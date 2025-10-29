"use client"

import React, { useState } from 'react'
import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { downloadAIModifiedFile } from '@/lib/api'
import { useAuth } from '@clerk/nextjs'

interface AIDownloadProps {
  sessionId: string | null
  originalFilename: string
}

export function AIDownload({ sessionId, originalFilename }: AIDownloadProps) {
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloadError, setDownloadError] = useState<string | null>(null)
  const { getToken } = useAuth()

  const handleDownload = async () => {
    if (!sessionId) return

    setIsDownloading(true)
    setDownloadError(null)

    try {
      const token = await getToken()
      const blob = await downloadAIModifiedFile(sessionId, token || undefined)

      // Create download link
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `cleaned_${originalFilename}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      setDownloadError(error instanceof Error ? error.message : 'Failed to download file')
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md p-6 text-center">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center">
            <Download className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-2">
          Your File is Ready!
        </h3>
        <p className="text-sm text-green-700 dark:text-green-300 mb-6">
          Click the button below to download your cleaned Excel file.
        </p>
        
        <Button
          onClick={handleDownload}
          disabled={isDownloading || !sessionId}
          className="bg-green-600 hover:bg-green-700 text-white px-8"
        >
          {isDownloading ? (
            <>
              <span className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Downloading...
            </>
          ) : (
            <>
              <Download className="w-4 h-4 mr-2" />
              Download File
            </>
          )}
        </Button>
      </div>

      {downloadError && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3 text-red-700 dark:text-red-300 text-sm">
          {downloadError}
        </div>
      )}

      <div className="bg-muted/50 border rounded-md p-4">
        <h4 className="text-sm font-semibold mb-2">What&apos;s Next?</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• The file will be downloaded as cleaned_{originalFilename}</li>
          <li>• Open it in Excel or any spreadsheet application</li>
          <li>• Your modifications have been applied</li>
          <li>• Close this modal to process another file</li>
        </ul>
      </div>
    </div>
  )
}
