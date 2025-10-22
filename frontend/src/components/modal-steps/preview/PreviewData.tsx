import React from 'react'
import { PreviewHeader } from './PreviewHeader'
import { PreviewEmptyState } from './PreviewEmptyState'
import { PreviewTable } from './PreviewTable'
import { PreviewNote } from './PreviewNote'
import type { FormatDataState } from '@/types/modal'

interface PreviewDataProps {
  state: FormatDataState;
}

export function PreviewData({ state }: PreviewDataProps) {
  const selectedColumns = state.columns.filter(col => col.isSelected)

  if (!state.previewData || state.previewData.length === 0) {
    return <PreviewEmptyState />
  }

  return (
    <div className="space-y-4">
      <PreviewHeader />
      <PreviewTable 
        previewData={state.previewData} 
        selectedColumns={selectedColumns} 
      />
      <PreviewNote />
    </div>
  )
}
