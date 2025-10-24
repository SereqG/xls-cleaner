import { HowItWorksHeader } from "./HowItWorksHeader"
import { HowItWorksSteps } from "./HowItWorksSteps"

export function HowItWorksSection() {

  return (
    <section className="bg-muted/30 py-16 px-4">
      <div className="mx-auto max-w-7xl">
        <HowItWorksHeader />
        <HowItWorksSteps />
      </div>
    </section>
  )
}
