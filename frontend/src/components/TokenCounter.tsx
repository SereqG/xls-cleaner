"use client"

import { useAISession } from '@/contexts/AISessionContext'
import { Coins } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { TokenSystemTooltip } from '@/components/TokenSystemTooltip'

export function TokenCounter() {
  const { tokensRemaining } = useAISession()

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-2 rounded-lg bg-violet-500/10 px-3 py-2 text-sm cursor-help">
            <Coins className="h-4 w-4 text-violet-500" />
            <span className="font-medium text-violet-700 dark:text-violet-400">
              {tokensRemaining} tokens
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <TokenSystemTooltip />
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
