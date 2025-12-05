"use client"

import { 
  IconFileDescription, 
  IconClock, 
  IconCheck,
  IconAlertCircle,
  IconArrowUpRight,
  IconArrowDownRight
} from "@tabler/icons-react"
import { cn } from "@/lib/utils"
import { mockContracts } from "@/lib/mock-data/contracts"

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

export function SectionCardsContract() {
  const totalContracts = mockContracts.length
  const activeContracts = mockContracts.filter(c => c.status === 'Actif').length
  const pendingContracts = mockContracts.filter(c => c.status === 'En Attente').length
  const expiringSoon = mockContracts.filter(c => {
    if (c.status !== 'Actif' || !c.renewalDate) return false
    const renewal = new Date(c.renewalDate)
    const today = new Date()
    const daysUntilRenewal = Math.ceil((renewal.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    return daysUntilRenewal <= 30 && daysUntilRenewal > 0
  }).length
  
  const totalRevenue = mockContracts
    .filter(c => c.status === 'Actif')
    .reduce((sum, c) => sum + c.monthlyRent, 0)

  return (
    <div className="grid grid-cols-1 gap-4 px-4 sm:grid-cols-2 lg:px-6 xl:grid-cols-4">
      <KpiCard
        title="Contrats Actifs"
        value={activeContracts}
        subtitle={`${totalContracts} au total`}
        icon={<IconCheck className="size-6 text-emerald-600 dark:text-emerald-400" />}
        iconBgColor="bg-emerald-100 dark:bg-emerald-500/20"
        trend={{ value: 15, isPositive: true }}
      />
      
      <KpiCard
        title="En Attente"
        value={pendingContracts}
        subtitle="Signature requise"
        icon={<IconClock className="size-6 text-amber-600 dark:text-amber-400" />}
        iconBgColor="bg-amber-100 dark:bg-amber-500/20"
      />
      
      <KpiCard
        title="Expirent Bientôt"
        value={expiringSoon}
        subtitle="Dans les 30 prochains jours"
        icon={<IconAlertCircle className="size-6 text-orange-600 dark:text-orange-400" />}
        iconBgColor="bg-orange-100 dark:bg-orange-500/20"
      />
      
      <KpiCard
        title="Revenus Mensuels"
        value={`${(totalRevenue / 1000).toFixed(0)}k`}
        subtitle="FCFA par mois"
        icon={<IconFileDescription className="size-6 text-blue-600 dark:text-blue-400" />}
        iconBgColor="bg-blue-100 dark:bg-blue-500/20"
        trend={{ value: 8, isPositive: true }}
      />
    </div>
  )
}

