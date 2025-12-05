import type { PropertyType, PropertyStatus, UnitStatus } from '@/lib/types/property'

export const PROPERTY_TYPES: PropertyType[] = ['Maison', 'Villa', 'Immeuble', 'Commercial']

export const PROPERTY_STATUSES: PropertyStatus[] = ['Libre', 'Réservé', 'Occupé', 'En Maintenance']

export const UNIT_STATUSES: UnitStatus[] = ['Libre', 'Réservé', 'Occupé', 'En Maintenance']

export const STATUS_COLORS: Record<PropertyStatus | UnitStatus, string> = {
  'Libre': 'bg-green-500',
  'Réservé': 'bg-yellow-500',
  'Occupé': 'bg-blue-500',
  'En Maintenance': 'bg-orange-500',
}

export const STATUS_BADGE_VARIANTS: Record<PropertyStatus | UnitStatus, 'default' | 'secondary' | 'destructive'> = {
  'Libre': 'default',
  'Réservé': 'secondary',
  'Occupé': 'default',
  'En Maintenance': 'secondary',
}

export const OCCUPANCY_BADGES = {
  full: { text: "Plein", className: "bg-red-600 hover:bg-red-700", color: "bg-red-600" },
  almostFull: { text: "Presque Plein", className: "bg-green-500 hover:bg-green-600", color: "bg-green-500" },
  moderate: { text: "Modéré", className: "bg-yellow-500 hover:bg-yellow-600", color: "bg-yellow-500" },
  lowOccupancy: { text: "Peu Occupé", className: "bg-orange-500 hover:bg-orange-600", color: "bg-orange-500" },
} as const

export const VALIDATION_MESSAGES = {
  required: 'Ce champ est requis',
  minLength: (min: number) => `Minimum ${min} caractères requis`,
  maxLength: (max: number) => `Maximum ${max} caractères autorisés`,
  email: 'Format email invalide',
  phone: 'Format de téléphone invalide',
  postalCode: 'Le code postal doit contenir 5 chiffres',
  positive: 'Doit être un nombre positif',
  maxPhotos: 'Maximum 10 photos autorisées',
  maxFileSize: 'La taille maximale est de 5MB par photo',
  invalidFileType: 'Format de fichier non supporté (JPG, PNG, WEBP uniquement)',
}


