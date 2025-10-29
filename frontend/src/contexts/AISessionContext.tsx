"use client"

import React, { createContext, useContext, useState } from 'react'

export interface AIMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  metadata?: {
    operation?: string
    params?: Record<string, unknown>
    stats?: Record<string, unknown>
  }
}

export interface AISessionData {
  sessionId: string
  fileName: string
  sheets: string[]
  selectedSheet: string
  conversationHistory: AIMessage[]
}

interface AISessionContextType {
  session: AISessionData | null
  setSession: (session: AISessionData | null) => void
  tokensRemaining: number
  setTokensRemaining: (tokens: number) => void
  isAIModalOpen: boolean
  setIsAIModalOpen: (open: boolean) => void
}

const AISessionContext = createContext<AISessionContextType | undefined>(undefined)

export function AISessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<AISessionData | null>(null)
  const [tokensRemaining, setTokensRemaining] = useState(50)
  const [isAIModalOpen, setIsAIModalOpen] = useState(false)

  return (
    <AISessionContext.Provider value={{ 
      session, 
      setSession,
      tokensRemaining,
      setTokensRemaining,
      isAIModalOpen,
      setIsAIModalOpen
    }}>
      {children}
    </AISessionContext.Provider>
  )
}

export function useAISession() {
  const context = useContext(AISessionContext)
  if (context === undefined) {
    throw new Error('useAISession must be used within an AISessionProvider')
  }
  return context
}
