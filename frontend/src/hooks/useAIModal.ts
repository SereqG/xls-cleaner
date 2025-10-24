import { useState, useEffect, useCallback, useMemo } from 'react'
import { useFile } from '@/contexts/FileContext'
import { useAuth } from '@clerk/nextjs'
import type { AIModalState, AIModalStep, ChatMessage } from '@/types/modal'
import type { FileData } from '@/types/api'
import { startAISession, sendAIMessage, getAIPreview, endAISession } from '@/lib/api'

const AI_MODAL_STEPS = [
  { id: 'select-sheet' as const, label: 'Select Sheet' },
  { id: 'chat' as const, label: 'Chat with AI' },
  { id: 'preview' as const, label: 'Preview Changes' },
  { id: 'download' as const, label: 'Download' },
]

function shouldShowSheetSelection(uploadedFile: FileData | null): boolean {
  return uploadedFile ? uploadedFile.spreadsheet_data.length > 1 : false
}

function getInitialStep(uploadedFile: FileData | null): AIModalStep {
  return shouldShowSheetSelection(uploadedFile) ? 'select-sheet' : 'chat'
}

function getInitialSheet(uploadedFile: FileData | null): string | null {
  if (!uploadedFile) return null
  if (uploadedFile.spreadsheet_data.length === 1) {
    return uploadedFile.spreadsheet_data[0].spreadsheet_name
  }
  return null
}

export function useAIModal(open: boolean) {
  const { uploadedFile } = useFile()
  const { getToken } = useAuth()

  const [state, setState] = useState<AIModalState>({
    currentStep: 'select-sheet',
    selectedSheet: null,
    messages: [],
    previewData: null,
    sessionId: null,
    isProcessing: false,
    error: null,
    remainingTokens: 15,
    dailyLimit: 15,
  })

  const showSheetSelection = shouldShowSheetSelection(uploadedFile)

  const steps = useMemo(() => {
    if (showSheetSelection) {
      return AI_MODAL_STEPS
    }
    // Skip sheet selection if only one sheet
    return AI_MODAL_STEPS.filter(step => step.id !== 'select-sheet')
  }, [showSheetSelection])

  // Initialize state when modal opens
  useEffect(() => {
    if (open && uploadedFile) {
      setState(prev => ({
        ...prev,
        currentStep: getInitialStep(uploadedFile),
        selectedSheet: getInitialSheet(uploadedFile),
        messages: [],
        previewData: null,
        sessionId: null,
        error: null,
      }))
    }
  }, [open, uploadedFile])

  // Cleanup session when modal closes
  useEffect(() => {
    if (!open && state.sessionId) {
      const cleanup = async () => {
        try {
          const token = await getToken()
          await endAISession(state.sessionId!, token || undefined)
        } catch (error) {
          console.error('Failed to cleanup session:', error)
        }
      }
      cleanup()
    }
  }, [open, state.sessionId, getToken])

  const currentStepIndex = steps.findIndex(step => step.id === state.currentStep)

  const canProceed = useMemo(() => {
    switch (state.currentStep) {
      case 'select-sheet':
        return !!state.selectedSheet
      case 'chat':
        return state.messages.length > 0
      case 'preview':
        return !!state.previewData
      case 'download':
        return false
      default:
        return false
    }
  }, [state])

  const startSession = useCallback(async (sheetName: string) => {
    if (!uploadedFile) return

    setState(prev => ({ ...prev, isProcessing: true, error: null }))

    try {
      const token = await getToken()
      const result = await startAISession(
        uploadedFile.file_metadata,
        sheetName,
        token || undefined
      )

      setState(prev => ({
        ...prev,
        sessionId: result.session_id,
        remainingTokens: result.remaining_tokens,
        dailyLimit: result.daily_limit,
        isProcessing: false,
      }))
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to start session',
        isProcessing: false,
      }))
    }
  }, [uploadedFile, getToken])

  const sendMessage = useCallback(async (message: string) => {
    if (!state.sessionId) return

    // Add user message immediately
    const userMessage: ChatMessage = {
      role: 'user',
      content: message,
      timestamp: new Date(),
    }

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isProcessing: true,
      error: null,
    }))

    try {
      const token = await getToken()
      const result = await sendAIMessage(state.sessionId, message, token || undefined)

      // Add assistant response
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: result.response,
        timestamp: new Date(),
      }

      setState(prev => ({
        ...prev,
        messages: [...prev.messages, assistantMessage],
        remainingTokens: result.remaining_tokens,
        isProcessing: false,
      }))
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to send message',
        isProcessing: false,
      }))
    }
  }, [state.sessionId, getToken])

  const loadPreview = useCallback(async () => {
    if (!state.sessionId) return

    setState(prev => ({ ...prev, isProcessing: true, error: null }))

    try {
      const token = await getToken()
      const result = await getAIPreview(state.sessionId, token || undefined)

      setState(prev => ({
        ...prev,
        previewData: result.preview,
        isProcessing: false,
      }))
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to load preview',
        isProcessing: false,
      }))
    }
  }, [state.sessionId, getToken])

  const handleNext = useCallback(async () => {
    const nextStepIndex = currentStepIndex + 1
    if (nextStepIndex >= steps.length) return

    const nextStep = steps[nextStepIndex].id

    // Special handling for transitioning to chat step
    if (nextStep === 'chat' && !state.sessionId && state.selectedSheet) {
      await startSession(state.selectedSheet)
    }

    // Special handling for transitioning to preview step
    if (nextStep === 'preview') {
      await loadPreview()
    }

    setState(prev => ({ ...prev, currentStep: nextStep }))
  }, [currentStepIndex, steps, state.sessionId, state.selectedSheet, startSession, loadPreview])

  const handleBack = useCallback(() => {
    const prevStepIndex = currentStepIndex - 1
    if (prevStepIndex < 0) return

    const prevStep = steps[prevStepIndex].id
    setState(prev => ({ ...prev, currentStep: prevStep, error: null }))
  }, [currentStepIndex, steps])

  const updateState = useCallback((updates: Partial<AIModalState>) => {
    setState(prev => ({ ...prev, ...updates }))
  }, [])

  return {
    uploadedFile,
    state,
    steps,
    currentStepIndex,
    canProceed,
    handleNext,
    handleBack,
    updateState,
    sendMessage,
  }
}
