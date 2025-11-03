import { type AIMessage } from '@/contexts/AISessionContext'
import { Bot, User } from 'lucide-react'
import { cn } from '@/lib/utils'

// Helper function to check if message metadata has valid stats
function hasValidStats(msg: AIMessage): boolean {
  return !!(
    msg.metadata?.stats &&
    typeof msg.metadata.stats === 'object' &&
    'rows' in msg.metadata.stats &&
    'columns' in msg.metadata.stats
  )
}

interface MessageProps {
  message: AIMessage
  index: number
}

export function Message({ message: msg, index }: MessageProps) {
  return (
    <div
      key={index}
      className={cn(
        "flex gap-3",
        msg.role === 'user' ? 'justify-end' : 'justify-start'
      )}
    >
      {msg.role === 'assistant' && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-500/20">
          <Bot className="h-5 w-5 text-violet-500" />
        </div>
      )}
      
      <div
        className={cn(
          "max-w-[80%] rounded-lg px-4 py-2",
          msg.role === 'user'
            ? 'bg-violet-500 text-white'
            : 'bg-muted'
        )}
      >
        <p className="whitespace-pre-wrap text-sm">{msg.content}</p>
        {hasValidStats(msg) && (
          <div className="mt-2 border-t border-border/50 pt-2 text-xs opacity-70">
            <p>
              Result: {String(msg.metadata!.stats!.rows)} rows × {String(msg.metadata!.stats!.columns)} columns
            </p>
          </div>
        )}
      </div>
      
      {msg.role === 'user' && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
          <User className="h-5 w-5" />
        </div>
      )}
    </div>
  )
}