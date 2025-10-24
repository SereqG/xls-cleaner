import React from 'react'
import type { ColumnSelection } from '@/types/modal'

interface PreviewTableRowProps {
  row: Record<string, unknown>
  rowIndex: number
  selectedColumns: ColumnSelection[]
}

export function PreviewTableRow({ row, rowIndex, selectedColumns }: PreviewTableRowProps) {
  return (
    <tr className="border-t hover:bg-gray-50 dark:hover:bg-gray-800/50">
      <td className="px-4 py-3 text-muted-foreground font-mono text-xs border-r">
        {rowIndex + 1}
      </td>
      {selectedColumns.map((column) => {
        const value = row[column.name]
        const displayValue = value === null || value === undefined || value === '' 
          ? <span className="text-muted-foreground italic">empty</span>
          : String(value)
        
        return (
          <td
            key={column.name}
            className="px-4 py-3 border-r last:border-r-0"
          >
            {displayValue}
          </td>
        )
      })}
    </tr>
  )
}