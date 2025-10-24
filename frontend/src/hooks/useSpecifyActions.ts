import { useMemo } from 'react'
import type { FormatDataState, ColumnAction } from '@/types/modal'

interface UseSpecifyActionsProps {
  state: FormatDataState
  updateState: (updates: Partial<FormatDataState>) => void
}

export function useSpecifyActions({ state, updateState }: UseSpecifyActionsProps) {
  const updateAction = (columnName: string, updates: Partial<ColumnAction>) => {
    const existingActionIndex = state.actions.findIndex(a => a.columnName === columnName)
    let newActions: ColumnAction[]

    if (existingActionIndex >= 0) {
      newActions = [...state.actions]
      newActions[existingActionIndex] = {
        ...newActions[existingActionIndex],
        ...updates,
      }
    } else {
      newActions = [
        ...state.actions,
        {
          columnName,
          ...updates,
        },
      ]
    }

    updateState({ actions: newActions })
  }

  const getAction = (columnName: string): ColumnAction | undefined => {
    return state.actions.find(a => a.columnName === columnName)
  }

  const selectedColumns = useMemo(() => {
    return state.columns.filter(col => col.isSelected)
  }, [state.columns])

  const hasSelectedColumns = selectedColumns.length > 0

  return {
    updateAction,
    getAction,
    selectedColumns,
    hasSelectedColumns
  }
}