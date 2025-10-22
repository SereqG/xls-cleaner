import React from 'react'
import { SelectColumnsHeader } from './SelectColumnsHeader'
import { ColumnsList } from './ColumnsList'
import { SelectColumnsEmptyState } from './SelectColumnsEmptyState'
import { useSelectColumns } from '@/hooks'
import type { FormatDataState } from '@/types/modal'

interface SelectColumnsProps {
  state: FormatDataState;
  updateState: (updates: Partial<FormatDataState>) => void;
}

export function SelectColumns({ state, updateState }: SelectColumnsProps) {
  const {
    handleToggleColumn,
    handleTypeChange,
    selectedCount,
    hasColumns,
    columns
  } = useSelectColumns({ state, updateState })

  if (!hasColumns) {
    return <SelectColumnsEmptyState />
  }

  return (
    <div className="space-y-4">
      <SelectColumnsHeader selectedCount={selectedCount} />
      <ColumnsList
        columns={columns}
        onToggleColumn={handleToggleColumn}
        onTypeChange={handleTypeChange}
      />
    </div>
  )
}
