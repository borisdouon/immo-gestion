"use client"

import { OCCUPANCY_BADGES } from "@/lib/constants/property"

export function OccupancyLegend() {
  return (
    <div className="flex flex-wrap items-center gap-4 rounded-lg border p-3 bg-muted/50">
      <div className="text-sm font-medium">Légende d'occupation :</div>
      {Object.values(OCCUPANCY_BADGES).map((badge) => (
        <div key={badge.text} className="flex items-center gap-2">
          <div className={`h-3 w-3 rounded-full ${badge.color}`} />
          <span className="text-sm">{badge.text}</span>
        </div>
      ))}
    </div>
  )
}

