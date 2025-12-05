"use client"

import Link from "next/link"
import { IconFileDescription } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { ContractTableView } from "./contract-table-view"
import type { Contract } from "@/lib/types/contract"

type ViewMode = 'table'

interface ContractListProps {
  contracts: Contract[]
  viewMode?: ViewMode
}

export function ContractList({ contracts, viewMode = 'table' }: ContractListProps) {
  if (contracts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border/50 bg-card/30 py-16 px-4">
        <div className="flex size-16 items-center justify-center rounded-2xl bg-orange-100 dark:bg-orange-500/20">
          <IconFileDescription className="size-8 text-orange-500" />
        </div>
        <h3 className="mt-4 text-lg font-semibold">Aucun contrat trouvé</h3>
        <p className="mt-2 text-sm text-muted-foreground text-center max-w-sm">
          Créez un nouveau contrat pour commencer à gérer vos locations.
        </p>
        <Button 
          asChild 
          className="mt-6 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-lg shadow-orange-500/25 transition-all duration-300 hover:shadow-xl"
        >
          <Link href="/contract/new">
            Créer un contrat
          </Link>
        </Button>
      </div>
    )
  }

  // Render based on view mode
  if (viewMode === 'table') {
    return <ContractTableView contracts={contracts} />
  }

  return null
}

