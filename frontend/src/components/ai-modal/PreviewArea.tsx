import { Button } from '@/components/ui/button'
import { SheetPreview } from '@/components/SheetPreview'
import { X } from 'lucide-react'

interface PreviewAreaProps {
  onHidePreview: () => void
}

export function PreviewArea({ onHidePreview }: PreviewAreaProps) {
  return (
    <div className="flex w-1/2 flex-col">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <h3 className="text-sm font-semibold">Live Preview</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onHidePreview}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <SheetPreview />
      </div>
    </div>
  )
}