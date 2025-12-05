import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UIState {
  // Sidebar state
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  
  // View preferences
  propertyViewMode: 'grid' | 'table'
  tenantViewMode: 'grid' | 'table'
  contractViewMode: 'table'
  setPropertyViewMode: (mode: 'grid' | 'table') => void
  setTenantViewMode: (mode: 'grid' | 'table') => void
  
  // Filter preferences (persisted)
  savedFilters: {
    property?: {
      type?: string
      status?: string
    }
    tenant?: {
      status?: string
      property?: string
    }
    contract?: {
      status?: string
    }
  }
  setSavedFilters: (module: 'property' | 'tenant' | 'contract', filters: Record<string, string>) => void
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      // Sidebar
      sidebarOpen: true,
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      
      // View modes
      propertyViewMode: 'grid',
      tenantViewMode: 'table',
      contractViewMode: 'table',
      setPropertyViewMode: (mode) => set({ propertyViewMode: mode }),
      setTenantViewMode: (mode) => set({ tenantViewMode: mode }),
      
      // Saved filters
      savedFilters: {},
      setSavedFilters: (module, filters) =>
        set((state) => ({
          savedFilters: {
            ...state.savedFilters,
            [module]: filters,
          },
        })),
    }),
    {
      name: 'crm-ui-storage',
      partialize: (state) => ({
        savedFilters: state.savedFilters,
        propertyViewMode: state.propertyViewMode,
        tenantViewMode: state.tenantViewMode,
      }),
    }
  )
)

