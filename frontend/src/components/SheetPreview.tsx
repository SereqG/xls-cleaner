"use client"

import { useAIPreview } from '@/hooks/useAI'
import { Table, Loader2 } from 'lucide-react'

export function SheetPreview() {
  const { data: previewData, isLoading, error } = useAIPreview()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin text-violet-500" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
        Failed to load preview
      </div>
    )
  }

  if (!previewData || !previewData.preview || previewData.preview.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border p-8 text-center">
        <Table className="h-8 w-8 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          No preview available
        </p>
      </div>
    )
  }

  const columns = previewData.stats.column_names || Object.keys(previewData.preview[0] || {})

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">
          Preview: {previewData.sheet_name}
        </h3>
        <div className="text-xs text-muted-foreground">
          {previewData.stats.rows} rows × {previewData.stats.columns} columns
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className="border-b border-border px-4 py-2 text-left font-medium"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {previewData.preview.map((row, rowIdx) => (
              <tr key={rowIdx} className="hover:bg-muted/30">
                {columns.map((col, colIdx) => (
                  <td
                    key={colIdx}
                    className="border-b border-border px-4 py-2"
                  >
                    {String(row[col] ?? '')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
