"use client"

import { type Icon } from "@tabler/icons-react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

interface NavItem {
  title: string
  url: string
  icon?: Icon
  badge?: number
}

interface NavMainProps {
  items: NavItem[]
  label?: string
}

// Map icon display names to animation classes
const getIconAnimationClass = (iconName: string): string => {
  const animationMap: Record<string, string> = {
    IconLayoutDashboard: "icon-dashboard",
    IconBuilding: "icon-building",
    IconBuildingCommunity: "icon-building",
    IconUsers: "icon-users",
    IconFileDescription: "icon-document",
    IconCurrencyDollar: "icon-currency",
    IconTool: "icon-tool",
    IconChartBar: "icon-chart",
    IconSettings: "icon-settings",
    IconHelp: "icon-help",
    IconBell: "icon-bell",
  }
  return animationMap[iconName] || ""
}

export function NavMain({ items, label }: NavMainProps) {
  const pathname = usePathname()

  const isActive = (url: string) => {
    if (url === "/") {
      return pathname === "/"
    }
    return pathname === url || pathname.startsWith(`${url}/`)
  }

  return (
    <SidebarGroup className="py-1">
      {label && (
        <SidebarGroupLabel className="px-3 text-xs font-semibold uppercase tracking-wider text-sidebar-muted">
          {label}
        </SidebarGroupLabel>
      )}
      <SidebarGroupContent>
        <SidebarMenu className="gap-1 px-1">
          {items.map((item) => {
            const active = isActive(item.url)
            const iconAnimClass = item.icon ? getIconAnimationClass(item.icon.displayName || "") : ""
            
            return (
              <SidebarMenuItem key={item.title}>
                <Link href={item.url}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    isActive={active}
                    className={cn(
                      // Base styles
                      "group relative h-12 rounded-xl px-3",
                      // Enhanced transitions
                      "transition-all duration-300 ease-out",
                      // Hover slide effect with gradient background
                      "sidebar-item-hover",
                      // Hover lift effect
                      "hover:translate-x-1 hover:shadow-sm",
                      // Active state
                      active && [
                        "bg-gradient-to-r from-orange-500/15 via-amber-500/10 to-transparent",
                        "text-orange-700 dark:text-orange-400",
                        "font-medium",
                        "shadow-sm",
                        // Left indicator bar
                        "before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2",
                        "before:w-[3px] before:rounded-full before:bg-gradient-to-b before:from-orange-500 before:to-amber-500",
                        "before:active-indicator",
                      ],
                      // Inactive hover states
                      !active && [
                        "text-sidebar-foreground/80",
                        "hover:text-orange-600 dark:hover:text-orange-400",
                      ]
                    )}
                  >
                    {/* Icon with glow effect */}
                    {item.icon && (
                      <div className="relative flex items-center justify-center">
                        {/* Animated glow ring */}
                        <span className="icon-glow-ring" />
                        <item.icon
                          className={cn(
                            "relative size-5 shrink-0",
                            "transition-all duration-300 ease-out",
                            // Icon-specific animation class
                            iconAnimClass,
                            // Color states
                            active 
                              ? "text-orange-600 dark:text-orange-400" 
                              : "text-sidebar-foreground/60 group-hover:text-orange-500 dark:group-hover:text-orange-400"
                          )}
                        />
                      </div>
                    )}
                    
                    {/* Title with subtle slide */}
                    <span className={cn(
                      "truncate text-[15px]",
                      "transition-transform duration-300 ease-out",
                      "group-hover:translate-x-0.5"
                    )}>
                      {item.title}
                    </span>
                    
                    {/* Animated badge */}
                    {item.badge !== undefined && item.badge > 0 && (
                      <SidebarMenuBadge
                        className={cn(
                          "sidebar-badge ml-auto flex h-6 min-w-6 items-center justify-center rounded-full px-2 text-xs font-bold",
                          "transition-all duration-300 ease-out",
                          "group-hover:scale-110 group-hover:shadow-md",
                          active
                            ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-orange-500/30"
                            : "bg-sidebar-accent text-sidebar-foreground/70 group-hover:bg-orange-500 group-hover:text-white"
                        )}
                      >
                        {item.badge}
                      </SidebarMenuBadge>
                    )}
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
