"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { tenantFormSchema, type TenantFormData } from "@/lib/schemas/tenant"
import { TENANT_STATUSES } from "@/lib/constants/tenant"
import { mockProperties } from "@/lib/mock-data/properties"
import type { Tenant } from "@/lib/types/tenant"
import { toast } from "sonner"

interface TenantFormProps {
  tenant?: Tenant
  onSubmit: (data: TenantFormData) => void
}

export function TenantForm({ tenant, onSubmit }: TenantFormProps) {
  const [formData, setFormData] = useState<Partial<TenantFormData>>({
    firstName: tenant?.firstName || '',
    lastName: tenant?.lastName || '',
    email: tenant?.email || '',
    phone: tenant?.phone || '',
    alternatePhone: tenant?.alternatePhone || '',
    idNumber: tenant?.idNumber || '',
    idType: tenant?.idType,
    address: {
      street: tenant?.address.street || '',
      city: tenant?.address.city || '',
      postalCode: tenant?.address.postalCode || '',
      country: tenant?.address.country || 'Côte d\'Ivoire',
    },
    employer: tenant?.employer || '',
    occupation: tenant?.occupation || '',
    emergencyContact: tenant?.emergencyContact ? {
      name: tenant.emergencyContact.name,
      phone: tenant.emergencyContact.phone,
      relationship: tenant.emergencyContact.relationship,
    } : undefined,
    status: tenant?.status || 'En Attente',
    moveInDate: tenant?.moveInDate || '',
    moveOutDate: tenant?.moveOutDate || '',
    currentPropertyId: tenant?.currentPropertyId || '',
    currentUnitId: tenant?.currentUnitId || '',
    currentRent: tenant?.currentRent,
    notes: tenant?.notes || '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (tenant) {
      setFormData({
        firstName: tenant.firstName,
        lastName: tenant.lastName,
        email: tenant.email,
        phone: tenant.phone,
        alternatePhone: tenant.alternatePhone,
        idNumber: tenant.idNumber,
        idType: tenant.idType,
        address: tenant.address,
        employer: tenant.employer,
        occupation: tenant.occupation,
        emergencyContact: tenant.emergencyContact,
        status: tenant.status,
        moveInDate: tenant.moveInDate,
        moveOutDate: tenant.moveOutDate,
        currentPropertyId: tenant.currentPropertyId,
        currentUnitId: tenant.currentUnitId,
        currentRent: tenant.currentRent,
        notes: tenant.notes,
      })
    }
    setErrors({})
  }, [tenant])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const validatedData = tenantFormSchema.parse(formData)
      onSubmit(validatedData)
    } catch (error: any) {
      if (error.errors) {
        const newErrors: Record<string, string> = {}
        error.errors.forEach((err: any) => {
          const path = err.path.join('.')
          newErrors[path] = err.message
        })
        setErrors(newErrors)
        toast.error("Veuillez corriger les erreurs dans le formulaire")
      }
    }
  }

  const handleChange = (field: string, value: unknown) => {
    setFormData((prev) => {
      const fieldPath = field.split('.')
      if (fieldPath.length === 1) {
        return { ...prev, [field]: value }
      }
      if (fieldPath.length === 2) {
        return {
          ...prev,
          [fieldPath[0]]: {
            ...(prev[fieldPath[0] as keyof typeof prev] as any),
            [fieldPath[1]]: value,
          },
        }
      }
      return prev
    })
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  // Get available properties and units
  const selectedProperty = mockProperties.find(p => p.id === formData.currentPropertyId)
  const availableUnits = selectedProperty?.units || []

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Informations personnelles</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">Prénom *</Label>
              <Input
                id="firstName"
                value={formData.firstName || ''}
                onChange={(e) => handleChange('firstName', e.target.value)}
                className={errors.firstName ? 'border-destructive' : ''}
              />
              {errors.firstName && (
                <p className="text-sm text-destructive">{errors.firstName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Nom *</Label>
              <Input
                id="lastName"
                value={formData.lastName || ''}
                onChange={(e) => handleChange('lastName', e.target.value)}
                className={errors.lastName ? 'border-destructive' : ''}
              />
              {errors.lastName && (
                <p className="text-sm text-destructive">{errors.lastName}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email || ''}
                onChange={(e) => handleChange('email', e.target.value)}
                className={errors.email ? 'border-destructive' : ''}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone *</Label>
              <Input
                id="phone"
                value={formData.phone || ''}
                onChange={(e) => handleChange('phone', e.target.value)}
                className={errors.phone ? 'border-destructive' : ''}
              />
              {errors.phone && (
                <p className="text-sm text-destructive">{errors.phone}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="alternatePhone">Téléphone alternatif</Label>
            <Input
              id="alternatePhone"
              value={formData.alternatePhone || ''}
              onChange={(e) => handleChange('alternatePhone', e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Adresse</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="address.street">Rue *</Label>
            <Input
              id="address.street"
              value={formData.address?.street || ''}
              onChange={(e) => handleChange('address.street', e.target.value)}
              className={errors['address.street'] ? 'border-destructive' : ''}
            />
            {errors['address.street'] && (
              <p className="text-sm text-destructive">{errors['address.street']}</p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="address.city">Ville *</Label>
              <Input
                id="address.city"
                value={formData.address?.city || ''}
                onChange={(e) => handleChange('address.city', e.target.value)}
                className={errors['address.city'] ? 'border-destructive' : ''}
              />
              {errors['address.city'] && (
                <p className="text-sm text-destructive">{errors['address.city']}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="address.postalCode">Code postal</Label>
              <Input
                id="address.postalCode"
                value={formData.address?.postalCode || ''}
                onChange={(e) => handleChange('address.postalCode', e.target.value)}
                className={errors['address.postalCode'] ? 'border-destructive' : ''}
              />
              {errors['address.postalCode'] && (
                <p className="text-sm text-destructive">{errors['address.postalCode']}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address.country">Pays *</Label>
            <Input
              id="address.country"
              value={formData.address?.country || ''}
              onChange={(e) => handleChange('address.country', e.target.value)}
              className={errors['address.country'] ? 'border-destructive' : ''}
            />
            {errors['address.country'] && (
              <p className="text-sm text-destructive">{errors['address.country']}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Affectation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="status">Statut *</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleChange('status', value)}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Sélectionner un statut" />
                </SelectTrigger>
                <SelectContent>
                  {TENANT_STATUSES.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.status && (
                <p className="text-sm text-destructive">{errors.status}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="moveInDate">Date d'entrée</Label>
              <Input
                id="moveInDate"
                type="date"
                value={formData.moveInDate || ''}
                onChange={(e) => handleChange('moveInDate', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="currentPropertyId">Propriété</Label>
              <Select
                value={formData.currentPropertyId || undefined}
                onValueChange={(value) => {
                  handleChange('currentPropertyId', value === 'none' ? undefined : value)
                  handleChange('currentUnitId', undefined) // Reset unit when property changes
                }}
              >
                <SelectTrigger id="currentPropertyId">
                  <SelectValue placeholder="Sélectionner une propriété" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Aucune</SelectItem>
                  {mockProperties.map((property) => (
                    <SelectItem key={property.id} value={property.id}>
                      {property.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="currentUnitId">Logement</Label>
              <Select
                value={formData.currentUnitId || undefined}
                onValueChange={(value) => handleChange('currentUnitId', value === 'none' ? undefined : value)}
                disabled={!formData.currentPropertyId}
              >
                <SelectTrigger id="currentUnitId">
                  <SelectValue placeholder="Sélectionner un logement" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Aucun</SelectItem>
                  {availableUnits.map((unit) => (
                    <SelectItem key={unit.id} value={unit.id}>
                      {unit.number} - {unit.rooms} pièces
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {formData.currentUnitId && (
            <div className="space-y-2">
              <Label htmlFor="currentRent">Loyer mensuel (FCFA)</Label>
              <Input
                id="currentRent"
                type="number"
                value={formData.currentRent || ''}
                onChange={(e) => handleChange('currentRent', e.target.value ? Number(e.target.value) : undefined)}
              />
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Informations supplémentaires</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="employer">Employeur</Label>
              <Input
                id="employer"
                value={formData.employer || ''}
                onChange={(e) => handleChange('employer', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="occupation">Profession</Label>
              <Input
                id="occupation"
                value={formData.occupation || ''}
                onChange={(e) => handleChange('occupation', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes || ''}
              onChange={(e) => handleChange('notes', e.target.value)}
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button type="submit">
          {tenant ? 'Mettre à jour' : 'Créer le locataire'}
        </Button>
      </div>
    </form>
  )
}

