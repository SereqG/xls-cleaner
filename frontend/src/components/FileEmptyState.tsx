export function FileEmptyState() {
  return (
    <>
      <h3 className="text-xl font-semibold">Upload your Excel</h3>
      <p className="text-sm text-muted-foreground">
        Drag & drop or click to upload
      </p>
      <p className="text-xs text-violet-400">Supported: .xlsx, .xls</p>
    </>
  )
}