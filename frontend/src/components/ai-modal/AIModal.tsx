"use client"

import React, {  useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ModalStepsBreadcrumb } from '@/components/format-data-modal/ModalStepsBreadcrumb'
import { ModalNavigation } from '@/components/format-data-modal/ModalNavigation'
import { AIModalStepsContent } from './AIModalStepsContent'
import { useAIModal } from '@/hooks'

interface AIModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AIModal({ open, onOpenChange }: AIModalProps) {
  const {
    uploadedFile,
    state,
    steps,
    currentStepIndex,
    canProceed,
    handleNext,
    handleBack,
    updateState,
    sendMessage,
    startSession
  } = useAIModal(open)

  useEffect(() => {
    if (open && uploadedFile) {
      startSession(uploadedFile.file_metadata.name)
    }
  }, [open, uploadedFile])

  if (!uploadedFile) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <span className="text-2xl">✨</span>
            AI Cleaning: {uploadedFile.file_metadata.name}
          </DialogTitle>
        </DialogHeader>

        <ModalStepsBreadcrumb steps={steps} currentStepIndex={currentStepIndex} />

        {state.error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3 text-red-700 dark:text-red-300 text-sm">
            {state.error}
          </div>
        )}

        <div className="flex-1 overflow-hidden">
          <AIModalStepsContent
            state={state}
            updateState={updateState}
            uploadedFile={uploadedFile}
            onSendMessage={sendMessage}
          />
        </div>

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
