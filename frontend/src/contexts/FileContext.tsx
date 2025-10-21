"use client"

import React, { createContext, useContext, useState } from 'react'

interface FileContextType {
  uploadedFile: File | null
  setUploadedFile: (file: File | null) => void
}

const FileContext = createContext<FileContextType | undefined>(undefined)

export function FileProvider({ children }: { children: React.ReactNode }) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)

  return (
    <FileContext.Provider value={{ uploadedFile, setUploadedFile }}>
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
