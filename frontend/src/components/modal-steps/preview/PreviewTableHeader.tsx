import React from 'react'
import type { ColumnSelection } from '@/types/modal'

interface PreviewTableHeaderProps {
  selectedColumns: ColumnSelection[]
}

export function PreviewTableHeader({ selectedColumns }: PreviewTableHeaderProps) {
  return (
    <thead className="bg-gray-100 dark:bg-gray-800">
      <tr>
        <th className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wider border-r">
          #
        </th>
        {selectedColumns.map((column) => (
          <th
            key={column.name}
            className="px-4 py-3 text-left font-semibold border-r last:border-r-0"
          >
            <div className="flex flex-col gap-1">
              <span>{column.name}</span>
              <span className="text-xs text-muted-foreground font-normal">
                {column.selectedType}
              </span>
            </div>
          </th>
        ))}
      </tr>
    </thead>
  )
}