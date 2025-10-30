import { Button } from '@/components/ui/button'
import { AISessionData } from '@/contexts/AISessionContext'

interface PreviewToggleButtonProps {
  session: AISessionData | null
  onShowPreview: () => void
}

export function PreviewToggleButton({ 
  session, 
  onShowPreview 
}: PreviewToggleButtonProps) {
  if (!session) return null

  return (
    <Button
      variant="outline"
      size="sm"
      className="absolute bottom-4 right-4"
      onClick={onShowPreview}
    >
      Show Preview
    </Button>
  )
}