"use client"

import { useChatInterface } from '@/hooks/useChatInterface'
import { ChatContainer } from '@/components/chat'

export function ChatInterface() {
  const {
    session,
    message,
    chatMutation,
    messagesEndRef,
    textareaRef,
    handleSubmit,
    handleKeyDown,
    handleTextareaChange,
  } = useChatInterface()

  if (!session) {
    return (
      <div className="flex h-full items-center justify-center p-8 text-center">
        <p className="text-muted-foreground">
          Upload a file to start chatting with the AI assistant
        </p>
      </div>
    )
  }

  return (
    <ChatContainer
      session={session}
      message={message}
      onSubmit={handleSubmit}
      onKeyDown={handleKeyDown}
      onTextareaChange={handleTextareaChange}
      textareaRef={textareaRef}
      messagesEndRef={messagesEndRef}
      isLoading={chatMutation.isPending}
    />
  )
}
