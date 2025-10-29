"use client"

import { useState } from 'react'
import { useAISession } from '@/contexts/AISessionContext'
import { useSelectSheet } from '@/hooks/useAI'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SheetSelectorModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SheetSelectorModal({ open, onOpenChange }: SheetSelectorModalProps) {
  const { session } = useAISession()
  const selectSheet = useSelectSheet()
  const [selectedSheet, setSelectedSheet] = useState(session?.selectedSheet || '')

  const handleSelect = async () => {
    if (!selectedSheet) return
    
    try {
      await selectSheet.mutateAsync(selectedSheet)
      onOpenChange(false)
    } catch (error) {
      console.error('Failed to select sheet:', error)
    }
  }

  if (!session) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Select Sheet</DialogTitle>
          <DialogDescription>
            Choose which sheet you want to work with
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          {session.sheets.map((sheet) => (
            <button
              key={sheet}
              onClick={() => setSelectedSheet(sheet)}
              className={cn(
                "flex w-full items-center justify-between rounded-lg border p-3 text-left transition-colors hover:bg-muted/50",
                selectedSheet === sheet
                  ? "border-violet-500 bg-violet-500/10"
                  : "border-border"
              )}
            >
              <span className="font-medium">{sheet}</span>
              {selectedSheet === sheet && (
                <Check className="h-5 w-5 text-violet-500" />
              )}
            </button>
          ))}
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSelect}
            disabled={!selectedSheet || selectSheet.isPending}
          >
            {selectSheet.isPending ? 'Selecting...' : 'Select Sheet'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
