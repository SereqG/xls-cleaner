import React from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { DownloadActions } from './DownloadActions'
import { DownloadSummary } from './DownloadSummary'
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

      <DownloadActions
        isDownloading={isDownloading}
        downloadComplete={downloadComplete}
        onDownload={handleDownload}
      />

      <DownloadSummary state={state} />
    </div>
  )
}
