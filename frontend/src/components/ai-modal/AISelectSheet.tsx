"use client"

import React from 'react'
import type { SpreadsheetData } from '@/types/api'

interface AISelectSheetProps {
  sheets: SpreadsheetData[]
  selectedSheet: string | null
  onSelectSheet: (sheetName: string) => void
}

export function AISelectSheet({ sheets, selectedSheet, onSelectSheet }: AISelectSheetProps) {
  return (
    <div className="space-y-4">
      <div className="bg-muted/50 border rounded-md p-4">
        <h3 className="text-sm font-semibold mb-2">Select a Sheet</h3>
        <p className="text-xs text-muted-foreground">
          This workbook contains {sheets.length} sheet{sheets.length > 1 ? 's' : ''}. 
          Choose which sheet you want to clean with AI.
        </p>
      </div>

      <div className="space-y-2">
        {sheets.map((sheet) => {
          const isSelected = selectedSheet === sheet.spreadsheet_name
          
          return (
            <button
              key={sheet.spreadsheet_name}
              onClick={() => onSelectSheet(sheet.spreadsheet_name)}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                isSelected
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                  : 'border-muted hover:border-green-300 hover:bg-muted/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold text-sm mb-1">{sheet.spreadsheet_name}</h4>
                  <p className="text-xs text-muted-foreground">
                    {sheet.columns.length} column{sheet.columns.length > 1 ? 's' : ''} • 
                    {sheet.spreadsheet_snippet.length} row{sheet.spreadsheet_snippet.length > 1 ? 's' : ''} (sample)
                  </p>
                </div>
                {isSelected && (
                  <div className="ml-4">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
