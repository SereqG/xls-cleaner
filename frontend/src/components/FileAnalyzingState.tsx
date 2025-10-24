import { Loader2 } from 'lucide-react'

export function FileAnalyzingState() {
  return (
    <div className="flex flex-col items-center gap-2">
      <Loader2 className="h-8 w-8 text-violet-500 animate-spin" />
      <p className="text-lg font-semibold">Analyzing your Excel file...</p>
      <p className="text-sm text-muted-foreground">This may take a moment</p>
    </div>
  )
}