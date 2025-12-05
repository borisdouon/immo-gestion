"use client"

import Link from "next/link"
import { IconCalendar, IconMapPin, IconUser, IconArrowUpRight } from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import type { Contract } from "@/lib/types/contract"

const statusConfig = {
  'Actif': { 
    color: 'bg-emerald-500 text-white',
  },
  'En Attente': { 
    color: 'bg-amber-500 text-white',
  },
  'Expiré': { 
    color: 'bg-gray-500 text-white',
  },
  'Résilié': { 
    color: 'bg-red-500 text-white',
  },
  'Renouvelé': { 
    color: 'bg-blue-500 text-white',
  },
  'Brouillon': { 
    color: 'bg-slate-500 text-white',
  },
}

interface ContractTableViewProps {
  contracts: Contract[]
}

function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
  } catch {
    return dateString
  }
}

export function ContractTableView({ contracts }: ContractTableViewProps) {
  return (
    <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-b border-border/50">
              <TableHead className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground min-w-[140px]">
                N° Contrat
              </TableHead>
              <TableHead className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground min-w-[180px]">
                Locataire
              </TableHead>
              <TableHead className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground min-w-[200px]">
                Propriété
              </TableHead>
              <TableHead className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground min-w-[140px]">
                Période
              </TableHead>
              <TableHead className="px-4 pr-8 py-3.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground text-right min-w-[140px]">
                Loyer Mensuel
              </TableHead>
              <TableHead className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground min-w-[100px]">
                Statut
              </TableHead>
              <TableHead className="w-12 px-4 py-3.5"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contracts.map((contract) => {
              const status = statusConfig[contract.status] || statusConfig['Brouillon']

              return (
                <TableRow 
                  key={contract.id}
                  className="group cursor-pointer transition-colors hover:bg-orange-50/50 dark:hover:bg-orange-950/10 border-b border-border/30 last:border-b-0"
                >
                  <TableCell className="px-4 py-3 align-middle">
                    <Link href={`/contract/${contract.id}`} className="block">
                      <div className="font-semibold text-sm text-foreground group-hover:text-orange-600 transition-colors">
                        {contract.contractNumber}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {contract.type}
                      </div>
                    </Link>
                  </TableCell>
                  
                  <TableCell className="px-4 py-3 align-middle">
                    <Link href={`/contract/${contract.id}`} className="block">
                      <div className="flex items-center gap-2">
                        <IconUser className="size-4 text-orange-600/70 shrink-0" />
                        <div>
                          <div className="font-medium text-sm text-foreground group-hover:text-orange-600 transition-colors">
                            {contract.tenantName}
                          </div>
                          {contract.tenantEmail && (
                            <div className="text-xs text-muted-foreground truncate max-w-[160px]">
                              {contract.tenantEmail}
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                  </TableCell>
                  
                  <TableCell className="px-4 py-3 align-middle">
                    <Link href={`/contract/${contract.id}`} className="block">
                      <div className="flex items-center gap-2">
                        <IconMapPin className="size-4 text-orange-600 shrink-0" />
                        <div>
                          <div className="font-medium text-sm text-foreground group-hover:text-orange-600 transition-colors">
                            {contract.propertyName}
                            {contract.unitNumber && ` • ${contract.unitNumber}`}
                          </div>
                          <div className="text-xs text-muted-foreground truncate max-w-[180px]">
                            {contract.propertyAddress.street}, {contract.propertyAddress.city}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </TableCell>
                  
                  <TableCell className="px-4 py-3 align-middle">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 text-sm text-foreground">
                        <IconCalendar className="size-3.5 shrink-0 text-orange-600/70" />
                        <span>{formatDate(contract.startDate)}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Jusqu'au {formatDate(contract.endDate)}
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell className="px-4 pr-8 py-3 align-middle text-right">
                    <span className="text-sm font-semibold text-orange-600">
                      {contract.monthlyRent.toLocaleString('fr-FR')} FCFA
                    </span>
                  </TableCell>
                  
                  <TableCell className="px-4 py-3 align-middle">
                    <Badge className={cn("text-xs font-medium px-2.5 py-0.5", status.color)}>
                      {contract.status}
                    </Badge>
                  </TableCell>
                  
                  <TableCell className="px-4 py-3 align-middle">
                    <Link href={`/contract/${contract.id}`} className="flex items-center justify-center">
                      <div className="flex size-8 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-500/20 opacity-0 transition-all duration-300 group-hover:opacity-100">
                        <IconArrowUpRight className="size-4 text-orange-600 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </div>
                    </Link>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

