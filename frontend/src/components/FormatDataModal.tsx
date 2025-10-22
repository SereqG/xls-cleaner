"use client"

import React, { useState, useMemo } from 'react'
import { ChevronRight, ChevronLeft, Loader2 } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useFile } from '@/contexts/FileContext'
import type { FormatDataState, ModalStep, DataType } from '@/types/modal'
import type { FileData, SpreadsheetData } from '@/types/api'
import { SelectSheet } from './modal-steps/SelectSheet'
import { SelectColumns } from './modal-steps/SelectColumns'
import { SpecifyActions } from './modal-steps/SpecifyActions'
import { PreviewData } from './modal-steps/PreviewData'
import { DownloadFile } from './modal-steps/DownloadFile'

interface FormatDataModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FormatDataModal({ open, onOpenChange }: FormatDataModalProps) {
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

  // Determine if sheet selection step should be shown
  const showSheetSelection = uploadedFile && uploadedFile.spreadsheet_data.length > 1
  
  // Get available steps based on whether sheet selection is needed
  const steps: { id: ModalStep; label: string }[] = useMemo(() => {
    const allSteps = [
      { id: 'select-sheet' as ModalStep, label: 'Select Spreadsheet' },
      { id: 'select-columns' as ModalStep, label: 'Select Columns' },
      { id: 'specify-actions' as ModalStep, label: 'Specify Actions' },
      { id: 'preview' as ModalStep, label: 'Preview' },
      { id: 'download' as ModalStep, label: 'Download File' },
    ]
    
    if (!showSheetSelection) {
      return allSteps.filter(step => step.id !== 'select-sheet')
    }
    return allSteps
  }, [showSheetSelection])

  // Initialize when modal opens
  React.useEffect(() => {
    if (open && uploadedFile) {
      // If only one sheet, auto-select it
      if (uploadedFile.spreadsheet_data.length === 1) {
        const sheet = uploadedFile.spreadsheet_data[0]
        setState(prev => ({
          ...prev,
          currentStep: 'select-columns',
          selectedSheet: sheet.spreadsheet_name,
          columns: sheet.columns.map(col => ({
            name: col.name,
            originalType: col.type,
            selectedType: mapToDataType(col.type),
            isSelected: false,
          })),
        }))
      } else {
        setState({
          currentStep: 'select-sheet',
          selectedSheet: null,
          columns: [],
          actions: [],
          previewData: null,
          isProcessing: false,
          error: null,
        })
      }
    }
  }, [open, uploadedFile])

  const currentStepIndex = steps.findIndex(step => step.id === state.currentStep)
  
  const canProceed = useMemo(() => {
    switch (state.currentStep) {
      case 'select-sheet':
        return state.selectedSheet !== null
      case 'select-columns':
        return state.columns.some(col => col.isSelected)
      case 'specify-actions':
        return true // Can always proceed from actions
      case 'preview':
        return true
      case 'download':
        return false // Last step
      default:
        return false
    }
  }, [state.currentStep, state.selectedSheet, state.columns])

  const handleNext = async () => {
    const nextStepIndex = currentStepIndex + 1
    if (nextStepIndex < steps.length) {
      const nextStep = steps[nextStepIndex].id
      
      // If moving to preview, generate preview data
      if (nextStep === 'preview') {
        setState(prev => ({ ...prev, isProcessing: true, error: null }))
        try {
          const previewData = await generatePreviewData(state, uploadedFile!)
          setState(prev => ({
            ...prev,
            currentStep: nextStep,
            previewData,
            isProcessing: false,
          }))
        } catch (error) {
          setState(prev => ({
            ...prev,
            error: error instanceof Error ? error.message : 'Failed to generate preview',
            isProcessing: false,
          }))
        }
      } else {
        setState(prev => ({ ...prev, currentStep: nextStep }))
      }
    }
  }

  const handleBack = () => {
    const prevStepIndex = currentStepIndex - 1
    if (prevStepIndex >= 0) {
      setState(prev => ({
        ...prev,
        currentStep: steps[prevStepIndex].id,
        error: null,
      }))
    }
  }

  const updateState = (updates: Partial<FormatDataState>) => {
    setState(prev => ({ ...prev, ...updates }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl">
            Format Data: {uploadedFile?.file_metadata.name}
          </DialogTitle>
        </DialogHeader>

        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 py-4 border-b overflow-x-auto">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <div
                className={`flex items-center gap-2 px-3 py-1 rounded-md text-sm whitespace-nowrap ${
                  index === currentStepIndex
                    ? 'bg-violet-500 text-white'
                    : index < currentStepIndex
                    ? 'bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300'
                    : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
                }`}
              >
                <span className="font-medium">{index + 1}</span>
                <span>{step.label}</span>
              </div>
              {index < steps.length - 1 && (
                <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Error Display */}
        {state.error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3 text-red-700 dark:text-red-300 text-sm">
            {state.error}
          </div>
        )}

        {/* Step Content */}
        <div className="flex-1 overflow-y-auto py-4">
          {state.isProcessing ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
            </div>
          ) : (
            <>
              {state.currentStep === 'select-sheet' && (
                <SelectSheet state={state} updateState={updateState} uploadedFile={uploadedFile!} />
              )}
              {state.currentStep === 'select-columns' && (
                <SelectColumns state={state} updateState={updateState} />
              )}
              {state.currentStep === 'specify-actions' && (
                <SpecifyActions state={state} updateState={updateState} />
              )}
              {state.currentStep === 'preview' && (
                <PreviewData state={state} />
              )}
              {state.currentStep === 'download' && (
                <DownloadFile state={state} uploadedFile={uploadedFile!} onComplete={() => onOpenChange(false)} />
              )}
            </>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between gap-4 pt-4 border-t">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStepIndex === 0 || state.isProcessing}
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </Button>
          
          {state.currentStep !== 'download' ? (
            <Button
              onClick={handleNext}
              disabled={!canProceed || state.isProcessing}
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Helper function to map detected types to our DataType
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

// Helper function to generate preview data
async function generatePreviewData(
  state: FormatDataState,
  uploadedFile: FileData
): Promise<Record<string, unknown>[]> {
  // Find the selected sheet
  const sheet = uploadedFile.spreadsheet_data.find(
    (s: SpreadsheetData) => s.spreadsheet_name === state.selectedSheet
  )
  
  if (!sheet) {
    throw new Error('Selected sheet not found')
  }

  // Get the selected columns
  const selectedColumns = state.columns.filter(col => col.isSelected)
  
  // Get raw data from spreadsheet_snippet (first 5 rows)
  const rawData = sheet.spreadsheet_snippet.slice(0, 5)
  
  // Apply transformations
  const transformedData = rawData.map((row: Record<string, unknown>) => {
    const transformedRow: Record<string, unknown> = {}
    
    selectedColumns.forEach(column => {
      const action = state.actions.find(a => a.columnName === column.name)
      let value = row[column.name]
      
      // Apply transformations
      if (value === null || value === undefined || value === '') {
        if (action?.replaceEmpty !== undefined) {
          value = action.replaceEmpty
        }
      } else {
        // Apply type-specific transformations
        if (column.selectedType === 'string' && action?.changeCase) {
          const strValue = String(value)
          switch (action.changeCase) {
            case 'uppercase':
              value = strValue.toUpperCase()
              break
            case 'lowercase':
              value = strValue.toLowerCase()
              break
            case 'titlecase':
              value = strValue.replace(/\w\S*/g, (txt) => 
                txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
              )
              break
          }
        } else if (column.selectedType === 'number' && action?.roundDecimals !== undefined) {
          const numValue = Number(value)
          if (!isNaN(numValue)) {
            value = Number(numValue.toFixed(action.roundDecimals))
          }
        }
      }
      
      transformedRow[column.name] = value
    })
    
    return transformedRow
  })
  
  return transformedData
}
