import type { FileData } from '@/types/api'

interface FileUploadedStateProps {
  uploadedFile: FileData
}

export function FileUploadedState({ uploadedFile }: FileUploadedStateProps) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xl font-semibold">{uploadedFile.file_metadata.name}</p>
      <p className="text-sm text-muted-foreground">
        {(uploadedFile.file_metadata.size / 1024).toFixed(2)} KB
      </p>
      <p className="text-xs text-green-500">
        ✓ Analyzed {uploadedFile.spreadsheet_data.length} sheet(s)
      </p>
    </div>
  )
}