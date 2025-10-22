import React from 'react'

interface SheetSelectionIndicatorProps {
  isSelected: boolean
}

export function SheetSelectionIndicator({ isSelected }: SheetSelectionIndicatorProps) {
  if (!isSelected) return null

  return (
    <div className="bg-violet-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
      ✓
    </div>
  )
}