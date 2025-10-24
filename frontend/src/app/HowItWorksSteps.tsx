import { ArrowRight } from "lucide-react"
import { steps } from "@/lib/steps"
import { StepCard } from "@/components/StepCard"

export function HowItWorksSteps() {
  return (
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
  )
}