import { useState } from 'react'
import { useFile } from '@/contexts/FileContext'

export function useFileActions() {
  const { uploadedFile } = useFile()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleFormatData = () => {
    if (uploadedFile) {
      setIsModalOpen(true)
    }
  }

  const handleUseAI = () => {
    if (uploadedFile) {
      console.log('Use AI for Cleaning clicked for:', uploadedFile.file_metadata.name)
      console.log('Available sheets:', uploadedFile.spreadsheet_data.map(sheet => sheet.spreadsheet_name))
    }
  }

  return {
    uploadedFile,
    isModalOpen,
    setIsModalOpen,
    handleFormatData,
    handleUseAI,
  }
}