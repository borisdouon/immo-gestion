"use client"

import { IconUser, IconHome, IconCalendar, IconCurrencyDollar, IconCheck } from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { Tenant } from "@/lib/types/tenant"
import type { Property, Unit } from "@/lib/types/property"
import type { Contract } from "@/lib/types/contract"

interface StepReviewProps {
  tenant: Tenant
  property: Property
  unit: Unit | null
  contractTerms: Partial<Contract>
  onComplete: () => void
}

function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  } catch {
    return dateString
  }
}

function getInitials(firstName: string, lastName: string): string {
  const first = firstName.charAt(0).toUpperCase()
  const second = lastName.charAt(0).toUpperCase()
  return `${first}${second}`
}

export function StepReview({
  tenant,
  property,
  unit,
  contractTerms,
  onComplete,
}: StepReviewProps) {
  const totalMonthly =
    (contractTerms.monthlyRent || 0) +
    (!contractTerms.utilitiesIncluded ? (contractTerms.utilitiesAmount || 0) : 0) +
    (contractTerms.maintenanceFee || 0) +
    (!contractTerms.parkingIncluded ? (contractTerms.parkingFee || 0) : 0)

  return (
    <div className="space-y-6">
      <div className="text-center py-4">
        <div className="flex size-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-500/20 mx-auto mb-4">
          <IconCheck className="size-8 text-emerald-600 dark:text-emerald-400" />
        </div>
        <h3 className="text-2xl font-bold mb-2">Vérification finale</h3>
        <p className="text-muted-foreground">
          Vérifiez toutes les informations avant de créer le contrat
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tenant Info */}
        <div className="p-6 rounded-xl border border-border/50 bg-card space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex size-10 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-500/20">
              <IconUser className="size-5 text-orange-600 dark:text-orange-400" />
            </div>
            <h4 className="font-semibold text-lg">Locataire</h4>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex size-14 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 text-white font-bold text-lg">
              {getInitials(tenant.firstName, tenant.lastName)}
            </div>
            <div className="flex-1">
              <h5 className="font-semibold">{tenant.fullName}</h5>
              <p className="text-sm text-muted-foreground">{tenant.email}</p>
              <p className="text-sm text-muted-foreground">{tenant.phone}</p>
            </div>
          </div>
        </div>

        {/* Property Info */}
        <div className="p-6 rounded-xl border border-border/50 bg-card space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex size-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-500/20">
              <IconHome className="size-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h4 className="font-semibold text-lg">Propriété</h4>
          </div>

          <div>
            <h5 className="font-semibold mb-1">{property.name}</h5>
            <Badge variant="outline" className="mb-2">
              {property.type}
            </Badge>
            <p className="text-sm text-muted-foreground">
              {property.address.street}, {property.address.city}
            </p>
            {unit && (
              <div className="mt-3 p-3 rounded-lg bg-muted">
                <p className="font-semibold text-sm">Unité: {unit.number}</p>
                <p className="text-xs text-muted-foreground">
                  {unit.rooms} pièces • {unit.size} m²
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Contract Terms */}
      <div className="p-6 rounded-xl border border-border/50 bg-card space-y-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex size-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-500/20">
            <IconCalendar className="size-5 text-purple-600 dark:text-purple-400" />
          </div>
          <h4 className="font-semibold text-lg">Conditions du contrat</h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Période</p>
              <p className="font-medium">
                {contractTerms.startDate && formatDate(contractTerms.startDate)} -{" "}
                {contractTerms.endDate && formatDate(contractTerms.endDate)}
              </p>
              <p className="text-sm text-muted-foreground">
                Durée: {contractTerms.duration} mois
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground mb-1">Paiement</p>
              <p className="font-medium">{contractTerms.paymentFrequency}</p>
              <p className="text-sm text-muted-foreground">
                Jour: {contractTerms.paymentDay} de chaque mois
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Loyer mensuel</p>
              <p className="font-bold text-lg text-orange-600">
                {contractTerms.monthlyRent?.toLocaleString("fr-FR")} FCFA
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground mb-1">Caution</p>
              <p className="font-semibold">
                {contractTerms.deposit?.toLocaleString("fr-FR")} FCFA
              </p>
            </div>
          </div>
        </div>

        {/* Additional Terms */}
        {(contractTerms.utilitiesAmount ||
          contractTerms.maintenanceFee ||
          contractTerms.parkingFee) && (
          <div className="pt-4 border-t border-border/50">
            <p className="text-xs font-medium text-muted-foreground mb-2">
              Frais supplémentaires
            </p>
            <div className="space-y-2">
              {!contractTerms.utilitiesIncluded && contractTerms.utilitiesAmount && (
                <div className="flex justify-between text-sm">
                  <span>Charges</span>
                  <span className="font-medium">
                    {contractTerms.utilitiesAmount.toLocaleString("fr-FR")} FCFA
                  </span>
                </div>
              )}
              {contractTerms.maintenanceFee && (
                <div className="flex justify-between text-sm">
                  <span>Maintenance</span>
                  <span className="font-medium">
                    {contractTerms.maintenanceFee.toLocaleString("fr-FR")} FCFA
                  </span>
                </div>
              )}
              {!contractTerms.parkingIncluded && contractTerms.parkingFee && (
                <div className="flex justify-between text-sm">
                  <span>Parking</span>
                  <span className="font-medium">
                    {contractTerms.parkingFee.toLocaleString("fr-FR")} FCFA
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Total */}
        <div className="pt-4 border-t-2 border-orange-500">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-lg">Total mensuel</span>
            <span className="font-bold text-2xl text-orange-600">
              {totalMonthly.toLocaleString("fr-FR")} FCFA
            </span>
          </div>
        </div>
      </div>

      {/* Action */}
      <div className="flex justify-center pt-4">
        <Button
          onClick={onComplete}
          size="lg"
          className="px-8 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
        >
          Créer le contrat
        </Button>
      </div>
    </div>
  )
}

