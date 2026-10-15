import { useOutletContext } from 'react-router-dom'
import type { Community } from '@/data/communities'

export interface ComunidadContext {
  comunidad: Community
}

/** Comunidad activa dentro de /comunidades/:id (la entrega ComunidadLayout vía Outlet). */
export function useComunidad() {
  return useOutletContext<ComunidadContext>().comunidad
}
