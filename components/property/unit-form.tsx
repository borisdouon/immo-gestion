"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { IconCheck, IconX } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { unitFormSchema, type UnitFormData } from "@/lib/schemas/property"
import { UNIT_STATUSES } from "@/lib/constants/property"
import type { Unit } from "@/lib/types/property"
import { toast } from "sonner"

interface UnitFormProps {
  unit?: Unit
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onSubmit: (data: UnitFormData) => void
  trigger?: React.ReactNode
}

export function UnitForm({
  unit,
  open: controlledOpen,
  onOpenChange,
  onSubmit,
  trigger,
}: UnitFormProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen
  const setOpen = onOpenChange || setInternalOpen

  const [formData, setFormData] = useState<Partial<UnitFormData>>({
    number: unit?.number || '',
    floor: unit?.floor || 0,
    rooms: unit?.rooms || 1,
    size: unit?.size || 0,
    rent: unit?.rent || 0,
    status: unit?.status || 'Libre',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  useEffect(() => {
    if (unit) {
      setFormData({
        number: unit.number,
        floor: unit.floor,
        rooms: unit.rooms,
        size: unit.size,
        rent: unit.rent,
        status: unit.status,
      })
    } else {
      setFormData({
        number: '',
        floor: 0,
        rooms: 1,
        size: 0,
        rent: 0,
        status: 'Libre',
      })
    }
    setErrors({})
    setTouched({})
  }, [unit, open])

  const validateField = (field: keyof UnitFormData, value: unknown) => {
    try {
      const fieldSchema = unitFormSchema.shape[field]
      if (fieldSchema) {
        fieldSchema.parse(value)
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

  const handleChange = (field: keyof UnitFormData, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setTouched((prev) => ({ ...prev, [field]: true }))
    validateField(field, value)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const result = unitFormSchema.safeParse(formData)
    if (result.success) {
      onSubmit(result.data)
      setOpen(false)
      toast.success(unit ? 'Logement modifié avec succès' : 'Logement créé avec succès')
    } else {
      const newErrors: Record<string, string> = {}
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          newErrors[err.path[0].toString()] = err.message
        }
      })
      setErrors(newErrors)
      toast.error('Veuillez corriger les erreurs dans le formulaire')
    }
  }

  const isValid = Object.keys(errors).length === 0

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      {trigger && <DrawerTrigger asChild>{trigger}</DrawerTrigger>}
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{unit ? 'Modifier le logement' : 'Ajouter un logement'}</DrawerTitle>
          <DrawerDescription>
            Remplissez les informations du logement
          </DrawerDescription>
        </DrawerHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 overflow-y-auto px-4">
          {/* Numéro */}
          <div className="space-y-2">
            <Label htmlFor="number">
              Numéro <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Input
                id="number"
                value={formData.number || ''}
                onChange={(e) => handleChange('number', e.target.value)}
                onBlur={() => setTouched((prev) => ({ ...prev, number: true }))}
                className={errors.number ? 'border-destructive' : ''}
              />
              {touched.number && errors.number && (
                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                  <IconX className="h-4 w-4 text-destructive" />
                </div>
              )}
              {touched.number && !errors.number && formData.number && (
                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                  <IconCheck className="h-4 w-4 text-green-500" />
                </div>
              )}
            </div>
            {touched.number && errors.number && (
              <p className="text-sm text-destructive">{errors.number}</p>
            )}
          </div>

          {/* Étage */}
          <div className="space-y-2">
            <Label htmlFor="floor">Étage</Label>
            <Input
              id="floor"
              type="number"
              value={formData.floor || 0}
              onChange={(e) => handleChange('floor', parseInt(e.target.value) || 0)}
              min={0}
            />
          </div>

          {/* Chambres */}
          <div className="space-y-2">
            <Label htmlFor="rooms">
              Nombre de chambres <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Input
                id="rooms"
                type="number"
                value={formData.rooms || 1}
                onChange={(e) => handleChange('rooms', parseInt(e.target.value) || 1)}
                onBlur={() => setTouched((prev) => ({ ...prev, rooms: true }))}
                min={1}
                className={errors.rooms ? 'border-destructive' : ''}
              />
              {touched.rooms && errors.rooms && (
                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                  <IconX className="h-4 w-4 text-destructive" />
                </div>
              )}
              {touched.rooms && !errors.rooms && formData.rooms && (
                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                  <IconCheck className="h-4 w-4 text-green-500" />
                </div>
              )}
            </div>
            {touched.rooms && errors.rooms && (
              <p className="text-sm text-destructive">{errors.rooms}</p>
            )}
          </div>

          {/* Taille */}
          <div className="space-y-2">
            <Label htmlFor="size">
              Taille (m²) <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Input
                id="size"
                type="number"
                value={formData.size || 0}
                onChange={(e) => handleChange('size', parseFloat(e.target.value) || 0)}
                onBlur={() => setTouched((prev) => ({ ...prev, size: true }))}
                min={0}
                step="0.01"
                className={errors.size ? 'border-destructive' : ''}
              />
              {touched.size && errors.size && (
                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                  <IconX className="h-4 w-4 text-destructive" />
                </div>
              )}
              {touched.size && !errors.size && formData.size && (
                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                  <IconCheck className="h-4 w-4 text-green-500" />
                </div>
              )}
            </div>
            {touched.size && errors.size && (
              <p className="text-sm text-destructive">{errors.size}</p>
            )}
          </div>

          {/* Loyer */}
          <div className="space-y-2">
            <Label htmlFor="rent">
              Loyer mensuel (FCFA) <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Input
                id="rent"
                type="number"
                value={formData.rent || 0}
                onChange={(e) => handleChange('rent', parseFloat(e.target.value) || 0)}
                onBlur={() => setTouched((prev) => ({ ...prev, rent: true }))}
                min={0}
                className={errors.rent ? 'border-destructive' : ''}
              />
              {touched.rent && errors.rent && (
                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                  <IconX className="h-4 w-4 text-destructive" />
                </div>
              )}
              {touched.rent && !errors.rent && formData.rent && (
                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                  <IconCheck className="h-4 w-4 text-green-500" />
                </div>
              )}
            </div>
            {touched.rent && errors.rent && (
              <p className="text-sm text-destructive">{errors.rent}</p>
            )}
          </div>

          {/* Statut */}
          <div className="space-y-2">
            <Label htmlFor="status">
              Statut <span className="text-destructive">*</span>
            </Label>
            <Select
              value={formData.status || 'Libre'}
              onValueChange={(value) => handleChange('status', value as UnitFormData['status'])}
            >
              <SelectTrigger id="status" className={errors.status ? 'border-destructive' : ''}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {UNIT_STATUSES.map((status) => (
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

          <DrawerFooter>
            <Button type="submit" disabled={!isValid || Object.keys(errors).length > 0}>
              {unit ? 'Modifier' : 'Créer'}
            </Button>
            <DrawerClose asChild>
              <Button type="button" variant="outline">
                Annuler
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  )
}


