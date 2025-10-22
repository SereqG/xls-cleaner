import React from 'react'
import { ColumnActionItem } from './ColumnActionItem'
import type { ColumnSelection, ColumnAction } from '@/types/modal'

interface ActionsListProps {
  selectedColumns: ColumnSelection[]
  getAction: (columnName: string) => ColumnAction | undefined
  onUpdateAction: (columnName: string, updates: Partial<ColumnAction>) => void
}

export function ActionsList({ selectedColumns, getAction, onUpdateAction }: ActionsListProps) {
  return (
    <div className="space-y-6 max-h-96 overflow-y-auto">
      {selectedColumns.map((column) => (
        <ColumnActionItem
          key={column.name}
          column={column}
          action={getAction(column.name)}
          onUpdateAction={onUpdateAction}
        />
      ))}
    </div>
  )
}