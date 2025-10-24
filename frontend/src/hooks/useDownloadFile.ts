import { useState } from 'react'
import { processDownload } from '@/lib/downloadUtils'
import type { FormatDataState } from '@/types/modal'
import type { FileData } from '@/types/api'

interface UseDownloadFileOptions {
  state: FormatDataState
  uploadedFile: FileData
  onComplete: () => void
}

export function useDownloadFile({ state, uploadedFile, onComplete }: UseDownloadFileOptions) {
  const [filename, setFilename] = useState(() => {
    const originalName = uploadedFile.file_metadata.name
    const nameWithoutExt = originalName.replace(/\.(xlsx|xls)$/i, '')
    return `${nameWithoutExt}_formatted.xlsx`
  })
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloadComplete, setDownloadComplete] = useState(false)

  const handleDownload = async () => {
    setIsDownloading(true)
    
    try {
      const result = await processDownload(state, uploadedFile, filename)
      
      if (result.success) {
        setDownloadComplete(true)
        setTimeout(() => {
          onComplete()
        }, 2000)
      } else {
        throw new Error(result.error || 'Download failed')
      }
    } catch (error) {
      console.error('Download error:', error)
      alert('Failed to download file: ' + (error instanceof Error ? error.message : 'Unknown error'))
    } finally {
      setIsDownloading(false)
    }
  }

  return {
    filename,
    setFilename,
    isDownloading,
    downloadComplete,
    handleDownload,
  }
}