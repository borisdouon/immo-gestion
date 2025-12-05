"use client"

import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { IconCheck, IconMapPin } from "@tabler/icons-react"

interface Address {
  street: string
  city: string
  postalCode: string
  country: string
}

interface StepAddressProps {
  address: Address
  onChange: (field: keyof Address, value: string) => void
  errors?: Partial<Record<keyof Address, string>>
}

const cities = [
  { value: 'Abidjan', label: 'Abidjan', region: 'District Autonome' },
  { value: 'Yamoussoukro', label: 'Yamoussoukro', region: 'Capitale politique' },
  { value: 'Bouaké', label: 'Bouaké', region: 'Vallée du Bandama' },
  { value: 'San-Pédro', label: 'San-Pédro', region: 'Bas-Sassandra' },
  { value: 'Korhogo', label: 'Korhogo', region: 'Savanes' },
]

export function StepAddress({ address, onChange, errors }: StepAddressProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 rounded-xl bg-orange-50 p-4 dark:bg-orange-950/20">
        <div className="flex size-10 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900/30">
          <IconMapPin className="size-5 text-orange-600 dark:text-orange-400" />
        </div>
        <div>
          <p className="font-medium">Localisation de la propriété</p>
          <p className="text-sm text-muted-foreground">Entrez l'adresse complète du bien</p>
        </div>
      </div>
      
      {/* Street */}
      <div className="space-y-2">
        <Label htmlFor="street" className="text-sm font-medium">
          Rue / Adresse
          <span className="text-orange-500 ml-1">*</span>
        </Label>
        <div className="relative">
          <Input
            id="street"
            value={address.street}
            onChange={(e) => onChange('street', e.target.value)}
            className={cn(
              "h-12 rounded-xl border-border/50 bg-background px-4",
              "focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20",
              "transition-all duration-200",
              errors?.street && "border-red-500"
            )}
            placeholder="Ex: Boulevard de la République, Lot 24"
          />
          {address.street && address.street.length >= 5 && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <IconCheck className="size-5 text-emerald-500" />
            </div>
          )}
        </div>
        {errors?.street && (
          <p className="text-sm text-red-500">{errors.street}</p>
        )}
      </div>
      
      {/* City and Postal Code */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="city" className="text-sm font-medium">
            Ville
            <span className="text-orange-500 ml-1">*</span>
          </Label>
          <Select 
            value={address.city} 
            onValueChange={(value) => onChange('city', value)}
          >
            <SelectTrigger 
              id="city"
              className={cn(
                "h-12 rounded-xl border-border/50 bg-background",
                "focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20",
                address.city && "border-emerald-300"
              )}
            >
              <SelectValue placeholder="Sélectionner une ville" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              {cities.map((city) => (
                <SelectItem 
                  key={city.value} 
                  value={city.value}
                  className="rounded-lg"
                >
                  <div className="flex flex-col">
                    <span>{city.label}</span>
                    <span className="text-xs text-muted-foreground">{city.region}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="postalCode" className="text-sm font-medium">
            Code Postal
          </Label>
          <Input
            id="postalCode"
            value={address.postalCode}
            onChange={(e) => onChange('postalCode', e.target.value)}
            className={cn(
              "h-12 rounded-xl border-border/50 bg-background px-4",
              "focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20",
              "transition-all duration-200"
            )}
            placeholder="Ex: 01 BP 1234"
          />
        </div>
      </div>
      
      {/* Country */}
      <div className="space-y-2">
        <Label htmlFor="country" className="text-sm font-medium">
          Pays
          <span className="text-orange-500 ml-1">*</span>
        </Label>
        <Input
          id="country"
          value={address.country}
          onChange={(e) => onChange('country', e.target.value)}
          className={cn(
            "h-12 rounded-xl border-border/50 bg-background px-4",
            "focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20",
            "transition-all duration-200"
          )}
          placeholder="Côte d'Ivoire"
        />
      </div>
    </div>
  )
}


