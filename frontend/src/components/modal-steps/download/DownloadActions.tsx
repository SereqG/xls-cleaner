import React from 'react'
import { Download, Loader2, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface DownloadActionsProps {
  isDownloading: boolean
  downloadComplete: boolean
  onDownload: () => void
}

export function DownloadActions({ 
  isDownloading, 
  downloadComplete, 
  onDownload 
}: DownloadActionsProps) {
  return (
    <div className="space-y-3">
      <Button
        onClick={onDownload}
        disabled={isDownloading || downloadComplete}
        className="w-full"
        size="lg"
      >
        {isDownloading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Preparing download...
          </>
        ) : downloadComplete ? (
          <>
            <CheckCircle className="w-4 h-4" />
            Downloaded successfully!
          </>
        ) : (
          <>
            <Download className="w-4 h-4" />
            Download File
          </>
        )}
      </Button>

      {downloadComplete && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md p-3 text-sm text-green-700 dark:text-green-300 text-center">
          File downloaded successfully! This modal will close automatically.
        </div>
      )}
    </div>
  )
}