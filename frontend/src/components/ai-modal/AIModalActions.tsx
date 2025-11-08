import { Button } from '@/components/ui/button'
import { TokenCounter } from '@/components/TokenCounter'
import { AISessionData } from '@/contexts/AISessionContext'
import { Download, ChevronDown } from 'lucide-react'

interface AIModalActionsProps {
  session: AISessionData | null
  onSheetSelectorOpen: () => void
  onDownload: () => void
  isDownloading: boolean
}

export function AIModalActions({
  session,
  onSheetSelectorOpen,
  onDownload,
  isDownloading,
}: AIModalActionsProps) {
    const isDisabled = isDownloading || !session

  return (
    <div className="flex items-center gap-2">
      <TokenCounter />
      
      {session && session.sheets.length > 1 && (
        <Button
          variant="outline"
          size="sm"
          onClick={onSheetSelectorOpen}
        >
          <ChevronDown className="mr-2 h-4 w-4" />
          {session.selectedSheet}
        </Button>
      )}

      <Button
        variant="outline"
        size="sm"
        onClick={onDownload}
        disabled={isDisabled}
      >
        <Download className="mr-2 h-4 w-4" />
        {isDownloading ? 'Downloading...' : 'Download'}
      </Button>
    </div>
  )
}