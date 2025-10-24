import React from 'react'
import { ColumnItem } from './ColumnItem'
import type { ColumnSelection, DataType } from '@/types/modal'

interface ColumnsListProps {
  columns: ColumnSelection[]
  onToggleColumn: (columnName: string) => void
  onTypeChange: (columnName: string, type: DataType) => void
}

export function ColumnsList({ columns, onToggleColumn, onTypeChange }: ColumnsListProps) {
  return (
    <div className="space-y-3 max-h-96 overflow-y-auto">
      {columns.map((column) => (
        <ColumnItem
          key={column.name}
          column={column}
          onToggle={() => onToggleColumn(column.name)}
          onTypeChange={(type) => onTypeChange(column.name, type)}
        />
      ))}
    </div>
  )
}