import { useState, useEffect, useMemo } from 'react'
import { useFile } from '@/contexts/FileContext'
import type { FormatDataState, DataType, ColumnSelection, ColumnAction, ModalStep } from '@/types/modal'
import type { FileData, SpreadsheetData } from '@/types/api'
import { getModalSteps } from '@/lib/modalSteps'
import { canProceedFromStep } from '@/lib/modalValidation'

function mapToDataType(type: string): DataType {
  const lowerType = type.toLowerCase()
  if (lowerType.includes('int') || lowerType.includes('float') || lowerType.includes('number')) {
    return 'number'
  }
  if (lowerType.includes('date') || lowerType.includes('time')) {
    return 'date'
  }
  if (lowerType.includes('bool')) {
    return 'boolean'
  }
  return 'string'
}

function findSelectedSheet(uploadedFile: FileData, selectedSheetName: string | null): SpreadsheetData {
  const sheet = uploadedFile.spreadsheet_data.find(
    (s: SpreadsheetData) => s.spreadsheet_name === selectedSheetName
  )
  
  if (!sheet) {
    throw new Error('Selected sheet not found')
  }
  
  return sheet
}

function getSelectedColumns(columns: ColumnSelection[]): ColumnSelection[] {
  return columns.filter(col => col.isSelected)
}

function getRawDataSample(sheet: SpreadsheetData): Record<string, unknown>[] {
  return sheet.spreadsheet_snippet.slice(0, 5)
}

function handleEmptyValue(value: unknown, action: ColumnAction | undefined): unknown {
  if (value === null || value === undefined || value === '') {
    return action?.replaceEmpty !== undefined ? action.replaceEmpty : value
  }
  return value
}

function applyStringCaseTransformation(value: string, caseType: string): string {
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

function applyTypeSpecificTransformations(
  value: unknown, 
  column: ColumnSelection, 
  action: ColumnAction | undefined
): unknown {
  if (value === null || value === undefined || value === '') {
    return value
  }

  if (column.selectedType === 'string' && action?.changeCase) {
    return applyStringCaseTransformation(String(value), action.changeCase)
  }
  
  if (column.selectedType === 'number' && action?.roundDecimals !== undefined) {
    return applyNumberRounding(value, action.roundDecimals)
  }
  
  return value
}

function transformRowData(
  row: Record<string, unknown>,
  selectedColumns: ColumnSelection[],
  actions: ColumnAction[]
): Record<string, unknown> {
  const transformedRow: Record<string, unknown> = {}
  
  selectedColumns.forEach(column => {
    const action = actions.find(a => a.columnName === column.name)
    let value = row[column.name]
    
    value = handleEmptyValue(value, action)
    if (value !== null && value !== undefined && value !== '') {
      value = applyTypeSpecificTransformations(value, column, action)
    }
    
    transformedRow[column.name] = value
  })
  
  return transformedRow
}

async function generatePreviewData(
  state: FormatDataState,
  uploadedFile: FileData
): Promise<Record<string, unknown>[]> {
  const sheet = findSelectedSheet(uploadedFile, state.selectedSheet)
  const selectedColumns = getSelectedColumns(state.columns)
  const rawData = getRawDataSample(sheet)
  
  return rawData.map(row => transformRowData(row, selectedColumns, state.actions))
}

function createColumnConfigs(sheet: SpreadsheetData): ColumnSelection[] {
  return sheet.columns.map(col => ({
    name: col.name,
    originalType: col.type,
    selectedType: mapToDataType(col.type),
    isSelected: false,
  }))
}

function createSingleSheetState(sheet: SpreadsheetData): Partial<FormatDataState> {
  return {
    currentStep: 'select-columns',
    selectedSheet: sheet.spreadsheet_name,
    columns: createColumnConfigs(sheet),
  }
}

function createMultiSheetState(): FormatDataState {
  return {
    currentStep: 'select-sheet',
    selectedSheet: null,
    columns: [],
    actions: [],
    previewData: null,
    isProcessing: false,
    error: null,
  }
}

function initializeModalState(uploadedFile: FileData): Partial<FormatDataState> | FormatDataState {
  if (uploadedFile.spreadsheet_data.length === 1) {
    const sheet = uploadedFile.spreadsheet_data[0]
    return createSingleSheetState(sheet)
  } else {
    return createMultiSheetState()
  }
}

export function useFormatDataModal(open: boolean) {
  const { uploadedFile } = useFile()
  
  const [state, setState] = useState<FormatDataState>({
    currentStep: 'select-sheet',
    selectedSheet: null,
    columns: [],
    actions: [],
    previewData: null,
    isProcessing: false,
    error: null,
  })

  const showSheetSelection = uploadedFile && uploadedFile.spreadsheet_data.length > 1
  
  const steps = useMemo(() => {
    return getModalSteps(!!showSheetSelection)
  }, [showSheetSelection])

  useEffect(() => {
    if (open && uploadedFile) {
      const initialState = initializeModalState(uploadedFile)
      if ('currentStep' in initialState && initialState.currentStep === 'select-sheet') {
        setState(initialState as FormatDataState)
      } else {
        setState(prev => ({ ...prev, ...initialState }))
      }
    }
  }, [open, uploadedFile])

  const currentStepIndex = steps.findIndex(step => step.id === state.currentStep)
  
  const canProceed = useMemo(() => {
    return canProceedFromStep(state.currentStep, state)
  }, [state])

  const setProcessingState = (isProcessing: boolean, error: string | null = null) => {
    setState(prev => ({ ...prev, isProcessing, error }))
  }

  const setPreviewStep = (previewData: Record<string, unknown>[], stepId: ModalStep) => {
    setState(prev => ({
      ...prev,
      currentStep: stepId,
      previewData,
      isProcessing: false,
    }))
  }

  const setRegularStep = (stepId: ModalStep) => {
    setState(prev => ({ ...prev, currentStep: stepId }))
  }

  const handlePreviewGeneration = async (stepId: ModalStep) => {
    setProcessingState(true, null)
    try {
      const previewData = await generatePreviewData(state, uploadedFile!)
      setPreviewStep(previewData, stepId)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate preview'
      setProcessingState(false, errorMessage)
    }
  }

  const getNextStepId = (): ModalStep | null => {
    const nextStepIndex = currentStepIndex + 1
    return nextStepIndex < steps.length ? steps[nextStepIndex].id : null
  }

  const handleNext = async () => {
    const nextStep = getNextStepId()
    if (!nextStep) return

    if (nextStep === 'preview') {
      await handlePreviewGeneration(nextStep)
    } else {
      setRegularStep(nextStep)
    }
  }

  const getPreviousStepId = (): ModalStep | null => {
    const prevStepIndex = currentStepIndex - 1
    return prevStepIndex >= 0 ? steps[prevStepIndex].id : null
  }

  const goToPreviousStep = (stepId: ModalStep) => {
    setState(prev => ({
      ...prev,
      currentStep: stepId,
      error: null,
    }))
  }

  const handleBack = () => {
    const prevStep = getPreviousStepId()
    if (prevStep) {
      goToPreviousStep(prevStep)
    }
  }

  const updateState = (updates: Partial<FormatDataState>) => {
    setState(prev => ({ ...prev, ...updates }))
  }

  return {
    uploadedFile,
    state,
    steps,
    currentStepIndex,
    canProceed,
    handleNext,
    handleBack,
    updateState,
  }
}