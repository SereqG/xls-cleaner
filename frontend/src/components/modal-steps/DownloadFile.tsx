import React from 'react'
import { Download, Loader2, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { FormatDataState } from '@/types/modal'
import type { FileData } from '@/types/api'
import { useDownloadFile } from '@/hooks'

interface DownloadFileProps {
  state: FormatDataState;
  uploadedFile: FileData;
  onComplete: () => void;
}

export function DownloadFile({ state, uploadedFile, onComplete }: DownloadFileProps) {
  const {
    filename,
    setFilename,
    isDownloading,
    downloadComplete,
    handleDownload,
  } = useDownloadFile({ state, uploadedFile, onComplete })

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Download Formatted File</h3>
        <p className="text-sm text-muted-foreground">
          Your data is ready to download. Click the button below to save your formatted file.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="filename">Filename</Label>
        <Input
          id="filename"
          value={filename}
          onChange={(e) => setFilename(e.target.value)}
          disabled={isDownloading || downloadComplete}
        />
      </div>

      <div className="space-y-3">
        <Button
          onClick={handleDownload}
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

      <div className="border-t pt-4 space-y-2">
        <h4 className="font-medium text-sm">Summary</h4>
        <div className="text-sm space-y-1">
          <p className="text-muted-foreground">
            <span className="font-medium text-foreground">Sheet:</span> {state.selectedSheet}
          </p>
          <p className="text-muted-foreground">
            <span className="font-medium text-foreground">Columns:</span>{' '}
            {state.columns.filter(col => col.isSelected).length} selected
          </p>
          <p className="text-muted-foreground">
            <span className="font-medium text-foreground">Actions:</span>{' '}
            {state.actions.length} configured
          </p>
        </div>
      </div>
    </div>
  )
}
