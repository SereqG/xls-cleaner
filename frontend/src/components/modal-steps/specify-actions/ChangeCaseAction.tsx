import React from 'react'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface ChangeCaseActionProps {
  columnName: string
  value?: 'uppercase' | 'lowercase' | 'titlecase'
  onUpdate: (value: 'uppercase' | 'lowercase' | 'titlecase' | undefined) => void
}

export function ChangeCaseAction({ columnName, value, onUpdate }: ChangeCaseActionProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={`${columnName}-case`} className="text-sm">
        Change case:
      </Label>
      <Select
        value={value ?? 'none'}
        onValueChange={(val) =>
          onUpdate(val === 'none' ? undefined : val as 'uppercase' | 'lowercase' | 'titlecase')
        }
      >
        <SelectTrigger id={`${columnName}-case`}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">No change</SelectItem>
          <SelectItem value="uppercase">UPPERCASE</SelectItem>
          <SelectItem value="lowercase">lowercase</SelectItem>
          <SelectItem value="titlecase">Title Case</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}