import { DialogHeader } from '@/components/ui/dialog'
import { AISessionData } from '@/contexts/AISessionContext'
import { AIModalTitle } from './AIModalTitle'
import { AIModalActions } from './AIModalActions'

interface AIModalHeaderProps {
  session: AISessionData | null
  onSheetSelectorOpen: () => void
  onDownload: () => void
  isDownloading: boolean
}

export function AIModalHeader({
  session,
  onSheetSelectorOpen,
  onDownload,
  isDownloading
}: AIModalHeaderProps) {
  return (
    <DialogHeader className="border-b border-border h-20 px-12 py-4">
      <div className="flex items-center justify-between">
        <AIModalTitle session={session} />
        
        <AIModalActions
          session={session}
          onSheetSelectorOpen={onSheetSelectorOpen}
          onDownload={onDownload}
          isDownloading={isDownloading}
        />
      </div>
    </DialogHeader>
  )
}