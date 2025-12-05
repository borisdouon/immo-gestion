"use client"

import { cn } from "@/lib/utils"
import { 
  IconBuilding, 
  IconHome, 
  IconBuildingEstate, 
  IconBuildingStore,
  IconMapPin,
  IconUser,
  IconInfoCircle,
  IconCircleFilled,
  IconEdit
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import type { PropertyType, PropertyStatus } from "@/lib/types/property"

interface SummaryData {
  type: PropertyType
  name: string
  status: PropertyStatus
  address: {
    street: string
    city: string
    postalCode: string
    country: string
  }
  owner: {
    name: string
    email: string
    phone: string
  }
  description: string
  unitsCount?: number
}

interface StepSummaryProps {
  data: SummaryData
  onEdit: (step: number) => void
}

const typeIcons = {
  'Maison': IconHome,
  'Villa': IconBuildingEstate,
  'Immeuble': IconBuilding,
  'Commercial': IconBuildingStore,
}

const typeColors = {
  'Maison': 'from-blue-500 to-cyan-500',
  'Villa': 'from-purple-500 to-pink-500',
  'Immeuble': 'from-orange-500 to-amber-500',
  'Commercial': 'from-emerald-500 to-teal-500',
}

const statusColors: Record<PropertyStatus, string> = {
  'Libre': 'text-emerald-600',
  'Réservé': 'text-amber-600',
  'Occupé': 'text-blue-600',
  'En Maintenance': 'text-orange-600',
}

function SummaryCard({ 
  title, 
  icon: Icon, 
  children, 
  onEdit,
  step 
}: { 
  title: string
  icon: React.ComponentType<{ className?: string }>
  children: React.ReactNode
  onEdit: (step: number) => void
  step: number
}) {
  return (
    <div className="rounded-xl border border-border/50 bg-card p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icon className="size-4 text-orange-600" />
          <h4 className="font-medium text-sm">{title}</h4>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-7 text-xs text-muted-foreground hover:text-orange-600"
          onClick={() => onEdit(step)}
        >
          <IconEdit className="size-3 mr-1" />
          Modifier
        </Button>
      </div>
      <div className="space-y-2 text-sm">
        {children}
      </div>
    </div>
  )
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-right">{value || '—'}</span>
    </div>
  )
}

export function StepSummary({ data, onEdit }: StepSummaryProps) {
  const TypeIcon = typeIcons[data.type]
  const typeColor = typeColors[data.type]
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center pb-4 border-b">
        <div className="inline-flex size-14 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 mb-3">
          <IconCircleFilled className="size-6 text-emerald-600" />
        </div>
        <h3 className="text-lg font-semibold">Vérifiez vos informations</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Assurez-vous que tout est correct avant de créer la propriété
        </p>
      </div>
      
      {/* Property Type Badge */}
      <div className="flex items-center gap-4 rounded-2xl bg-orange-50 dark:bg-orange-950/20 p-4">
        <div className={cn(
          "flex size-14 items-center justify-center rounded-xl text-white shadow-lg",
          `bg-gradient-to-br ${typeColor}`
        )}>
          <TypeIcon className="size-7" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Type de bien</p>
          <p className="text-lg font-semibold">{data.type}</p>
        </div>
      </div>
      
      {/* Info Grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        <SummaryCard title="Informations" icon={IconInfoCircle} onEdit={onEdit} step={2}>
          <SummaryItem label="Nom" value={data.name} />
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Statut</span>
            <span className={cn("font-medium", statusColors[data.status])}>
              {data.status}
            </span>
          </div>
        </SummaryCard>
        
        <SummaryCard title="Localisation" icon={IconMapPin} onEdit={onEdit} step={3}>
          <SummaryItem label="Rue" value={data.address.street} />
          <SummaryItem label="Ville" value={data.address.city} />
          <SummaryItem label="Pays" value={data.address.country} />
        </SummaryCard>
        
        <SummaryCard title="Propriétaire" icon={IconUser} onEdit={onEdit} step={4}>
          <SummaryItem label="Nom" value={data.owner.name} />
          <SummaryItem label="Email" value={data.owner.email} />
          <SummaryItem label="Téléphone" value={data.owner.phone} />
        </SummaryCard>
        
        {data.type === 'Immeuble' && (
          <SummaryCard title="Logements" icon={IconHome} onEdit={onEdit} step={6}>
            <SummaryItem label="Unités" value={`${data.unitsCount || 0} logement(s)`} />
          </SummaryCard>
        )}
      </div>
      
      {/* Description preview */}
      {data.description && (
        <div className="rounded-xl border border-border/50 bg-card p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-sm">Description</h4>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 text-xs text-muted-foreground hover:text-orange-600"
              onClick={() => onEdit(5)}
            >
              <IconEdit className="size-3 mr-1" />
              Modifier
            </Button>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-3">
            {data.description}
          </p>
        </div>
      )}
      
      {/* Final note */}
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-800 dark:bg-emerald-950/20">
        <p className="text-sm text-emerald-700 dark:text-emerald-300">
          ✅ <strong>Prêt à créer !</strong> Cliquez sur "Créer la propriété" pour finaliser.
        </p>
      </div>
    </div>
  )
}


