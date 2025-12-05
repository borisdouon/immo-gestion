export type TenantStatus = 'Actif' | 'Inactif' | 'En Attente' | 'Résilié'

export interface Address {
  street: string
  city: string
  postalCode?: string
  country: string
}

export interface EmergencyContact {
  name: string
  phone: string
  relationship: string
}

export interface Tenant {
  id: string
  
  // Personal Information
  firstName: string
  lastName: string
  fullName: string // computed
  
  // Contact
  email: string
  phone: string
  alternatePhone?: string
  
  // Identification (for documents tab)
  idNumber?: string
  idType?: 'CNI' | 'Passport' | 'Permis'
  
  // Current Address
  address: Address
  
  // Employment (optional)
  employer?: string
  occupation?: string
  
  // Emergency Contact
  emergencyContact?: EmergencyContact
  
  // Status & Lease
  status: TenantStatus
  moveInDate?: string
  moveOutDate?: string
  
  // Current Property/Unit Assignment
  currentPropertyId?: string
  currentPropertyName?: string // denormalized for quick display
  currentUnitId?: string
  currentUnitNumber?: string // denormalized for quick display
  currentRent?: number
  
  // Metadata
  notes?: string
  createdAt: string
  updatedAt: string
}





