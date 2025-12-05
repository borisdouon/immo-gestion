export type PropertyType = 'Maison' | 'Villa' | 'Immeuble' | 'Commercial'
export type PropertyStatus = 'Libre' | 'Réservé' | 'Occupé' | 'En Maintenance'
export type UnitStatus = 'Libre' | 'Réservé' | 'Occupé' | 'En Maintenance'

export interface Address {
  street: string
  city: string
  postalCode?: string
  country: string
}

export interface Owner {
  id: string
  name: string
  email?: string
  phone: string
}

export interface Unit {
  id: string
  number: string
  floor?: number
  rooms: number
  size: number // m²
  rent: number // FCFA
  status: UnitStatus
  tenantId?: string
  tenantName?: string
  tenantPhone?: string
  tenantEmail?: string
}

export interface Property {
  id: string
  type: PropertyType
  name: string
  address: Address
  owner: Owner
  status: PropertyStatus
  units?: Unit[] // Only for Immeuble type
  totalUnits?: number
  occupiedUnits?: number
  photos?: string[]
  description?: string
  createdAt: string
  updatedAt: string
}


