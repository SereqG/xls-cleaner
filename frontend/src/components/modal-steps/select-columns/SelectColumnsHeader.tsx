import React from 'react'

interface SelectColumnsHeaderProps {
  selectedCount: number
}

export function SelectColumnsHeader({ selectedCount }: SelectColumnsHeaderProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Select Columns to Modify</h3>
      <p className="text-sm text-muted-foreground">
        Choose at least one column and optionally change its data type.
        {selectedCount > 0 && ` (${selectedCount} selected)`}
      </p>
    </div>
  )
}