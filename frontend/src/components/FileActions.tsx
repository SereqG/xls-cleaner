"use client"

import React from 'react'
import { Settings, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useFile } from '@/contexts/FileContext'
import { cn } from '@/lib/utils'

export function FileActions() {
  const { uploadedFile } = useFile()

  const handleFormatData = () => {
    // TODO: Implement format data logic
    console.log('Format Data clicked')
  }

  const handleUseAI = () => {
    // TODO: Implement AI cleaning logic
    console.log('Use AI for Cleaning clicked')
  }

  return (
    <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 animate-in fade-in slide-in-from-bottom-5 duration-500">
      <Button
        onClick={handleFormatData}
        disabled={!uploadedFile}
        size="lg"
        variant="outline"
        className={cn(
          "h-16 text-base font-semibold transition-all duration-300",
          uploadedFile && "hover:scale-105 hover:border-violet-400 hover:bg-violet-400/10"
        )}
      >
        <Settings className="h-5 w-5" />
        Format Data
      </Button>
      
      <Button
        onClick={handleUseAI}
        disabled={!uploadedFile}
        size="lg"
        className={cn(
          "h-16 text-base font-semibold transition-all duration-300",
          "bg-green-600 text-white hover:bg-green-700",
          uploadedFile && "hover:scale-105"
        )}
      >
        <Sparkles className="h-5 w-5" />
        Use AI for Cleaning
      </Button>
    </div>
  )
}
