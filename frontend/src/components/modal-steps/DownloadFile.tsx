import React, { useState } from 'react'
import { Download, Loader2, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { FormatDataState } from '@/types/modal'
import type { FileData } from '@/types/api'
import * as XLSX from 'xlsx'

interface DownloadFileProps {
  state: FormatDataState;
  uploadedFile: FileData;
  onComplete: () => void;
}

export function DownloadFile({ state, uploadedFile, onComplete }: DownloadFileProps) {
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
      // Find the selected sheet
      const sheet = uploadedFile.spreadsheet_data.find(
        s => s.spreadsheet_name === state.selectedSheet
      )
      
      if (!sheet) {
        throw new Error('Selected sheet not found')
      }

      // Get selected columns
      const selectedColumns = state.columns.filter(col => col.isSelected)
      
      // Transform all data
      const transformedData = sheet.spreadsheet_snippet.map((row: Record<string, unknown>) => {
        const transformedRow: Record<string, unknown> = {}
        
        selectedColumns.forEach(column => {
          const action = state.actions.find(a => a.columnName === column.name)
          let value = row[column.name]
          
          // Apply transformations
          if (value === null || value === undefined || value === '') {
            if (action?.replaceEmpty !== undefined) {
              value = action.replaceEmpty
            }
          } else {
            // Apply type-specific transformations
            if (column.selectedType === 'string' && action?.changeCase) {
              const strValue = String(value)
              switch (action.changeCase) {
                case 'uppercase':
                  value = strValue.toUpperCase()
                  break
                case 'lowercase':
                  value = strValue.toLowerCase()
                  break
                case 'titlecase':
                  value = strValue.replace(/\w\S*/g, (txt) => 
                    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
                  )
                  break
              }
            } else if (column.selectedType === 'number' && action?.roundDecimals !== undefined) {
              const numValue = Number(value)
              if (!isNaN(numValue)) {
                value = Number(numValue.toFixed(action.roundDecimals))
              }
            }
          }
          
          transformedRow[column.name] = value
        })
        
        return transformedRow
      })

      // Create a new workbook
      const workbook = XLSX.utils.book_new()
      
      // Convert data to worksheet
      const worksheet = XLSX.utils.json_to_sheet(transformedData)
      
      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, state.selectedSheet || 'Sheet1')
      
      // Generate and download the file
      XLSX.writeFile(workbook, filename)
      
      setDownloadComplete(true)
      
      // Auto-close after 2 seconds
      setTimeout(() => {
        onComplete()
      }, 2000)
      
    } catch (error) {
      console.error('Download error:', error)
      alert('Failed to download file: ' + (error instanceof Error ? error.message : 'Unknown error'))
    } finally {
      setIsDownloading(false)
    }
  }

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
