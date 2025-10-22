import { useState, useRef } from 'react'
import { useFile } from '@/contexts/FileContext'
import { analyzeSpreadsheet } from '@/lib/api'

export function useFileUpload() {
  const { setUploadedFile, isAnalyzing, setIsAnalyzing } = useFile()
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const isValidFile = (file: File): boolean => {
    const validTypes: { [key: string]: string } = {
      '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      '.xls': 'application/vnd.ms-excel',
    }
    const fileName = file.name.toLowerCase()
    const fileType = file.type
    return Object.entries(validTypes).some(([ext, mime]) =>
      fileName.endsWith(ext) && fileType === mime
    )
  }

  const analyzeFile = async (file: File) => {
    setIsAnalyzing(true)
    
    try {
      const spreadsheet_data = await analyzeSpreadsheet(file)
      
      setUploadedFile({
        file_metadata: file,
        spreadsheet_data: spreadsheet_data
      })
      
    } catch (error) {
      console.error('Error analyzing file:', error)
      const errorMessage = error instanceof Error ? error.message : 'Error analyzing file. Please try again.'
      alert(errorMessage)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files.length > 0) {
      const file = files[0]
      if (isValidFile(file)) {
        analyzeFile(file)
      }
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      const file = files[0]
      if (isValidFile(file)) {
        analyzeFile(file)
      }
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return {
    isDragging,
    fileInputRef,
    isAnalyzing,
    isValidFile,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileChange,
    handleClick,
  }
}