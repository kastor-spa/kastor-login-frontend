import { createStore } from '@/lib/create-store'

/**
 * Perfiles. Ver docs/mapas/MAPA-perfiles.md.
 * Nombres e ids reales del listado legacy. Permisos de DANILO reales (solo "Elementos");
 * los de los otros tres perfiles son sugeridos hasta capturar su pantalla de edición.
 */
export interface Perfil {
  id: number
  nombre: string
  /** ids de submodulos[] marcados */
  permisos: number[]
}

export const perfiles: Perfil[] = [
  { id: 2326, nombre: 'DANILO', permisos: [1] },
  { id: 2414, nombre: 'Perfil Qa', permisos: [1, 3, 109, 4, 69, 12, 13, 18, 19, 80, 33, 34] },
  { id: 2417, nombre: 'Sin remuneraciones', permisos: [1, 3, 109, 107, 217, 4, 69, 7, 8, 9, 10, 12, 13, 14, 15, 16, 18, 19, 20, 49, 30, 31, 29, 76, 80, 33, 34, 35, 55] },
  { id: 2331, nombre: 'Test 1', permisos: [12, 13, 18] },
]

export const perfilesStore = createStore<Perfil[]>(perfiles)
