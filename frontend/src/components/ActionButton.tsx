import React from 'react'
import { LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ActionButtonProps {
  onClick: () => void
  disabled: boolean
  icon: LucideIcon
  children: React.ReactNode
  variant?: 'default' | 'outline'
  className?: string
  enableHoverEffects?: boolean
}

export function ActionButton({
  onClick,
  disabled,
  icon: Icon,
  children,
  variant = 'default',
  className,
  enableHoverEffects = false,
}: ActionButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      size="lg"
      variant={variant}
      className={cn(
        "h-16 text-base font-semibold transition-all duration-300",
        enableHoverEffects && !disabled && "hover:scale-105",
        className
      )}
    >
      <Icon className="h-5 w-5" />
      {children}
    </Button>
  )
}