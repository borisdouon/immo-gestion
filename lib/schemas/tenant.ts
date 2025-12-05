import { z } from "zod"
import { VALIDATION_MESSAGES } from "@/lib/constants/tenant"

export const addressSchema = z.object({
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
})

export const emergencyContactSchema = z.object({
  name: z.string().min(1, VALIDATION_MESSAGES.required),
  phone: z.string().min(1, VALIDATION_MESSAGES.required),
  relationship: z.string().min(1, VALIDATION_MESSAGES.required),
})

export const tenantFormSchema = z.object({
  firstName: z
    .string()
    .min(1, VALIDATION_MESSAGES.required)
    .min(2, VALIDATION_MESSAGES.minLength(2)),
  lastName: z
    .string()
    .min(1, VALIDATION_MESSAGES.required)
    .min(2, VALIDATION_MESSAGES.minLength(2)),
  email: z
    .string()
    .min(1, VALIDATION_MESSAGES.required)
    .email(VALIDATION_MESSAGES.email),
  phone: z.string().min(1, VALIDATION_MESSAGES.required),
  alternatePhone: z.string().optional(),
  idNumber: z.string().optional(),
  idType: z.enum(['CNI', 'Passport', 'Permis']).optional(),
  address: addressSchema,
  employer: z.string().optional(),
  occupation: z.string().optional(),
  emergencyContact: emergencyContactSchema.optional(),
  status: z.enum(['Actif', 'Inactif', 'En Attente', 'Résilié'], {
    required_error: VALIDATION_MESSAGES.required,
  }),
  moveInDate: z.string().optional(),
  moveOutDate: z.string().optional(),
  currentPropertyId: z.string().optional(),
  currentUnitId: z.string().optional(),
  currentRent: z.coerce.number().positive().optional(),
  notes: z.string().optional(),
})

export type TenantFormData = z.infer<typeof tenantFormSchema>





