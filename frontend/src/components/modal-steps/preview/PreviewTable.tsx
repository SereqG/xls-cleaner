import React from 'react'
import { PreviewTableHeader } from './PreviewTableHeader'
import { PreviewTableRow } from './PreviewTableRow'
import type { ColumnSelection } from '@/types/modal'

interface PreviewTableProps {
  previewData: Record<string, unknown>[]
  selectedColumns: ColumnSelection[]
}

export function PreviewTable({ previewData, selectedColumns }: PreviewTableProps) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <PreviewTableHeader selectedColumns={selectedColumns} />
          <tbody>
            {previewData.map((row, rowIndex) => (
              <PreviewTableRow
                key={rowIndex}
                row={row}
                rowIndex={rowIndex}
                selectedColumns={selectedColumns}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}