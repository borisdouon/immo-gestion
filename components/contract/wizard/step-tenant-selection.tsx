"use client"

import { useState, useMemo } from "react"
import { IconUserPlus, IconSearch, IconMail, IconPhone, IconCheck } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { mockTenants } from "@/lib/mock-data/tenants"
import type { Tenant } from "@/lib/types/tenant"

interface StepTenantSelectionProps {
  selectedTenant: Tenant | null
  onSelectTenant: (tenant: Tenant) => void
}

function getInitials(firstName: string, lastName: string): string {
  const first = firstName.charAt(0).toUpperCase()
  const second = lastName.charAt(0).toUpperCase()
  return `${first}${second}`
}

export function StepTenantSelection({ selectedTenant, onSelectTenant }: StepTenantSelectionProps) {
  const [search, setSearch] = useState("")
  const [showNewForm, setShowNewForm] = useState(false)
  const [newTenant, setNewTenant] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  })

  const filteredTenants = useMemo(() => {
    if (!search) return mockTenants
    const query = search.toLowerCase()
    return mockTenants.filter(
      (tenant) =>
        tenant.fullName.toLowerCase().includes(query) ||
        tenant.email.toLowerCase().includes(query) ||
        tenant.phone.toLowerCase().includes(query)
    )
  }, [search])

  const handleCreateTenant = () => {
    if (newTenant.firstName && newTenant.lastName && newTenant.email && newTenant.phone) {
      const tenant: Tenant = {
        id: `t-${Date.now()}`,
        firstName: newTenant.firstName,
        lastName: newTenant.lastName,
        fullName: `${newTenant.firstName} ${newTenant.lastName}`,
        email: newTenant.email,
        phone: newTenant.phone,
        address: {
          street: "",
          city: "",
          country: "Côte d'Ivoire",
        },
        status: "En Attente",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      onSelectTenant(tenant)
      setShowNewForm(false)
      setNewTenant({ firstName: "", lastName: "", email: "", phone: "" })
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      {/* Left: Tenant List */}
      <div className="lg:col-span-2 space-y-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Rechercher un locataire..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-11 rounded-xl"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowNewForm(!showNewForm)}
            className="gap-2"
          >
            <IconUserPlus className="size-4" />
            Nouveau
          </Button>
        </div>

        <div className="space-y-2 max-h-[500px] overflow-y-auto">
          {filteredTenants.map((tenant) => {
            const initials = getInitials(tenant.firstName, tenant.lastName)
            const isSelected = selectedTenant?.id === tenant.id

            return (
              <button
                key={tenant.id}
                onClick={() => onSelectTenant(tenant)}
                className={cn(
                  "w-full text-left p-4 rounded-xl border-2 transition-all duration-200",
                  "hover:border-orange-300 hover:shadow-md",
                  isSelected
                    ? "border-orange-500 bg-orange-50 dark:bg-orange-950/20"
                    : "border-border bg-card"
                )}
              >
                <div className="flex items-center gap-4">
                  <div className="relative shrink-0">
                    <div className="flex size-12 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 text-white font-bold text-sm">
                      {initials}
                    </div>
                    {isSelected && (
                      <div className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-orange-500 text-white">
                        <IconCheck className="size-3" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm truncate">{tenant.fullName}</h3>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <IconMail className="size-3" />
                        {tenant.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <IconPhone className="size-3" />
                        {tenant.phone}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Right: New Tenant Form or Selected Tenant Info */}
      <div className="lg:col-span-1">
        {showNewForm ? (
          <div className="sticky top-0 p-6 rounded-xl border border-border/50 bg-card space-y-4">
            <div>
              <h3 className="font-semibold text-lg">Nouveau Locataire</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Créez un nouveau profil de locataire
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Prénom *</Label>
                <Input
                  id="firstName"
                  value={newTenant.firstName}
                  onChange={(e) =>
                    setNewTenant((prev) => ({ ...prev, firstName: e.target.value }))
                  }
                  placeholder="Jean"
                  className="rounded-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Nom *</Label>
                <Input
                  id="lastName"
                  value={newTenant.lastName}
                  onChange={(e) =>
                    setNewTenant((prev) => ({ ...prev, lastName: e.target.value }))
                  }
                  placeholder="Kouamé"
                  className="rounded-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={newTenant.email}
                  onChange={(e) =>
                    setNewTenant((prev) => ({ ...prev, email: e.target.value }))
                  }
                  placeholder="jean.kouame@email.ci"
                  className="rounded-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone *</Label>
                <Input
                  id="phone"
                  value={newTenant.phone}
                  onChange={(e) =>
                    setNewTenant((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  placeholder="+225 07 11 22 33 44"
                  className="rounded-lg"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowNewForm(false)
                    setNewTenant({ firstName: "", lastName: "", email: "", phone: "" })
                  }}
                  className="flex-1"
                >
                  Annuler
                </Button>
                <Button
                  onClick={handleCreateTenant}
                  disabled={
                    !newTenant.firstName ||
                    !newTenant.lastName ||
                    !newTenant.email ||
                    !newTenant.phone
                  }
                  className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                >
                  Créer
                </Button>
              </div>
            </div>
          </div>
        ) : selectedTenant ? (
          <div className="sticky top-0 p-6 rounded-xl border border-orange-200 dark:border-orange-800/50 bg-orange-50/50 dark:bg-orange-950/10 space-y-4">
            <div>
              <h3 className="font-semibold text-lg">Locataire Sélectionné</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Vérifiez les informations avant de continuer
              </p>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-lg bg-card border border-border/50">
              <div className="flex size-12 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 text-white font-bold text-sm">
                {getInitials(selectedTenant.firstName, selectedTenant.lastName)}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm">{selectedTenant.fullName}</h4>
                <p className="text-xs text-muted-foreground truncate">{selectedTenant.email}</p>
                <p className="text-xs text-muted-foreground">{selectedTenant.phone}</p>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={() => onSelectTenant(null as any)}
              className="w-full"
            >
              Changer de locataire
            </Button>
          </div>
        ) : (
          <div className="sticky top-0 p-6 rounded-xl border border-dashed border-border/50 bg-muted/30 text-center">
            <IconUserPlus className="size-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">
              Sélectionnez un locataire ou créez-en un nouveau
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

