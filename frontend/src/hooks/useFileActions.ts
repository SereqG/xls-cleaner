import { useState } from 'react'
import { useFile } from '@/contexts/FileContext'
import { useAISession } from '@/contexts/AISessionContext'
import { useAIUpload } from './useAI'
import { useUser } from '@clerk/nextjs'

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
    
    // Check if user is signed in
    if (!isSignedIn || !user) {
      alert('Please sign in to use AI Mode')
      return
    }
    
    try {
      // Upload file to AI backend
      await aiUpload.mutateAsync(uploadedFile.file_metadata)
      
      // Open AI modal
      setIsAIModalOpen(true)
    } catch (error) {
      console.error('Failed to initialize AI session:', error)
      alert('Failed to initialize AI session. Please try again.')
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