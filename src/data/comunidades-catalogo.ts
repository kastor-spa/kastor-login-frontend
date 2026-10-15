/**
 * Catálogo de comunidades de la administración "upselling", extraído del HTML real
 * de /login/tareas/agregar (docs/referencias/tareas/02-pagina.html, 2026-10-14).
 * Compartido por los módulos que asignan comunidades (Tareas, etc.).
 */
export interface ComunidadOpcion {
  id: number
  nombre: string
}

export const comunidadesCatalogo: ComunidadOpcion[] = [
  { id: 11847, nombre: "Administradora Acodef Ltda" },
  { id: 10156, nombre: "COMUNIDAD CAMINO LA VILLA" },
  { id: 12040, nombre: "COMUNIDAD CAMINO LA VILLA" },
  { id: 12173, nombre: "COMUNIDAD CAMINO LA VILLA" },
  { id: 12182, nombre: "COMUNIDAD CAMINO LA VILLA" },
  { id: 8811, nombre: "COMUNIDAD EDIFICIO DON ALONSO" },
  { id: 10189, nombre: "COMUNIDAD EDIFICIO LOFTS BICENTENARIO" },
  { id: 9858, nombre: "CONDOMINIO CONCEPTO DESIGN SAN DAMIAN" },
  { id: 9748, nombre: "Comunidad Arrayan" },
  { id: 10761, nombre: "Comunidad Edificio Bellos Horizontes" },
  { id: 9780, nombre: "Comunidad Edificio Galvarino Gallardo" },
  { id: 10157, nombre: "Comunidad Edificio Valladolid" },
  { id: 9014, nombre: "Comunidad Notocar xD" },
  { id: 11846, nombre: "Comunidad Nueva España 1" },
  { id: 12164, nombre: "Comunidad QA 1" },
  { id: 9749, nombre: "Condominio Puertas Del Golf Oriente" },
  { id: 10512, nombre: "Condominio Step Sectores" },
  { id: 10181, nombre: "DEMO Otrospagos" },
  { id: 8476, nombre: "Edificio Don Angel" },
  { id: 10359, nombre: "Edificio ISP" },
  { id: 12128, nombre: "Edificio Nataly Farias" },
  { id: 12127, nombre: "Edificio Rebeca Lobos" },
  { id: 11150, nombre: "Edificio San Pablo" },
  { id: 8653, nombre: "Edificios Alderete Cook (sectores)" },
  { id: 10158, nombre: "NMB -Sin sector" },
  { id: 11534, nombre: "OTROSPAGOS V2" },
  { id: 8512, nombre: "P00020 Comunidad Edificio Torre Alcántara" },
  { id: 10682, nombre: "P00270 Comunidad Edificio Consorcio Vida" },
  { id: 11320, nombre: "P00450 Comunidad Edificio Matta 530" },
  { id: 9375, nombre: "P00650 Edificio Neruda" },
  { id: 9147, nombre: "P01640 Comunidad Edificio de oficinas San Andres Concepcion" },
  { id: 8756, nombre: "P01650 Paseo Los Heroes de Chillan." },
  { id: 9146, nombre: "P01750 Edificio Augusto Leguia 100" },
  { id: 10681, nombre: "Parque Santa Maria - Departamentos (Respaldo)" },
  { id: 11044, nombre: "Rapelco" },
  { id: 10760, nombre: "SII Integrado - REC - ESPOZ 3300 - BICENTENARIO" },
  { id: 11043, nombre: "SIS 2 - COMUNIDAD CAMINO LA VILLA" },
  { id: 10234, nombre: "q" },
]

export function nombreComunidad(id: number): string {
  return comunidadesCatalogo.find((c) => c.id === id)?.nombre ?? `Comunidad ${id}`
}
