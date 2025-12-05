"use client"

import { useRouter, useParams } from "next/navigation"
import { notFound } from "next/navigation"
import { PropertyForm } from "@/components/property/property-form"
import { getPropertyById } from "@/lib/mock-data/properties"
import { Button } from "@/components/ui/button"
import { IconArrowLeft } from "@tabler/icons-react"
import Link from "next/link"
import type { PropertyFormData } from "@/lib/schemas/property"
import { toast } from "sonner"

export default function PropertyEditPage() {
  const params = useParams()
  const id = params.id as string
  const property = getPropertyById(id)

  if (!property) {
    notFound()
  }

  return <PropertyEditForm property={property} />
}

function PropertyEditForm({ property }: { readonly property: NonNullable<ReturnType<typeof getPropertyById>> }) {
  const router = useRouter()

  const handleSubmit = (data: PropertyFormData) => {
    // Envoyer les données au backend (à implémenter)
    console.log('Propriété modifiée:', data)
    
    toast.success('Propriété modifiée avec succès')
    router.push(`/property/${property.id}`)
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          {/* Back Button */}
          <div className="px-4 lg:px-6">
            <Button variant="ghost" asChild>
              <Link href={`/property/${property.id}`}>
                <IconArrowLeft className="mr-2 h-4 w-4" />
                Retour aux détails
              </Link>
            </Button>
          </div>

          {/* Header */}
          <div className="px-4 lg:px-6">
            <h1 className="text-2xl font-semibold">Modifier la Propriété</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {property.name}
            </p>
          </div>

          {/* Form */}
          <PropertyForm property={property} onSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  )
}
