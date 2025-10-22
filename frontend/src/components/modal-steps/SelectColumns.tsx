import React from 'react'
import type { FormatDataState, DataType } from '@/types/modal'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface SelectColumnsProps {
  state: FormatDataState;
  updateState: (updates: Partial<FormatDataState>) => void;
}

const dataTypes: DataType[] = ['string', 'number', 'date', 'boolean']

export function SelectColumns({ state, updateState }: SelectColumnsProps) {
  const handleToggleColumn = (columnName: string) => {
    const updatedColumns = state.columns.map(col =>
      col.name === columnName ? { ...col, isSelected: !col.isSelected } : col
    )
    updateState({ columns: updatedColumns })
  }

  const handleTypeChange = (columnName: string, newType: DataType) => {
    const updatedColumns = state.columns.map(col =>
      col.name === columnName ? { ...col, selectedType: newType } : col
    )
    updateState({ columns: updatedColumns })
  }

  const selectedCount = state.columns.filter(col => col.isSelected).length

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Select Columns to Modify</h3>
        <p className="text-sm text-muted-foreground">
          Choose at least one column and optionally change its data type.
          {selectedCount > 0 && ` (${selectedCount} selected)`}
        </p>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {state.columns.map((column) => (
          <div
            key={column.name}
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
                onCheckedChange={() => handleToggleColumn(column.name)}
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
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">Detected:</span>
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs font-mono">
                      {column.originalType}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">Type:</span>
                    <Select
                      value={column.selectedType}
                      onValueChange={(value) => handleTypeChange(column.name, value as DataType)}
                      disabled={!column.isSelected}
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
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {state.columns.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No columns available. Please go back and select a spreadsheet.
        </div>
      )}
    </div>
  )
}
