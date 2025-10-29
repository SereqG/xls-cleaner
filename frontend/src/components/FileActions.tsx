"use client"

import React from 'react'
import { Settings, Sparkles, Loader2 } from 'lucide-react'
import { ActionButton } from './ActionButton'
import { FormatDataModal } from './format-data-modal'
import { AIModeModal } from './AIModeModal'
import { useFileActions } from '@/hooks'

export function FileActions() {
  const {
    uploadedFile,
    isModalOpen,
    setIsModalOpen,
    handleFormatData,
    handleUseAI,
    isAIUploading,
  } = useFileActions()

  return (
    <>
      <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 animate-in fade-in slide-in-from-bottom-5 duration-500">
        <ActionButton
          onClick={handleFormatData}
          disabled={!uploadedFile}
          variant="outline"
          icon={Settings}
          className="hover:border-violet-400 hover:bg-violet-400/10"
          enableHoverEffects={!!uploadedFile}
        >
          Format Data
        </ActionButton>
        
        <ActionButton
          onClick={handleUseAI}
          disabled={!uploadedFile || isAIUploading}
          icon={isAIUploading ? Loader2 : Sparkles}
          className="bg-green-600 text-white hover:bg-green-700"
          enableHoverEffects={!!uploadedFile && !isAIUploading}
        >
          {isAIUploading ? 'Initializing AI...' : 'Use AI for Cleaning'}
        </ActionButton>
      </div>

      <FormatDataModal open={isModalOpen} onOpenChange={setIsModalOpen} />
      <AIModeModal />
    </>
  )
}
