"use client"

import * as React from "react"
import { IconCalendar, IconDownload } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface DashboardHeaderProps {
  userName?: string
  onDateRangeChange?: (range: string) => void
  onExport?: () => void
}

export function DashboardHeader({ 
  userName = "Admin",
  onDateRangeChange,
  onExport 
}: DashboardHeaderProps) {
  const [dateRange, setDateRange] = React.useState("6m")

  const handleDateChange = (value: string) => {
    setDateRange(value)
    onDateRangeChange?.(value)
  }

  return (
    <div className="flex flex-col gap-3 px-4 py-4 sm:px-6 md:flex-row md:items-center md:justify-between md:gap-4 lg:px-6">
      <div className="space-y-1 min-w-0 flex-1">
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl md:text-3xl">
          Bonjour, {userName}!
        </h1>
        <p className="text-muted-foreground text-xs sm:text-sm md:text-base">
          Voici un aperçu de vos propriétés 🏠
        </p>
      </div>
      
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
        <Select value={dateRange} onValueChange={handleDateChange}>
          <SelectTrigger className="w-full sm:w-[160px] h-10 sm:h-9" size="sm">
            <IconCalendar className="mr-2 size-4" />
            <SelectValue placeholder="Période" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">7 derniers jours</SelectItem>
            <SelectItem value="30d">30 derniers jours</SelectItem>
            <SelectItem value="3m">3 derniers mois</SelectItem>
            <SelectItem value="6m">6 derniers mois</SelectItem>
            <SelectItem value="1y">Cette année</SelectItem>
          </SelectContent>
        </Select>
        
        <Button 
          variant="default" 
          size="sm"
          onClick={onExport}
          className="w-full sm:w-auto h-10 sm:h-9 bg-primary hover:bg-primary/90 touch-manipulation"
        >
          <IconDownload className="mr-2 size-4" />
          <span className="hidden xs:inline">Exporter</span>
          <span className="xs:hidden">Export</span>
        </Button>
      </div>
    </div>
  )
}

