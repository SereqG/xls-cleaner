const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export interface UploadFileParams {
  file: File
  userId: string
  email: string
}

export interface UploadFileResponse {
  session_id: string
  file_name: string
  sheets: string[]
  selected_sheet: string
  tokens_remaining: number
}

export interface SendMessageParams {
  sessionId: string
  message: string
  userId: string
}

export interface SendMessageResponse {
  type: 'success' | 'error'
  message: string
  operation?: string
  summary?: string
  preview?: Record<string, unknown>[]
  stats?: {
    rows: number
    columns: number
    column_names: string[]
  }
  tokens_remaining: number
  suggestion?: string
}

export interface GetPreviewResponse {
  preview: Record<string, unknown>[]
  stats: {
    rows: number
    columns: number
    column_names: string[]
  }
  sheet_name: string
}

export interface TokensResponse {
  tokens_remaining: number
  daily_limit: number
  tokens_used_today: number
}

export const aiApi = {
  uploadFile: async (params: UploadFileParams): Promise<UploadFileResponse> => {
    const formData = new FormData()
    formData.append('file', params.file)
    formData.append('user_id', params.userId)
    formData.append('email', params.email)

    const response = await fetch(`${API_BASE_URL}/api/ai/upload`, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const error = await response.json()
      // If it's a token limit error, preserve the full error structure
      if (error.message && error.daily_limit) {
        throw new Error(JSON.stringify(error))
      }
      throw new Error(error.error || 'Failed to upload file')
    }

    return response.json()
  },

  sendMessage: async (params: SendMessageParams): Promise<SendMessageResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/ai/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        session_id: params.sessionId,
        message: params.message,
        user_id: params.userId,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      // If it's a token limit error, preserve the full error structure
      if (error.message && error.daily_limit) {
        throw new Error(JSON.stringify(error))
      }
      throw new Error(error.error || 'Failed to send message')
    }

    return response.json()
  },

  getPreview: async (sessionId: string, userId: string): Promise<GetPreviewResponse> => {
    const response = await fetch(
      `${API_BASE_URL}/api/ai/preview/${sessionId}?user_id=${userId}`,
      {
        method: 'GET',
      }
    )

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to get preview')
    }

    return response.json()
  },

  downloadFile: async (sessionId: string, userId: string): Promise<Blob> => {
    const response = await fetch(
      `${API_BASE_URL}/api/ai/download/${sessionId}?user_id=${userId}`,
      {
        method: 'GET',
      }
    )

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to download file')
    }

    return response.blob()
  },

  getTokens: async (userId: string): Promise<TokensResponse> => {
    const response = await fetch(
      `${API_BASE_URL}/api/ai/tokens?user_id=${userId}`,
      {
        method: 'GET',
      }
    )

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to get tokens')
    }

    return response.json()
  },

  selectSheet: async (sessionId: string, sheetName: string, userId: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/ai/select-sheet`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        session_id: sessionId,
        sheet_name: sheetName,
        user_id: userId,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to select sheet')
    }
  },
}
