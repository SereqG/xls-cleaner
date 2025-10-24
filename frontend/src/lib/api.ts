import type { AnalyzeSpreadsheetResponse } from '@/types/api'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export async function analyzeSpreadsheet(file: File): Promise<AnalyzeSpreadsheetResponse> {
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch(`${API_BASE_URL}/api/analyze-spreadsheet`, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }))
    throw new Error(error.error || 'Failed to analyze spreadsheet')
  }

  return response.json()
}
