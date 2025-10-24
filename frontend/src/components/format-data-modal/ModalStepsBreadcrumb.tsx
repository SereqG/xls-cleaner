import React from 'react'
import { 
  Breadcrumb, 
  BreadcrumbList, 
  BreadcrumbItem, 
  BreadcrumbPage, 
  BreadcrumbSeparator 
} from '@/components/ui/breadcrumb'

interface StepDefinition {
  id: string
  label: string
}

interface ModalStepsBreadcrumbProps {
  steps: StepDefinition[]
  currentStepIndex: number
}

export function ModalStepsBreadcrumb({ steps, currentStepIndex }: ModalStepsBreadcrumbProps) {
  return (
    <div className="py-4 border-b">
      <Breadcrumb>
        <BreadcrumbList className="flex-wrap">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <BreadcrumbItem>
                {index === currentStepIndex ? (
                  <BreadcrumbPage className="flex items-center gap-2 px-3 py-1 rounded-md bg-violet-500 text-white font-medium">
                    <span>{index + 1}</span>
                    <span>{step.label}</span>
                  </BreadcrumbPage>
                ) : (
                  <div 
                    className={`flex items-center gap-2 px-3 py-1 rounded-md text-sm ${
                      index < currentStepIndex
                        ? 'bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300'
                        : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
                    }`}
                  >
                    <span className="font-medium">{index + 1}</span>
                    <span>{step.label}</span>
                  </div>
                )}
              </BreadcrumbItem>
              {index < steps.length - 1 && (
                <BreadcrumbSeparator />
              )}
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  )
}