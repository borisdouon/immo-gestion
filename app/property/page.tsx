"use client"

import { useState, useMemo, Suspense } from "react"
import dynamic from "next/dynamic"
import Link from "next/link"
import { SectionCardsProperty } from "@/components/property/section-cards-property"
import { PropertyFilters } from "@/components/property/property-filters"
import { Button } from "@/components/ui/button"
import { IconPlus } from "@tabler/icons-react"
import { mockProperties } from "@/lib/mock-data/properties"
import type { PropertyType, PropertyStatus } from "@/lib/types/property"
import { TableSkeleton } from "@/components/ui/table-skeleton"
import { useDebounce } from "@/hooks/use-debounce"

// Lazy load heavy grid component
const PropertyGrid = dynamic(() => import("@/components/property/property-grid").then(mod => ({ default: mod.PropertyGrid })), {
  loading: () => <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"><TableSkeleton rows={3} cols={1} /><TableSkeleton rows={3} cols={1} /><TableSkeleton rows={3} cols={1} /></div>,
  ssr: false,
})

export default function Page() {
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState<PropertyType | 'all'>("all")
  const [statusFilter, setStatusFilter] = useState<PropertyStatus | 'all'>("all")

  // Debounce search input to reduce filtering computations
  const debouncedSearch = useDebounce(search, 300)

  const filteredProperties = useMemo(() => {
    return mockProperties.filter((property) => {
      const matchesSearch =
        debouncedSearch === "" ||
        property.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        property.address.street.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        property.address.city.toLowerCase().includes(debouncedSearch.toLowerCase())

      const matchesType = typeFilter === "all" || property.type === typeFilter
      const matchesStatus = statusFilter === "all" || property.status === statusFilter

      return matchesSearch && matchesType && matchesStatus
    })
  }, [debouncedSearch, typeFilter, statusFilter])

  const handleClearFilters = () => {
    setSearch("")
    setTypeFilter("all")
    setStatusFilter("all")
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 sm:gap-6 py-4 sm:py-6">
          {/* Enhanced Header Section */}
          <div className="flex flex-col gap-3 px-4 sm:px-6 lg:px-6 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1 min-w-0 flex-1">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight md:text-3xl">
                Propriétés 
              </h1>
              <p className="text-muted-foreground text-xs sm:text-sm md:text-base">
                Gérer votre portefeuille immobilier
              </p>
            </div>
            
            <Button 
              asChild 
              className="mt-2 md:mt-0 h-11 sm:h-10 px-4 sm:px-6 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-lg shadow-orange-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/30 hover:scale-[1.02] touch-manipulation w-full sm:w-auto"
            >
              <Link href="/property/new" className="flex items-center justify-center">
                <IconPlus className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-sm sm:text-base">Ajouter une propriété</span>
              </Link>
            </Button>
          </div>

          {/* Metric Cards */}
          <SectionCardsProperty />

          {/* Filters */}
          <div className="px-4 sm:px-6 lg:px-6">
            <PropertyFilters
              search={search}
              onSearchChange={setSearch}
              typeFilter={typeFilter}
              onTypeFilterChange={setTypeFilter}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
              onClearFilters={handleClearFilters}
            />
          </div>

          {/* Property Grid */}
          <div className="px-4 sm:px-6 lg:px-6">
            <Suspense fallback={<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"><TableSkeleton rows={3} cols={1} /><TableSkeleton rows={3} cols={1} /><TableSkeleton rows={3} cols={1} /></div>}>
              <PropertyGrid properties={filteredProperties} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}
