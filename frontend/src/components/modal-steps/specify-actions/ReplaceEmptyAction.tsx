import React from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface ReplaceEmptyActionProps {
  columnName: string
  value?: string
  onUpdate: (value: string | undefined) => void
}

export function ReplaceEmptyAction({ columnName, value, onUpdate }: ReplaceEmptyActionProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={`${columnName}-replace-empty`} className="text-sm">
        Replace empty values with:
      </Label>
      <Input
        id={`${columnName}-replace-empty`}
        placeholder="Leave empty to keep empty cells"
        value={value ?? ''}
        onChange={(e) => onUpdate(e.target.value || undefined)}
      />
    </div>
  )
}