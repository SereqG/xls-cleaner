import React from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface RoundDecimalsActionProps {
  columnName: string
  value?: number
  onUpdate: (value: number | undefined) => void
}

export function RoundDecimalsAction({ columnName, value, onUpdate }: RoundDecimalsActionProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={`${columnName}-decimals`} className="text-sm">
        Round to decimal places:
      </Label>
      <Input
        id={`${columnName}-decimals`}
        type="number"
        min="0"
        max="10"
        placeholder="Leave empty for no rounding"
        value={value ?? ''}
        onChange={(e) => {
          const val = e.target.value
          onUpdate(val === '' ? undefined : parseInt(val, 10))
        }}
      />
    </div>
  )
}