"use client"

import { use, useRouter } from "next/navigation"
import { notFound } from "next/navigation"
import { TenantForm } from "@/components/tenant/tenant-form"
import { Button } from "@/components/ui/button"
import { IconArrowLeft } from "@tabler/icons-react"
import Link from "next/link"
import { getTenantById } from "@/lib/mock-data/tenants"
import { type TenantFormData } from "@/lib/schemas/tenant"
import { toast } from "sonner"

interface EditTenantPageProps {
  params: Promise<{
    id: string
  }>
}

export default function EditTenantPage({ params }: EditTenantPageProps) {
  const { id } = use(params)
  const router = useRouter()
  const tenant = getTenantById(id)

  if (!tenant) {
    notFound()
  }

  const handleSubmit = (data: TenantFormData) => {
    try {
      // In a real app, this would be an API call
      // For now, we'll just simulate success
      const updatedTenant = {
        ...tenant,
        ...data,
        fullName: `${data.firstName} ${data.lastName}`,
        updatedAt: new Date().toISOString(),
      }

      console.log('Tenant updated:', updatedTenant)
      
      toast.success("Locataire mis à jour avec succès")
      router.push(`/tenant/${id}`)
    } catch (error) {
      toast.error("Erreur lors de la mise à jour du locataire")
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
              <Link href={`/tenant/${id}`}>
                <IconArrowLeft className="mr-2 h-4 w-4" />
                Retour aux détails
              </Link>
            </Button>
          </div>

          {/* Form */}
          <div className="px-4 lg:px-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold tracking-tight">Modifier le locataire</h1>
              <p className="text-muted-foreground mt-1">
                Modifiez les informations du locataire
              </p>
            </div>

            <TenantForm tenant={tenant} onSubmit={handleSubmit} />
          </div>
        </div>
      </div>
    </div>
  )
}





