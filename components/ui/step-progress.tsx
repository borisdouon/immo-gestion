"use client"

import { cn } from "@/lib/utils"
import { IconCheck } from "@tabler/icons-react"

interface Step {
  id: number
  title: string
  description?: string
}

interface StepProgressProps {
  steps: Step[]
  currentStep: number
  className?: string
}

export function StepProgress({ steps, currentStep, className }: StepProgressProps) {
  return (
    <div className={cn("w-full", className)}>
      {/* Progress bar */}
      <div className="relative">
        {/* Background line */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-border" />
        
        {/* Active line */}
        <div 
          className="absolute top-5 left-0 h-0.5 bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-500 ease-out"
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        />
        
        {/* Step circles */}
        <div className="relative flex justify-between">
          {steps.map((step) => {
            const isCompleted = step.id < currentStep
            const isCurrent = step.id === currentStep
            const isPending = step.id > currentStep
            
            return (
              <div key={step.id} className="flex flex-col items-center">
                {/* Circle */}
                <div
                  className={cn(
                    "relative z-10 flex size-10 items-center justify-center rounded-full border-2 transition-all duration-300",
                    isCompleted && "border-orange-500 bg-gradient-to-br from-orange-500 to-amber-500 text-white",
                    isCurrent && "border-orange-500 bg-white dark:bg-card shadow-lg shadow-orange-500/25 scale-110",
                    isPending && "border-border bg-card text-muted-foreground"
                  )}
                >
                  {isCompleted ? (
                    <IconCheck className="size-5" />
                  ) : (
                    <span className={cn(
                      "text-sm font-semibold",
                      isCurrent && "text-orange-600"
                    )}>
                      {step.id}
                    </span>
                  )}
                </div>
                
                {/* Label */}
                <div className="mt-3 text-center">
                  <p className={cn(
                    "text-xs font-medium transition-colors hidden sm:block",
                    isCurrent && "text-orange-600",
                    isCompleted && "text-foreground",
                    isPending && "text-muted-foreground"
                  )}>
                    {step.title}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}


