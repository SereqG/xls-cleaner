export function TokenSystemTooltip() {
  return (
    <div className="max-w-xs text-sm">
      <p className="font-semibold mb-1">Token System</p>
      <p className="mb-2">Each AI operation costs 1 token.</p>
      <p className="mb-2">You get 50 free tokens daily that reset at midnight UTC.</p>
      <p>Use tokens to:</p>
      <ul className="list-disc list-inside mt-1 text-xs">
        <li>Clean and format data</li>
        <li>Remove duplicates</li>
        <li>Sort and filter columns</li>
        <li>Transform data types</li>
      </ul>
    </div>
  )
}