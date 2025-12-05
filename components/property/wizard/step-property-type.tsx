"use client"

import { cn } from "@/lib/utils"
import { IconHome, IconBuilding, IconBuildingEstate, IconBuildingStore, IconCheck } from "@tabler/icons-react"
import type { PropertyType } from "@/lib/types/property"

const propertyTypes = [
  { 
    type: 'Maison' as PropertyType, 
    icon: IconHome, 
    description: 'Maison individuelle',
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-50 dark:bg-blue-950/20'
  },
  { 
    type: 'Villa' as PropertyType, 
    icon: IconBuildingEstate, 
    description: 'Villa de luxe avec jardin',
    color: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-50 dark:bg-purple-950/20'
  },
  { 
    type: 'Immeuble' as PropertyType, 
    icon: IconBuilding, 
    description: 'Immeuble multi-logements',
    color: 'from-orange-500 to-amber-500',
    bgColor: 'bg-orange-50 dark:bg-orange-950/20'
  },
  { 
    type: 'Commercial' as PropertyType, 
    icon: IconBuildingStore, 
    description: 'Local ou espace commercial',
    color: 'from-emerald-500 to-teal-500',
    bgColor: 'bg-emerald-50 dark:bg-emerald-950/20'
  },
]

interface StepPropertyTypeProps {
  value: PropertyType
  onChange: (type: PropertyType) => void
}

export function StepPropertyType({ value, onChange }: StepPropertyTypeProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-muted-foreground">
          Sélectionnez le type de bien que vous souhaitez ajouter
        </p>
      </div>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {propertyTypes.map((item) => {
          const isSelected = value === item.type
          const Icon = item.icon
          
          return (
            <button
              key={item.type}
              type="button"
              onClick={() => onChange(item.type)}
              className={cn(
                "group relative overflow-hidden rounded-2xl border-2 p-6 text-left transition-all duration-300",
                "hover:shadow-xl hover:-translate-y-1",
                isSelected 
                  ? "border-orange-500 shadow-lg" 
                  : "border-border hover:border-orange-300"
              )}
            >
              {/* Gradient background on selection */}
              <div className={cn(
                "absolute inset-0 transition-opacity duration-300",
                isSelected ? item.bgColor : "bg-transparent"
              )} />
              
              <div className="relative">
                <div className={cn(
                  "flex size-14 items-center justify-center rounded-xl transition-all duration-300",
                  isSelected 
                    ? `bg-gradient-to-br ${item.color} text-white shadow-lg`
                    : "bg-muted text-muted-foreground group-hover:bg-orange-100 group-hover:text-orange-600 dark:group-hover:bg-orange-950/30"
                )}>
                  <Icon className="size-7" />
                </div>
                
                <h3 className="mt-4 text-lg font-semibold">{item.type}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
                
                {/* Checkmark */}
                {isSelected && (
                  <div className="absolute top-0 right-0">
                    <div className="flex size-7 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-md">
                      <IconCheck className="size-4" />
                    </div>
                  </div>
                )}
              </div>
            </button>
          )
        })}
      </div>
      
      {value === 'Immeuble' && (
        <div className="rounded-xl border border-orange-200 bg-orange-50 p-4 dark:border-orange-800 dark:bg-orange-950/20">
          <p className="text-sm text-orange-700 dark:text-orange-300">
            💡 <strong>Immeuble sélectionné</strong> — Vous pourrez ajouter les logements individuels à l'étape suivante.
          </p>
        </div>
      )}
    </div>
  )
}


