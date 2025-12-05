"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { IconEdit, IconMapPin, IconMail, IconPhone, IconBuilding } from "@tabler/icons-react"
import Link from "next/link"
import { STATUS_COLORS } from "@/lib/constants/tenant"
import type { Tenant } from "@/lib/types/tenant"

interface TenantDetailsProps {
  tenant: Tenant
}

function formatDate(dateString?: string): string {
  if (!dateString) return 'Non spécifiée'
  try {
    const date = new Date(dateString)
    // Use a deterministic format to avoid hydration mismatches
    const day = date.getDate()
    const monthNames = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre']
    const month = monthNames[date.getMonth()]
    const year = date.getFullYear()
    return `${day} ${month} ${year}`
  } catch {
    return 'Non spécifiée'
  }
}

function getInitials(firstName: string, lastName: string): string {
  const first = firstName.charAt(0).toUpperCase()
  const second = lastName.charAt(0).toUpperCase()
  return `${first}${second}`
}

export function TenantDetails({ tenant }: TenantDetailsProps) {
  const initials = getInitials(tenant.firstName, tenant.lastName)
  const propertyLocation = tenant.currentPropertyName && tenant.currentUnitNumber
    ? `${tenant.currentPropertyName} - ${tenant.currentUnitNumber}`
    : tenant.currentPropertyName || 'Non assigné'

  return (
    <div className="grid gap-4 px-4 lg:px-6 md:grid-cols-2">
      {/* Personal Information */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                <span className="text-lg font-semibold text-foreground">
                  {initials}
                </span>
              </div>
              <div>
                <CardTitle>{tenant.fullName}</CardTitle>
                <CardDescription className="mt-1">
                  Locataire
                </CardDescription>
              </div>
            </div>
            <Badge className={STATUS_COLORS[tenant.status]}>
              {tenant.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3">
            <IconMail className="mt-0.5 h-5 w-5 text-muted-foreground shrink-0" />
            <div>
              <div className="font-medium">Email</div>
              <div className="text-sm text-muted-foreground">
                {tenant.email}
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <IconPhone className="mt-0.5 h-5 w-5 text-muted-foreground shrink-0" />
            <div>
              <div className="font-medium">Téléphone</div>
              <div className="text-sm text-muted-foreground">
                {tenant.phone}
              </div>
              {tenant.alternatePhone && (
                <div className="text-sm text-muted-foreground mt-1">
                  Alternatif: {tenant.alternatePhone}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-start gap-3">
            <IconMapPin className="mt-0.5 h-5 w-5 text-muted-foreground shrink-0" />
            <div>
              <div className="font-medium">Adresse</div>
              <div className="text-sm text-muted-foreground">
                {tenant.address.street}
                <br />
                {tenant.address.city}
                {tenant.address.postalCode && `, ${tenant.address.postalCode}`}
                <br />
                {tenant.address.country}
              </div>
            </div>
          </div>

          {tenant.employer && (
            <div>
              <div className="font-medium">Employeur</div>
              <div className="text-sm text-muted-foreground">
                {tenant.employer}
              </div>
            </div>
          )}

          {tenant.occupation && (
            <div>
              <div className="font-medium">Profession</div>
              <div className="text-sm text-muted-foreground">
                {tenant.occupation}
              </div>
            </div>
          )}

          {tenant.emergencyContact && (
            <div>
              <div className="font-medium">Contact d'urgence</div>
              <div className="text-sm text-muted-foreground">
                {tenant.emergencyContact.name} ({tenant.emergencyContact.relationship})
                <br />
                {tenant.emergencyContact.phone}
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 pt-2">
            <Button asChild variant="outline" size="sm">
              <Link href={`/tenant/${tenant.id}/edit`}>
                <IconEdit className="mr-2 h-4 w-4" />
                Modifier
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lease Information */}
      <Card>
        <CardHeader>
          <CardTitle>Informations de location</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3">
            <IconBuilding className="mt-0.5 h-5 w-5 text-muted-foreground shrink-0" />
            <div>
              <div className="font-medium">Propriété / Logement</div>
              <div className="text-sm text-muted-foreground">
                {propertyLocation}
              </div>
              {tenant.currentPropertyId && (
                <Link
                  href={`/property/${tenant.currentPropertyId}`}
                  className="text-sm text-primary hover:underline mt-1 inline-block"
                >
                  Voir la propriété →
                </Link>
              )}
            </div>
          </div>

          {tenant.currentRent && (
            <div>
              <div className="font-medium">Loyer mensuel</div>
              <div className="text-sm text-muted-foreground">
                {tenant.currentRent.toLocaleString('fr-FR')} FCFA
              </div>
            </div>
          )}

          <div>
            <div className="font-medium">Date d'entrée</div>
            <div className="text-sm text-muted-foreground">
              {formatDate(tenant.moveInDate)}
            </div>
          </div>

          {tenant.moveOutDate && (
            <div>
              <div className="font-medium">Date de sortie</div>
              <div className="text-sm text-muted-foreground">
                {formatDate(tenant.moveOutDate)}
              </div>
            </div>
          )}

          {tenant.idNumber && (
            <div>
              <div className="font-medium">Pièce d'identité</div>
              <div className="text-sm text-muted-foreground">
                {tenant.idType}: {tenant.idNumber}
              </div>
            </div>
          )}

          {tenant.notes && (
            <div>
              <div className="font-medium">Notes</div>
              <div className="text-sm text-muted-foreground whitespace-pre-wrap">
                {tenant.notes}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

