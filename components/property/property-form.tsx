"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { IconCheck, IconX, IconPlus } from "@tabler/icons-react"
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { propertyFormSchema, type PropertyFormData, type UnitFormData } from "@/lib/schemas/property"
import { PROPERTY_TYPES, PROPERTY_STATUSES } from "@/lib/constants/property"
import { UnitForm } from "./unit-form"
import type { Property, Unit } from "@/lib/types/property"
import { toast } from "sonner"

interface PropertyFormProps {
  property?: Property
  onSubmit: (data: PropertyFormData) => void
}

export function PropertyForm({ property, onSubmit }: PropertyFormProps) {
  const [formData, setFormData] = useState<Partial<PropertyFormData>>({
    name: property?.name || '',
    type: property?.type || 'Maison',
    status: property?.status || 'Libre',
    address: {
      street: property?.address.street || '',
      city: property?.address.city || '',
      postalCode: property?.address.postalCode || '',
      country: property?.address.country || 'Côte d\'Ivoire',
    },
    owner: {
      name: property?.owner.name || '',
      email: property?.owner.email || '',
      phone: property?.owner.phone || '',
    },
    description: property?.description || '',
    units: property?.units || [],
    photos: [],
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [unitFormOpen, setUnitFormOpen] = useState(false)
  const [editingUnit, setEditingUnit] = useState<Unit | undefined>()

  useEffect(() => {
    if (property) {
      setFormData({
        name: property.name,
        type: property.type,
        status: property.status,
        address: property.address,
        owner: property.owner,
        description: property.description,
        units: property.units || [],
        photos: [],
      })
    }
    setErrors({})
    setTouched({})
  }, [property])

  const validateField = (field: string, value: unknown) => {
    try {
      const fieldPath = field.split('.')
      let schema = propertyFormSchema
      
      for (const path of fieldPath) {
        if (schema.shape && path in schema.shape) {
          schema = schema.shape[path as keyof typeof schema.shape] as any
        }
      }
      
      if (schema) {
        schema.parse(value)
        setErrors((prev) => {
          const newErrors = { ...prev }
          delete newErrors[field]
          return newErrors
        })
      }
    } catch (error: any) {
      if (error.errors?.[0]?.message) {
        setErrors((prev) => ({
          ...prev,
          [field]: error.errors[0].message,
        }))
      }
    }
  }

  const handleChange = (field: string, value: unknown) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof PropertyFormData] as any),
          [child]: value,
        },
      }))
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }))
    }
    setTouched((prev) => ({ ...prev, [field]: true }))
    validateField(field, value)
  }

  const handleUnitSubmit = (unitData: UnitFormData) => {
    if (editingUnit) {
      setFormData((prev) => ({
        ...prev,
        units: prev.units?.map((u) =>
          u.id === editingUnit.id
            ? { ...u, ...unitData, id: editingUnit.id }
            : u
        ),
      }))
    } else {
      const newUnit: Unit = {
        id: `unit-${Date.now()}`,
        ...unitData,
      }
      setFormData((prev) => ({
        ...prev,
        units: [...(prev.units || []), newUnit],
      }))
    }
    setEditingUnit(undefined)
    setUnitFormOpen(false)
  }

  const handleDeleteUnit = (unitId: string) => {
    setFormData((prev) => ({
      ...prev,
      units: prev.units?.filter((u) => u.id !== unitId),
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const result = propertyFormSchema.safeParse(formData)
    if (result.success) {
      onSubmit(result.data)
      toast.success(property ? 'Propriété modifiée avec succès' : 'Propriété créée avec succès')
    } else {
      const newErrors: Record<string, string> = {}
      result.error.errors.forEach((err) => {
        if (err.path.length > 0) {
          const fieldPath = err.path.join('.')
          newErrors[fieldPath] = err.message
        }
      })
      setErrors(newErrors)
      toast.error('Veuillez corriger les erreurs dans le formulaire')
    }
  }

  const hasErrors = Object.keys(errors).length > 0

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <Tabs defaultValue="informations" className="w-full">
        <TabsList className="px-4 lg:px-6">
          <TabsTrigger value="informations">Informations</TabsTrigger>
          {formData.type === 'Immeuble' && (
            <TabsTrigger value="logements">
              Logements {formData.units && formData.units.length > 0 && `(${formData.units.length})`}
            </TabsTrigger>
          )}
        </TabsList>

        {/* Onglet Informations */}
        <TabsContent value="informations" className="space-y-6 px-4 lg:px-6">
          <Card>
            <CardContent className="pt-6 space-y-4">
              {/* Nom */}
              <div className="space-y-2">
                <Label htmlFor="name">
                  Nom de la propriété <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="name"
                    value={formData.name || ''}
                    onChange={(e) => handleChange('name', e.target.value)}
                    onBlur={() => setTouched((prev) => ({ ...prev, name: true }))}
                    className={errors.name ? 'border-destructive' : ''}
                  />
                  {touched.name && errors.name && (
                    <div className="absolute right-2 top-1/2 -translate-y-1/2">
                      <IconX className="h-4 w-4 text-destructive" />
                    </div>
                  )}
                  {touched.name && !errors.name && formData.name && (
                    <div className="absolute right-2 top-1/2 -translate-y-1/2">
                      <IconCheck className="h-4 w-4 text-green-500" />
                    </div>
                  )}
                </div>
                {touched.name && errors.name && (
                  <p className="text-sm text-destructive">{errors.name}</p>
                )}
              </div>

              {/* Type et Statut */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">
                    Type <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => handleChange('type', value)}
                  >
                    <SelectTrigger id="type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PROPERTY_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">
                    Statut <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => handleChange('status', value)}
                  >
                    <SelectTrigger id="status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PROPERTY_STATUSES.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Adresse */}
              <div className="space-y-4">
                <h3 className="font-medium">Adresse</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="address.street">
                    Rue <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="address.street"
                      value={formData.address?.street || ''}
                      onChange={(e) => handleChange('address.street', e.target.value)}
                      onBlur={() => setTouched((prev) => ({ ...prev, 'address.street': true }))}
                      className={errors['address.street'] ? 'border-destructive' : ''}
                    />
                    {touched['address.street'] && errors['address.street'] && (
                      <div className="absolute right-2 top-1/2 -translate-y-1/2">
                        <IconX className="h-4 w-4 text-destructive" />
                      </div>
                    )}
                    {touched['address.street'] && !errors['address.street'] && formData.address?.street && (
                      <div className="absolute right-2 top-1/2 -translate-y-1/2">
                        <IconCheck className="h-4 w-4 text-green-500" />
                      </div>
                    )}
                  </div>
                  {touched['address.street'] && errors['address.street'] && (
                    <p className="text-sm text-destructive">{errors['address.street']}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="address.city">
                      Ville <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={formData.address?.city || ''}
                      onValueChange={(value) => handleChange('address.city', value)}
                    >
                      <SelectTrigger id="address.city">
                        <SelectValue placeholder="Sélectionner une ville" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Abidjan">Abidjan</SelectItem>
                        <SelectItem value="Yamoussoukro">Yamoussoukro</SelectItem>
                        <SelectItem value="Bouaké">Bouaké</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address.postalCode">Code Postal</Label>
                    <Input
                      id="address.postalCode"
                      value={formData.address?.postalCode || ''}
                      onChange={(e) => handleChange('address.postalCode', e.target.value)}
                      onBlur={() => setTouched((prev) => ({ ...prev, 'address.postalCode': true }))}
                      className={errors['address.postalCode'] ? 'border-destructive' : ''}
                    />
                    {touched['address.postalCode'] && errors['address.postalCode'] && (
                      <p className="text-sm text-destructive">{errors['address.postalCode']}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address.country">
                    Pays <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="address.country"
                    value={formData.address?.country || ''}
                    onChange={(e) => handleChange('address.country', e.target.value)}
                    onBlur={() => setTouched((prev) => ({ ...prev, 'address.country': true }))}
                    className={errors['address.country'] ? 'border-destructive' : ''}
                  />
                  {touched['address.country'] && errors['address.country'] && (
                    <p className="text-sm text-destructive">{errors['address.country']}</p>
                  )}
                </div>
              </div>

              {/* Propriétaire */}
              <div className="space-y-4">
                <h3 className="font-medium">Propriétaire</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="owner.name">
                    Nom <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="owner.name"
                      value={formData.owner?.name || ''}
                      onChange={(e) => handleChange('owner.name', e.target.value)}
                      onBlur={() => setTouched((prev) => ({ ...prev, 'owner.name': true }))}
                      className={errors['owner.name'] ? 'border-destructive' : ''}
                    />
                    {touched['owner.name'] && errors['owner.name'] && (
                      <div className="absolute right-2 top-1/2 -translate-y-1/2">
                        <IconX className="h-4 w-4 text-destructive" />
                      </div>
                    )}
                    {touched['owner.name'] && !errors['owner.name'] && formData.owner?.name && (
                      <div className="absolute right-2 top-1/2 -translate-y-1/2">
                        <IconCheck className="h-4 w-4 text-green-500" />
                      </div>
                    )}
                  </div>
                  {touched['owner.name'] && errors['owner.name'] && (
                    <p className="text-sm text-destructive">{errors['owner.name']}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="owner.email">Email</Label>
                    <div className="relative">
                      <Input
                        id="owner.email"
                        type="email"
                        value={formData.owner?.email || ''}
                        onChange={(e) => handleChange('owner.email', e.target.value)}
                        onBlur={() => setTouched((prev) => ({ ...prev, 'owner.email': true }))}
                        className={errors['owner.email'] ? 'border-destructive' : ''}
                      />
                      {touched['owner.email'] && errors['owner.email'] && (
                        <div className="absolute right-2 top-1/2 -translate-y-1/2">
                          <IconX className="h-4 w-4 text-destructive" />
                        </div>
                      )}
                      {touched['owner.email'] && !errors['owner.email'] && formData.owner?.email && (
                        <div className="absolute right-2 top-1/2 -translate-y-1/2">
                          <IconCheck className="h-4 w-4 text-green-500" />
                        </div>
                      )}
                    </div>
                    {touched['owner.email'] && errors['owner.email'] && (
                      <p className="text-sm text-destructive">{errors['owner.email']}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="owner.phone">
                      Téléphone <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        id="owner.phone"
                        value={formData.owner?.phone || ''}
                        onChange={(e) => handleChange('owner.phone', e.target.value)}
                        onBlur={() => setTouched((prev) => ({ ...prev, 'owner.phone': true }))}
                        className={errors['owner.phone'] ? 'border-destructive' : ''}
                      />
                      {touched['owner.phone'] && errors['owner.phone'] && (
                        <div className="absolute right-2 top-1/2 -translate-y-1/2">
                          <IconX className="h-4 w-4 text-destructive" />
                        </div>
                      )}
                      {touched['owner.phone'] && !errors['owner.phone'] && formData.owner?.phone && (
                        <div className="absolute right-2 top-1/2 -translate-y-1/2">
                          <IconCheck className="h-4 w-4 text-green-500" />
                        </div>
                      )}
                    </div>
                    {touched['owner.phone'] && errors['owner.phone'] && (
                      <p className="text-sm text-destructive">{errors['owner.phone']}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description || ''}
                  onChange={(e) => handleChange('description', e.target.value)}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Logements (si Immeuble) */}
        {formData.type === 'Immeuble' && (
          <TabsContent value="logements" className="space-y-4 px-4 lg:px-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Logements</h3>
                <p className="text-sm text-muted-foreground">
                  {formData.units?.length || 0} logement(s) configuré(s)
                </p>
              </div>
              <Button
                type="button"
                onClick={() => {
                  setEditingUnit(undefined)
                  setUnitFormOpen(true)
                }}
              >
                <IconPlus className="mr-2 h-4 w-4" />
                Ajouter un logement
              </Button>
            </div>

            {formData.units && formData.units.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {formData.units.map((unit) => (
                  <Card key={unit.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold">{unit.number}</h4>
                          <p className="text-sm text-muted-foreground">
                            {unit.rooms} chambre(s) • {unit.size}m²
                          </p>
                          <p className="text-sm font-medium mt-1">
                            {unit.rent.toLocaleString('fr-FR')} FCFA/mois
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingUnit(unit)
                              setUnitFormOpen(true)
                            }}
                          >
                            Modifier
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteUnit(unit.id)}
                          >
                            Supprimer
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="pt-6 text-center text-muted-foreground">
                  Aucun logement configuré. Cliquez sur "Ajouter un logement" pour commencer.
                </CardContent>
              </Card>
            )}

            <UnitForm
              unit={editingUnit}
              open={unitFormOpen}
              onOpenChange={setUnitFormOpen}
              onSubmit={handleUnitSubmit}
            />
          </TabsContent>
        )}
      </Tabs>

      {/* Actions */}
      <div className="flex items-center justify-end gap-4 border-t p-4 lg:px-6">
        <Button type="button" variant="outline">
          Annuler
        </Button>
        <Button type="submit" disabled={hasErrors}>
          {property ? 'Modifier' : 'Créer'} la propriété
        </Button>
      </div>
    </form>
  )
}


