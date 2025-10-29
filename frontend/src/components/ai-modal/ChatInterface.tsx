"use client"

import React, { useState, useRef, useEffect } from 'react'
import { Send } from 'lucide-react'
import type { ChatMessage } from '@/types/modal'
import { Button } from '@/components/ui/button'

interface ChatInterfaceProps {
  messages: ChatMessage[]
  onSendMessage: (message: string) => void
  isProcessing: boolean
  remainingTokens: number
  dailyLimit: number
}

export function ChatInterface({
  messages,
  onSendMessage,
  isProcessing,
  remainingTokens,
  dailyLimit,
}: ChatInterfaceProps) {
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim() && !isProcessing && remainingTokens > 0) {
      onSendMessage(input.trim())
      setInput('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-shrink-0 bg-muted/50 border-b px-4 py-2">
        <div className="text-sm">
          <span className="font-medium">Tokens remaining: </span>
          <span className={remainingTokens <= 3 ? 'text-red-500 font-semibold' : 'text-foreground'}>
            {remainingTokens}/{dailyLimit}
          </span>
          {remainingTokens === 0 && (
            <span className="ml-2 text-red-500">Daily limit reached</span>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <p className="text-lg font-medium mb-2">Start chatting with the AI assistant</p>
            <p className="text-sm">Ask questions about your data or request modifications like:</p>
            <ul className="text-sm mt-2 space-y-1">
              <li>• &quot;Remove rows where column Name is empty&quot;</li>
              <li>• &quot;Convert Email column to lowercase&quot;</li>
              <li>• &quot;Fill empty cells in Age column with 0&quot;</li>
              <li>• &quot;Show me information about the data&quot;</li>
            </ul>
          </div>
        ) : (
          <>
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.role === 'user'
                      ? 'bg-green-600 text-white'
                      : 'bg-muted text-foreground'
                  }`}
                >
                  <div className="text-sm whitespace-pre-wrap break-words">{message.content}</div>
                  <div
                    className={`text-xs mt-1 ${
                      message.role === 'user' ? 'text-green-100' : 'text-muted-foreground'
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
            {isProcessing && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg px-4 py-2">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-foreground/60 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    <div className="w-2 h-2 bg-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="flex-shrink-0 border-t p-4">
        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              remainingTokens === 0
                ? 'Daily token limit reached. Come back tomorrow!'
                : 'Type your message... (Press Enter to send, Shift+Enter for new line)'
            }
            disabled={isProcessing || remainingTokens === 0}
            className="flex-1 resize-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            rows={2}
          />
          <Button
            type="submit"
            disabled={isProcessing || !input.trim() || remainingTokens === 0}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  )
}
