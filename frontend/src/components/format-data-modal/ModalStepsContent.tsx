import React from 'react'
import { Loader2 } from 'lucide-react'
import { SelectSheet } from '../modal-steps/select-sheet'
import { SelectColumns } from '../modal-steps/select-columns'
import { SpecifyActions } from '../modal-steps/specify-actions'
import { PreviewData } from '../modal-steps/preview'
import { DownloadFile } from '../modal-steps/download'
import { FormatDataState } from '@/types/modal'
import { FileData } from '@/types/api'

interface ModalStepsContentProps {
  state: FormatDataState
  updateState: (updates: Partial<FormatDataState>) => void
  uploadedFile: FileData
  onComplete: () => void
}

export function ModalStepsContent({ 
  state, 
  updateState, 
  uploadedFile, 
  onComplete 
}: ModalStepsContentProps) {
  return (
    <div className="flex-1 overflow-y-auto py-4">
      {state.isProcessing ? (
        <div className="flex items-center justify-center h-full">
          <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
        </div>
      ) : (
        <>
          {state.currentStep === 'select-sheet' && (
            <SelectSheet state={state} updateState={updateState} uploadedFile={uploadedFile} />
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
            <DownloadFile state={state} uploadedFile={uploadedFile} onComplete={onComplete} />
          )}
        </>
      )}
    </div>
  )
}