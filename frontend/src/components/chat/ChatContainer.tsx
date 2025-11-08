import { type AISessionData } from '@/contexts/AISessionContext'
import { MessagesList } from './MessagesList'
import { MessageInput } from './MessageInput'

interface ChatContainerProps {
  session: AISessionData
  message: string
  onSubmit: (e: React.FormEvent) => void
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void
  onTextareaChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  textareaRef: React.RefObject<HTMLTextAreaElement | null>
  messagesEndRef: React.RefObject<HTMLDivElement | null>
  isLoading: boolean
}

export function ChatContainer({
  session,
  message,
  onSubmit,
  onKeyDown,
  onTextareaChange,
  textareaRef,
  messagesEndRef,
  isLoading
}: ChatContainerProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        <MessagesList 
          session={session}
          isLoading={isLoading}
          messagesEndRef={messagesEndRef}
        />
      </div>

      <MessageInput
        message={message}
        onSubmit={onSubmit}
        onKeyDown={onKeyDown}
        onTextareaChange={onTextareaChange}
        textareaRef={textareaRef}
        isLoading={isLoading}
      />
    </div>
  )
}