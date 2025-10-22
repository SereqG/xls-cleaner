import React from 'react'
import type { FormatDataState } from '@/types/modal'

interface PreviewDataProps {
  state: FormatDataState;
}

export function PreviewData({ state }: PreviewDataProps) {
  const selectedColumns = state.columns.filter(col => col.isSelected)

  if (!state.previewData || state.previewData.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No preview data available.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Preview Transformed Data</h3>
        <p className="text-sm text-muted-foreground">
          Showing the first 5 rows with your transformations applied.
        </p>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
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
            <tbody>
              {state.previewData.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="border-t hover:bg-gray-50 dark:hover:bg-gray-800/50"
                >
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
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-3 text-sm">
        <p className="text-blue-700 dark:text-blue-300">
          <strong>Note:</strong> This is a preview of the first 5 rows. The full dataset will be
          transformed when you download the file.
        </p>
      </div>
    </div>
  )
}
