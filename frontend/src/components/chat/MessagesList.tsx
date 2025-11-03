import { type AISessionData } from '@/contexts/AISessionContext'
import { ChatEmptyState } from './ChatEmptyState'
import { Message } from './Message'
import { LoadingIndicator } from './LoadingIndicator'

interface MessagesListProps {
  session: AISessionData
  isLoading: boolean
  messagesEndRef: React.RefObject<HTMLDivElement | null>
}

export function MessagesList({ session, isLoading, messagesEndRef }: MessagesListProps) {
  if (session.conversationHistory.length === 0) {
    return <ChatEmptyState />
  }

  return (
    <>
      {session.conversationHistory.map((msg, idx) => (
        <Message key={idx} message={msg} index={idx} />
      ))}
      
      {isLoading && <LoadingIndicator />}
      
      <div ref={messagesEndRef} />
    </>
  )
}