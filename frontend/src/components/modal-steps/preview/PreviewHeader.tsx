import React from 'react'

export function PreviewHeader() {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Preview Transformed Data</h3>
      <p className="text-sm text-muted-foreground">
        Showing the first 5 rows with your transformations applied.
      </p>
    </div>
  )
}