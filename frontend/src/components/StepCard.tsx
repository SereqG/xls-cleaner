import { LucideIcon } from "lucide-react"

interface StepCardProps {
  icon: LucideIcon
  title: string
  description: string
}

export function StepCard({ icon: Icon, title, description }: StepCardProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-6 w-full max-w-xs lg:w-64 aspect-square flex flex-col items-center justify-center text-center space-y-4 hover:border-violet-500/50 transition-colors">
      <div className="w-16 h-16 rounded-full bg-violet-500 flex items-center justify-center flex-shrink-0">
        <Icon className="w-8 h-8 text-white" />
      </div>
      
      <h3 className="text-lg font-semibold">{title}</h3>
      
      <p className="text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  )
}