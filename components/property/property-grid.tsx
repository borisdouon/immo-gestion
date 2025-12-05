"use client"

import Link from "next/link"
import { IconBuilding, IconPlus } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { PropertyCard } from "./property-card"
import type { Property } from "@/lib/types/property"

interface PropertyGridProps {
  properties: Property[]
}

export function PropertyGrid({ properties }: PropertyGridProps) {
  if (properties.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border/50 bg-card/30 py-16 px-4">
        <div className="flex size-16 items-center justify-center rounded-2xl bg-orange-100 dark:bg-orange-500/20">
          <IconBuilding className="size-8 text-orange-500" />
        </div>
        <h3 className="mt-4 text-lg font-semibold">Aucune propriété trouvée</h3>
        <p className="mt-2 text-sm text-muted-foreground text-center max-w-sm">
          Essayez de modifier vos filtres ou ajoutez une nouvelle propriété à votre portefeuille.
        </p>
        <Button 
          asChild 
          className="mt-6 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-lg shadow-orange-500/25 transition-all duration-300 hover:shadow-xl"
        >
          <Link href="/property/new">
            <IconPlus className="mr-2 size-4" />
            Ajouter une propriété
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  )
}
