"use client"

import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { IconCheck, IconUser, IconMail, IconPhone } from "@tabler/icons-react"

interface Owner {
  name: string
  email: string
  phone: string
}

interface StepOwnerProps {
  owner: Owner
  onChange: (field: keyof Owner, value: string) => void
  errors?: Partial<Record<keyof Owner, string>>
}

export function StepOwner({ owner, onChange, errors }: StepOwnerProps) {
  const isEmailValid = !owner.email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(owner.email)
  const isPhoneValid = owner.phone.length >= 8
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 rounded-xl bg-orange-50 p-4 dark:bg-orange-950/20">
        <div className="flex size-10 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900/30">
          <IconUser className="size-5 text-orange-600 dark:text-orange-400" />
        </div>
        <div>
          <p className="font-medium">Informations du propriétaire</p>
          <p className="text-sm text-muted-foreground">Contact principal pour cette propriété</p>
        </div>
      </div>
      
      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="ownerName" className="text-sm font-medium">
          Nom complet
          <span className="text-orange-500 ml-1">*</span>
        </Label>
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2">
            <IconUser className="size-5 text-muted-foreground" />
          </div>
          <Input
            id="ownerName"
            value={owner.name}
            onChange={(e) => onChange('name', e.target.value)}
            className={cn(
              "h-12 rounded-xl border-border/50 bg-background pl-10 pr-10",
              "focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20",
              "transition-all duration-200",
              errors?.name && "border-red-500"
            )}
            placeholder="Ex: Jean Kouassi"
          />
          {owner.name && owner.name.length >= 2 && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <IconCheck className="size-5 text-emerald-500" />
            </div>
          )}
        </div>
        {errors?.name && (
          <p className="text-sm text-red-500">{errors.name}</p>
        )}
      </div>
      
      {/* Email and Phone */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="ownerEmail" className="text-sm font-medium">
            Email
          </Label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
              <IconMail className="size-5 text-muted-foreground" />
            </div>
            <Input
              id="ownerEmail"
              type="email"
              value={owner.email}
              onChange={(e) => onChange('email', e.target.value)}
              className={cn(
                "h-12 rounded-xl border-border/50 bg-background pl-10 pr-10",
                "focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20",
                "transition-all duration-200",
                owner.email && !isEmailValid && "border-red-500"
              )}
              placeholder="email@example.com"
            />
            {owner.email && isEmailValid && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <IconCheck className="size-5 text-emerald-500" />
              </div>
            )}
          </div>
          {owner.email && !isEmailValid && (
            <p className="text-sm text-red-500">Email invalide</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="ownerPhone" className="text-sm font-medium">
            Téléphone
            <span className="text-orange-500 ml-1">*</span>
          </Label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
              <IconPhone className="size-5 text-muted-foreground" />
            </div>
            <Input
              id="ownerPhone"
              value={owner.phone}
              onChange={(e) => onChange('phone', e.target.value)}
              className={cn(
                "h-12 rounded-xl border-border/50 bg-background pl-10 pr-10",
                "focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20",
                "transition-all duration-200",
                errors?.phone && "border-red-500"
              )}
              placeholder="+225 07 00 00 00 00"
            />
            {owner.phone && isPhoneValid && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <IconCheck className="size-5 text-emerald-500" />
              </div>
            )}
          </div>
          {errors?.phone && (
            <p className="text-sm text-red-500">{errors.phone}</p>
          )}
        </div>
      </div>
      
      {/* Info note */}
      <div className="rounded-xl border border-border/50 bg-muted/30 p-4">
        <p className="text-sm text-muted-foreground">
          💡 Ces informations seront utilisées pour contacter le propriétaire en cas de besoin. 
          L'email est optionnel mais recommandé pour les notifications.
        </p>
      </div>
    </div>
  )
}


