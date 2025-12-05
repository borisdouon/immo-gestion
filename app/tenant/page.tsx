"use client"

import { useState, useMemo, Suspense } from "react"
import dynamic from "next/dynamic"
import Link from "next/link"
import { SectionCardsTenant } from "@/components/tenant/section-cards-tenant"
import { TenantFilters } from "@/components/tenant/tenant-filters"
import { Button } from "@/components/ui/button"
import { IconUserPlus, IconLayoutGrid, IconTable } from "@tabler/icons-react"
import { cn } from "@/lib/utils"
import { mockTenants } from "@/lib/mock-data/tenants"
import type { TenantStatus } from "@/lib/types/tenant"
import { TableSkeleton } from "@/components/ui/table-skeleton"
import { useDebounce } from "@/hooks/use-debounce"

// Lazy load heavy list component
const TenantList = dynamic(() => import("@/components/tenant/tenant-list").then(mod => ({ default: mod.TenantList })), {
  loading: () => <TableSkeleton rows={10} cols={5} />,
  ssr: false,
})

type ViewMode = 'grid' | 'table'

export default function Page() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<TenantStatus | 'all'>("all")
  const [propertyFilter, setPropertyFilter] = useState("all")
  const [viewMode, setViewMode] = useState<ViewMode>('table')

  // Debounce search input to reduce filtering computations
  const debouncedSearch = useDebounce(search, 300)

  const filteredTenants = useMemo(() => {
    return mockTenants.filter((tenant) => {
      const matchesSearch =
        debouncedSearch === "" ||
        tenant.fullName.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        tenant.email.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        tenant.phone.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        tenant.currentPropertyName?.toLowerCase().includes(debouncedSearch.toLowerCase())

      const matchesStatus = statusFilter === "all" || tenant.status === statusFilter
      const matchesProperty =
        propertyFilter === "all" || tenant.currentPropertyName === propertyFilter

      return matchesSearch && matchesStatus && matchesProperty
    })
  }, [debouncedSearch, statusFilter, propertyFilter])

  const handleClearFilters = () => {
    setSearch("")
    setStatusFilter("all")
    setPropertyFilter("all")
  }

  return (
    <div className="flex flex-1 flex-col" suppressHydrationWarning>
      <div className="@container/main flex flex-1 flex-col gap-2" suppressHydrationWarning>
        <div className="flex flex-col gap-4 sm:gap-6 py-4 sm:py-6" suppressHydrationWarning>
          {/* Header Section */}
          <div className="flex flex-col gap-3 px-4 sm:px-6 lg:px-6 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1 min-w-0 flex-1">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight md:text-3xl">
                Locataires 
              </h1>
              <p className="text-muted-foreground text-xs sm:text-sm md:text-base">
                Gérer les profils et informations des locataires
              </p>
            </div>
            
            <Button 
              asChild 
              className="mt-2 md:mt-0 h-11 sm:h-10 px-4 sm:px-6 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-lg shadow-orange-500/25 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] touch-manipulation w-full sm:w-auto"
            >
              <Link href="/tenant/new" className="flex items-center justify-center">
                <IconUserPlus className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-sm sm:text-base">Ajouter un locataire</span>
              </Link>
            </Button>
          </div>

          {/* KPI Cards */}
          <SectionCardsTenant />

          {/* View Toggle */}
          <div className="px-4 sm:px-6 lg:px-6">
            <div className="inline-flex rounded-xl bg-muted/50 p-1 w-full sm:w-auto">
              <button
                onClick={() => setViewMode('table')}
                className={cn(
                  "inline-flex items-center justify-center gap-2 rounded-lg px-3 sm:px-4 py-2.5 sm:py-2 text-sm font-medium transition-all duration-200 touch-manipulation flex-1 sm:flex-initial min-h-[44px] sm:min-h-0",
                  viewMode === 'table' 
                    ? "bg-white shadow-sm text-orange-600 dark:bg-card" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <IconTable className="size-4" />
                <span className="hidden xs:inline">Table</span>
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  "inline-flex items-center justify-center gap-2 rounded-lg px-3 sm:px-4 py-2.5 sm:py-2 text-sm font-medium transition-all duration-200 touch-manipulation flex-1 sm:flex-initial min-h-[44px] sm:min-h-0",
                  viewMode === 'grid' 
                    ? "bg-white shadow-sm text-orange-600 dark:bg-card" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <IconLayoutGrid className="size-4" />
                <span className="hidden xs:inline">Grille</span>
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="px-4 sm:px-6 lg:px-6">
            <TenantFilters
              search={search}
              onSearchChange={setSearch}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
              propertyFilter={propertyFilter}
              onPropertyFilterChange={setPropertyFilter}
              onClearFilters={handleClearFilters}
            />
          </div>

          {/* Tenant List */}
          <div className="px-4 sm:px-6 lg:px-6">
            <Suspense fallback={<TableSkeleton rows={10} cols={5} />}>
              <TenantList tenants={filteredTenants} viewMode={viewMode} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}
