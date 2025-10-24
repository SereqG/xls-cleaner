import React from 'react'
import { SpecifyActionsHeader } from './SpecifyActionsHeader'
import { SpecifyActionsEmptyState } from './SpecifyActionsEmptyState'
import { ActionsList } from './ActionsList'
import { useSpecifyActions } from '@/hooks'
import type { FormatDataState } from '@/types/modal'

interface SpecifyActionsProps {
  state: FormatDataState;
  updateState: (updates: Partial<FormatDataState>) => void;
}

export function SpecifyActions({ state, updateState }: SpecifyActionsProps) {
  const {
    updateAction,
    getAction,
    selectedColumns,
    hasSelectedColumns
  } = useSpecifyActions({ state, updateState })

  if (!hasSelectedColumns) {
    return <SpecifyActionsEmptyState />
  }

  return (
    <div className="space-y-4">
      <SpecifyActionsHeader />
      <ActionsList
        selectedColumns={selectedColumns}
        getAction={getAction}
        onUpdateAction={updateAction}
      />
    </div>
  )
}
