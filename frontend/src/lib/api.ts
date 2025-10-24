import type { AnalyzeSpreadsheetResponse } from '@/types/api'
import type { TokenStatus } from '@/types/modal'

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

// AI Service APIs
export async function startAISession(file: File, sheetName: string, token?: string): Promise<{
  session_id: string;
  remaining_tokens: number;
  daily_limit: number;
}> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('sheet_name', sheetName)

  const headers: HeadersInit = {}
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE_URL}/api/ai/start-session`, {
    method: 'POST',
    headers,
    body: formData,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }))
    throw new Error(error.error || 'Failed to start AI session')
  }

  return response.json()
}

export async function sendAIMessage(sessionId: string, message: string, token?: string): Promise<{
  response: string;
  remaining_tokens: number;
}> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE_URL}/api/ai/chat`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ session_id: sessionId, message }),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }))
    throw new Error(error.error || 'Failed to send message')
  }

  return response.json()
}

export async function getAIPreview(sessionId: string, token?: string): Promise<{
  preview: string;
}> {
  const headers: HeadersInit = {}
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE_URL}/api/ai/preview?session_id=${sessionId}`, {
    method: 'GET',
    headers,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }))
    throw new Error(error.error || 'Failed to get preview')
  }

  return response.json()
}

export async function downloadAIModifiedFile(sessionId: string, token?: string): Promise<Blob> {
  const headers: HeadersInit = {}
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE_URL}/api/ai/download?session_id=${sessionId}`, {
    method: 'GET',
    headers,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }))
    throw new Error(error.error || 'Failed to download file')
  }

  return response.blob()
}

export async function endAISession(sessionId: string, token?: string): Promise<void> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE_URL}/api/ai/end-session`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ session_id: sessionId }),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }))
    throw new Error(error.error || 'Failed to end session')
  }
}

export async function getTokenStatus(token?: string): Promise<TokenStatus> {
  const headers: HeadersInit = {}
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE_URL}/api/ai/token-status`, {
    method: 'GET',
    headers,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }))
    throw new Error(error.error || 'Failed to get token status')
  }

  return response.json()
}
