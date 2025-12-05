"use client"

import { useState, useMemo } from "react"
import { IconSearch, IconMapPin, IconHome, IconBuilding, IconCheck, IconInfoCircle } from "@tabler/icons-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { mockProperties } from "@/lib/mock-data/properties"
import type { Property, Unit } from "@/lib/types/property"

interface StepPropertySelectionProps {
  selectedProperty: Property | null
  selectedUnit: Unit | null
  onSelectProperty: (property: Property, unit: Unit | null) => void
}

export function StepPropertySelection({
  selectedProperty,
  selectedUnit,
  onSelectProperty,
}: StepPropertySelectionProps) {
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("available")

  // Filter for available properties/units
  const availableProperties = useMemo(() => {
    return mockProperties
      .map((property) => {
        if (property.type === "Immeuble" && property.units) {
          // For buildings, show only available units
          const availableUnits = property.units.filter(
            (unit) => unit.status === "Libre"
          )
          if (availableUnits.length > 0) {
            return { ...property, availableUnits }
          }
          return null
        } else {
          // For houses/villas, show if status is "Libre"
          if (property.status === "Libre") {
            return { ...property, availableUnits: [] }
          }
          return null
        }
      })
      .filter((p): p is Property & { availableUnits: Unit[] } => p !== null)
  }, [])

  const filteredProperties = useMemo(() => {
    let filtered = availableProperties

    if (search) {
      const query = search.toLowerCase()
      filtered = filtered.filter(
        (property) =>
          property.name.toLowerCase().includes(query) ||
          property.address.street.toLowerCase().includes(query) ||
          property.address.city.toLowerCase().includes(query)
      )
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter((property) => property.type === typeFilter)
    }

    return filtered
  }, [availableProperties, search, typeFilter])

  const handleSelectProperty = (property: Property, unit: Unit | null = null) => {
    onSelectProperty(property, unit)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      {/* Left: Property Browser */}
      <div className="lg:col-span-2 space-y-4">
        {/* Search and Filters */}
        <div className="space-y-3">
          <div className="relative">
            <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Rechercher une propriété..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-11 rounded-xl"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="h-9 rounded-lg border border-border/50 bg-background px-3 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none"
            >
              <option value="all">Tous les types</option>
              <option value="Maison">Maison</option>
              <option value="Villa">Villa</option>
              <option value="Immeuble">Immeuble</option>
              <option value="Commercial">Commercial</option>
            </select>

            <Badge
              variant="outline"
              className={cn(
                "cursor-pointer",
                statusFilter === "available" && "border-orange-500 bg-orange-50"
              )}
              onClick={() => setStatusFilter("available")}
            >
              Disponibles uniquement
            </Badge>
          </div>
        </div>

        {/* Property Grid */}
        <div className="space-y-3 max-h-[500px] overflow-y-auto">
          {filteredProperties.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <IconHome className="size-12 mx-auto mb-3 opacity-50" />
              <p>Aucune propriété disponible trouvée</p>
            </div>
          ) : (
            filteredProperties.map((property) => {
              const isSelected =
                selectedProperty?.id === property.id &&
                (!selectedUnit || selectedUnit.id === selectedUnit?.id)

              return (
                <div key={property.id} className="space-y-2">
                  <button
                    onClick={() => {
                      if (property.type === "Immeuble" && property.availableUnits.length > 0) {
                        // Don't auto-select, let user choose unit
                        return
                      } else {
                        handleSelectProperty(property, null)
                      }
                    }}
                    className={cn(
                      "w-full text-left p-4 rounded-xl border-2 transition-all duration-200",
                      "hover:border-orange-300 hover:shadow-md",
                      isSelected && !selectedUnit
                        ? "border-orange-500 bg-orange-50 dark:bg-orange-950/20"
                        : "border-border bg-card"
                    )}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={cn(
                          "flex size-12 items-center justify-center rounded-lg shrink-0",
                          property.type === "Immeuble"
                            ? "bg-blue-100 dark:bg-blue-500/20"
                            : "bg-orange-100 dark:bg-orange-500/20"
                        )}
                      >
                        {property.type === "Immeuble" ? (
                          <IconBuilding className="size-6 text-blue-600 dark:text-blue-400" />
                        ) : (
                          <IconHome className="size-6 text-orange-600 dark:text-orange-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-sm">{property.name}</h3>
                          <Badge variant="outline" className="text-xs">
                            {property.type}
                          </Badge>
                          {isSelected && !selectedUnit && (
                            <IconCheck className="size-4 text-orange-500" />
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <IconMapPin className="size-3" />
                          <span className="truncate">
                            {property.address.street}, {property.address.city}
                          </span>
                        </div>
                        {property.type !== "Immeuble" && (
                          <div className="mt-2 text-xs text-muted-foreground">
                            Statut: <span className="font-medium text-emerald-600">Libre</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </button>

                  {/* Show available units for buildings */}
                  {property.type === "Immeuble" &&
                    property.availableUnits.length > 0 && (
                      <div className="ml-16 space-y-2">
                        <p className="text-xs font-medium text-muted-foreground mb-2">
                          Unités disponibles ({property.availableUnits.length})
                        </p>
                        {property.availableUnits.map((unit) => {
                          const isUnitSelected =
                            selectedProperty?.id === property.id &&
                            selectedUnit?.id === unit.id

                          return (
                            <button
                              key={unit.id}
                              onClick={() => handleSelectProperty(property, unit)}
                              className={cn(
                                "w-full text-left p-3 rounded-lg border-2 transition-all duration-200",
                                "hover:border-orange-300 hover:shadow-sm",
                                isUnitSelected
                                  ? "border-orange-500 bg-orange-50 dark:bg-orange-950/20"
                                  : "border-border bg-card"
                              )}
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-semibold text-sm">
                                      {unit.number}
                                    </span>
                                    {isUnitSelected && (
                                      <IconCheck className="size-4 text-orange-500" />
                                    )}
                                  </div>
                                  <div className="text-xs text-muted-foreground mt-0.5">
                                    {unit.rooms} pièces • {unit.size} m² •{" "}
                                    {unit.rent.toLocaleString("fr-FR")} FCFA/mois
                                  </div>
                                </div>
                              </div>
                            </button>
                          )
                        })}
                      </div>
                    )}
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* Right: Selected Property Info */}
      <div className="lg:col-span-1">
        {selectedProperty ? (
          <div className="sticky top-0 p-6 rounded-xl border border-orange-200 dark:border-orange-800/50 bg-orange-50/50 dark:bg-orange-950/10 space-y-4">
            <div>
              <h3 className="font-semibold text-lg">Propriété Sélectionnée</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Vérifiez les détails avant de continuer
              </p>
            </div>

            <div className="p-4 rounded-lg bg-card border border-border/50 space-y-3">
              <div>
                <h4 className="font-semibold text-sm">{selectedProperty.name}</h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {selectedProperty.type}
                </p>
              </div>

              <div className="flex items-start gap-2 text-xs text-muted-foreground">
                <IconMapPin className="size-3.5 shrink-0 mt-0.5" />
                <div>
                  <p>{selectedProperty.address.street}</p>
                  <p>
                    {selectedProperty.address.city}, {selectedProperty.address.country}
                  </p>
                </div>
              </div>

              {selectedUnit && (
                <div className="pt-3 border-t border-border/50">
                  <p className="text-xs font-medium text-muted-foreground mb-2">
                    Unité sélectionnée
                  </p>
                  <div className="p-2 rounded-lg bg-muted">
                    <p className="font-semibold text-sm">{selectedUnit.number}</p>
                    <p className="text-xs text-muted-foreground">
                      {selectedUnit.rooms} pièces • {selectedUnit.size} m²
                    </p>
                    <p className="text-sm font-semibold text-orange-600 mt-1">
                      {selectedUnit.rent.toLocaleString("fr-FR")} FCFA/mois
                    </p>
                  </div>
                </div>
              )}

              {!selectedUnit && selectedProperty.type !== "Immeuble" && (
                <div className="pt-3 border-t border-border/50">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <IconInfoCircle className="size-3.5" />
                    <span>Propriété complète sélectionnée</span>
                  </div>
                </div>
              )}
            </div>

            <Button
              variant="outline"
              onClick={() => onSelectProperty(null as any, null)}
              className="w-full"
            >
              Changer de propriété
            </Button>
          </div>
        ) : (
          <div className="sticky top-0 p-6 rounded-xl border border-dashed border-border/50 bg-muted/30 text-center">
            <IconHome className="size-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">
              Sélectionnez une propriété disponible
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

