import React from 'react'

interface SelectSheetHeaderProps {
  totalSheets: number
}

export function SelectSheetHeader({ totalSheets }: SelectSheetHeaderProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Select a Spreadsheet</h3>
      <p className="text-sm text-muted-foreground">
        Your file contains {totalSheets} spreadsheets. Select one to continue.
      </p>
    </div>
  )
}