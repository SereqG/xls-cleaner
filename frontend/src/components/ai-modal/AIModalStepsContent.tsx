"use client"

import React from 'react'
import { AISelectSheet } from './AISelectSheet'
import { ChatInterface } from './ChatInterface'
import { AIPreview } from './AIPreview'
import { AIDownload } from './AIDownload'
import type { AIModalState } from '@/types/modal'
import type { FileData } from '@/types/api'

interface AIModalStepsContentProps {
  state: AIModalState
  updateState: (updates: Partial<AIModalState>) => void
  uploadedFile: FileData
  onSendMessage: (message: string) => void
}

export function AIModalStepsContent({
  state,
  updateState,
  uploadedFile,
  onSendMessage,
}: AIModalStepsContentProps) {
  switch (state.currentStep) {
    case 'select-sheet':
      return (
        <AISelectSheet
          sheets={uploadedFile.spreadsheet_data}
          selectedSheet={state.selectedSheet}
          onSelectSheet={(sheetName) => updateState({ selectedSheet: sheetName })}
        />
      )

    case 'chat':
      return (
        <ChatInterface
          messages={state.messages}
          onSendMessage={onSendMessage}
          isProcessing={state.isProcessing}
          remainingTokens={state.remainingTokens}
          dailyLimit={state.dailyLimit}
        />
      )

    case 'preview':
      return <AIPreview previewData={state.previewData} isProcessing={state.isProcessing} />

    case 'download':
      return (
        <AIDownload
          sessionId={state.sessionId}
          originalFilename={uploadedFile.file_metadata.name}
        />
      )

    default:
      return null
  }
}
