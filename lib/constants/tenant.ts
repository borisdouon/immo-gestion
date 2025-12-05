import type { TenantStatus } from '@/lib/types/tenant'

export const TENANT_STATUSES: TenantStatus[] = ['Actif', 'Inactif', 'En Attente', 'Résilié']

export const STATUS_COLORS: Record<TenantStatus, string> = {
  'Actif': 'bg-blue-500 hover:bg-blue-600',
  'Inactif': 'bg-gray-500 hover:bg-gray-600',
  'En Attente': 'bg-yellow-500 hover:bg-yellow-600',
  'Résilié': 'bg-red-500 hover:bg-red-600',
}

export const STATUS_BADGE_VARIANTS: Record<TenantStatus, 'default' | 'secondary' | 'destructive'> = {
  'Actif': 'default',
  'Inactif': 'secondary',
  'En Attente': 'secondary',
  'Résilié': 'destructive',
}

export const VALIDATION_MESSAGES = {
  required: 'Ce champ est requis',
  minLength: (min: number) => `Minimum ${min} caractères requis`,
  maxLength: (max: number) => `Maximum ${max} caractères autorisés`,
  email: 'Format email invalide',
  phone: 'Format de téléphone invalide',
  postalCode: 'Le code postal doit contenir 5 chiffres',
  positive: 'Doit être un nombre positif',
}





