import { useMemo } from 'react'
import type { FormatDataState, DataType } from '@/types/modal'

interface UseSelectColumnsProps {
  state: FormatDataState
  updateState: (updates: Partial<FormatDataState>) => void
}

export function useSelectColumns({ state, updateState }: UseSelectColumnsProps) {
  const handleToggleColumn = (columnName: string) => {
    const updatedColumns = state.columns.map(col =>
      col.name === columnName ? { ...col, isSelected: !col.isSelected } : col
    )
    updateState({ columns: updatedColumns })
  }

  const handleTypeChange = (columnName: string, newType: DataType) => {
    const updatedColumns = state.columns.map(col =>
      col.name === columnName ? { ...col, selectedType: newType } : col
    )
    updateState({ columns: updatedColumns })
  }

  const selectedCount = useMemo(() => {
    return state.columns.filter(col => col.isSelected).length
  }, [state.columns])

  const hasColumns = state.columns.length > 0

  return {
    handleToggleColumn,
    handleTypeChange,
    selectedCount,
    hasColumns,
    columns: state.columns
  }
}