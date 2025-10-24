"use client"

import React from 'react'
import { Upload } from 'lucide-react'
import { useFile } from '@/contexts/FileContext'
import { cn } from '@/lib/utils'
import { useFileUpload } from '@/hooks'
import { FileAnalyzingState } from './FileAnalyzingState'
import { FileUploadedState } from './FileUploadedState'
import { FileEmptyState } from './FileEmptyState'

export function FileUpload() {
  const { uploadedFile } = useFile()
  const {
    isDragging,
    fileInputRef,
    isAnalyzing,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileChange,
    handleClick,
  } = useFileUpload()

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
        
        {isAnalyzing ? (
          <FileAnalyzingState />
        ) : uploadedFile ? (
          <FileUploadedState uploadedFile={uploadedFile} />
        ) : (
          <FileEmptyState />
        )}
      </div>
    </div>
  )
}
