import { useState } from "react"
import { useAIDownload } from "./useAI"
import { useAISession } from "@/contexts/AISessionContext"

export function useAiModeModal() {
    const { isAIModalOpen, setIsAIModalOpen, session } = useAISession()
    const [showSheetSelector, setShowSheetSelector] = useState(false)
    const [showPreview, setShowPreview] = useState(true)
    const downloadMutation = useAIDownload()
  
    const handleDownload = async () => {
      try {
        await downloadMutation.mutateAsync()
      } catch (error) {
        console.error('Failed to download file:', error)
      }
    }

    return {
        isAIModalOpen,
        setIsAIModalOpen,
        showSheetSelector,
        setShowSheetSelector,
        showPreview,
        setShowPreview,
        downloadMutation,
        handleDownload,
        session
    }
}