"use client"

import Link from "next/link"
import { IconUsers, IconUserPlus } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { TenantCard } from "./tenant-card"
import { TenantTableView } from "./tenant-table-view"
import type { Tenant } from "@/lib/types/tenant"

type ViewMode = 'grid' | 'table'

interface TenantListProps {
  tenants: Tenant[]
  viewMode?: ViewMode
}

export function TenantList({ tenants, viewMode = 'table' }: TenantListProps) {
  if (tenants.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border/50 bg-card/30 py-16 px-4">
        <div className="flex size-16 items-center justify-center rounded-2xl bg-orange-100 dark:bg-orange-500/20">
          <IconUsers className="size-8 text-orange-500" />
        </div>
        <h3 className="mt-4 text-lg font-semibold">Aucun locataire trouvé</h3>
        <p className="mt-2 text-sm text-muted-foreground text-center max-w-sm">
          Modifiez vos filtres ou ajoutez un nouveau locataire pour commencer.
        </p>
        <Button 
          asChild 
          className="mt-6 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-lg shadow-orange-500/25 transition-all duration-300 hover:shadow-xl"
        >
          <Link href="/tenant/new">
            <IconUserPlus className="mr-2 size-4" />
            Ajouter un locataire
          </Link>
        </Button>
      </div>
    )
  }

  // Render based on view mode
  if (viewMode === 'table') {
    return <TenantTableView tenants={tenants} />
  }

  // Default: grid view
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {tenants.map((tenant) => (
        <TenantCard key={tenant.id} tenant={tenant} />
      ))}
    </div>
  )
}
