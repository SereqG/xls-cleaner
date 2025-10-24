import React from 'react'
import { ReplaceEmptyAction } from './ReplaceEmptyAction'
import { ChangeCaseAction } from './ChangeCaseAction'
import { RoundDecimalsAction } from './RoundDecimalsAction'
import type { ColumnSelection, ColumnAction } from '@/types/modal'

interface ColumnActionItemProps {
  column: ColumnSelection
  action?: ColumnAction
  onUpdateAction: (columnName: string, updates: Partial<ColumnAction>) => void
}

export function ColumnActionItem({ column, action, onUpdateAction }: ColumnActionItemProps) {
  return (
    <div className="p-4 border rounded-lg bg-card">
      <div className="mb-4">
        <h4 className="font-medium text-base">{column.name}</h4>
        <p className="text-xs text-muted-foreground mt-1">
          Type: {column.selectedType}
        </p>
      </div>

      <div className="space-y-4">
        <ReplaceEmptyAction
          columnName={column.name}
          value={action?.replaceEmpty}
          onUpdate={(value) => onUpdateAction(column.name, { replaceEmpty: value })}
        />

        {column.selectedType === 'string' && (
          <ChangeCaseAction
            columnName={column.name}
            value={action?.changeCase}
            onUpdate={(value) => onUpdateAction(column.name, { changeCase: value })}
          />
        )}

        {column.selectedType === 'number' && (
          <RoundDecimalsAction
            columnName={column.name}
            value={action?.roundDecimals}
            onUpdate={(value) => onUpdateAction(column.name, { roundDecimals: value })}
          />
        )}
      </div>
    </div>
  )
}