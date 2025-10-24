import { steps } from "@/lib/steps"

export function HowItWorksHeader() {
  return (
    <div className="text-center mb-12">
      <h2 className="text-4xl font-bold mb-3">How it works</h2>
      <p className="text-lg text-muted-foreground">{steps.length} quick steps</p>
    </div>
  )
}