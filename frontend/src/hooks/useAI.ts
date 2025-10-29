import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAISession } from '@/contexts/AISessionContext'
import { aiApi } from '@/lib/ai-api'
import { useUser } from '@clerk/nextjs'
import { useEffect } from 'react'

export function useAIUpload() {
  const { setSession, setTokensRemaining } = useAISession()
  const { user } = useUser()

  return useMutation({
    mutationFn: async (file: File) => {
      if (!user) throw new Error('User not authenticated')
      
      return aiApi.uploadFile({
        file,
        userId: user.id,
        email: user.primaryEmailAddress?.emailAddress || '',
      })
    },
    onSuccess: (data) => {
      setSession({
        sessionId: data.session_id,
        fileName: data.file_name,
        sheets: data.sheets,
        selectedSheet: data.selected_sheet,
        conversationHistory: [],
      })
      setTokensRemaining(data.tokens_remaining)
    },
  })
}

export function useAIChat() {
  const { session, setSession, setTokensRemaining } = useAISession()
  const { user } = useUser()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (message: string) => {
      if (!user) throw new Error('User not authenticated')
      if (!session) throw new Error('No active session')
      
      return aiApi.sendMessage({
        sessionId: session.sessionId,
        message,
        userId: user.id,
      })
    },
    onSuccess: (data, message) => {
      if (!session) return
      
      // Add user message
      const userMessage = {
        role: 'user' as const,
        content: message,
        timestamp: new Date().toISOString(),
      }
      
      // Add AI response
      const aiMessage = {
        role: 'assistant' as const,
        content: data.message,
        timestamp: new Date().toISOString(),
        metadata: data.operation ? {
          operation: data.operation,
          stats: data.stats,
        } : undefined,
      }
      
      setSession({
        ...session,
        conversationHistory: [
          ...session.conversationHistory,
          userMessage,
          aiMessage,
        ],
      })
      
      setTokensRemaining(data.tokens_remaining)
      
      // Invalidate preview cache if there was an operation that might have changed the data
      if (data.operation) {
        queryClient.invalidateQueries({ queryKey: ['ai-preview'] })
      }
    },
  })
}

export function useAIPreview() {
  const { session } = useAISession()
  const { user } = useUser()

  return useQuery({
    queryKey: ['ai-preview', session?.sessionId],
    queryFn: async () => {
      if (!user || !session) throw new Error('No active session')
      
      return aiApi.getPreview(session.sessionId, user.id)
    },
    enabled: !!session && !!user,
  })
}

export function useAITokens() {
  const { setTokensRemaining } = useAISession()
  const { user } = useUser()

  const query = useQuery({
    queryKey: ['ai-tokens', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated')
      
      return aiApi.getTokens(user.id)
    },
    enabled: !!user,
  })

  // Update tokens when data changes
  useEffect(() => {
    if (query.data) {
      setTokensRemaining(query.data.tokens_remaining)
    }
  }, [query.data, setTokensRemaining])

  return query
}

export function useAIDownload() {
  const { session } = useAISession()
  const { user } = useUser()

  return useMutation({
    mutationFn: async () => {
      if (!user || !session) throw new Error('No active session')
      
      return aiApi.downloadFile(session.sessionId, user.id)
    },
    onSuccess: (blob) => {
      if (!session) return
      
      // Create download link
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `cleaned_${session.fileName}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    },
  })
}

export function useSelectSheet() {
  const { session, setSession } = useAISession()
  const { user } = useUser()

  return useMutation({
    mutationFn: async (sheetName: string) => {
      if (!user || !session) throw new Error('No active session')
      
      return aiApi.selectSheet(session.sessionId, sheetName, user.id)
    },
    onSuccess: (_, sheetName) => {
      if (!session) return
      
      setSession({
        ...session,
        selectedSheet: sheetName,
      })
    },
  })
}
