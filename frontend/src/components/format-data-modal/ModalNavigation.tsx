import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ModalStep, AIModalStep } from '@/types/modal'

interface ModalNavigationProps {
  currentStep: ModalStep | AIModalStep
  currentStepIndex: number
  isProcessing: boolean
  canProceed: boolean
  onBack: () => void
  onNext: () => void
  onClose: () => void
}

export function ModalNavigation({
  currentStep,
  currentStepIndex,
  isProcessing,
  canProceed,
  onBack,
  onNext,
  onClose
}: ModalNavigationProps) {
  return (
    <div className="flex justify-between gap-4 pt-4 border-t">
      <Button
        variant="outline"
        onClick={onBack}
        disabled={currentStepIndex === 0 || isProcessing}
      >
        <ChevronLeft className="w-4 h-4" />
        Back
      </Button>
      
      {currentStep !== 'download' ? (
        <Button
          onClick={onNext}
          disabled={!canProceed || isProcessing}
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </Button>
      ) : (
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      )}
    </div>
  )
}