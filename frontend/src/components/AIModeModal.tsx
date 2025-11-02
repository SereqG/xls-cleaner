"use client"

import { Dialog, DialogContent } from '@/components/ui/dialog'
import { SheetSelectorModal } from '@/components/SheetSelectorModal'
import { AIModalHeader, MainContent } from '@/components/ai-modal'
import { useAiModeModal } from '@/hooks/useAiModeModal'

export function AIModeModal() {
  const {
    isAIModalOpen,
    setIsAIModalOpen,
    showSheetSelector,
    setShowSheetSelector,
    showPreview,
    setShowPreview,
    downloadMutation,
    handleDownload,
    session
  } = useAiModeModal()


  return (
    <>
      <Dialog open={isAIModalOpen} onOpenChange={setIsAIModalOpen}>
        <DialogContent className="max-w-6xl h-[85vh] p-0 gap-0 flex flex-col">


          <AIModalHeader
            session={session}
            onSheetSelectorOpen={() => setShowSheetSelector(true)}
            onDownload={handleDownload}
            isDownloading={downloadMutation.isPending}
          />

          <MainContent
            session={session}
            showPreview={showPreview}
            onHidePreview={() => setShowPreview(false)}
            onShowPreview={() => setShowPreview(true)}
          />
        </DialogContent>
      </Dialog>

      <SheetSelectorModal
        open={showSheetSelector}
        onOpenChange={setShowSheetSelector}
      />
    </>
  )
}
