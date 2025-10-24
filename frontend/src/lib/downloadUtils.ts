import * as XLSX from 'xlsx'
import type { FormatDataState, ColumnSelection, ColumnAction } from '@/types/modal'
import type { FileData, SpreadsheetData } from '@/types/api'

export interface DownloadConfig {
  filename: string
  selectedSheet: string | null
  columns: ColumnSelection[]
  actions: ColumnAction[]
}

export interface DownloadResult {
  success: boolean
  error?: string
}

function findSelectedSheet(uploadedFile: FileData, selectedSheetName: string | null): SpreadsheetData {
  const sheet = uploadedFile.spreadsheet_data.find(
    s => s.spreadsheet_name === selectedSheetName
  )
  
  if (!sheet) {
    throw new Error('Selected sheet not found')
  }
  
  return sheet
}

function getSelectedColumns(columns: ColumnSelection[]): ColumnSelection[] {
  return columns.filter(col => col.isSelected)
}

function applyEmptyValueReplacement(value: unknown, action: ColumnAction | undefined): unknown {
  if (value === null || value === undefined || value === '') {
    return action?.replaceEmpty !== undefined ? action.replaceEmpty : value
  }
  return value
}

function applyCaseTransformation(value: string, caseType: string): string {
  switch (caseType) {
    case 'uppercase':
      return value.toUpperCase()
    case 'lowercase':
      return value.toLowerCase()
    case 'titlecase':
      return value.replace(/\w\S*/g, (txt) => 
        txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
      )
    default:
      return value
  }
}

function applyNumberRounding(value: unknown, decimals: number): number | unknown {
  const numValue = Number(value)
  if (!isNaN(numValue)) {
    return Number(numValue.toFixed(decimals))
  }
  return value
}

function applyColumnTransformations(
  value: unknown,
  column: ColumnSelection,
  action: ColumnAction | undefined
): unknown {
  let transformedValue = applyEmptyValueReplacement(value, action)
  
  if (transformedValue !== null && transformedValue !== undefined && transformedValue !== '') {
    if (column.selectedType === 'string' && action?.changeCase) {
      transformedValue = applyCaseTransformation(String(transformedValue), action.changeCase)
    } else if (column.selectedType === 'number' && action?.roundDecimals !== undefined) {
      transformedValue = applyNumberRounding(transformedValue, action.roundDecimals)
    }
  }
  
  return transformedValue
}

function transformRowData(
  row: Record<string, unknown>,
  selectedColumns: ColumnSelection[],
  actions: ColumnAction[]
): Record<string, unknown> {
  const transformedRow: Record<string, unknown> = {}
  
  selectedColumns.forEach(column => {
    const action = actions.find(a => a.columnName === column.name)
    const value = row[column.name]
    transformedRow[column.name] = applyColumnTransformations(value, column, action)
  })
  
  return transformedRow
}

function transformSheetData(
  sheet: SpreadsheetData,
  selectedColumns: ColumnSelection[],
  actions: ColumnAction[]
): Record<string, unknown>[] {
  return sheet.spreadsheet_snippet.map(row => 
    transformRowData(row, selectedColumns, actions)
  )
}

function createExcelFile(
  transformedData: Record<string, unknown>[],
  sheetName: string,
  filename: string
): void {
  const workbook = XLSX.utils.book_new()
  const worksheet = XLSX.utils.json_to_sheet(transformedData)
  
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName || 'Sheet1')
  XLSX.writeFile(workbook, filename)
}

export async function processDownload(
  state: FormatDataState,
  uploadedFile: FileData,
  filename: string
): Promise<DownloadResult> {
  try {
    const sheet = findSelectedSheet(uploadedFile, state.selectedSheet)
    const selectedColumns = getSelectedColumns(state.columns)
    const transformedData = transformSheetData(sheet, selectedColumns, state.actions)
    
    createExcelFile(transformedData, state.selectedSheet || 'Sheet1', filename)
    
    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}