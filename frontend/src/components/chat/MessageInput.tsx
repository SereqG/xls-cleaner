import { Button } from '@/components/ui/button'
import { Send, Loader2 } from 'lucide-react'

interface MessageInputProps {
  message: string
  onSubmit: (e: React.FormEvent) => void
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void
  onTextareaChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  textareaRef: React.RefObject<HTMLTextAreaElement | null>
  isLoading: boolean
}

export function MessageInput({
  message,
  onSubmit,
  onKeyDown,
  onTextareaChange,
  textareaRef,
  isLoading
}: MessageInputProps) {
  return (
    <form onSubmit={onSubmit} className="border-t border-border p-4">
      <div className="flex gap-2">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={onTextareaChange}
          onKeyDown={onKeyDown}
          placeholder="Ask me to clean your Excel data..."
          className="min-h-[44px] max-h-[120px] flex-1 resize-none rounded-lg border border-border bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-violet-500"
          disabled={isLoading}
          rows={1}
        />
        <Button
          type="submit"
          disabled={!message.trim() || isLoading}
          size="icon"
          className="h-[44px] w-[44px] shrink-0"
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Send className="h-5 w-5" />
          )}
        </Button>
      </div>
    </form>
  )
}