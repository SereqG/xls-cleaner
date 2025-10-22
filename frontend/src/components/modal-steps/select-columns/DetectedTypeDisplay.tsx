import React from 'react'

interface DetectedTypeDisplayProps {
  originalType: string
}

export function DetectedTypeDisplay({ originalType }: DetectedTypeDisplayProps) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-muted-foreground">Detected:</span>
      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs font-mono">
        {originalType}
      </span>
    </div>
  )
}