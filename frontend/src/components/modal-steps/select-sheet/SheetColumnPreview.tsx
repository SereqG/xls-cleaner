import React from 'react'
import type { ColumnInfo } from '@/types/api'

interface SheetColumnPreviewProps {
  columns: ColumnInfo[]
}

export function SheetColumnPreview({ columns }: SheetColumnPreviewProps) {
  const visibleColumns = columns.slice(0, 5)
  const remainingCount = columns.length - 5

  return (
    <div className="flex flex-wrap gap-2">
      {visibleColumns.map((col) => (
        <span
          key={col.name}
          className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded"
        >
          {col.name}
        </span>
      ))}
      {remainingCount > 0 && (
        <span className="text-xs px-2 py-1 text-muted-foreground">
          +{remainingCount} more
        </span>
      )}
    </div>
  )
}