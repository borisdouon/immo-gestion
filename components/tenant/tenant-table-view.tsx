"use client"

import Link from "next/link"
import { IconMail, IconPhone, IconMapPin, IconCalendar, IconArrowUpRight } from "@tabler/icons-react"
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
import type { Tenant } from "@/lib/types/tenant"

const statusConfig = {
  'Actif': { 
    color: 'bg-emerald-500 text-white',
    dotColor: 'bg-emerald-500',
  },
  'En Attente': { 
    color: 'bg-amber-500 text-white',
    dotColor: 'bg-amber-500',
  },
  'Inactif': { 
    color: 'bg-gray-500 text-white',
    dotColor: 'bg-gray-400',
  },
  'Résilié': { 
    color: 'bg-red-500 text-white',
    dotColor: 'bg-red-500',
  },
}

interface TenantTableViewProps {
  tenants: Tenant[]
}

function getInitials(firstName: string, lastName: string): string {
  const first = firstName.charAt(0).toUpperCase()
  const second = lastName.charAt(0).toUpperCase()
  return `${first}${second}`
}

function formatDate(dateString?: string): string {
  if (!dateString) return ''
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })
  } catch {
    return ''
  }
}

export function TenantTableView({ tenants }: TenantTableViewProps) {
  return (
    <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-b border-border/50">
              <TableHead className="w-20 px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Avatar
              </TableHead>
              <TableHead className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground min-w-[180px]">
                Nom complet
              </TableHead>
              <TableHead className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground min-w-[220px]">
                Contact
              </TableHead>
              <TableHead className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground min-w-[200px]">
                Propriété
              </TableHead>
              <TableHead className="px-4 pr-8 py-3.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground text-right min-w-[140px]">
                Loyer
              </TableHead>
              <TableHead className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground min-w-[100px]">
                Statut
              </TableHead>
              <TableHead className="w-12 px-4 py-3.5"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tenants.map((tenant) => {
              const initials = getInitials(tenant.firstName, tenant.lastName)
              const moveInDateFormatted = formatDate(tenant.moveInDate)
              const status = statusConfig[tenant.status] || statusConfig['Inactif']

              return (
                <TableRow 
                  key={tenant.id}
                  className="group cursor-pointer transition-colors hover:bg-orange-50/50 dark:hover:bg-orange-950/10 border-b border-border/30 last:border-b-0"
                >
                  <TableCell className="px-4 py-3 align-middle">
                    <Link href={`/tenant/${tenant.id}`} className="flex items-center justify-center">
                      <div className="relative">
                        <div className="flex size-11 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 text-white font-bold text-xs shadow-sm transition-transform duration-300 group-hover:scale-110">
                          {initials}
                        </div>
                        <div className={cn(
                          "absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-white dark:border-card",
                          status.dotColor
                        )} />
                      </div>
                    </Link>
                  </TableCell>
                  
                  <TableCell className="px-4 py-3 align-middle">
                    <Link href={`/tenant/${tenant.id}`} className="block">
                      <div className="font-semibold text-sm text-foreground group-hover:text-orange-600 transition-colors">
                        {tenant.fullName}
                      </div>
                      {moveInDateFormatted && (
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                          <IconCalendar className="size-3 shrink-0" />
                          <span>Depuis {moveInDateFormatted}</span>
                        </div>
                      )}
                    </Link>
                  </TableCell>
                  
                  <TableCell className="px-4 py-3 align-middle">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <IconMail className="size-3.5 shrink-0 text-orange-600/70" />
                        <span className="truncate max-w-[200px]">{tenant.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <IconPhone className="size-3.5 shrink-0 text-orange-600/70" />
                        <span>{tenant.phone}</span>
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell className="px-4 py-3 align-middle">
                    {tenant.currentPropertyName ? (
                      <div className="flex items-center gap-2 text-sm text-foreground">
                        <IconMapPin className="size-4 shrink-0 text-orange-600" />
                        <span className="truncate max-w-[180px]">
                          {tenant.currentPropertyName}
                          {tenant.currentUnitNumber && ` • ${tenant.currentUnitNumber}`}
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  
                  <TableCell className="px-4 pr-8 py-3 align-middle text-right">
                    {tenant.currentRent ? (
                      <span className="text-sm font-semibold text-orange-600">
                        {tenant.currentRent.toLocaleString('fr-FR')} FCFA
                      </span>
                    ) : (
                      <span className="text-sm text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  
                  <TableCell className="px-4 py-3 align-middle">
                    <Badge className={cn("text-xs font-medium px-2.5 py-0.5", status.color)}>
                      {tenant.status}
                    </Badge>
                  </TableCell>
                  
                  <TableCell className="px-4 py-3 align-middle">
                    <Link href={`/tenant/${tenant.id}`} className="flex items-center justify-center">
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

