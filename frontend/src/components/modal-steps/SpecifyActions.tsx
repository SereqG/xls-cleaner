import React from 'react'
import type { FormatDataState, ColumnAction } from '@/types/modal'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface SpecifyActionsProps {
  state: FormatDataState;
  updateState: (updates: Partial<FormatDataState>) => void;
}

export function SpecifyActions({ state, updateState }: SpecifyActionsProps) {
  const selectedColumns = state.columns.filter(col => col.isSelected)

  const updateAction = (columnName: string, updates: Partial<ColumnAction>) => {
    const existingActionIndex = state.actions.findIndex(a => a.columnName === columnName)
    let newActions: ColumnAction[]

    if (existingActionIndex >= 0) {
      // Update existing action
      newActions = [...state.actions]
      newActions[existingActionIndex] = {
        ...newActions[existingActionIndex],
        ...updates,
      }
    } else {
      // Create new action
      newActions = [
        ...state.actions,
        {
          columnName,
          ...updates,
        },
      ]
    }

    updateState({ actions: newActions })
  }

  const getAction = (columnName: string): ColumnAction | undefined => {
    return state.actions.find(a => a.columnName === columnName)
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Specify Actions</h3>
        <p className="text-sm text-muted-foreground">
          Configure transformations for each selected column. All actions are optional.
        </p>
      </div>

      <div className="space-y-6 max-h-96 overflow-y-auto">
        {selectedColumns.map((column) => {
          const action = getAction(column.name)
          
          return (
            <div
              key={column.name}
              className="p-4 border rounded-lg bg-card"
            >
              <div className="mb-4">
                <h4 className="font-medium text-base">{column.name}</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Type: {column.selectedType}
                </p>
              </div>

              <div className="space-y-4">
                {/* Replace Empty Values - Available for all types */}
                <div className="space-y-2">
                  <Label htmlFor={`${column.name}-replace-empty`} className="text-sm">
                    Replace empty values with:
                  </Label>
                  <Input
                    id={`${column.name}-replace-empty`}
                    placeholder="Leave empty to keep empty cells"
                    value={action?.replaceEmpty ?? ''}
                    onChange={(e) =>
                      updateAction(column.name, { replaceEmpty: e.target.value || undefined })
                    }
                  />
                </div>

                {/* Change Case - Only for string columns */}
                {column.selectedType === 'string' && (
                  <div className="space-y-2">
                    <Label htmlFor={`${column.name}-case`} className="text-sm">
                      Change case:
                    </Label>
                    <Select
                      value={action?.changeCase ?? 'none'}
                      onValueChange={(value) =>
                        updateAction(column.name, {
                          changeCase: value === 'none' ? undefined : value as 'uppercase' | 'lowercase' | 'titlecase',
                        })
                      }
                    >
                      <SelectTrigger id={`${column.name}-case`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No change</SelectItem>
                        <SelectItem value="uppercase">UPPERCASE</SelectItem>
                        <SelectItem value="lowercase">lowercase</SelectItem>
                        <SelectItem value="titlecase">Title Case</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Round Decimals - Only for number columns */}
                {column.selectedType === 'number' && (
                  <div className="space-y-2">
                    <Label htmlFor={`${column.name}-decimals`} className="text-sm">
                      Round to decimal places:
                    </Label>
                    <Input
                      id={`${column.name}-decimals`}
                      type="number"
                      min="0"
                      max="10"
                      placeholder="Leave empty for no rounding"
                      value={action?.roundDecimals ?? ''}
                      onChange={(e) => {
                        const value = e.target.value
                        updateAction(column.name, {
                          roundDecimals: value === '' ? undefined : parseInt(value, 10),
                        })
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {selectedColumns.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No columns selected. Please go back and select at least one column.
        </div>
      )}
    </div>
  )
}
