import React from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { DetectedTypeDisplay } from './DetectedTypeDisplay'
import { ColumnTypeSelector } from './ColumnTypeSelector'
import type { ColumnSelection, DataType } from '@/types/modal'

interface ColumnItemProps {
  column: ColumnSelection
  onToggle: () => void
  onTypeChange: (type: DataType) => void
}

export function ColumnItem({ column, onToggle, onTypeChange }: ColumnItemProps) {
  return (
    <div
      className={`p-4 border rounded-lg transition-all ${
        column.isSelected
          ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20'
          : 'border-border'
      }`}
    >
      <div className="flex items-start gap-4">
        <Checkbox
          id={`column-${column.name}`}
          checked={column.isSelected}
          onCheckedChange={onToggle}
          className="mt-1"
        />
        
        <div className="flex-1 min-w-0">
          <Label
            htmlFor={`column-${column.name}`}
            className="text-base font-medium cursor-pointer"
          >
            {column.name}
          </Label>
          
          <div className="flex items-center gap-4 mt-3">
            <DetectedTypeDisplay originalType={column.originalType} />
            <ColumnTypeSelector
              selectedType={column.selectedType}
              isDisabled={!column.isSelected}
              onTypeChange={onTypeChange}
            />
          </div>
        </div>
      </div>
    </div>
  )
}