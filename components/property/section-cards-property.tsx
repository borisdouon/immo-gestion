"use client"

import { 
  IconBuilding, 
  IconHome, 
  IconTrendingUp, 
  IconDoorExit,
  IconArrowUpRight,
  IconArrowDownRight
} from "@tabler/icons-react"
import { cn } from "@/lib/utils"
import { mockProperties } from "@/lib/mock-data/properties"

interface KpiCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: React.ReactNode
  iconBgColor: string
  trend?: {
    value: number
    isPositive: boolean
  }
}

function KpiCard({ title, value, subtitle, icon, iconBgColor, trend }: KpiCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-card border border-border/50 p-5 shadow-sm transition-all duration-300 hover:shadow-md hover:border-orange-200 dark:hover:border-orange-800/50">
      {/* Subtle gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-amber-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      
      <div className="relative flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">
            {title}
          </p>
          <p className="text-3xl font-bold tracking-tight">
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-muted-foreground">
              {subtitle}
            </p>
          )}
          {trend && (
            <div className={cn(
              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
              trend.isPositive 
                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                : "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400"
            )}>
              {trend.isPositive ? (
                <IconArrowUpRight className="size-3" />
              ) : (
                <IconArrowDownRight className="size-3" />
              )}
              {trend.isPositive ? "+" : ""}{trend.value}%
            </div>
          )}
        </div>
        
        <div className={cn(
          "flex size-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110",
          iconBgColor
        )}>
          {icon}
        </div>
      </div>
    </div>
  )
}

export function SectionCardsProperty() {
  const totalProperties = mockProperties.length
  const totalUnits = mockProperties.reduce((acc, prop) => acc + (prop.totalUnits || 0), 0)
  const occupiedUnits = mockProperties.reduce((acc, prop) => acc + (prop.occupiedUnits || 0), 0)
  const occupancyRate = totalUnits > 0 ? Math.round((occupiedUnits / totalUnits) * 100) : 0
  const freeUnits = totalUnits - occupiedUnits

  return (
    <div className="grid grid-cols-1 gap-4 px-4 sm:grid-cols-2 lg:px-6 xl:grid-cols-4">
      <KpiCard
        title="Total Propriétés"
        value={totalProperties}
        subtitle="Dans le portefeuille"
        icon={<IconBuilding className="size-6 text-orange-600 dark:text-orange-400" />}
        iconBgColor="bg-orange-100 dark:bg-orange-500/20"
        trend={{ value: 12, isPositive: true }}
      />
      
      <KpiCard
        title="Total Logements"
        value={totalUnits}
        subtitle="Unités disponibles"
        icon={<IconHome className="size-6 text-blue-600 dark:text-blue-400" />}
        iconBgColor="bg-blue-100 dark:bg-blue-500/20"
        trend={{ value: 8, isPositive: true }}
      />
      
      <KpiCard
        title="Taux d'Occupation"
        value={`${occupancyRate}%`}
        subtitle="Performance globale"
        icon={<IconTrendingUp className="size-6 text-emerald-600 dark:text-emerald-400" />}
        iconBgColor="bg-emerald-100 dark:bg-emerald-500/20"
        trend={{ value: 5, isPositive: true }}
      />
      
      <KpiCard
        title="Logements Libres"
        value={freeUnits}
        subtitle="À louer"
        icon={<IconDoorExit className="size-6 text-amber-600 dark:text-amber-400" />}
        iconBgColor="bg-amber-100 dark:bg-amber-500/20"
        trend={{ value: 3, isPositive: false }}
      />
    </div>
  )
}
