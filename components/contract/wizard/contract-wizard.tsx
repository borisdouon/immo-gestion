"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { StepTenantSelection } from "./step-tenant-selection"
import { StepPropertySelection } from "./step-property-selection"
import { StepContractTerms } from "./step-contract-terms"
import { StepReview } from "./step-review"
import { Button } from "@/components/ui/button"
import { IconChevronLeft, IconChevronRight, IconX, IconCheck } from "@tabler/icons-react"
import { cn } from "@/lib/utils"
import type { Tenant } from "@/lib/types/tenant"
import type { Property, Unit } from "@/lib/types/property"
import type { Contract } from "@/lib/types/contract"

type WizardStep = 1 | 2 | 3 | 4

interface ContractWizardData {
  tenant: Tenant | null
  property: Property | null
  unit: Unit | null
  contractTerms: Partial<Contract> | null
}

export function ContractWizard() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<WizardStep>(1)
  const [wizardData, setWizardData] = useState<ContractWizardData>({
    tenant: null,
    property: null,
    unit: null,
    contractTerms: null,
  })

  const updateWizardData = useCallback((updates: Partial<ContractWizardData>) => {
    setWizardData(prev => ({ ...prev, ...updates }))
  }, [])

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return wizardData.tenant !== null
      case 2:
        return wizardData.property !== null
      case 3:
        return wizardData.contractTerms !== null && 
               wizardData.contractTerms.startDate && 
               wizardData.contractTerms.endDate &&
               wizardData.contractTerms.monthlyRent
      case 4:
        return true
      default:
        return false
    }
  }

  const handleNext = () => {
    if (canProceed() && currentStep < 4) {
      setCurrentStep((prev) => (prev + 1) as WizardStep)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as WizardStep)
    }
  }

  const handleCancel = () => {
    router.push("/contract")
  }

  const steps = [
    { number: 1, title: "Locataire", description: "Sélectionner ou créer un locataire" },
    { number: 2, title: "Propriété", description: "Choisir une propriété disponible" },
    { number: 3, title: "Conditions", description: "Définir les termes du contrat" },
    { number: 4, title: "Révision", description: "Vérifier et créer le contrat" },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="relative w-full max-w-6xl h-[90vh] mx-4 bg-card rounded-2xl border border-border/50 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border/50">
          <div>
            <h2 className="text-2xl font-bold">Nouveau Contrat</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Créez un nouveau contrat de location en quelques étapes
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCancel}
            className="rounded-full"
          >
            <IconX className="size-5" />
          </Button>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 border-b border-border/50 bg-muted/30">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div className="flex items-center w-full">
                    <div
                      className={cn(
                        "flex size-10 items-center justify-center rounded-full border-2 font-semibold transition-all",
                        currentStep === step.number
                          ? "border-orange-500 bg-orange-500 text-white"
                          : currentStep > step.number
                          ? "border-emerald-500 bg-emerald-500 text-white"
                          : "border-border bg-background text-muted-foreground"
                      )}
                    >
                      {currentStep > step.number ? (
                        <IconCheck className="size-5" />
                      ) : (
                        step.number
                      )}
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={cn(
                          "h-0.5 flex-1 mx-2 transition-colors",
                          currentStep > step.number
                            ? "bg-emerald-500"
                            : "bg-border"
                        )}
                      />
                    )}
                  </div>
                  <div className="mt-2 text-center">
                    <p className={cn(
                      "text-xs font-medium",
                      currentStep >= step.number ? "text-foreground" : "text-muted-foreground"
                    )}>
                      {step.title}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {currentStep === 1 && (
            <StepTenantSelection
              selectedTenant={wizardData.tenant}
              onSelectTenant={(tenant) => updateWizardData({ tenant })}
            />
          )}
          {currentStep === 2 && (
            <StepPropertySelection
              selectedProperty={wizardData.property}
              selectedUnit={wizardData.unit}
              onSelectProperty={(property, unit) => updateWizardData({ property, unit })}
            />
          )}
          {currentStep === 3 && (
            <StepContractTerms
              tenant={wizardData.tenant!}
              property={wizardData.property!}
              unit={wizardData.unit}
              contractTerms={wizardData.contractTerms}
              onUpdateTerms={(terms) => updateWizardData({ contractTerms: terms })}
            />
          )}
          {currentStep === 4 && (
            <StepReview
              tenant={wizardData.tenant!}
              property={wizardData.property!}
              unit={wizardData.unit}
              contractTerms={wizardData.contractTerms!}
              onComplete={() => {
                // TODO: Save contract and redirect
                router.push("/contract")
              }}
            />
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between p-6 border-t border-border/50 bg-muted/30">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
            className="gap-2"
          >
            <IconChevronLeft className="size-4" />
            Précédent
          </Button>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              onClick={handleCancel}
            >
              Annuler
            </Button>
            {currentStep < 4 ? (
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                className="gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
              >
                Suivant
                <IconChevronRight className="size-4" />
              </Button>
            ) : (
              <Button
                onClick={() => {
                  // TODO: Handle contract creation
                  router.push("/contract")
                }}
                className="gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
              >
                Créer le contrat
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

