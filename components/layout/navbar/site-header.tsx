"use client"

import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

const pageTitles: Record<string, string> = {
  '/': 'Tableau de bord',
  '/property': 'Propriétés',
  '/property/new': 'Nouvelle Propriété',
}

function getPageTitle(pathname: string): string {
  // Check exact matches first
  if (pageTitles[pathname]) {
    return pageTitles[pathname]
  }
  
  // Check for dynamic routes
  if (pathname.startsWith('/property/')) {
    if (pathname.endsWith('/edit')) {
      return 'Modifier la Propriété'
    }
    return 'Détails de la Propriété'
  }
  
  // Default fallback
  return 'Gestion Immobilier'
}

export function SiteHeader() {
  const pathname = usePathname()
  const title = getPageTitle(pathname)

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-3 sm:px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1 min-w-[44px] min-h-[44px] touch-manipulation" />
        <Separator
          orientation="vertical"
          className="mx-1 sm:mx-2 data-[orientation=vertical]:h-4 hidden sm:block"
        />
        <h1 className="text-sm sm:text-base font-medium truncate flex-1 min-w-0">{title}</h1>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" asChild size="sm" className="hidden sm:flex touch-manipulation">
            <a
              href="https://github.com/shadcn-ui/ui/tree/main/apps/v4/app/(examples)/dashboard"
              rel="noopener noreferrer"
              target="_blank"
              className="dark:text-foreground"
            >
              GitHub
            </a>
          </Button>
        </div>
      </div>
    </header>
  )
}
