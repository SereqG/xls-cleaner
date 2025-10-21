import { ArrowRight } from "lucide-react"
import { steps } from "@/lib/steps"
import { StepCard } from "@/components/StepCard"

export function HowItWorksSection() {

  return (
    <section className="bg-muted/30 py-16 px-4">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-3">How it works</h2>
          <p className="text-lg text-muted-foreground">{steps.length} quick steps</p>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-center gap-6 lg:gap-4">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col lg:flex-row items-center gap-4 lg:gap-4">
              <StepCard
                icon={step.icon}
                title={step.title}
                description={step.description}
              />

              {index < steps.length - 1 && (
                <div className="hidden lg:block">
                  <ArrowRight className="w-8 h-8 text-violet-500" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
