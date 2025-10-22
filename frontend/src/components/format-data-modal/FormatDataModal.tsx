"use client"

import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ModalStepsBreadcrumb } from './ModalStepsBreadcrumb'
import { ModalStepsContent } from './ModalStepsContent'
import { ModalNavigation } from './ModalNavigation'
import { useFormatDataModal } from '@/hooks'

interface FormatDataModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FormatDataModal({ open, onOpenChange }: FormatDataModalProps) {
  const {
    uploadedFile,
    state,
    steps,
    currentStepIndex,
    canProceed,
    handleNext,
    handleBack,
    updateState,
  } = useFormatDataModal(open)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl">
            Format Data: {uploadedFile?.file_metadata.name}
          </DialogTitle>
        </DialogHeader>

        <ModalStepsBreadcrumb steps={steps} currentStepIndex={currentStepIndex} />

        {state.error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3 text-red-700 dark:text-red-300 text-sm">
            {state.error}
          </div>
        )}

        <ModalStepsContent 
          state={state} 
          updateState={updateState} 
          uploadedFile={uploadedFile!} 
          onComplete={() => onOpenChange(false)} 
        />

        <ModalNavigation
          currentStep={state.currentStep}
          currentStepIndex={currentStepIndex}
          isProcessing={state.isProcessing}
          canProceed={canProceed}
          onBack={handleBack}
          onNext={handleNext}
          onClose={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
}