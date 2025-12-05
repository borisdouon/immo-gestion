"use client"

import { IconBuilding, IconCash, IconTool, IconTrendingUp, IconTrendingDown } from "@tabler/icons-react"
import { cn } from "@/lib/utils"

interface KpiCardProps {
  title: string
  value: string | number
  change: number
  icon: React.ReactNode
  iconBgColor: string
  iconColor: string
}

function KpiCard({ title, value, change, icon, iconBgColor, iconColor }: KpiCardProps) {
  const isPositive = change >= 0
  const TrendIcon = isPositive ? IconTrendingUp : IconTrendingDown

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-card to-card/80 p-4 shadow-sm border border-border/50 transition-all duration-300 hover:shadow-md hover:border-orange-200 dark:hover:border-orange-800/50">
      {/* Subtle gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-amber-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none" />
      
      <div className="relative">
        <div className="flex items-start justify-between">
          <div className={cn("flex size-10 items-center justify-center rounded-xl", iconBgColor)}>
            <div className={cn("size-5", iconColor)}>{icon}</div>
          </div>
        </div>
        
        <div className="mt-4 space-y-1">
          <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
            {title}
          </p>
          <p className="text-2xl font-bold tracking-tight">
            {value}
          </p>
        </div>

        <div className="mt-2 flex items-center gap-1">
          <div className={cn(
            "flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-xs font-medium",
            isPositive 
              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" 
              : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
          )}>
            <TrendIcon className="size-3" />
            <span>{isPositive ? "+" : ""}{change}%</span>
          </div>
        </div>
      </div>
    </div>
  )
}

interface KpiCardsProps {
  totalProperties?: number
  totalRevenue?: number
  maintenanceCost?: number
  occupancyRate?: number
  propertiesChange?: number
  revenueChange?: number
  maintenanceChange?: number
}

export function KpiCards({
  totalProperties = 12,
  totalRevenue = 2450000,
  maintenanceCost = 185000,
  occupancyRate = 87,
  propertiesChange = 8,
  revenueChange = 20,
  maintenanceChange = -15,
}: KpiCardsProps) {
  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M FCFA`
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}K FCFA`
    }
    return `${value} FCFA`
  }

  return (
    <div className="flex flex-col gap-3">
      <KpiCard
        title="Total Propriétés"
        value={totalProperties}
        change={propertiesChange}
        icon={<IconBuilding className="size-5" />}
        iconBgColor="bg-orange-100 dark:bg-orange-500/20"
        iconColor="text-orange-600 dark:text-orange-400"
      />
      
      <KpiCard
        title="Revenus Totaux"
        value={formatCurrency(totalRevenue)}
        change={revenueChange}
        icon={<IconCash className="size-5" />}
        iconBgColor="bg-emerald-100 dark:bg-emerald-500/20"
        iconColor="text-emerald-600 dark:text-emerald-400"
      />
      
      <KpiCard
        title="Coûts Maintenance"
        value={formatCurrency(maintenanceCost)}
        change={maintenanceChange}
        icon={<IconTool className="size-5" />}
        iconBgColor="bg-blue-100 dark:bg-blue-500/20"
        iconColor="text-blue-600 dark:text-blue-400"
      />
    </div>
  )
}

