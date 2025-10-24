import React from 'react'
import { SelectSheetHeader } from './SelectSheetHeader'
import { SheetsList } from './SheetsList'
import { useSelectSheet } from '@/hooks'
import type { FormatDataState } from '@/types/modal'
import type { FileData } from '@/types/api'

interface SelectSheetProps {
  state: FormatDataState;
  updateState: (updates: Partial<FormatDataState>) => void;
  uploadedFile: FileData;
}

export function SelectSheet({ state, updateState, uploadedFile }: SelectSheetProps) {
  const {
    handleSelectSheet,
    sheetsData,
    totalSheets
  } = useSelectSheet({ state, updateState, uploadedFile })

  return (
    <div className="space-y-4">
      <SelectSheetHeader totalSheets={totalSheets} />
      <SheetsList 
        sheetsData={sheetsData} 
        onSelectSheet={handleSelectSheet} 
      />
    </div>
  )
}
