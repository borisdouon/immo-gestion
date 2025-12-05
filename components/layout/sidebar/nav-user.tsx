"use client"

import {
  IconChevronUp,
  IconLogout,
  IconSettings,
  IconUser,
} from "@tabler/icons-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

interface NavUserProps {
  user: {
    name: string
    email: string
    avatar: string
    role?: string
  }
}

export function NavUser({ user }: NavUserProps) {
  const { isMobile } = useSidebar()

  // Get initials from name
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="group relative flex w-full items-start gap-3 rounded-lg border border-transparent bg-transparent p-2.5 text-left transition-all duration-200 hover:border-sidebar-border hover:bg-sidebar-accent/30 data-[state=open]:border-sidebar-border data-[state=open]:bg-sidebar-accent/40 [&[data-state=open]_svg]:rotate-180"
            >
              {/* Avatar - floating on left */}
              <div className="relative shrink-0">
                <Avatar className="h-12 w-12 rounded-full ring-2 ring-orange-400/30 ring-offset-0 transition-all duration-200 group-hover:ring-orange-500/50 dark:ring-orange-600/30 dark:group-hover:ring-orange-500/40">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-full bg-gradient-to-br from-orange-500 to-amber-500 text-sm font-semibold text-white">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                {/* Status indicator */}
                <div className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-sidebar bg-emerald-500" />
              </div>
              
              {/* User info - inline to the right */}
              <div className="min-w-0 flex-1 space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="truncate text-sm font-semibold text-sidebar-foreground">
                    {user.name}
                  </span>
                </div>
                
                {user.role && (
                  <Badge 
                    variant="secondary" 
                    className="h-4 w-fit rounded px-1.5 text-[10px] font-medium bg-orange-100/80 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300"
                  >
                    {user.role}
                  </Badge>
                )}
                
                <span className="block truncate text-xs text-sidebar-muted">
                  {user.email}
                </span>
              </div>
              
              {/* Chevron - bottom right */}
              <IconChevronUp className="mt-auto shrink-0 size-4 text-sidebar-muted/40 transition-all duration-200 group-hover:text-sidebar-foreground/60" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-60 rounded-xl"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <div className="flex items-center gap-3 px-3 py-3">
              <Avatar className="h-11 w-11 rounded-lg">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 text-sm font-semibold text-white">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left leading-tight">
                <span className="text-[15px] font-semibold">{user.name}</span>
                <span className="text-sm text-muted-foreground">
                  {user.email}
                </span>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem className="gap-3 px-3 py-2.5 text-[15px]">
                <IconUser className="size-5 text-muted-foreground" />
                <span>Mon Profil</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-3 px-3 py-2.5 text-[15px]">
                <IconSettings className="size-5 text-muted-foreground" />
                <span>Paramètres</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-3 px-3 py-2.5 text-[15px] text-red-600 focus:bg-red-50 focus:text-red-700 dark:text-red-400 dark:focus:bg-red-950/50">
              <IconLogout className="size-5" />
              <span>Déconnexion</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
