"use client"

import * as React from "react"
import {
  IconBuilding,
  IconBuildingCommunity,
  IconChartBar,
  IconCurrencyDollar,
  IconFileDescription,
  IconHome,
  IconLayoutDashboard,
  IconSettings,
  IconHelp,
  IconBell,
  IconTool,
  IconUsers,
} from "@tabler/icons-react"

import { NavMain } from "@/components/layout/sidebar/nav-main"
import { NavSecondary } from "@/components/layout/sidebar/nav-secondary"
import { NavUser } from "@/components/layout/sidebar/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "Admin User",
    email: "admin@immogestion.ci",
    avatar: "/avatars/admin.jpg",
    role: "Super Admin",
  },
  navDashboard: [
    {
      title: "Vue d'ensemble",
      url: "/",
      icon: IconLayoutDashboard,
    },
  ],
  navGestion: [
    {
      title: "Propriétés",
      url: "/property",
      icon: IconBuilding,
      badge: 12,
    },
    {
      title: "Locataires",
      url: "/tenant",
      icon: IconUsers,
      badge: 8,
    },
    {
      title: "Contrats",
      url: "/contract",
      icon: IconFileDescription,
    },
  ],
  navFinanceOps: [
    {
      title: "Finances",
      url: "/finance",
      icon: IconCurrencyDollar,
    },
    {
      title: "Maintenance",
      url: "/maintenance",
      icon: IconTool,
      badge: 3,
    },
    {
      title: "Rapports",
      url: "/reports",
      icon: IconChartBar,
    },
  ],
  navSecondary: [
    {
      title: "Paramètres",
      url: "/settings",
      icon: IconSettings,
    },
    {
      title: "Aide & Support",
      url: "/help",
      icon: IconHelp,
    },
    {
      title: "Notifications",
      url: "/notifications",
      icon: IconBell,
      badge: 5,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" variant="inset" {...props}>
      <SidebarHeader className="pb-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="group/logo h-auto py-4 rounded-xl transition-all duration-300 hover:bg-sidebar-accent/50 hover:shadow-md"
            >
              <a href="/" className="flex items-center gap-3">
                <div className="relative flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 shadow-md transition-all duration-300 group-hover/logo:shadow-lg group-hover/logo:shadow-orange-500/30 group-hover/logo:scale-105">
                  <IconHome className="size-6 text-white transition-transform duration-300 group-hover/logo:rotate-12 group-hover/logo:scale-110" />
                </div>
                <div className="flex flex-col transition-transform duration-300 group-hover/logo:translate-x-1">
                  <span className="text-lg font-bold tracking-tight text-sidebar-foreground transition-colors duration-300 group-hover/logo:text-orange-600 dark:group-hover/logo:text-orange-400">
                    ImmoGestion
                  </span>
                  <span className="text-xs font-medium uppercase tracking-wider text-sidebar-muted transition-colors duration-300 group-hover/logo:text-orange-500/70">
                    Plateforme Admin
                  </span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarSeparator className="mx-3" />

      <SidebarContent className="px-1">
        {/* Dashboard Section */}
        <NavMain 
          items={data.navDashboard} 
          label="TABLEAU DE BORD"
        />
        
        {/* Gestion Section */}
        <NavMain 
          items={data.navGestion} 
          label="GESTION"
        />
        
        {/* Finance & Operations Section */}
        <NavMain 
          items={data.navFinanceOps} 
          label="FINANCES & OPS"
        />
        
        {/* Secondary Navigation */}
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>

      <SidebarSeparator className="mx-3" />

      <SidebarFooter className="pb-3">
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
