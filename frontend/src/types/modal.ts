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
