import type { ModalStep, FormatDataState } from '@/types/modal'

type ValidationRule = (state: FormatDataState) => boolean

const STEP_VALIDATION_RULES: Record<ModalStep, ValidationRule> = {
  'select-sheet': (state) => state.selectedSheet !== null,
  'select-columns': (state) => state.columns.some(col => col.isSelected),
  'specify-actions': () => true,
  'preview': () => true,
  'download': () => false,
}

export function canProceedFromStep(step: ModalStep, state: FormatDataState): boolean {
  const validationRule = STEP_VALIDATION_RULES[step]
  return validationRule ? validationRule(state) : false
}