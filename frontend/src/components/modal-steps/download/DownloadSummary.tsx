import React from 'react'
import type { FormatDataState } from '@/types/modal'

interface DownloadSummaryProps {
  state: FormatDataState
}

export function DownloadSummary({ state }: DownloadSummaryProps) {
  return (
    <div className="border-t pt-4 space-y-2">
      <h4 className="font-medium text-sm">Summary</h4>
      <div className="text-sm space-y-1">
        <p className="text-muted-foreground">
          <span className="font-medium text-foreground">Sheet:</span> {state.selectedSheet}
        </p>
        <p className="text-muted-foreground">
          <span className="font-medium text-foreground">Columns:</span>{' '}
          {state.columns.filter(col => col.isSelected).length} selected
        </p>
        <p className="text-muted-foreground">
          <span className="font-medium text-foreground">Actions:</span>{' '}
          {state.actions.length} configured
        </p>
      </div>
    </div>
  )
}