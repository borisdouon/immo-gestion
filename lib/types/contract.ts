export type ContractStatus = 
  | 'Brouillon'           // Draft
  | 'En Attente'          // Pending signature
  | 'Actif'               // Active
  | 'Expiré'              // Expired
  | 'Résilié'             // Terminated
  | 'Renouvelé'           // Renewed

export type ContractType = 
  | 'Location'            // Rental
  | 'Vente'               // Sale
  | 'Commercial'          // Commercial lease

export type PaymentFrequency = 
  | 'Mensuel'            // Monthly
  | 'Trimestriel'         // Quarterly
  | 'Semestriel'          // Semi-annual
  | 'Annuel'              // Annual

export interface Contract {
  id: string
  
  // Contract Identification
  contractNumber: string        // Auto-generated: CT-2024-001
  type: ContractType
  status: ContractStatus
  
  // Parties
  tenantId: string
  tenantName: string            // Denormalized
  tenantEmail?: string
  tenantPhone?: string
  
  propertyId: string
  propertyName: string          // Denormalized
  propertyAddress: {
    street: string
    city: string
    postalCode?: string
    country: string
  }
  
  unitId?: string              // For buildings
  unitNumber?: string          // Denormalized
  
  // Terms
  startDate: string
  endDate: string
  duration: number              // Months
  renewalDate?: string          // Auto-calculated reminder
  
  // Financial Terms
  monthlyRent: number           // FCFA
  deposit: number               // Caution
  paymentFrequency: PaymentFrequency
  paymentDay: number            // Day of month (1-31)
  
  // Additional Terms
  utilitiesIncluded: boolean
  utilitiesAmount?: number
  maintenanceFee?: number
  parkingIncluded: boolean
  parkingFee?: number
  
  // Documents
  signedContractUrl?: string
  attachments?: string[]
  
  // Metadata
  notes?: string
  createdAt: string
  updatedAt: string
  createdBy?: string
}

