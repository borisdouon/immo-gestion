"use client"

import { useState, useMemo, Suspense } from "react"
import dynamic from "next/dynamic"
import Link from "next/link"
import { SectionCardsContract } from "@/components/contract/section-cards-contract"
import { Button } from "@/components/ui/button"
import { IconPlus, IconTable } from "@tabler/icons-react"
import { cn } from "@/lib/utils"
import { mockContracts } from "@/lib/mock-data/contracts"
import type { ContractStatus } from "@/lib/types/contract"
import { TableSkeleton } from "@/components/ui/table-skeleton"
import { useDebounce } from "@/hooks/use-debounce"

// Lazy load heavy list component
const ContractList = dynamic(() => import("@/components/contract/contract-list").then(mod => ({ default: mod.ContractList })), {
  loading: () => <TableSkeleton rows={10} cols={5} />,
  ssr: false,
})

type ViewMode = 'table'

export default function Page() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<ContractStatus | 'all'>("all")
  const [viewMode, setViewMode] = useState<ViewMode>('table')

  // Debounce search input to reduce filtering computations
  const debouncedSearch = useDebounce(search, 300)

  const filteredContracts = useMemo(() => {
    return mockContracts.filter((contract) => {
      const matchesSearch =
        debouncedSearch === "" ||
        contract.contractNumber.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        contract.tenantName.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        contract.propertyName.toLowerCase().includes(debouncedSearch.toLowerCase())

      const matchesStatus = statusFilter === "all" || contract.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [debouncedSearch, statusFilter])

  return (
    <div className="flex flex-1 flex-col" suppressHydrationWarning>
      <div className="@container/main flex flex-1 flex-col gap-2" suppressHydrationWarning>
        <div className="flex flex-col gap-4 sm:gap-6 py-4 sm:py-6" suppressHydrationWarning>
          {/* Header Section */}
          <div className="flex flex-col gap-3 px-4 sm:px-6 lg:px-6 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1 min-w-0 flex-1">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight md:text-3xl">
                Contrats 
              </h1>
              <p className="text-muted-foreground text-xs sm:text-sm md:text-base">
                Gérez vos contrats de location et créez de nouveaux accords
              </p>
            </div>
            
            <Button 
              asChild 
              className="mt-2 md:mt-0 h-11 sm:h-10 px-4 sm:px-6 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-lg shadow-orange-500/25 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] touch-manipulation w-full sm:w-auto"
            >
              <Link href="/contract/new" className="flex items-center justify-center">
                <IconPlus className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-sm sm:text-base">Nouveau contrat</span>
              </Link>
            </Button>
          </div>

          {/* KPI Cards */}
          <SectionCardsContract />

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
            </div>
          </div>

          {/* Filters */}
          <div className="px-4 sm:px-6 lg:px-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex-1 w-full sm:max-w-md">
                <input
                  type="text"
                  placeholder="Rechercher par numéro, locataire ou propriété..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full h-11 sm:h-10 rounded-lg border border-border/50 bg-background px-4 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all touch-manipulation"
                />
              </div>
              
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as ContractStatus | 'all')}
                  className="h-11 sm:h-10 w-full sm:w-auto min-w-[160px] rounded-lg border border-border/50 bg-background px-4 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all touch-manipulation"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="Actif">Actif</option>
                  <option value="En Attente">En Attente</option>
                  <option value="Expiré">Expiré</option>
                  <option value="Résilié">Résilié</option>
                  <option value="Brouillon">Brouillon</option>
                </select>
              </div>
            </div>
          </div>

          {/* Contract List */}
          <div className="px-4 sm:px-6 lg:px-6">
            <Suspense fallback={<TableSkeleton rows={10} cols={5} />}>
              <ContractList contracts={filteredContracts} viewMode={viewMode} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}

