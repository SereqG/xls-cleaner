import { Upload, Settings, Sparkles, Download, ArrowRight } from "lucide-react"

export function HowItWorksSection() {
  const steps = [
    {
      icon: Upload,
      title: "Upload your Excel file",
      description: "Pick any .xlsx or .xls you want to tidy up.",
    },
    {
      icon: Settings,
      title: "Choose what to clean",
      description: "Do it manually or let the AI handle the boring bits.",
    },
    {
      icon: Sparkles,
      title: "Chat with AI",
      description: "Ask questions or use ready-made prompts to improve your sheet.",
    },
    {
      icon: Download,
      title: "Download the result",
      description: "Grab your clean, optimized Excel.",
    },
  ]

  return (
    <section className="bg-muted/30 py-16 px-4">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-3">How it works</h2>
          <p className="text-lg text-muted-foreground">4 quick steps</p>
        </div>

        {/* Steps - Desktop: horizontal with arrows, Mobile: vertical stack */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-center gap-6 lg:gap-4">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <div key={index} className="flex flex-col lg:flex-row items-center gap-4 lg:gap-4">
                {/* Card */}
                <div className="bg-card border border-border rounded-lg p-6 w-full max-w-xs lg:w-64 aspect-square flex flex-col items-center justify-center text-center space-y-4 hover:border-violet-500/50 transition-colors">
                  {/* Icon */}
                  <div className="w-16 h-16 rounded-full bg-violet-500 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-lg font-semibold">{step.title}</h3>
                  
                  {/* Description */}
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Arrow - show between items, hide after last */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block">
                    <ArrowRight className="w-8 h-8 text-violet-500" />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
