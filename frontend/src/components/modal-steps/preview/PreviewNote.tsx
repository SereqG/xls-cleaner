import React from 'react'

export function PreviewNote() {
  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-3 text-sm">
      <p className="text-blue-700 dark:text-blue-300">
        <strong>Note:</strong> This is a preview of the first 5 rows. The full dataset will be
        transformed when you download the file.
      </p>
    </div>
  )
}