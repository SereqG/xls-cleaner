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
    <>
      <div className="flex h-[calc(100%-73px)] overflow-hidden">
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
    </>
  )
}