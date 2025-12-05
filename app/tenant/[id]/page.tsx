"use client"

import { use } from "react"
import { notFound } from "next/navigation"
import { TenantDetails } from "@/components/tenant/tenant-details"
import { getTenantById } from "@/lib/mock-data/tenants"
import { Button } from "@/components/ui/button"
import { IconArrowLeft } from "@tabler/icons-react"
import Link from "next/link"

interface TenantDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export default function TenantDetailPage({ params }: TenantDetailPageProps) {
  const { id } = use(params)
  const tenant = getTenantById(id)

  if (!tenant) {
    notFound()
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

          {/* Tenant Details */}
          <TenantDetails tenant={tenant} />
        </div>
      </div>
    </div>
  )
}





