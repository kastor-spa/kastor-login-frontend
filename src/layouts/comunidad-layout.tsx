import { Fragment, type CSSProperties } from 'react'
import { Navigate, Outlet, useLocation, useParams } from 'react-router-dom'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { ComunidadSidebar } from '@/components/layout/comunidad-sidebar'
import { Toaster } from '@/components/ui/sonner'
import { communities } from '@/data/communities'
import type { ComunidadContext } from '@/hooks/use-comunidad'

/**
 * Dashboard de una comunidad (/comunidades/:id): Sidebar de 2 niveles + Core.
 * Ancho total = riel de productos (3rem) + panel de Kastor Contable (16rem).
 */
export function ComunidadLayout() {
  const { id } = useParams()
  const { pathname } = useLocation()
  const comunidad = communities.find((c) => c.id === id)

  if (!comunidad) return <Navigate to="/" replace />

  return (
    <SidebarProvider style={{ '--sidebar-width': '19rem' } as CSSProperties}>
      <ComunidadSidebar comunidad={comunidad} />
      <SidebarInset className="min-w-0">
        {/* key por ruta: cada módulo remonta y repite la animación de entrada. */}
        <Fragment key={pathname}>
          <Outlet context={{ comunidad } satisfies ComunidadContext} />
        </Fragment>
      </SidebarInset>
      <Toaster position="top-right" richColors />
    </SidebarProvider>
  )
}
