export type DataType = 'string' | 'number' | 'date' | 'boolean';

export interface ColumnSelection {
  name: string;
  originalType: string;
  selectedType: DataType;
  isSelected: boolean;
}

export interface ColumnAction {
  columnName: string;
  replaceEmpty?: string;
  changeCase?: 'uppercase' | 'lowercase' | 'titlecase';
  roundDecimals?: number;
}

export type ModalStep = 'select-sheet' | 'select-columns' | 'specify-actions' | 'preview' | 'download';

export interface FormatDataState {
  currentStep: ModalStep;
  selectedSheet: string | null;
  columns: ColumnSelection[];
  actions: ColumnAction[];
  previewData: Record<string, unknown>[] | null;
  isProcessing: boolean;
  error: string | null;
}

// AI Modal Types
export type AIModalStep = 'select-sheet' | 'chat' | 'preview' | 'download';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface AIModalState {
  currentStep: AIModalStep;
  selectedSheet: string | null;
  messages: ChatMessage[];
  previewData: string | null;
  sessionId: string | null;
  isProcessing: boolean;
  error: string | null;
  remainingTokens: number;
  dailyLimit: number;
}

export interface TokenStatus {
  used_tokens: number;
  remaining_tokens: number;
  daily_limit: number;
}
