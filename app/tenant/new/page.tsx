"use client"

import { useRouter } from "next/navigation"
import { TenantForm } from "@/components/tenant/tenant-form"
import { Button } from "@/components/ui/button"
import { IconArrowLeft } from "@tabler/icons-react"
import Link from "next/link"
import { tenantFormSchema, type TenantFormData } from "@/lib/schemas/tenant"
import { mockTenants } from "@/lib/mock-data/tenants"
import { toast } from "sonner"

export default function NewTenantPage() {
  const router = useRouter()

  const handleSubmit = (data: TenantFormData) => {
    try {
      // In a real app, this would be an API call
      // For now, we'll just simulate success
      const newTenant = {
        ...data,
        id: `tenant-${Date.now()}`,
        fullName: `${data.firstName} ${data.lastName}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        currentPropertyName: data.currentPropertyId
          ? mockTenants.find(t => t.currentPropertyId === data.currentPropertyId)?.currentPropertyName
          : undefined,
        currentUnitNumber: data.currentUnitId
          ? mockTenants.find(t => t.currentUnitId === data.currentUnitId)?.currentUnitNumber
          : undefined,
      }

      console.log('New tenant created:', newTenant)
      
      toast.success("Locataire créé avec succès")
      router.push(`/tenant/${newTenant.id}`)
    } catch (error) {
      toast.error("Erreur lors de la création du locataire")
      console.error(error)
    }
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          {/* Back Button */}
          <div className="px-4 lg:px-6">
            <Button variant="ghost" asChild>
              <Link href="/tenant">
                <IconArrowLeft className="mr-2 h-4 w-4" />
                Retour à la liste
              </Link>
            </Button>
          </div>

          {/* Form */}
          <div className="px-4 lg:px-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold tracking-tight">Ajouter un locataire</h1>
              <p className="text-muted-foreground mt-1">
                Remplissez les informations pour créer un nouveau locataire
              </p>
            </div>

            <TenantForm onSubmit={handleSubmit} />
          </div>
        </div>
      </div>
    </div>
  )
}





