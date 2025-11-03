import { Bot, Loader2 } from 'lucide-react'

export function LoadingIndicator() {
  return (
    <div className="flex gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-500/20">
        <Bot className="h-5 w-5 text-violet-500" />
      </div>
      <div className="flex items-center gap-2 rounded-lg bg-muted px-4 py-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-sm">Processing...</span>
      </div>
    </div>
  )
}