import { ChatInterface } from '@/components/ChatInterface'
import { cn } from '@/lib/utils'

interface ChatAreaProps {
  showPreview: boolean
}

export function ChatArea({ showPreview }: ChatAreaProps) {
  return (
    <div className={cn(
      "flex flex-col border-r border-border transition-all",
      showPreview ? "w-1/2" : "w-full"
    )}>
      <ChatInterface />
    </div>
  )
}