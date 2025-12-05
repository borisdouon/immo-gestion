import { z } from "zod"
import { VALIDATION_MESSAGES } from "@/lib/constants/property"

export const unitFormSchema = z.object({
  number: z
    .string()
    .min(1, VALIDATION_MESSAGES.required)
    .min(2, VALIDATION_MESSAGES.minLength(2)),
  floor: z.coerce.number().int().min(0).optional(),
  rooms: z.coerce.number().int().min(1, VALIDATION_MESSAGES.positive),
  size: z.coerce.number().positive(VALIDATION_MESSAGES.positive),
  rent: z.coerce.number().positive(VALIDATION_MESSAGES.positive),
  status: z.enum(['Libre', 'Réservé', 'Occupé', 'En Maintenance'], {
    required_error: VALIDATION_MESSAGES.required,
  }),
})

export const propertyFormSchema = z.object({
  name: z
    .string()
    .min(1, VALIDATION_MESSAGES.required)
    .min(3, VALIDATION_MESSAGES.minLength(3)),
  type: z.enum(['Maison', 'Villa', 'Immeuble', 'Commercial'], {
    required_error: VALIDATION_MESSAGES.required,
  }),
  status: z.enum(['Libre', 'Réservé', 'Occupé', 'En Maintenance'], {
    required_error: VALIDATION_MESSAGES.required,
  }),
  address: z.object({
    street: z.string().min(1, VALIDATION_MESSAGES.required),
    city: z.string().min(1, VALIDATION_MESSAGES.required),
    postalCode: z
      .string()
      .optional()
      .refine(
        (val) => !val || /^\d{5}$/.test(val),
        VALIDATION_MESSAGES.postalCode
      ),
    country: z.string().min(1, VALIDATION_MESSAGES.required),
  }),
  owner: z.object({
    name: z.string().min(1, VALIDATION_MESSAGES.required),
    email: z
      .string()
      .optional()
      .refine(
        (val) => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
        VALIDATION_MESSAGES.email
      ),
    phone: z.string().min(1, VALIDATION_MESSAGES.required),
  }),
  description: z.string().optional(),
  units: z.array(unitFormSchema).optional(),
  photos: z.array(z.string()).optional(),
})

export type UnitFormData = z.infer<typeof unitFormSchema>
export type PropertyFormData = z.infer<typeof propertyFormSchema>


