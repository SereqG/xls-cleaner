"use client"

import React from 'react'

interface AIPreviewProps {
  previewData: string | null
  isProcessing: boolean
}

export function AIPreview({ previewData, isProcessing }: AIPreviewProps) {
  if (isProcessing) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mb-2" />
          <p className="text-sm text-muted-foreground">Loading preview...</p>
        </div>
      </div>
    )
  }

  if (!previewData) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">No preview data available</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="bg-muted/50 border rounded-md p-4">
        <h3 className="text-sm font-semibold mb-2">Preview of Modified Data</h3>
        <p className="text-xs text-muted-foreground mb-4">
          Review the changes below. If you&apos;re satisfied, proceed to download the modified file.
        </p>
      </div>

      <div className="border rounded-md overflow-auto max-h-96">
        <pre className="p-4 text-xs font-mono whitespace-pre">{previewData}</pre>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-3">
        <p className="text-sm text-blue-700 dark:text-blue-300">
          ℹ️ This is a preview of the first 10 rows. The full file will be available for download.
        </p>
      </div>
    </div>
  )
}
