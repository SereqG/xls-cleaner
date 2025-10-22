import React from 'react'
import type { FormatDataState } from '@/types/modal'
import type { FileData } from '@/types/api'
import { cn } from '@/lib/utils'

interface SelectSheetProps {
  state: FormatDataState;
  updateState: (updates: Partial<FormatDataState>) => void;
  uploadedFile: FileData;
}

export function SelectSheet({ state, updateState, uploadedFile }: SelectSheetProps) {
  const handleSelectSheet = (sheetName: string) => {
    const sheet = uploadedFile.spreadsheet_data.find(s => s.spreadsheet_name === sheetName)
    if (!sheet) return

    updateState({
      selectedSheet: sheetName,
      columns: sheet.columns.map(col => ({
        name: col.name,
        originalType: col.type,
        selectedType: mapToDataType(col.type),
        isSelected: false,
      })),
    })
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Select a Spreadsheet</h3>
        <p className="text-sm text-muted-foreground">
          Your file contains {uploadedFile.spreadsheet_data.length} spreadsheets. Select one to continue.
        </p>
      </div>

      <div className="grid gap-4">
        {uploadedFile.spreadsheet_data.map((sheet) => (
          <div
            key={sheet.spreadsheet_name}
            className={cn(
              "p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-violet-400",
              state.selectedSheet === sheet.spreadsheet_name
                ? "border-violet-500 bg-violet-50 dark:bg-violet-900/20"
                : "border-border"
            )}
            onClick={() => handleSelectSheet(sheet.spreadsheet_name)}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-semibold text-base">{sheet.spreadsheet_name}</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {sheet.columns.length} columns
                </p>
              </div>
              {state.selectedSheet === sheet.spreadsheet_name && (
                <div className="bg-violet-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                  ✓
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {sheet.columns.slice(0, 5).map((col) => (
                <span
                  key={col.name}
                  className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded"
                >
                  {col.name}
                </span>
              ))}
              {sheet.columns.length > 5 && (
                <span className="text-xs px-2 py-1 text-muted-foreground">
                  +{sheet.columns.length - 5} more
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function mapToDataType(type: string): 'string' | 'number' | 'date' | 'boolean' {
  const lowerType = type.toLowerCase()
  if (lowerType.includes('int') || lowerType.includes('float') || lowerType.includes('number')) {
    return 'number'
  }
  if (lowerType.includes('date') || lowerType.includes('time')) {
    return 'date'
  }
  if (lowerType.includes('bool')) {
    return 'boolean'
  }
  return 'string'
}
