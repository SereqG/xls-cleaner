import React from 'react'
import { cn } from '@/lib/utils'
import { SheetColumnPreview } from './SheetColumnPreview'
import { SheetSelectionIndicator } from './SheetSelectionIndicator'
import type { ColumnInfo } from '@/types/api'

interface SheetItemProps {
  name: string
  columnCount: number
  columns: ColumnInfo[]
  isSelected: boolean
  onSelect: () => void
}

export function SheetItem({ 
  name, 
  columnCount, 
  columns, 
  isSelected, 
  onSelect 
}: SheetItemProps) {
  return (
    <div
      className={cn(
        "p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-violet-400",
        isSelected
          ? "border-violet-500 bg-violet-50 dark:bg-violet-900/20"
          : "border-border"
      )}
      onClick={onSelect}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-semibold text-base">{name}</h4>
          <p className="text-sm text-muted-foreground mt-1">
            {columnCount} columns
          </p>
        </div>
        <SheetSelectionIndicator isSelected={isSelected} />
      </div>

      <SheetColumnPreview columns={columns} />
    </div>
  )
}