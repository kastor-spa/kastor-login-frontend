import { Outlet } from 'react-router-dom'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/layout/app-sidebar'
import { Toaster } from '@/components/ui/sonner'

/**
 * Estructura base: Sidebar + Core.
 * El Core (header + body) lo arma cada página con <Core>, <CoreHeader> y <CoreBody>.
 */
export function AppLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="min-w-0">
        <Outlet />
      </SidebarInset>
      <Toaster position="top-right" richColors />
    </SidebarProvider>
  )
}
