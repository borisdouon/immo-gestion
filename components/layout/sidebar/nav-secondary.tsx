"use client"

import * as React from "react"
import { type Icon } from "@tabler/icons-react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"

interface NavItem {
  title: string
  url: string
  icon: Icon
  badge?: number
}

// Map icon display names to animation classes
const getIconAnimationClass = (iconName: string): string => {
  const animationMap: Record<string, string> = {
    IconSettings: "icon-settings",
    IconHelp: "icon-help",
    IconBell: "icon-bell",
  }
  return animationMap[iconName] || ""
}

export function NavSecondary({
  items,
  ...props
}: {
  items: NavItem[]
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const pathname = usePathname()

  const isActive = (url: string) => {
    return pathname === url || pathname.startsWith(`${url}/`)
  }

  return (
    <SidebarGroup {...props}>
      <SidebarSeparator className="mx-2 mb-2" />
      <SidebarGroupContent>
        <SidebarMenu className="gap-1 px-1">
          {items.map((item) => {
            const active = isActive(item.url)
            const iconAnimClass = getIconAnimationClass(item.icon.displayName || "")
            
            return (
              <SidebarMenuItem key={item.title}>
                <Link href={item.url}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    isActive={active}
                    className={cn(
                      // Base styles
                      "group relative h-11 rounded-xl px-3",
                      // Enhanced transitions
                      "transition-all duration-300 ease-out",
                      // Hover slide effect
                      "sidebar-item-hover",
                      // Hover lift
                      "hover:translate-x-1",
                      // Active state
                      active && [
                        "bg-sidebar-accent",
                        "text-sidebar-accent-foreground",
                        "font-medium",
                        "shadow-sm",
                      ],
                      // Inactive hover states
                      !active && [
                        "text-sidebar-foreground/70",
                        "hover:text-sidebar-foreground",
                      ]
                    )}
                  >
                    {/* Icon with glow effect */}
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
                            ? "text-sidebar-accent-foreground"
                            : "text-sidebar-foreground/50 group-hover:text-orange-500 dark:group-hover:text-orange-400"
                        )}
                      />
                    </div>
                    
                    {/* Title with subtle slide */}
                    <span className={cn(
                      "truncate text-[15px]",
                      "transition-transform duration-300 ease-out",
                      "group-hover:translate-x-0.5"
                    )}>
                      {item.title}
                    </span>
                    
                    {/* Animated notification badge */}
                    {item.badge !== undefined && item.badge > 0 && (
                      <SidebarMenuBadge
                        className={cn(
                          "sidebar-badge ml-auto flex h-6 min-w-6 items-center justify-center rounded-full px-2 text-xs font-bold",
                          "transition-all duration-300 ease-out",
                          "group-hover:scale-110 group-hover:shadow-md",
                          "bg-gradient-to-r from-orange-500 to-red-500 text-white",
                          "shadow-orange-500/30"
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
