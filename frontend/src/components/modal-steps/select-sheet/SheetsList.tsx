import React from 'react'
import { SheetItem } from './SheetItem'
import type { ColumnInfo } from '@/types/api'

interface SheetData {
  name: string
  columnCount: number
  columns: ColumnInfo[]
  isSelected: boolean
}

interface SheetsListProps {
  sheetsData: SheetData[]
  onSelectSheet: (sheetName: string) => void
}

export function SheetsList({ sheetsData, onSelectSheet }: SheetsListProps) {
  return (
    <div className="grid gap-4">
      {sheetsData.map((sheet) => (
        <SheetItem
          key={sheet.name}
          name={sheet.name}
          columnCount={sheet.columnCount}
          columns={sheet.columns}
          isSelected={sheet.isSelected}
          onSelect={() => onSelectSheet(sheet.name)}
        />
      ))}
    </div>
  )
}