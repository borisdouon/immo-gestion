"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { IconEdit, IconMapPin, IconUser, IconPhone, IconMail } from "@tabler/icons-react"
import Link from "next/link"
import { STATUS_BADGE_VARIANTS, OCCUPANCY_BADGES, STATUS_COLORS } from "@/lib/constants/property"
import { formatDate } from "@/lib/utils/format"
import { cn } from "@/lib/utils"
import type { Property, Unit } from "@/lib/types/property"

interface PropertyDetailsProps {
  property: Property
  selectedUnitId?: string
  onUnitSelect?: (unit: Unit) => void
}

export function PropertyDetails({ property, selectedUnitId, onUnitSelect }: PropertyDetailsProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const selectedItemRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to selected item
  useEffect(() => {
    if (selectedUnitId && selectedItemRef.current && scrollContainerRef.current) {
      selectedItemRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'nearest',
      })
    }
  }, [selectedUnitId])

  // Calculate occupancy rate for buildings
  const occupancyRate = property.totalUnits && property.totalUnits > 0
    ? Math.max(0, Math.min(100, Math.round((property.occupiedUnits || 0) / property.totalUnits * 100)))
    : 0

  // Get occupancy badge for buildings
  const getOccupancyBadge = () => {
    if (property.type === 'Immeuble' && property.totalUnits && property.totalUnits > 0) {
      if (occupancyRate === 100) {
        return { text: OCCUPANCY_BADGES.full.text, className: OCCUPANCY_BADGES.full.className }
      }
      if (occupancyRate > 80) {
        return { text: OCCUPANCY_BADGES.almostFull.text, className: OCCUPANCY_BADGES.almostFull.className }
      }
      if (occupancyRate >= 40) {
        return { text: OCCUPANCY_BADGES.moderate.text, className: OCCUPANCY_BADGES.moderate.className }
      }
      if (occupancyRate < 40) {
        return { text: OCCUPANCY_BADGES.lowOccupancy.text, className: OCCUPANCY_BADGES.lowOccupancy.className }
      }
    }
    return null
  }

  // Get status badge for individual properties
  const getStatusBadge = () => {
    if (property.type !== 'Immeuble') {
      const statusColors: Record<string, string> = {
        'Libre': 'bg-green-500',
        'Occupé': 'bg-blue-500',
        'Réservé': 'bg-yellow-500',
        'En Maintenance': 'bg-orange-500',
      }
      return {
        text: property.status,
        className: statusColors[property.status] || 'bg-gray-500'
      }
    }
    return null
  }

  const occupancyBadge = getOccupancyBadge()
  const statusBadge = getStatusBadge()

  return (
    <div className="grid gap-4 px-4 lg:px-6 md:grid-cols-2">
      {/* Property Info */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>{property.name}</CardTitle>
              <CardDescription className="mt-1">
                {property.type}
              </CardDescription>
            </div>
            {/* Show occupancy badge for buildings, status badge for individual properties */}
            {occupancyBadge ? (
              <Badge className={occupancyBadge.className}>
                {occupancyBadge.text}
              </Badge>
            ) : statusBadge ? (
              <Badge className={statusBadge.className}>
                {statusBadge.text}
              </Badge>
            ) : (
              <Badge variant={STATUS_BADGE_VARIANTS[property.status]}>
                {property.status}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3">
            <IconMapPin className="mt-0.5 h-5 w-5 text-muted-foreground shrink-0" />
            <div>
              <div className="font-medium">Adresse</div>
              <div className="text-sm text-muted-foreground">
                {property.address.street}
                <br />
                {property.address.city}
                {property.address.postalCode && `, ${property.address.postalCode}`}
                <br />
                {property.address.country}
              </div>
            </div>
          </div>

          {property.description && (
            <div>
              <div className="font-medium">Description</div>
              <div className="text-sm text-muted-foreground">
                {property.description}
              </div>
            </div>
          )}

          {property.type === 'Immeuble' && (
            <div>
              <div className="font-medium">Statistiques</div>
              <div className="text-sm text-muted-foreground">
                {property.totalUnits} logement(s) au total
                <br />
                {property.occupiedUnits} logement(s) occupé(s)
                <br />
                {property.totalUnits && property.occupiedUnits
                  ? Math.round((property.occupiedUnits / property.totalUnits) * 100)
                  : 0}% d'occupation
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 pt-2">
            <Button asChild variant="outline" size="sm">
              <Link href={`/property/${property.id}/edit`}>
                <IconEdit className="mr-2 h-4 w-4" />
                Modifier
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Owner Info */}
      <Card>
        <CardHeader>
          <CardTitle>
            {property.type === 'Immeuble' ? 'Propriétaires/Locataires' : 'Propriétaire'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Liste des propriétaires/locataires pour les immeubles */}
          {property.type === 'Immeuble' && property.units && property.units.length > 0 ? (
            <>
              <div 
                ref={scrollContainerRef}
                className="space-y-1 max-h-[200px] overflow-y-auto border rounded-lg p-2"
              >
                {property.units.map((unit) => {
                  const isSelected = selectedUnitId === unit.id
                  const ownerName = unit.tenantName || `Logement ${unit.number}`
                  return (
                    <div
                      key={unit.id}
                      ref={isSelected ? selectedItemRef : null}
                      onClick={() => onUnitSelect?.(unit)}
                      className={cn(
                        "flex items-center gap-2 p-2 rounded cursor-pointer transition-colors text-sm",
                        isSelected 
                          ? "bg-primary/10 font-medium border border-primary" 
                          : "hover:bg-accent"
                      )}
                    >
                      <div className={cn(
                        "h-2 w-2 rounded-full shrink-0",
                        STATUS_COLORS[unit.status]
                      )} />
                      <span className="flex-1 truncate">{ownerName}</span>
                      <span className="text-xs text-muted-foreground shrink-0">{unit.number}</span>
                    </div>
                  )
                })}
              </div>
              
              {/* Informations du propriétaire/locataire sélectionné */}
              {selectedUnitId ? (() => {
                const selectedUnit = property.units?.find(u => u.id === selectedUnitId)
                if (!selectedUnit) return null
                
                const displayOwner = {
                  name: selectedUnit.tenantName || 'Non renseigné',
                  phone: selectedUnit.tenantPhone || 'Non renseigné',
                  email: selectedUnit.tenantEmail || undefined,
                }
                
                return (
                  <div className="pt-4 border-t space-y-3">
                    <div className="flex items-start gap-3">
                      <IconUser className="mt-0.5 h-5 w-5 text-muted-foreground shrink-0" />
                      <div>
                        <div className="font-medium">{displayOwner.name}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          Logement {selectedUnit.number}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <IconPhone className="mt-0.5 h-5 w-5 text-muted-foreground shrink-0" />
                      <div>
                        <div className="text-sm">{displayOwner.phone}</div>
                      </div>
                    </div>
                    {displayOwner.email && (
                      <div className="flex items-start gap-3">
                        <IconMail className="mt-0.5 h-5 w-5 text-muted-foreground shrink-0" />
                        <div>
                          <div className="text-sm">{displayOwner.email}</div>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })() : (
                <div className="pt-4 border-t text-sm text-muted-foreground text-center py-4">
                  Cliquez sur un logement pour voir les informations du propriétaire/locataire
                </div>
              )}
            </>
          ) : (
            /* Affichage normal pour propriétés individuelles */
            <>
              <div className="flex items-start gap-3">
                <IconUser className="mt-0.5 h-5 w-5 text-muted-foreground shrink-0" />
                <div>
                  <div className="font-medium">{property.owner.name}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <IconPhone className="mt-0.5 h-5 w-5 text-muted-foreground shrink-0" />
                <div>
                  <div className="text-sm">{property.owner.phone}</div>
                </div>
              </div>

              {property.owner.email && (
                <div className="flex items-start gap-3">
                  <IconMail className="mt-0.5 h-5 w-5 text-muted-foreground shrink-0" />
                  <div>
                    <div className="text-sm">{property.owner.email}</div>
                  </div>
                </div>
              )}
            </>
          )}

          <div className="pt-2 text-xs text-muted-foreground">
            Créé le {formatDate(property.createdAt)}
            <br />
            Modifié le {formatDate(property.updatedAt)}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


