import { useState, useRef, useEffect } from 'react'
import { useAISession } from '@/contexts/AISessionContext'
import { useAIChat } from '@/hooks/useAI'

export function useChatInterface() {
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

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value)
    
    const textarea = e.target
    textarea.style.height = 'auto'
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`
  }

  return {
    session,
    message,
    setMessage,
    chatMutation,
    messagesEndRef,
    textareaRef,
    handleSubmit,
    handleKeyDown,
    handleTextareaChange,
  }
}