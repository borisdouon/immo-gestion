"use client"

import Link from "next/link"
import { IconMail, IconPhone, IconMapPin, IconCalendar } from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"
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

interface TenantListViewProps {
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

export function TenantListView({ tenants }: TenantListViewProps) {
  return (
    <div className="space-y-2">
      {tenants.map((tenant) => {
        const initials = getInitials(tenant.firstName, tenant.lastName)
        const moveInDateFormatted = formatDate(tenant.moveInDate)
        const status = statusConfig[tenant.status] || statusConfig['Inactif']

        return (
          <Link key={tenant.id} href={`/tenant/${tenant.id}`}>
            <div className="group relative flex w-full items-start gap-3 rounded-lg border border-transparent bg-transparent p-2.5 text-left transition-all duration-200 hover:border-sidebar-border hover:bg-sidebar-accent/30">
              {/* Avatar - floating on left */}
              <div className="relative shrink-0">
                <div className="flex size-12 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-amber-500 text-white font-semibold text-sm ring-2 ring-orange-400/30 ring-offset-0 transition-all duration-200 group-hover:ring-orange-500/50 dark:ring-orange-600/30 dark:group-hover:ring-orange-500/40">
                  {initials}
                </div>
                {/* Status indicator */}
                <div className={cn(
                  "absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-sidebar",
                  status.dotColor
                )} />
              </div>

              {/* Main Info - inline to the right */}
              <div className="min-w-0 flex-1 grid grid-cols-1 md:grid-cols-5 gap-3 items-center">
                {/* Name & Date */}
                <div className="min-w-0 space-y-0.5">
                  <h3 className="text-sm font-semibold truncate text-sidebar-foreground">
                    {tenant.fullName}
                  </h3>
                  {moveInDateFormatted && (
                    <p className="flex items-center gap-1 text-xs text-sidebar-muted">
                      <IconCalendar className="size-3" />
                      Depuis {moveInDateFormatted}
                    </p>
                  )}
                </div>

                {/* Contact */}
                <div className="min-w-0 space-y-0.5">
                  <div className="flex items-center gap-1.5 text-xs text-sidebar-muted">
                    <IconMail className="size-3 shrink-0" />
                    <span className="truncate">{tenant.email}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-sidebar-muted">
                    <IconPhone className="size-3 shrink-0" />
                    <span className="truncate">{tenant.phone}</span>
                  </div>
                </div>

                {/* Property */}
                <div className="min-w-0">
                  {tenant.currentPropertyName ? (
                    <div className="flex items-center gap-1.5 text-xs text-sidebar-muted">
                      <IconMapPin className="size-3 shrink-0 text-orange-600" />
                      <span className="truncate">
                        {tenant.currentPropertyName}
                        {tenant.currentUnitNumber && ` • ${tenant.currentUnitNumber}`}
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs text-sidebar-muted">—</span>
                  )}
                </div>

                {/* Rent */}
                <div className="min-w-0">
                  {tenant.currentRent ? (
                    <span className="text-sm font-semibold text-orange-600">
                      {tenant.currentRent.toLocaleString('fr-FR')} FCFA
                    </span>
                  ) : (
                    <span className="text-xs text-sidebar-muted">—</span>
                  )}
                </div>

                {/* Status Badge */}
                <div className="flex justify-end">
                  <Badge className={cn("shrink-0 h-5 text-[10px] font-medium", status.color)}>
                    {tenant.status}
                  </Badge>
                </div>
              </div>
            </div>
          </Link>
        )
      })}
    </div>
  )
}

