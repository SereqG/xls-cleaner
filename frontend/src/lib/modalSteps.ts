import type { ModalStep } from '@/types/modal'

export interface StepDefinition {
  id: ModalStep
  label: string
}

export const MODAL_STEPS: StepDefinition[] = [
  { id: 'select-sheet', label: 'Select Spreadsheet' },
  { id: 'select-columns', label: 'Select Columns' },
  { id: 'specify-actions', label: 'Specify Actions' },
  { id: 'preview', label: 'Preview' },
  { id: 'download', label: 'Download File' },
]

export function getModalSteps(includeSheetSelection: boolean): StepDefinition[] {
  if (!includeSheetSelection) {
    return MODAL_STEPS.filter(step => step.id !== 'select-sheet')
  }
  return MODAL_STEPS
}