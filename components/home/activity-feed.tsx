"use client"

import * as React from "react"
import { 
  IconAlertTriangle, 
  IconQuestionMark, 
  IconFileText,
  IconAlertCircle,
  IconChevronRight
} from "@tabler/icons-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

type ActivityType = "complaint" | "question" | "request" | "incident"

interface Activity {
  id: string
  type: ActivityType
  title: string
  address: string
  timestamp: string
  avatar?: string
  tenantName?: string
}

const activityConfig: Record<ActivityType, { 
  label: string
  color: string
  bgColor: string
  icon: React.ElementType
}> = {
  complaint: {
    label: "Plainte",
    color: "text-rose-600 dark:text-rose-400",
    bgColor: "bg-rose-100 dark:bg-rose-500/20",
    icon: IconAlertTriangle,
  },
  question: {
    label: "Question",
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-100 dark:bg-amber-500/20",
    icon: IconQuestionMark,
  },
  request: {
    label: "Demande",
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-100 dark:bg-blue-500/20",
    icon: IconFileText,
  },
  incident: {
    label: "Incident",
    color: "text-orange-600 dark:text-orange-400",
    bgColor: "bg-orange-100 dark:bg-orange-500/20",
    icon: IconAlertCircle,
  },
}

// Mock data
const mockActivities: Activity[] = [
  {
    id: "1",
    type: "complaint",
    title: "Pas de chauffage dans la salle de bain",
    address: "9101 Boulevard Sunrise Meadows",
    timestamp: "12 Août 2024, 9:29",
    tenantName: "Marie Koné",
  },
  {
    id: "2",
    type: "question",
    title: "Animaux de compagnie autorisés?",
    address: "123 Avenue de l'Érable Springfield",
    timestamp: "20 Juil 2024, 9:29",
    tenantName: "Jean Diallo",
  },
  {
    id: "3",
    type: "request",
    title: "Demande de facture",
    address: "2223 Grove Avenue Magnolia",
    timestamp: "12 Juil 2024, 9:29",
    tenantName: "Awa Touré",
  },
  {
    id: "4",
    type: "incident",
    title: "Problèmes de ventilation",
    address: "5678 Rue Tranquil Heights",
    timestamp: "30 Juin 2024, 9:29",
    tenantName: "Moussa Bamba",
  },
  {
    id: "5",
    type: "complaint",
    title: "Fuite d'eau dans la cuisine",
    address: "456 Rue des Palmiers",
    timestamp: "28 Juin 2024, 14:30",
    tenantName: "Fatou Sow",
  },
]

function ActivityItem({ activity }: { activity: Activity }) {
  const config = activityConfig[activity.type]
  const Icon = config.icon

  return (
    <div className="flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-muted/50">
      <Avatar className="size-10 shrink-0">
        <AvatarImage src={activity.avatar} />
        <AvatarFallback className="bg-muted text-xs">
          {activity.tenantName?.split(" ").map(n => n[0]).join("") || "?"}
        </AvatarFallback>
      </Avatar>
      
      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-medium leading-tight line-clamp-2">
            {activity.title}
          </p>
          <Badge 
            variant="secondary" 
            className={cn(
              "shrink-0 text-[10px] font-medium",
              config.bgColor,
              config.color
            )}
          >
            {config.label}
          </Badge>
        </div>
        <p className="text-muted-foreground text-xs line-clamp-1">
          {activity.address}
        </p>
        <p className="text-muted-foreground/70 text-[10px]">
          {activity.timestamp}
        </p>
      </div>
    </div>
  )
}

interface ActivityFeedProps {
  activities?: Activity[]
  maxItems?: number
}

export function ActivityFeed({ 
  activities = mockActivities,
  maxItems = 5 
}: ActivityFeedProps) {
  const displayedActivities = activities.slice(0, maxItems)
  const totalCount = activities.length

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-base font-semibold">
              Mon Activité
            </CardTitle>
            {totalCount > 0 && (
              <Badge 
                variant="secondary" 
                className="bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400 text-[10px] px-1.5"
              >
                {totalCount}+
              </Badge>
            )}
          </div>
          <Button variant="ghost" size="sm" className="text-xs h-7">
            Voir tout
            <IconChevronRight className="ml-1 size-3" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-[340px] px-4 pb-4">
          <div className="space-y-1">
            {displayedActivities.map((activity) => (
              <ActivityItem key={activity.id} activity={activity} />
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

