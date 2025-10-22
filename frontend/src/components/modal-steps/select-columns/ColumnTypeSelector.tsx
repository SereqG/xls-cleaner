import React from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { DataType } from '@/types/modal'

interface ColumnTypeSelectorProps {
  selectedType: DataType
  isDisabled: boolean
  onTypeChange: (type: DataType) => void
}

const dataTypes: DataType[] = ['string', 'number', 'date', 'boolean']

export function ColumnTypeSelector({ selectedType, isDisabled, onTypeChange }: ColumnTypeSelectorProps) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-muted-foreground">Type:</span>
      <Select
        value={selectedType}
        onValueChange={(value) => onTypeChange(value as DataType)}
        disabled={isDisabled}
      >
        <SelectTrigger className="w-32 h-8 text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {dataTypes.map((type) => (
            <SelectItem key={type} value={type} className="text-xs">
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}