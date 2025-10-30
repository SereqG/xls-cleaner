"use client"

import { useAISession } from '@/contexts/AISessionContext'
import { Coins } from 'lucide-react'

export function TokenCounter() {
  const { tokensRemaining } = useAISession()

  return (
    <div className="flex items-center gap-2 rounded-lg bg-violet-500/10 px-3 py-2 text-sm">
      <Coins className="h-4 w-4 text-violet-500" />
      <span className="font-medium text-violet-700 dark:text-violet-400">
        {tokensRemaining} tokens
      </span>
    </div>
  )
}
