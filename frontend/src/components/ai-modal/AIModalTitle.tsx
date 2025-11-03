import { DialogTitle } from '@/components/ui/dialog'
import { AISessionData } from '@/contexts/AISessionContext'
import { FileSpreadsheet } from 'lucide-react'

interface AIModalTitleProps {
  session: AISessionData | null
}

export function AIModalTitle({ session }: AIModalTitleProps) {
  return (
    <div className="flex items-center gap-3">
      <FileSpreadsheet className="h-5 w-5 text-violet-500" />
      <div>
        <DialogTitle>AI Mode</DialogTitle>
        {session && (
          <p className="text-sm text-muted-foreground">
            {session.fileName}
          </p>
        )}
      </div>
    </div>
  )
}