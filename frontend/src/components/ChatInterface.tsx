"use client"

import { useState, useRef, useEffect } from 'react'
import { useAISession } from '@/contexts/AISessionContext'
import { useAIChat } from '@/hooks/useAI'
import { Button } from '@/components/ui/button'
import { Send, Loader2, Bot, User } from 'lucide-react'
import { cn } from '@/lib/utils'

export function ChatInterface() {
  const { session } = useAISession()
  const [message, setMessage] = useState('')
  const chatMutation = useAIChat()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [session?.conversationHistory])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!message.trim() || chatMutation.isPending) return
    
    const userMessage = message
    setMessage('')
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
    
    try {
      await chatMutation.mutateAsync(userMessage)
    } catch (error) {
      console.error('Failed to send message:', error)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  // Auto-resize textarea
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value)
    
    const textarea = e.target
    textarea.style.height = 'auto'
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`
  }

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
    <div className="flex h-full flex-col">
      {/* Messages */}
      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {session.conversationHistory.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
            <Bot className="h-12 w-12 text-violet-500" />
            <div>
              <h3 className="font-semibold">AI Assistant Ready</h3>
              <p className="text-sm text-muted-foreground">
                Ask me to clean, transform, or analyze your Excel data
              </p>
            </div>
            <div className="mt-4 space-y-2 text-xs text-muted-foreground">
              <p>Try asking:</p>
              <ul className="space-y-1">
                <li>• &ldquo;Remove duplicate rows&rdquo;</li>
                <li>• &ldquo;Fill missing values with 0&rdquo;</li>
                <li>• &ldquo;Sort by column A&rdquo;</li>
                <li>• &ldquo;Remove empty rows&rdquo;</li>
              </ul>
            </div>
          </div>
        ) : (
          <>
            {session.conversationHistory.map((msg, idx) => (
              <div
                key={idx}
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
                  {msg.metadata?.stats && typeof msg.metadata.stats === 'object' && 'rows' in msg.metadata.stats && 'columns' in msg.metadata.stats && (
                    <div className="mt-2 border-t border-border/50 pt-2 text-xs opacity-70">
                      <p>
                        Result: {String(msg.metadata.stats.rows)} rows × {String(msg.metadata.stats.columns)} columns
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
            ))}
            
            {chatMutation.isPending && (
              <div className="flex gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-500/20">
                  <Bot className="h-5 w-5 text-violet-500" />
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-muted px-4 py-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Processing...</span>
                </div>
              </div>
            )}
          </>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="border-t border-border p-4">
        <div className="flex gap-2">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            placeholder="Ask me to clean your Excel data..."
            className="min-h-[44px] max-h-[120px] flex-1 resize-none rounded-lg border border-border bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-violet-500"
            disabled={chatMutation.isPending}
            rows={1}
          />
          <Button
            type="submit"
            disabled={!message.trim() || chatMutation.isPending}
            size="icon"
            className="h-[44px] w-[44px] shrink-0"
          >
            {chatMutation.isPending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
