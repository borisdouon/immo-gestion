"use client"

import { useState, useEffect } from "react"
import { IconCalendar, IconCurrencyDollar, IconInfoCircle } from "@tabler/icons-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import type { Tenant } from "@/lib/types/tenant"
import type { Property, Unit } from "@/lib/types/property"
import type { Contract, PaymentFrequency } from "@/lib/types/contract"

interface StepContractTermsProps {
  tenant: Tenant
  property: Property
  unit: Unit | null
  contractTerms: Partial<Contract> | null
  onUpdateTerms: (terms: Partial<Contract>) => void
}

export function StepContractTerms({
  tenant,
  property,
  unit,
  contractTerms,
  onUpdateTerms,
}: StepContractTermsProps) {
  const defaultRent = unit?.rent || 0
  const defaultDeposit = defaultRent * 2

  const [terms, setTerms] = useState<Partial<Contract>>({
    startDate: contractTerms?.startDate || "",
    endDate: contractTerms?.endDate || "",
    duration: contractTerms?.duration || 12,
    monthlyRent: contractTerms?.monthlyRent || defaultRent,
    deposit: contractTerms?.deposit || defaultDeposit,
    paymentFrequency: contractTerms?.paymentFrequency || "Mensuel",
    paymentDay: contractTerms?.paymentDay || 1,
    utilitiesIncluded: contractTerms?.utilitiesIncluded ?? false,
    utilitiesAmount: contractTerms?.utilitiesAmount || 0,
    maintenanceFee: contractTerms?.maintenanceFee || 0,
    parkingIncluded: contractTerms?.parkingIncluded ?? false,
    parkingFee: contractTerms?.parkingFee || 0,
  })

  useEffect(() => {
    // Calculate end date based on start date and duration
    if (terms.startDate && terms.duration) {
      const start = new Date(terms.startDate)
      const end = new Date(start)
      end.setMonth(end.getMonth() + terms.duration)
      const endDateStr = end.toISOString().split("T")[0]
      if (endDateStr !== terms.endDate) {
        setTerms((prev) => ({ ...prev, endDate: endDateStr }))
      }
    }
  }, [terms.startDate, terms.duration, terms.endDate])

  // Update parent when terms change (debounced to prevent infinite loops)
  useEffect(() => {
    const timer = setTimeout(() => {
      onUpdateTerms(terms)
    }, 100)
    return () => clearTimeout(timer)
  }, [
    terms.startDate,
    terms.endDate,
    terms.duration,
    terms.monthlyRent,
    terms.deposit,
    terms.paymentFrequency,
    terms.paymentDay,
    terms.utilitiesIncluded,
    terms.utilitiesAmount,
    terms.maintenanceFee,
    terms.parkingIncluded,
    terms.parkingFee,
  ])

  const handleChange = (field: keyof Contract, value: any) => {
    setTerms((prev) => ({ ...prev, [field]: value }))
  }

  const totalMonthly = terms.monthlyRent! +
    (terms.utilitiesIncluded ? 0 : (terms.utilitiesAmount || 0)) +
    (terms.maintenanceFee || 0) +
    (terms.parkingIncluded ? 0 : (terms.parkingFee || 0))

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left: Form */}
      <div className="lg:col-span-2 space-y-6">
        {/* Dates */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <IconCalendar className="size-5 text-orange-600" />
            Période du contrat
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Date de début *</Label>
              <Input
                id="startDate"
                type="date"
                value={terms.startDate}
                onChange={(e) => handleChange("startDate", e.target.value)}
                className="rounded-lg"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Durée (mois) *</Label>
              <Input
                id="duration"
                type="number"
                min="1"
                value={terms.duration}
                onChange={(e) => handleChange("duration", parseInt(e.target.value) || 12)}
                className="rounded-lg"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">Date de fin</Label>
              <Input
                id="endDate"
                type="date"
                value={terms.endDate}
                readOnly
                className="rounded-lg bg-muted"
              />
            </div>
          </div>
        </div>

        {/* Financial Terms */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <IconCurrencyDollar className="size-5 text-orange-600" />
            Conditions financières
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="monthlyRent">Loyer mensuel (FCFA) *</Label>
              <Input
                id="monthlyRent"
                type="number"
                min="0"
                value={terms.monthlyRent}
                onChange={(e) => handleChange("monthlyRent", parseFloat(e.target.value) || 0)}
                className="rounded-lg"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="deposit">Caution (FCFA) *</Label>
              <Input
                id="deposit"
                type="number"
                min="0"
                value={terms.deposit}
                onChange={(e) => handleChange("deposit", parseFloat(e.target.value) || 0)}
                className="rounded-lg"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="paymentFrequency">Fréquence de paiement *</Label>
              <Select
                value={terms.paymentFrequency}
                onValueChange={(value) =>
                  handleChange("paymentFrequency", value as PaymentFrequency)
                }
              >
                <SelectTrigger className="rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Mensuel">Mensuel</SelectItem>
                  <SelectItem value="Trimestriel">Trimestriel</SelectItem>
                  <SelectItem value="Semestriel">Semestriel</SelectItem>
                  <SelectItem value="Annuel">Annuel</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="paymentDay">Jour de paiement (1-31) *</Label>
              <Input
                id="paymentDay"
                type="number"
                min="1"
                max="31"
                value={terms.paymentDay}
                onChange={(e) => handleChange("paymentDay", parseInt(e.target.value) || 1)}
                className="rounded-lg"
                required
              />
            </div>
          </div>
        </div>

        {/* Additional Terms */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Conditions supplémentaires</h3>

          <div className="space-y-4 p-4 rounded-lg border border-border/50 bg-muted/30">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="utilitiesIncluded" className="cursor-pointer">
                  Charges incluses
                </Label>
                <p className="text-xs text-muted-foreground">
                  Les charges sont incluses dans le loyer
                </p>
              </div>
              <Checkbox
                id="utilitiesIncluded"
                checked={terms.utilitiesIncluded}
                onCheckedChange={(checked) =>
                  handleChange("utilitiesIncluded", checked)
                }
              />
            </div>

            {!terms.utilitiesIncluded && (
              <div className="space-y-2">
                <Label htmlFor="utilitiesAmount">Montant des charges (FCFA)</Label>
                <Input
                  id="utilitiesAmount"
                  type="number"
                  min="0"
                  value={terms.utilitiesAmount}
                  onChange={(e) =>
                    handleChange("utilitiesAmount", parseFloat(e.target.value) || 0)
                  }
                  className="rounded-lg"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="maintenanceFee">Frais de maintenance (FCFA)</Label>
              <Input
                id="maintenanceFee"
                type="number"
                min="0"
                value={terms.maintenanceFee}
                onChange={(e) =>
                  handleChange("maintenanceFee", parseFloat(e.target.value) || 0)
                }
                className="rounded-lg"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="parkingIncluded" className="cursor-pointer">
                  Parking inclus
                </Label>
                <p className="text-xs text-muted-foreground">
                  Le parking est inclus dans le loyer
                </p>
              </div>
              <Checkbox
                id="parkingIncluded"
                checked={terms.parkingIncluded}
                onCheckedChange={(checked) => handleChange("parkingIncluded", checked)}
              />
            </div>

            {!terms.parkingIncluded && (
              <div className="space-y-2">
                <Label htmlFor="parkingFee">Frais de parking (FCFA)</Label>
                <Input
                  id="parkingFee"
                  type="number"
                  min="0"
                  value={terms.parkingFee}
                  onChange={(e) =>
                    handleChange("parkingFee", parseFloat(e.target.value) || 0)
                  }
                  className="rounded-lg"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right: Summary */}
      <div className="lg:col-span-1">
        <div className="sticky top-0 p-6 rounded-xl border border-border/50 bg-card space-y-4">
          <div>
            <h3 className="font-semibold text-lg">Résumé</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Aperçu des conditions
            </p>
          </div>

          <div className="space-y-3 p-4 rounded-lg bg-muted/30">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Loyer de base</span>
              <span className="font-medium">
                {terms.monthlyRent?.toLocaleString("fr-FR")} FCFA
              </span>
            </div>

            {!terms.utilitiesIncluded && terms.utilitiesAmount && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Charges</span>
                <span className="font-medium">
                  {terms.utilitiesAmount.toLocaleString("fr-FR")} FCFA
                </span>
              </div>
            )}

            {terms.maintenanceFee && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Maintenance</span>
                <span className="font-medium">
                  {terms.maintenanceFee.toLocaleString("fr-FR")} FCFA
                </span>
              </div>
            )}

            {!terms.parkingIncluded && terms.parkingFee && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Parking</span>
                <span className="font-medium">
                  {terms.parkingFee.toLocaleString("fr-FR")} FCFA
                </span>
              </div>
            )}

            <div className="pt-3 border-t border-border/50">
              <div className="flex justify-between">
                <span className="font-semibold">Total mensuel</span>
                <span className="font-bold text-lg text-orange-600">
                  {totalMonthly.toLocaleString("fr-FR")} FCFA
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-2 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/50">
            <IconInfoCircle className="size-4 text-blue-600 shrink-0 mt-0.5" />
            <p className="text-xs text-blue-700 dark:text-blue-400">
              Les montants peuvent être ajustés avant la finalisation du contrat.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

