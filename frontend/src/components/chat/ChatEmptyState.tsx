import { Bot } from 'lucide-react'

export function ChatEmptyState() {
  const exampleQuestions = [
    "Remove duplicate rows",
    "Fill missing values with 0",
    "Sort by column A",
    "Remove empty rows"
  ]

  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
      <Bot className="h-12 w-12 text-violet-500" />
      <div>
        <h3 className="font-semibold">AI Assistant Ready</h3>
        <p className="text-sm text-muted-foreground">
          Ask me to clean, transform, or analyze your Excel data
        </p>
      </div>
      <div className="mt-4 space-y-2 text-xs text-muted-foreground">
        <p>Try asking:</p>
        <ul className="space-y-1">
          {exampleQuestions.map((question, index) => (
            <li key={index}>• &ldquo;{question}&rdquo;</li>
          ))}
        </ul>
      </div>
    </div>
  )
}