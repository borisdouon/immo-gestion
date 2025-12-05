"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { STATUS_COLORS, STATUS_BADGE_VARIANTS } from "@/lib/constants/property"
import { formatCurrency } from "@/lib/utils/format"
import type { Unit } from "@/lib/types/property"
import { IconHome, IconGripVertical } from "@tabler/icons-react"

interface UnitCardProps {
  unit: Unit
  onUnitClick?: (unit: Unit) => void
}

function UnitCard({ unit, onUnitClick }: UnitCardProps) {
  const handleClick = () => {
    if (onUnitClick) {
      onUnitClick(unit)
    } else {
      // Default behavior: log unit info (can be extended later)
      console.log('Voir logement:', unit)
    }
  }

  return (
    <Button
      variant="outline"
      className="group h-auto flex-col items-start p-4 hover:bg-accent cursor-pointer"
      onClick={handleClick}
    >
      <div className="flex w-full items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <IconHome className="h-4 w-4" />
          <span className="font-semibold">{unit.number}</span>
        </div>
        <div
          className={`h-3 w-3 rounded-full ${STATUS_COLORS[unit.status]}`}
          title={unit.status}
        />
      </div>
      <div className="w-full text-left text-xs text-muted-foreground space-y-1">
        <div>{unit.rooms} chambre(s) • {unit.size}m²</div>
        <div className="font-medium text-foreground">
          {formatCurrency(unit.rent)}/mois
        </div>
        {unit.tenantName && (
          <div className="mt-1 text-xs">{unit.tenantName}</div>
        )}
      </div>
      <Badge
        variant={STATUS_BADGE_VARIANTS[unit.status]}
        className="mt-2 w-full justify-center"
      >
        {unit.status}
      </Badge>
    </Button>
  )
}

interface UnitGridProps {
  units: Unit[]
  onUnitClick?: (unit: Unit) => void
}

export function UnitGrid({ units, onUnitClick }: UnitGridProps) {
  // Group units by floor
  const unitsByFloor = units.reduce((acc, unit) => {
    const floor = unit.floor || 0
    if (!acc[floor]) {
      acc[floor] = []
    }
    acc[floor].push(unit)
    return acc
  }, {} as Record<number, Unit[]>)

  const floors = Object.keys(unitsByFloor)
    .map(Number)
    .sort((a, b) => b - a) // Highest floor first

  const totalUnits = units.length
  const occupiedUnits = units.filter(u => u.status === 'Occupé').length
  const freeUnits = units.filter(u => u.status === 'Libre').length

  return (
    <Card>
      <CardHeader>
        <CardTitle>Plan d'Occupation</CardTitle>
        <CardDescription>
          {totalUnits} logement(s) • {occupiedUnits} occupé(s) • {freeUnits} libre(s)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {floors.map((floor) => (
            <div key={floor}>
              <div className="mb-3 flex items-center gap-2">
                <h3 className="text-sm font-semibold">
                  {floor === 0 ? "Rez-de-chaussée" : `Étage ${floor}`}
                </h3>
                <Badge variant="outline" className="text-xs">
                  {unitsByFloor[floor].length} logement(s)
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
                {unitsByFloor[floor].map((unit) => (
                  <UnitCard key={unit.id} unit={unit} onUnitClick={onUnitClick} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-6 flex flex-wrap gap-4 rounded-lg border p-4">
          <div className="text-sm font-medium">Légende :</div>
          {Object.entries(STATUS_COLORS).map(([status, color]) => (
            <div key={status} className="flex items-center gap-2">
              <div className={`h-3 w-3 rounded-full ${color}`} />
              <span className="text-sm">{status}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}


