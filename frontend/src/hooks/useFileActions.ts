import { useState } from 'react'
import { useFile } from '@/contexts/FileContext'

export function useFileActions() {
  const { uploadedFile } = useFile()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isAIModalOpen, setIsAIModalOpen] = useState(false)

  const handleFormatData = () => {
    if (uploadedFile) {
      setIsModalOpen(true)
    }
  }

  const handleUseAI = () => {
    if (uploadedFile) {
      setIsAIModalOpen(true)
    }
  }

  return {
    uploadedFile,
    isModalOpen,
    setIsModalOpen,
    isAIModalOpen,
    setIsAIModalOpen,
    handleFormatData,
    handleUseAI,
  }
}