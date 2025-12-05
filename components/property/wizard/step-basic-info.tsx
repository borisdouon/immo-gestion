"use client"

import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { IconCheck, IconX, IconCircleFilled } from "@tabler/icons-react"
import type { PropertyStatus } from "@/lib/types/property"
import { PROPERTY_STATUSES } from "@/lib/constants/property"

const statusConfig: Record<PropertyStatus, { color: string; bgColor: string; description: string }> = {
  'Libre': { 
    color: 'text-emerald-600 dark:text-emerald-400', 
    bgColor: 'bg-emerald-50 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-800',
    description: 'Disponible à la location'
  },
  'Réservé': { 
    color: 'text-amber-600 dark:text-amber-400', 
    bgColor: 'bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-800',
    description: 'Réservé pour un locataire'
  },
  'Occupé': { 
    color: 'text-blue-600 dark:text-blue-400', 
    bgColor: 'bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-800',
    description: 'Actuellement loué'
  },
  'En Maintenance': { 
    color: 'text-orange-600 dark:text-orange-400', 
    bgColor: 'bg-orange-50 border-orange-200 dark:bg-orange-950/20 dark:border-orange-800',
    description: 'En cours de rénovation'
  },
}

interface StepBasicInfoProps {
  name: string
  status: PropertyStatus
  onNameChange: (name: string) => void
  onStatusChange: (status: PropertyStatus) => void
  errors?: { name?: string; status?: string }
}

export function StepBasicInfo({ 
  name, 
  status, 
  onNameChange, 
  onStatusChange,
  errors 
}: StepBasicInfoProps) {
  const isNameValid = name.length >= 3
  
  return (
    <div className="space-y-8">
      {/* Name Input */}
      <div className="space-y-3">
        <Label htmlFor="name" className="text-base font-medium">
          Nom de la propriété
          <span className="text-orange-500 ml-1">*</span>
        </Label>
        <div className="relative">
          <Input
            id="name"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            className={cn(
              "h-12 rounded-xl border-border/50 bg-background px-4 text-base",
              "focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20",
              "transition-all duration-200",
              errors?.name && "border-red-500 focus:border-red-500 focus:ring-red-500/20"
            )}
            placeholder="Ex: Résidence Les Cocotiers"
          />
          {/* Validation icon */}
          {name && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {isNameValid ? (
                <IconCheck className="size-5 text-emerald-500" />
              ) : (
                <IconX className="size-5 text-red-500" />
              )}
            </div>
          )}
        </div>
        {errors?.name && (
          <p className="text-sm text-red-500">{errors.name}</p>
        )}
        {!errors?.name && name && !isNameValid && (
          <p className="text-sm text-muted-foreground">Minimum 3 caractères</p>
        )}
      </div>
      
      {/* Status Selection */}
      <div className="space-y-3">
        <Label className="text-base font-medium">
          Statut initial
          <span className="text-orange-500 ml-1">*</span>
        </Label>
        <p className="text-sm text-muted-foreground">
          Définissez la disponibilité de la propriété
        </p>
        
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {PROPERTY_STATUSES.map((s) => {
            const config = statusConfig[s]
            const isSelected = status === s
            
            return (
              <button
                key={s}
                type="button"
                onClick={() => onStatusChange(s)}
                className={cn(
                  "relative rounded-xl border-2 p-4 text-left transition-all duration-200",
                  "hover:shadow-md",
                  isSelected 
                    ? `${config.bgColor} border-orange-500` 
                    : "border-border hover:border-orange-300"
                )}
              >
                <div className="flex items-center gap-3">
                  <IconCircleFilled className={cn("size-3", config.color)} />
                  <div>
                    <p className="font-medium">{s}</p>
                    <p className="text-xs text-muted-foreground">{config.description}</p>
                  </div>
                </div>
                
                {isSelected && (
                  <div className="absolute top-2 right-2">
                    <IconCheck className="size-5 text-orange-500" />
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}


