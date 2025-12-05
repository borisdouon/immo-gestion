"use client"

import { memo } from "react"
import Link from "next/link"
import Image from "next/image"
import { IconMapPin, IconHome, IconBuilding, IconArrowUpRight } from "@tabler/icons-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { OCCUPANCY_BADGES } from "@/lib/constants/property"
import type { Property } from "@/lib/types/property"
import { cn } from "@/lib/utils"

interface PropertyCardProps {
  property: Property
}

function PropertyCardComponent({ property }: PropertyCardProps) {
  const occupancyRate = property.totalUnits && property.totalUnits > 0
    ? Math.max(0, Math.min(100, Math.round((property.occupiedUnits || 0) / property.totalUnits * 100)))
    : 0

  const getOccupancyBadge = () => {
    if (occupancyRate === 100) return OCCUPANCY_BADGES.full
    if (occupancyRate > 80) return OCCUPANCY_BADGES.almostFull
    if (occupancyRate >= 40) return OCCUPANCY_BADGES.moderate
    if (occupancyRate < 40 && property.totalUnits && property.totalUnits > 0) return OCCUPANCY_BADGES.lowOccupancy
    return null
  }

  const getStatusBadge = () => {
    if (property.type !== 'Immeuble') {
      const statusColors: Record<string, string> = {
        'Libre': 'bg-emerald-500 text-white shadow-emerald-500/30',
        'Occupé': 'bg-blue-500 text-white shadow-blue-500/30',
        'Réservé': 'bg-amber-500 text-white shadow-amber-500/30',
        'En Maintenance': 'bg-orange-500 text-white shadow-orange-500/30',
      }
      return { text: property.status, className: statusColors[property.status] || 'bg-gray-500' }
    }
    return null
  }

  const occupancyBadge = getOccupancyBadge()
  const statusBadge = getStatusBadge()
  const imageUrl = property.photos?.[0] || 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800'

  return (
    <Link href={`/property/${property.id}`}>
      <Card className="group relative h-full overflow-hidden rounded-2xl border-border/50 bg-card transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/10 hover:border-orange-200 dark:hover:border-orange-800/50 hover:-translate-y-1">
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-orange-500/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none" />
        
        {/* Image Section */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
          <Image
            src={imageUrl}
            alt={property.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          
          {/* Top badges */}
          <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
            <div className="flex size-9 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
              <IconBuilding className="size-5 text-white" />
            </div>
            
            {occupancyBadge && property.type === 'Immeuble' && property.totalUnits && property.totalUnits > 0 && (
              <Badge className={cn("shadow-lg transition-transform duration-300 group-hover:scale-105", occupancyBadge.className)}>
                {occupancyBadge.text}
              </Badge>
            )}
            {statusBadge && property.type !== 'Immeuble' && (
              <Badge className={cn("shadow-lg transition-transform duration-300 group-hover:scale-105", statusBadge.className)}>
                {statusBadge.text}
              </Badge>
            )}
          </div>
          
          {/* Bottom info overlay */}
          <div className="absolute bottom-3 left-3 right-3">
            <h3 className="text-lg font-bold text-white drop-shadow-lg line-clamp-1 transition-transform duration-300 group-hover:translate-x-1">
              {property.name}
            </h3>
            <div className="flex items-center gap-1.5 text-sm text-white/90 mt-1">
              <IconMapPin className="size-3.5" />
              <span className="line-clamp-1">{property.address.city}</span>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <CardContent className="relative z-20 flex flex-col gap-3 p-4">
          {/* Address */}
          <p className="text-sm text-muted-foreground line-clamp-1">
            {property.address.street}
          </p>

          {/* Units Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <div className="flex size-8 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-500/20 transition-transform duration-300 group-hover:scale-110">
                <IconHome className="size-4 text-orange-600 dark:text-orange-400" />
              </div>
              {property.type === 'Immeuble' && property.totalUnits ? (
                <span className="font-medium">
                  {property.occupiedUnits || 0}/{property.totalUnits} Unités
                </span>
              ) : (
                <span className="text-muted-foreground">{property.type}</span>
              )}
            </div>
            
            {/* View arrow */}
            <div className="flex size-8 items-center justify-center rounded-full bg-orange-100 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1 dark:bg-orange-500/20">
              <IconArrowUpRight className="size-4 text-orange-600 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 dark:text-orange-400" />
            </div>
          </div>

          {/* Occupancy Progress */}
          {property.type === 'Immeuble' && property.totalUnits && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Taux d'occupation</span>
                <span className="font-bold text-orange-600 dark:text-orange-400">{occupancyRate}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-orange-100 dark:bg-orange-500/20">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-500"
                  style={{ width: `${occupancyRate}%` }}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}

export const PropertyCard = memo(PropertyCardComponent)
