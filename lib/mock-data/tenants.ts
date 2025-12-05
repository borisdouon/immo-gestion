import type { Tenant } from '@/lib/types/tenant'
import { mockProperties } from './properties'

// Extract tenants from properties
function extractTenantsFromProperties(): Tenant[] {
  const tenants: Tenant[] = []
  const tenantMap = new Map<string, Tenant>()

  mockProperties.forEach(property => {
    property.units?.forEach(unit => {
      if (unit.tenantId && unit.tenantName) {
        // Check if tenant already exists (shouldn't happen, but safety check)
        if (!tenantMap.has(unit.tenantId)) {
          const nameParts = unit.tenantName.split(' ')
          const firstName = nameParts[0] || ''
          const lastName = nameParts.slice(1).join(' ') || ''

          const tenant: Tenant = {
            id: unit.tenantId,
            firstName,
            lastName,
            fullName: unit.tenantName,
            email: unit.tenantEmail || '',
            phone: unit.tenantPhone || '',
            address: {
              street: property.address.street,
              city: property.address.city,
              postalCode: property.address.postalCode,
              country: property.address.country,
            },
            status: unit.status === 'Occupé' ? 'Actif' : unit.status === 'Réservé' ? 'En Attente' : 'Inactif',
            moveInDate: '2024-01-15', // Default date, can be customized
            currentPropertyId: property.id,
            currentPropertyName: property.name,
            currentUnitId: unit.id,
            currentUnitNumber: unit.number,
            currentRent: unit.rent,
            createdAt: property.createdAt,
            updatedAt: property.updatedAt,
          }

          tenantMap.set(unit.tenantId, tenant)
          tenants.push(tenant)
        }
      }
    })
  })

  return tenants
}

export const mockTenants: Tenant[] = extractTenantsFromProperties()

/**
 * Récupère un locataire par son ID
 */
export function getTenantById(id: string): Tenant | undefined {
  return mockTenants.find(t => t.id === id)
}

/**
 * Récupère tous les locataires
 */
export function getAllTenants(): Tenant[] {
  return mockTenants
}

/**
 * Récupère les locataires par statut
 */
export function getTenantsByStatus(status: Tenant['status']): Tenant[] {
  return mockTenants.filter(t => t.status === status)
}

/**
 * Récupère les locataires par propriété
 */
export function getTenantsByPropertyId(propertyId: string): Tenant[] {
  return mockTenants.filter(t => t.currentPropertyId === propertyId)
}





