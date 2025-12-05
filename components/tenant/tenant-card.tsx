"use client"

import { memo } from "react"
import Link from "next/link"
import { IconMail, IconPhone, IconMapPin, IconArrowUpRight, IconCalendar } from "@tabler/icons-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { Tenant } from "@/lib/types/tenant"

const statusConfig = {
  'Actif': { 
    color: 'bg-emerald-500 text-white shadow-emerald-500/30', 
    dotColor: 'bg-emerald-500',
    bgLight: 'bg-emerald-50 dark:bg-emerald-950/20'
  },
  'En Attente': { 
    color: 'bg-amber-500 text-white shadow-amber-500/30', 
    dotColor: 'bg-amber-500',
    bgLight: 'bg-amber-50 dark:bg-amber-950/20'
  },
  'Inactif': { 
    color: 'bg-gray-500 text-white shadow-gray-500/30', 
    dotColor: 'bg-gray-400',
    bgLight: 'bg-gray-50 dark:bg-gray-950/20'
  },
}

interface TenantCardProps {
  tenant: Tenant
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

function TenantCardComponent({ tenant }: TenantCardProps) {
  const initials = getInitials(tenant.firstName, tenant.lastName)
  const moveInDateFormatted = formatDate(tenant.moveInDate)
  const status = statusConfig[tenant.status] || statusConfig['Inactif']

  return (
    <Link href={`/tenant/${tenant.id}`}>
      <Card className="group relative h-full overflow-hidden rounded-2xl border-border/50 bg-card transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/10 hover:border-orange-200 dark:hover:border-orange-800/50 hover:-translate-y-1">
        {/* Hover gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-amber-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none" />
        
        <CardContent className="relative p-5">
          <div className="flex items-start gap-4">
            {/* Avatar with gradient */}
            <div className="relative shrink-0">
              <div className="flex size-14 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 text-white font-bold text-lg shadow-md transition-transform duration-300 group-hover:scale-110">
                {initials}
              </div>
              {/* Status dot */}
              <div className={cn(
                "absolute -bottom-1 -right-1 size-4 rounded-full border-2 border-white dark:border-card",
                status.dotColor
              )} />
            </div>
            
            {/* Info */}
            <div className="flex-1 min-w-0 space-y-3">
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="font-semibold text-base truncate transition-colors group-hover:text-orange-600">
                    {tenant.fullName}
                  </h3>
                  {moveInDateFormatted && (
                    <p className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                      <IconCalendar className="size-3" />
                      Depuis {moveInDateFormatted}
                    </p>
                  )}
                </div>
                <Badge className={cn("shrink-0 shadow-sm", status.color)}>
                  {tenant.status}
                </Badge>
              </div>
              
              {/* Contact info */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="flex size-6 items-center justify-center rounded-md bg-muted">
                    <IconMail className="size-3.5" />
                  </div>
                  <span className="truncate">{tenant.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="flex size-6 items-center justify-center rounded-md bg-muted">
                    <IconPhone className="size-3.5" />
                  </div>
                  <span className="truncate">{tenant.phone}</span>
                </div>
              </div>
              
              {/* Property location */}
              {tenant.currentPropertyName && (
                <div className={cn(
                  "flex items-center gap-2 rounded-lg p-2 text-sm",
                  status.bgLight
                )}>
                  <IconMapPin className="size-4 shrink-0 text-orange-600" />
                  <span className="truncate font-medium">
                    {tenant.currentPropertyName}
                    {tenant.currentUnitNumber && ` • ${tenant.currentUnitNumber}`}
                  </span>
                </div>
              )}
              
              {/* Rent info */}
              {tenant.currentRent && (
                <div className="flex items-center justify-between pt-2 border-t border-border/50">
                  <span className="text-xs text-muted-foreground">Loyer mensuel</span>
                  <span className="text-sm font-bold text-orange-600">
                    {tenant.currentRent.toLocaleString('fr-FR')} FCFA
                  </span>
                </div>
              )}
            </div>
            
            {/* Arrow on hover */}
            <div className="absolute top-4 right-4 opacity-0 transition-all duration-300 group-hover:opacity-100">
              <div className="flex size-8 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-500/20">
                <IconArrowUpRight className="size-4 text-orange-600 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

export const TenantCard = memo(TenantCardComponent)
