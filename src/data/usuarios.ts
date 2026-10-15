export type PerfilUsuario = 'Administrador' | 'Supervisor' | 'Operador'

export interface Usuario {
  id: string
  nombre: string
  correo: string
  perfil: PerfilUsuario
  /** Cantidad de comunidades asignadas. */
  comunidades: number
  /** DD-MM-YYYY HH:mm */
  ultimoAcceso: string
  activo: boolean
}

export const perfiles: PerfilUsuario[] = ['Administrador', 'Supervisor', 'Operador']

export const usuarios: Usuario[] = [
  { id: 'u01', nombre: 'Héctor Barrera', correo: 'hector.barrera@kastor.cl', perfil: 'Administrador', comunidades: 12, ultimoAcceso: '14-10-2026 18:32', activo: true },
  { id: 'u02', nombre: 'Álvaro Barahona', correo: 'alvaro.barahona@kastor.cl', perfil: 'Supervisor', comunidades: 4, ultimoAcceso: '14-10-2026 09:15', activo: true },
  { id: 'u03', nombre: 'Carolina Muñoz', correo: 'carolina.munoz@kastor.cl', perfil: 'Operador', comunidades: 3, ultimoAcceso: '13-10-2026 17:48', activo: true },
  { id: 'u04', nombre: 'Rodrigo Soto', correo: 'rodrigo.soto@kastor.cl', perfil: 'Operador', comunidades: 2, ultimoAcceso: '10-10-2026 11:02', activo: false },
  { id: 'u05', nombre: 'Daniela Reyes', correo: 'daniela.reyes@kastor.cl', perfil: 'Supervisor', comunidades: 5, ultimoAcceso: '14-10-2026 08:40', activo: true },
  { id: 'u06', nombre: 'Francisco Pizarro', correo: 'francisco.pizarro@kastor.cl', perfil: 'Operador', comunidades: 1, ultimoAcceso: '02-09-2026 16:21', activo: false },
  { id: 'u07', nombre: 'María José Tapia', correo: 'mj.tapia@kastor.cl', perfil: 'Administrador', comunidades: 12, ultimoAcceso: '14-10-2026 12:05', activo: true },
  { id: 'u08', nombre: 'Sebastián Vega', correo: 'sebastian.vega@kastor.cl', perfil: 'Operador', comunidades: 2, ultimoAcceso: '12-10-2026 19:10', activo: true },
]
