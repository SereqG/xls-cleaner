import { useMemo } from 'react'
import type { FormatDataState, DataType } from '@/types/modal'
import type { FileData } from '@/types/api'

interface UseSelectSheetProps {
  state: FormatDataState
  updateState: (updates: Partial<FormatDataState>) => void
  uploadedFile: FileData
}

function mapToDataType(type: string): DataType {
  const lowerType = type.toLowerCase()
  
  const typeMapping = {
    number: ['int', 'float', 'number'],
    date: ['date', 'time'],
    boolean: ['bool']
  } as const

  for (const [dataType, keywords] of Object.entries(typeMapping)) {
    if (keywords.some(keyword => lowerType.includes(keyword))) {
      return dataType as DataType
    }
  }
  
  return 'string'
}

export function useSelectSheet({ state, updateState, uploadedFile }: UseSelectSheetProps) {
  const handleSelectSheet = (sheetName: string) => {
    const sheet = uploadedFile.spreadsheet_data.find(s => s.spreadsheet_name === sheetName)
    if (!sheet) return

    updateState({
      selectedSheet: sheetName,
      columns: sheet.columns.map(col => ({
        name: col.name,
        originalType: col.type,
        selectedType: mapToDataType(col.type),
        isSelected: false,
      })),
    })
  }

  const sheetsData = useMemo(() => {
    return uploadedFile.spreadsheet_data.map(sheet => ({
      name: sheet.spreadsheet_name,
      columnCount: sheet.columns.length,
      columns: sheet.columns,
      isSelected: state.selectedSheet === sheet.spreadsheet_name
    }))
  }, [uploadedFile.spreadsheet_data, state.selectedSheet])

  const totalSheets = uploadedFile.spreadsheet_data.length

  return {
    handleSelectSheet,
    sheetsData,
    totalSheets,
    selectedSheet: state.selectedSheet
  }
}