"use client"

import { useState } from 'react'
import { useAISession } from '@/contexts/AISessionContext'
import { useAIDownload } from '@/hooks/useAI'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ChatInterface } from '@/components/ChatInterface'
import { SheetPreview } from '@/components/SheetPreview'
import { TokenCounter } from '@/components/TokenCounter'
import { SheetSelectorModal } from '@/components/SheetSelectorModal'
import { Download, FileSpreadsheet, X, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export function AIModeModal() {
  const { isAIModalOpen, setIsAIModalOpen, session } = useAISession()
  const [showSheetSelector, setShowSheetSelector] = useState(false)
  const [showPreview, setShowPreview] = useState(true)
  const downloadMutation = useAIDownload()

  const handleDownload = async () => {
    try {
      await downloadMutation.mutateAsync()
    } catch (error) {
      console.error('Failed to download file:', error)
    }
  }

  const handleClose = () => {
    setIsAIModalOpen(false)
  }

  return (
    <>
      <Dialog open={isAIModalOpen} onOpenChange={setIsAIModalOpen}>
        <DialogContent className="max-w-6xl h-[85vh] p-0 gap-0">
          {/* Header */}
          <DialogHeader className="border-b border-border px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileSpreadsheet className="h-5 w-5 text-violet-500" />
                <div>
                  <DialogTitle>AI Mode</DialogTitle>
                  {session && (
                    <p className="text-sm text-muted-foreground">
                      {session.fileName}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <TokenCounter />
                
                {session && session.sheets.length > 1 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowSheetSelector(true)}
                  >
                    <ChevronDown className="mr-2 h-4 w-4" />
                    {session.selectedSheet}
                  </Button>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownload}
                  disabled={downloadMutation.isPending || !session}
                >
                  <Download className="mr-2 h-4 w-4" />
                  {downloadMutation.isPending ? 'Downloading...' : 'Download'}
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleClose}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </DialogHeader>

          {/* Content */}
          <div className="flex h-[calc(100%-73px)] overflow-hidden">
            {/* Chat Area */}
            <div className={cn(
              "flex flex-col border-r border-border transition-all",
              showPreview ? "w-1/2" : "w-full"
            )}>
              <ChatInterface />
            </div>

            {/* Preview Area */}
            {showPreview && (
              <div className="flex w-1/2 flex-col">
                <div className="flex items-center justify-between border-b border-border px-4 py-3">
                  <h3 className="text-sm font-semibold">Live Preview</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPreview(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                  <SheetPreview />
                </div>
              </div>
            )}
          </div>

          {/* Toggle Preview Button (when hidden) */}
          {!showPreview && session && (
            <Button
              variant="outline"
              size="sm"
              className="absolute bottom-4 right-4"
              onClick={() => setShowPreview(true)}
            >
              Show Preview
            </Button>
          )}
        </DialogContent>
      </Dialog>

      {/* Sheet Selector Modal */}
      <SheetSelectorModal
        open={showSheetSelector}
        onOpenChange={setShowSheetSelector}
      />
    </>
  )
}
