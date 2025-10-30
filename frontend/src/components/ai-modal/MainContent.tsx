import { AISessionData } from '@/contexts/AISessionContext'
import { ChatArea } from './ChatArea'
import { PreviewArea } from './PreviewArea'
import { PreviewToggleButton } from './PreviewToggleButton'

interface MainContentProps {
  session: AISessionData | null
  showPreview: boolean
  onHidePreview: () => void
  onShowPreview: () => void
}

export function MainContent({
  session,
  showPreview,
  onHidePreview,
  onShowPreview
}: MainContentProps) {
  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex flex-1 overflow-hidden">
        <ChatArea showPreview={showPreview} />
        
        {showPreview && (
          <PreviewArea onHidePreview={onHidePreview} />
        )}
      </div>

      {!showPreview && (
        <PreviewToggleButton 
          session={session} 
          onShowPreview={onShowPreview} 
        />
      )}
    </div>
  )
}