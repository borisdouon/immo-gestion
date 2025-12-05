"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { 
  IconArrowLeft, 
  IconArrowRight, 
  IconCheck, 
  IconBuilding,
  IconLoader2
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { StepProgress } from "@/components/ui/step-progress"
import {
  StepPropertyType,
  StepBasicInfo,
  StepAddress,
  StepOwner,
  StepDetails,
  StepSummary,
} from "@/components/property/wizard"
import { cn } from "@/lib/utils"
import type { PropertyType, PropertyStatus } from "@/lib/types/property"
import { toast } from "sonner"

const BASE_STEPS = [
  { id: 1, title: "Type" },
  { id: 2, title: "Infos" },
  { id: 3, title: "Adresse" },
  { id: 4, title: "Propriétaire" },
  { id: 5, title: "Détails" },
  { id: 6, title: "Récap" },
]

const STEPS_WITH_UNITS = [
  { id: 1, title: "Type" },
  { id: 2, title: "Infos" },
  { id: 3, title: "Adresse" },
  { id: 4, title: "Propriétaire" },
  { id: 5, title: "Détails" },
  { id: 6, title: "Logements" },
  { id: 7, title: "Récap" },
]

interface FormData {
  type: PropertyType
  name: string
  status: PropertyStatus
  address: {
    street: string
    city: string
    postalCode: string
    country: string
  }
  owner: {
    name: string
    email: string
    phone: string
  }
  description: string
  units: any[]
}

export default function NewPropertyPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [formData, setFormData] = useState<FormData>({
    type: 'Maison',
    name: '',
    status: 'Libre',
    address: {
      street: '',
      city: '',
      postalCode: '',
      country: "Côte d'Ivoire",
    },
    owner: {
      name: '',
      email: '',
      phone: '',
    },
    description: '',
    units: [],
  })
  
  const steps = formData.type === 'Immeuble' ? STEPS_WITH_UNITS : BASE_STEPS
  const totalSteps = steps.length
  const isLastStep = currentStep === totalSteps
  
  // Validation per step
  const canGoNext = useMemo(() => {
    switch (currentStep) {
      case 1: // Type
        return true // Type is always selected
      case 2: // Basic Info
        return formData.name.length >= 3
      case 3: // Address
        return formData.address.street.length >= 5 && formData.address.city.length > 0
      case 4: // Owner
        return formData.owner.name.length >= 2 && formData.owner.phone.length >= 8
      case 5: // Details
        return true // Description is optional
      case 6: // Units (if Immeuble) or Summary
        return true
      case 7: // Summary (if Immeuble)
        return true
      default:
        return false
    }
  }, [currentStep, formData])
  
  const getStepTitle = (step: number) => {
    const titles: Record<number, string> = {
      1: "Quel type de bien ?",
      2: "Informations générales",
      3: "Localisation du bien",
      4: "Informations du propriétaire",
      5: "Description et photos",
      6: formData.type === 'Immeuble' ? "Configuration des logements" : "Récapitulatif",
      7: "Récapitulatif",
    }
    return titles[step] || ""
  }
  
  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1)
    }
  }
  
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
    }
  }
  
  const handleGoToStep = (step: number) => {
    setCurrentStep(step)
  }
  
  const handleSubmit = async () => {
    setIsSubmitting(true)
    
    try {
      // TODO: Send to backend
      await new Promise(resolve => setTimeout(resolve, 1500)) // Simulate API call
      
      const mockId = `prop-${Date.now()}`
      toast.success('Propriété créée avec succès ! 🎉')
      router.push(`/property/${mockId}`)
    } catch (error) {
      toast.error('Une erreur est survenue')
      setIsSubmitting(false)
    }
  }
  
  // Update form data helpers
  const updateType = (type: PropertyType) => {
    setFormData(prev => ({ ...prev, type }))
  }
  
  const updateBasicInfo = (field: 'name' | 'status', value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }
  
  const updateAddress = (field: keyof FormData['address'], value: string) => {
    setFormData(prev => ({
      ...prev,
      address: { ...prev.address, [field]: value }
    }))
  }
  
  const updateOwner = (field: keyof FormData['owner'], value: string) => {
    setFormData(prev => ({
      ...prev,
      owner: { ...prev.owner, [field]: value }
    }))
  }
  
  const updateDescription = (description: string) => {
    setFormData(prev => ({ ...prev, description }))
  }
  
  // Determine which step content to show
  const getSummaryStep = () => formData.type === 'Immeuble' ? 7 : 6
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30">
      {/* Container */}
      <div className="mx-auto max-w-3xl px-4 py-6 md:py-10">
        
        {/* Back link */}
        <Link 
          href="/property"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-orange-600 transition-colors mb-6"
        >
          <IconArrowLeft className="size-4" />
          Retour aux propriétés
        </Link>
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/25 mb-4">
            <IconBuilding className="size-8" />
          </div>
          <h1 className="text-2xl font-bold md:text-3xl">Nouvelle Propriété</h1>
          <p className="mt-2 text-muted-foreground">
            Créez votre bien en {totalSteps} étapes simples
          </p>
        </div>
        
        {/* Progress */}
        <StepProgress 
          steps={steps} 
          currentStep={currentStep} 
          className="mb-8"
        />
        
        {/* Step Content Card */}
        <div className="rounded-3xl border border-border/50 bg-card p-6 md:p-8 shadow-xl shadow-black/5">
          {/* Step title */}
          <div className="mb-6">
            <span className="inline-flex items-center rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-orange-600 dark:bg-orange-950/30 dark:text-orange-400">
              Étape {currentStep} sur {totalSteps}
            </span>
            <h2 className="mt-3 text-xl font-semibold">
              {getStepTitle(currentStep)}
            </h2>
          </div>
          
          {/* Dynamic step content */}
          <div className="min-h-[320px]">
            {currentStep === 1 && (
              <StepPropertyType 
                value={formData.type} 
                onChange={updateType} 
              />
            )}
            
            {currentStep === 2 && (
              <StepBasicInfo
                name={formData.name}
                status={formData.status}
                onNameChange={(name) => updateBasicInfo('name', name)}
                onStatusChange={(status) => updateBasicInfo('status', status)}
              />
            )}
            
            {currentStep === 3 && (
              <StepAddress
                address={formData.address}
                onChange={updateAddress}
              />
            )}
            
            {currentStep === 4 && (
              <StepOwner
                owner={formData.owner}
                onChange={updateOwner}
              />
            )}
            
            {currentStep === 5 && (
              <StepDetails
                description={formData.description}
                onDescriptionChange={updateDescription}
              />
            )}
            
            {/* Units step for Immeuble */}
            {currentStep === 6 && formData.type === 'Immeuble' && (
              <div className="space-y-6">
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950/20">
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    🏗️ <strong>Configuration des logements</strong> — Cette fonctionnalité sera disponible après la création de la propriété. Vous pourrez ajouter et configurer les logements individuels depuis la page de détails.
                  </p>
                </div>
                <div className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <div className="flex size-16 items-center justify-center rounded-2xl bg-muted mx-auto mb-4">
                      <IconBuilding className="size-8 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground">
                      Vous pourrez ajouter les logements après la création
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Summary step */}
            {currentStep === getSummaryStep() && (
              <StepSummary
                data={{
                  ...formData,
                  unitsCount: formData.units.length
                }}
                onEdit={handleGoToStep}
              />
            )}
          </div>
        </div>
        
        {/* Navigation */}
        <div className="mt-6 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={currentStep === 1}
            className={cn(
              "gap-2 transition-opacity",
              currentStep === 1 && "opacity-0 pointer-events-none"
            )}
          >
            <IconArrowLeft className="size-4" />
            Précédent
          </Button>
          
          {isLastStep ? (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="gap-2 h-11 px-6 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-lg shadow-orange-500/25 transition-all hover:shadow-xl hover:scale-[1.02]"
            >
              {isSubmitting ? (
                <>
                  <IconLoader2 className="size-4 animate-spin" />
                  Création en cours...
                </>
              ) : (
                <>
                  <IconCheck className="size-4" />
                  Créer la propriété
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              disabled={!canGoNext}
              className={cn(
                "gap-2 h-11 px-6 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-lg shadow-orange-500/25 transition-all hover:shadow-xl",
                !canGoNext && "opacity-50 cursor-not-allowed"
              )}
            >
              Suivant
              <IconArrowRight className="size-4" />
            </Button>
          )}
        </div>
        
        {/* Step indicator for mobile */}
        <div className="mt-6 text-center sm:hidden">
          <p className="text-sm text-muted-foreground">
            Étape {currentStep} sur {totalSteps}
          </p>
        </div>
      </div>
    </div>
  )
}
