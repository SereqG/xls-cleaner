"use client"

import React, { useRef, useState } from 'react'
import { Upload } from 'lucide-react'
import { useFile } from '@/contexts/FileContext'
import { cn } from '@/lib/utils'

export function FileUpload() {
  const { uploadedFile, setUploadedFile } = useFile()
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

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
        setUploadedFile(file)
      }
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      const file = files[0]
      if (isValidFile(file)) {
        setUploadedFile(file)
      }
    }
  }

  const isValidFile = (file: File): boolean => {
    const validTypes: { [key: string]: string } = {
      '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      '.xls': 'application/vnd.ms-excel',
    }
    const fileName = file.name.toLowerCase()
    const fileType = file.type
    // Check for a valid extension and matching MIME type
    return Object.entries(validTypes).some(([ext, mime]) =>
      fileName.endsWith(ext) && fileType === mime
    )
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div
      className={cn(
        "relative flex min-h-[200px] w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4",
        isDragging
          ? "border-violet-500 bg-violet-500/10"
          : "border-border hover:border-violet-400 hover:bg-violet-400/5"
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls"
        onChange={handleFileChange}
        className="hidden"
      />
      
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="rounded-full bg-violet-500/20 p-4 transition-transform duration-300 hover:scale-110">
          <Upload className="h-8 w-8 text-violet-500" />
        </div>
        
        {uploadedFile ? (
          <div className="flex flex-col gap-2">
            <p className="text-xl font-semibold">{uploadedFile.name}</p>
            <p className="text-sm text-muted-foreground">
              {(uploadedFile.size / 1024).toFixed(2)} KB
            </p>
          </div>
        ) : (
          <>
            <h3 className="text-xl font-semibold">Upload your Excel</h3>
            <p className="text-sm text-muted-foreground">
              Drag & drop or click to upload
            </p>
            <p className="text-xs text-violet-400">Supported: .xlsx, .xls</p>
          </>
        )}
      </div>
    </div>
  )
}
