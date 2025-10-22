"use client"

import React, { createContext, useContext, useState } from 'react'
import type { FileData } from '@/types/api'

interface FileContextType {
  uploadedFile: FileData | null;
  setUploadedFile: (fileData: FileData | null) => void;
  isAnalyzing: boolean;
  setIsAnalyzing: (analyzing: boolean) => void;
}

const FileContext = createContext<FileContextType | undefined>(undefined)

export function FileProvider({ children }: { children: React.ReactNode }) {
  const [uploadedFile, setUploadedFile] = useState<FileData | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  return (
    <FileContext.Provider value={{ 
      uploadedFile, 
      setUploadedFile, 
      isAnalyzing, 
      setIsAnalyzing 
    }}>
      {children}
    </FileContext.Provider>
  )
}

export function useFile() {
  const context = useContext(FileContext)
  if (context === undefined) {
    throw new Error('useFile must be used within a FileProvider')
  }
  return context
}
