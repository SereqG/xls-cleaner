import { useState } from 'react'
import { useFile } from '@/contexts/FileContext'
import { useAISession } from '@/contexts/AISessionContext'
import { useAIUpload } from './useAI'
import { useUser } from '@clerk/nextjs'
import { toast } from 'sonner'

export function useFileActions() {
  const { uploadedFile } = useFile()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { setIsAIModalOpen } = useAISession()
  const aiUpload = useAIUpload()
  const { user, isSignedIn } = useUser()

  const handleFormatData = () => {
    if (uploadedFile) {
      setIsModalOpen(true)
    }
  }

  const handleUseAI = async () => {
    if (!uploadedFile) return
    
    if (!isSignedIn || !user) {
      toast.error('Please sign in to use AI Mode')
      return
    }
    
    try {
      await aiUpload.mutateAsync(uploadedFile.file_metadata)
      
      setIsAIModalOpen(true)
    } catch (error) {
      console.error('Failed to initialize AI session:', error)
      toast.error('Failed to initialize AI session. Please try again.')
    }
  }

  return {
    uploadedFile,
    isModalOpen,
    setIsModalOpen,
    handleFormatData,
    handleUseAI,
    isAIUploading: aiUpload.isPending,
  }
}