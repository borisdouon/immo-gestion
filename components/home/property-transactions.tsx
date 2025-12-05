"use client"

import * as React from "react"
import { IconSearch, IconFilter, IconChevronRight, IconHome, IconMapPin } from "@tabler/icons-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { mockProperties } from "@/lib/mock-data/properties"
import type { Unit } from "@/lib/types/property"

interface AvailableUnit {
  id: string
  unitNumber: string
  floor?: number
  rooms: number
  size: number
  rent: number
  propertyName: string
  propertyAddress: string
  propertyId: string
  propertyImage?: string
}

// Extract available units from all properties
function getAvailableUnits(): AvailableUnit[] {
  const availableUnits: AvailableUnit[] = []
  
  mockProperties.forEach((property) => {
    if (property.type === 'Immeuble' && property.units) {
      property.units
        .filter(unit => unit.status === 'Libre')
        .forEach((unit) => {
          availableUnits.push({
            id: unit.id,
            unitNumber: unit.number,
            floor: unit.floor,
            rooms: unit.rooms,
            size: unit.size,
            rent: unit.rent,
            propertyName: property.name,
            propertyAddress: `${property.address.street}, ${property.address.city}`,
            propertyId: property.id,
          })
        })
    } else if (property.status === 'Libre') {
      // For non-Immeuble properties, treat the whole property as a unit
      availableUnits.push({
        id: property.id,
        unitNumber: property.name,
        rooms: 0, // Will be shown differently
        size: 0,
        rent: 0,
        propertyName: property.name,
        propertyAddress: `${property.address.street}, ${property.address.city}`,
        propertyId: property.id,
      })
    }
  })
  
  return availableUnits.sort((a, b) => a.rent - b.rent) // Sort by rent ascending
}

const statusConfig = {
  libre: {
    label: "Disponible",
    color: "text-emerald-600 dark:text-emerald-400",
    bgColor: "bg-emerald-100 dark:bg-emerald-500/20",
    dotColor: "bg-emerald-500",
  },
}

function StatusBadge() {
  const config = statusConfig.libre
  
  return (
    <div className={cn("flex items-center gap-1.5", config.color)}>
      <div className={cn("size-2 rounded-full", config.dotColor)} />
      <span className="text-sm font-medium">{config.label}</span>
    </div>
  )
}

interface PropertyTransactionsProps {
  units?: AvailableUnit[]
}

export function PropertyTransactions({ 
  units 
}: PropertyTransactionsProps) {
  const [search, setSearch] = React.useState("")
  const availableUnits = units || getAvailableUnits()
  
  const filteredUnits = availableUnits.filter(unit =>
    unit.propertyName.toLowerCase().includes(search.toLowerCase()) ||
    unit.propertyAddress.toLowerCase().includes(search.toLowerCase()) ||
    unit.unitNumber.toLowerCase().includes(search.toLowerCase())
  )

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "decimal",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-base font-semibold">
            Liste des Logements Disponibles
          </CardTitle>
          
          <div className="flex items-center gap-2">
            <div className="relative">
              <IconSearch className="text-muted-foreground absolute left-3 top-1/2 size-4 -translate-y-1/2" />
              <Input
                placeholder="Rechercher..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-9 w-[200px] pl-9"
              />
            </div>
            <Button variant="outline" size="sm" className="h-9">
              <IconFilter className="mr-2 size-4" />
              Filtrer
            </Button>
            <Button variant="ghost" size="sm" className="h-9">
              Voir tout
              <IconChevronRight className="ml-1 size-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border/50">
          {/* Header */}
          <div className="flex items-center gap-4 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-sidebar-muted">
            <div className="w-[35%]">Propriété / Logement</div>
            <div className="w-[15%]">Statut</div>
            <div className="w-[20%]">Détails</div>
            <div className="w-[15%]">Surface</div>
            <div className="w-[15%] text-right">Loyer Mensuel</div>
          </div>
          
          {/* Body */}
          <div className="divide-y divide-border/50">
            {filteredUnits.length > 0 ? (
              filteredUnits.map((unit) => (
                <div
                  key={unit.id}
                  className="group flex items-center gap-4 px-6 py-3 cursor-pointer transition-all duration-200 hover:bg-sidebar-accent/30"
                >
                  {/* Property/Unit */}
                  <div className="w-[35%]">
                    <div className="flex items-start gap-3">
                      <div className="relative shrink-0">
                        <Avatar className="size-12 rounded-full ring-2 ring-emerald-400/30 ring-offset-0 transition-all duration-200 group-hover:ring-emerald-500/50 dark:ring-emerald-600/30 dark:group-hover:ring-emerald-500/40">
                          <AvatarImage 
                            src={unit.propertyImage} 
                            className="object-cover"
                          />
                          <AvatarFallback className="rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 text-sm font-semibold text-white">
                            <IconHome className="size-5" />
                          </AvatarFallback>
                        </Avatar>
                        <div className={cn(
                          "absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-card",
                          statusConfig.libre.dotColor
                        )} />
                      </div>
                      <div className="min-w-0 flex-1 space-y-0.5">
                        <p className="text-sm font-semibold leading-tight truncate text-sidebar-foreground">
                          {unit.propertyName}
                        </p>
                        <div className="flex items-center gap-1.5 text-xs text-sidebar-muted">
                          <IconMapPin className="size-3" />
                          <span className="truncate">{unit.propertyAddress}</span>
                        </div>
                        <Badge variant="outline" className="mt-1 text-[10px] px-1.5 py-0">
                          Logement {unit.unitNumber}
                          {unit.floor && ` • Étage ${unit.floor}`}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  {/* Status */}
                  <div className="w-[15%]">
                    <StatusBadge />
                  </div>
                  
                  {/* Details */}
                  <div className="w-[20%]">
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium text-sidebar-foreground">
                        {unit.rooms > 0 ? `${unit.rooms} pièce${unit.rooms > 1 ? 's' : ''}` : 'N/A'}
                      </p>
                      {unit.floor && (
                        <p className="text-xs text-sidebar-muted">
                          Étage {unit.floor}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {/* Size */}
                  <div className="w-[15%]">
                    {unit.size > 0 ? (
                      <span className="text-sm text-sidebar-foreground">
                        {unit.size} m²
                      </span>
                    ) : (
                      <span className="text-sm text-sidebar-muted">—</span>
                    )}
                  </div>
                  
                  {/* Rent */}
                  <div className="w-[15%] text-right">
                    {unit.rent > 0 ? (
                      <span className="text-sm font-semibold text-sidebar-foreground">
                        {formatCurrency(unit.rent)} FCFA
                      </span>
                    ) : (
                      <span className="text-sm text-sidebar-muted">—</span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-12 text-center">
                <IconHome className="mx-auto size-12 text-muted-foreground/50 mb-3" />
                <p className="text-sm font-medium text-muted-foreground">
                  Aucun logement disponible
                </p>
                <p className="text-xs text-muted-foreground/70 mt-1">
                  Tous les logements sont actuellement occupés ou réservés
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

