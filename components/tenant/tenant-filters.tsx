"use client"

import { IconSearch, IconX, IconAdjustments } from "@tabler/icons-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TENANT_STATUSES } from "@/lib/constants/tenant"
import { mockProperties } from "@/lib/mock-data/properties"
import type { TenantStatus } from "@/lib/types/tenant"
import { cn } from "@/lib/utils"

interface TenantFiltersProps {
  search: string
  onSearchChange: (value: string) => void
  statusFilter: TenantStatus | 'all'
  onStatusFilterChange: (value: TenantStatus | 'all') => void
  propertyFilter: string
  onPropertyFilterChange: (value: string) => void
  onClearFilters: () => void
}

export function TenantFilters({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  propertyFilter,
  onPropertyFilterChange,
  onClearFilters,
}: TenantFiltersProps) {
  const activeFilterCount = [
    search !== '',
    statusFilter !== 'all',
    propertyFilter !== 'all'
  ].filter(Boolean).length

  const hasActiveFilters = activeFilterCount > 0

  // Get unique property names for filter
  const propertyNames = Array.from(
    new Set(mockProperties.map(p => p.name))
  ).sort()

  return (
    <div className="space-y-4">
      {/* Filter Header */}
      <div className="flex items-center gap-2">
        <div className="flex size-8 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-500/20">
          <IconAdjustments className="size-4 text-orange-600 dark:text-orange-400" />
        </div>
        <span className="text-sm font-semibold">Filtres</span>
        {hasActiveFilters && (
          <Badge 
            variant="secondary" 
            className="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
          >
            {activeFilterCount} actif{activeFilterCount > 1 ? 's' : ''}
          </Badge>
        )}
      </div>

      {/* Filter Controls */}
      <div className="flex flex-col gap-3 rounded-2xl border border-border/50 bg-card/50 p-4 md:flex-row md:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Rechercher par nom, email ou propriété..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-11 pl-10 bg-background border-border/50 rounded-xl focus:border-orange-300 focus:ring-orange-500/20 transition-colors"
          />
        </div>

        {/* Status Filter */}
        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger className={cn(
            "w-full md:w-[160px] h-11 bg-background border-border/50 rounded-xl transition-colors",
            statusFilter !== 'all' && "border-orange-300 bg-orange-50/50 dark:bg-orange-950/20"
          )}>
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="all" className="rounded-lg">Tous les statuts</SelectItem>
            {TENANT_STATUSES.map((status) => (
              <SelectItem key={status} value={status} className="rounded-lg">
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Property Filter */}
        <Select value={propertyFilter} onValueChange={onPropertyFilterChange}>
          <SelectTrigger className={cn(
            "w-full md:w-[180px] h-11 bg-background border-border/50 rounded-xl transition-colors",
            propertyFilter !== 'all' && "border-orange-300 bg-orange-50/50 dark:bg-orange-950/20"
          )}>
            <SelectValue placeholder="Propriété" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="all" className="rounded-lg">Toutes les propriétés</SelectItem>
            {propertyNames.map((name) => (
              <SelectItem key={name} value={name} className="rounded-lg">
                {name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="h-11 w-full md:w-auto rounded-xl text-orange-600 hover:text-orange-700 hover:bg-orange-50 dark:text-orange-400 dark:hover:bg-orange-950/20 transition-colors"
          >
            <IconX className="mr-2 h-4 w-4" />
            Réinitialiser
          </Button>
        )}
      </div>
    </div>
  )
}
