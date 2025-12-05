"use client"

import { useState, use } from "react"
import { notFound } from "next/navigation"
import { PropertyDetails } from "@/components/property/property-details"
import { UnitGrid } from "@/components/property/unit-grid"
import { getPropertyById } from "@/lib/mock-data/properties"
import { Button } from "@/components/ui/button"
import { IconArrowLeft } from "@tabler/icons-react"
import Link from "next/link"
import type { Unit } from "@/lib/types/property"

interface PropertyDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export default function PropertyDetailPage({ params }: PropertyDetailPageProps) {
  const { id } = use(params)
  const [selectedUnitId, setSelectedUnitId] = useState<string | undefined>()
  const property = getPropertyById(id)

  const handleUnitSelect = (unit: Unit) => {
    setSelectedUnitId(unit.id)
  }

  if (!property) {
    notFound()
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          {/* Back Button */}
          <div className="px-4 lg:px-6">
            <Button variant="ghost" asChild>
              <Link href="/property">
                <IconArrowLeft className="mr-2 h-4 w-4" />
                Retour à la liste
              </Link>
            </Button>
          </div>

          {/* Property Details */}
          <PropertyDetails 
            property={property} 
            selectedUnitId={selectedUnitId}
            onUnitSelect={handleUnitSelect}
          />

          {/* Unit Grid (only for Immeuble) */}
          {property.type === 'Immeuble' && property.units && property.units.length > 0 && (
            <div className="px-4 lg:px-6">
              <UnitGrid 
                units={property.units} 
                onUnitClick={handleUnitSelect}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


