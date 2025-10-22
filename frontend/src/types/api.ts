export interface ColumnInfo {
  name: string;
  type: string;
}

export interface SpreadsheetData {
  spreadsheet_name: string;
  columns: ColumnInfo[];
  spreadsheet_snippet: Record<string, unknown>[];
}

export interface FileData {
  file_metadata: File;
  spreadsheet_data: SpreadsheetData[];
}

export type AnalyzeSpreadsheetResponse = SpreadsheetData[];