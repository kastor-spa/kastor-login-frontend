# MAPA-tareas: Tareas

- **Ruta propuesta:** `/tareas` (legacy: `/login/tareas`; alta legacy: `/login/tareas/agregar`)
- **Categoría en navegación:** Administración
- **Evidencia:** `docs/referencias/tareas/01-pagina.html` (listado, HTML renderizado con sesión, 2026-10-14) y `docs/referencias/tareas/02-pagina.html` (formulario "Nueva tarea", 2026-10-14). Apoyo: `DESIGN-SYSTEM.md`, formato de `MAPA-sistema-cobranza.md`. Clases/rutas legacy: `.panel-heading`, `.panel-actions`, `.input-group-addon`, `.datepicker` (`dateFormat:'dd-mm-yy'`), `.table.table-striped.table-bordered.table-hover.table-condensed`, `$(".table").dataTable()`, `input[type=radio].comunidades[name=comunidades]`, `.tabla-herramientas > a.mostrar-tooltip` (script global del layout), `tr.activeLine`.
- **Fecha de mapeo:** 2026-10-14
- **Estado:** parcial (filtros, columnas y formulario de alta confirmados; filas, acciones por fila y presentación del estado sin evidencia porque la tabla viene vacía)

## 1. Propósito
Registrar tareas (texto libre con rango de fechas) asignadas a una comunidad y consultarlas filtrando por rango de fechas y por estado (Pendiente / Finalizada).

## 2. Core header
| Elemento | Texto exacto | Componente shadcn | Icono lucide | Evidencia |
|---|---|---|---|---|
| Título | Administrador de Tareas | CoreHeader `title` | — | `<div class="panel-heading"><strong>Administrador de Tareas</strong>` (01 y 02) |
| Subtítulo / contador | — | — | — | El legacy no muestra contador. Opcional "Cantidad: N" por consistencia (propuesta) |
| Ambiente | upselling | CoreHeader `environment` (Badge secondary) | — | `.navbar-brand-centered` = "upselling" |
| Acción primaria | Nueva tarea | Button (default, `bg-brand-orange hover:bg-brand-orange-hover text-white`) size=sm; abre Dialog | Plus | `<a href="/login/tareas/agregar" class="btn btn-warning btn-sm"><span class="glyphicon glyphicon-plus"></span> Nueva tarea</a>` |
| Acciones secundarias | — | — | — | No hay exportar ni otras acciones |
| Breadcrumb / volver | Volver | Button variant=outline size=sm, `Link to="/"` | ArrowLeft | 01: `<a href="/login/" class="btn btn-default btn-sm">…glyphicon-arrow-left… Volver</a>`. En 02 "Volver" apunta a `/login/tareas` (cerrar Dialog en la app nueva) |

Nota: igual que en Sistema Cobranza, el botón resaltado `btn-warning` de la barra de módulos sigue siendo "Usuarios" en ambas páginas; el Sidebar nuevo marca activo por ruta.

## 3. Filtros y búsqueda
Formulario `<form method="post" action="">` sobre la tabla, en una fila (`col-md-2` x 4 con `col-md-offset-2`). Cada control va dentro de `.input-group.input-group-sm` con prefijo `.input-group-addon`.

| Control | Opciones visibles | Componente | Notas |
|---|---|---|---|
| Desde | `name="fechaDesde"`, `id="desde"`, valor por defecto `01-10-2026` (primer día del mes en curso) | Input type=date o Popover + Calendar, con prefijo "Desde" + icono | Prefijo legacy: "Desde" + `glyphicon-calendar` → lucide `CalendarDays`. Formato legacy `dd-mm-yy` de jQuery UI = `DD-MM-YYYY` |
| Hasta | `name="fechaHasta"`, `id="hasta"`, valor por defecto `14-10-2026` (hoy) | Input type=date o Popover + Calendar, con prefijo "Hasta" + icono | Igual que Desde. Validar Hasta >= Desde (propuesta; el legacy no valida) |
| Estado | `name="tipo"`: "Todos" (value `0,1`, selected), "Pendiente" (`1`), "Finalizada" (`0`) | Select (shadcn) size=sm con prefijo "Estado" | En TS: `'todos' \| 'pendiente' \| 'finalizada'` o `'0,1' \| '1' \| '0'` si se quiere paridad con el POST |
| Buscar por fechas | botón submit | Button variant=outline size=sm | Legacy `btn btn-sm btn-default` con `<i class="icon-search">` → lucide `Search`. Texto exacto "Buscar por fechas" |
| Búsqueda / orden / paginación de la tabla | defaults de DataTables (`$(".table").dataTable()`) | Input + Search, TableHead ordenable (ArrowUpDown), pie con Anterior / Siguiente | Igual a `MAPA-sistema-cobranza.md` §3. Placeholder propuesto "Buscar tarea o comunidad" |

Notas de implementación: shadcn no tiene `popover` ni `calendar` instalados hoy en `src/components/ui`. Opción mínima: `Input type="date"` (sin dependencias). Opción completa: `pnpm dlx shadcn@latest add popover calendar`.

## 4. Listado
Tipo: tabla (`table table-striped table-bordered table-hover table-condensed` + DataTables por defecto). Equivalente: shadcn `Table` dentro de `Card`.

| Columna (texto exacto) | Tipo de dato | Alineación | Badge/estado | Notas |
|---|---|---|---|---|
| Fecha | fecha `DD-MM-YYYY` (inferido) | izq | — | Sin filas en la evidencia. Probablemente rango `fecha_inicio`–`fecha_hasta` o solo inicio: pendiente. Propuesta: mostrar "14-10-2026 → 20-10-2026" en `tabular-nums` |
| Tarea | texto largo (textarea) | izq | — | Truncar a 2 líneas (`line-clamp-2`) con Tooltip del texto completo (propuesta) |
| Comunidad | texto (nombre de comunidad) | izq | — | Una comunidad por tarea (radio en el alta) |
| Estado | enum Pendiente / Finalizada | centro | Badge (propuesta) | `th style="width:100px"`. Valores del filtro: 1 = Pendiente, 0 = Finalizada. Presentación real sin evidencia |
| Herramientas | acciones | centro | — | `th style="width:100px"`. Contenido sin evidencia; el layout global convierte `.tabla-herramientas > a` en enlaces con tooltip, lo que sugiere iconos con `title` |

Badge de estado propuesto:
| Valor | Valor TS | Icono lucide | Clases |
|---|---|---|---|
| Pendiente (1) | `'pendiente'` | Clock | Badge `bg-warning/15 text-brand-darkblue` |
| Finalizada (0) | `'finalizada'` | CircleCheck | Badge `bg-success/15 text-success` |

Acciones por fila (TODAS PROPUESTA, sin evidencia):
| Acción | Icono lucide | Confirmación | Notas |
|---|---|---|---|
| Marcar finalizada / reabrir | CircleCheck / RotateCcw | No | Solo si el estado es editable; toast success |
| Editar | Pencil | No | Reutiliza el Dialog de alta con valores precargados |
| Eliminar | Trash2 | AlertDialog "¿Eliminar esta tarea?" con botones "Cancelar" / "Eliminar" (destructive) | Texto propuesto |

Cada acción como `Button variant="ghost" size="icon"` con `Tooltip` (equivale a `.mostrar-tooltip`).

## 5. Formularios y modales
Legacy: página aparte `/login/tareas/agregar`, `<form class="form-horizontal" method="post">` con `<legend>Nueva tarea</legend>`. Propuesta: `Dialog` (ancho `sm:max-w-2xl`) titulado "Nueva tarea", abierto desde el botón del header.

| Campo | Placeholder / label | Tipo | Requerido | Componente |
|---|---|---|---|---|
| tarea | label "Tarea"; sin placeholder | textarea (`500px x 200px`, `resize: none`) | sí (`required`) | Textarea `rows={8} className="resize-none"` |
| fecha_inicio | label "Fecha desde"; `placeholder=""` | texto con `.datepicker` (`DD-MM-YYYY`), default `14-10-2026` (hoy) | sí (`required`) | Input type=date o Popover + Calendar, default hoy |
| fecha_hasta | label "Fecha hasta"; `placeholder=""` | texto con `.datepicker` (`DD-MM-YYYY`), default `14-10-2026` (hoy) | sí (`required`) | Input type=date o Popover + Calendar, default hoy |
| comunidades | sub-panel "Listado de Comunidades", tabla con columnas "Nombre comunidad" / "Asignar" | radio (`type="radio" class="comunidades" name="comunidades"`), 38 opciones, value = id de comunidad, ninguna preseleccionada | sí (validado por JS) | Combobox de selección única (Popover + Command con búsqueda) o lista con RadioGroup + Input de búsqueda dentro de `ScrollArea` |

Botones:
| Botón | Texto exacto | Legacy | Componente |
|---|---|---|---|
| Guardar | Guardar | `button type="submit" class="btn btn-warning"`, centrado | Button `bg-brand-orange hover:bg-brand-orange-hover` en `DialogFooter` |
| Volver | Volver | `a href="/login/tareas" class="btn btn-default btn-sm"` + `glyphicon-arrow-left` | Button variant=outline "Cancelar" en `DialogFooter` (o cerrar con la X) |
| Seleccionar todas | Seleccionar todas | COMENTADO en el HTML (`<!--<button type="button" class="todas btn btn-default btn-sm">…`) | No implementar |

JS inline del formulario (02):
```js
$("form").submit(function(){
  var cantidadCom = $('.comunidades:checked').length;
  if(cantidadCom < 1){ alert("¡Debes seleccionar al menos una Comunidad!"); return false; }
});
```
→ Validación en el submit del Dialog; mostrar el mensaje exacto "¡Debes seleccionar al menos una Comunidad!" como error bajo el campo (o `toast.error`).

Otros: `$(".datepicker").datepicker({dateFormat:'dd-mm-yy'})` (global). Estilo `tr.activeLine { background: orange; color: white; font-weight: bold; }` definido en 02 pero sin uso visible (probable resaltado de la fila seleccionada; en la app nueva: `bg-brand-orange text-white` en el item marcado del selector, propuesta).

Catálogo de comunidades del select (38, orden y textos exactos del HTML; nombres repetidos con ids distintos, uno con espacios finales):
```json
[{"id":11847,"nombre":"Administradora Acodef Ltda"},{"id":10156,"nombre":"COMUNIDAD CAMINO LA VILLA"},{"id":12040,"nombre":"COMUNIDAD CAMINO LA VILLA"},{"id":12173,"nombre":"COMUNIDAD CAMINO LA VILLA"},{"id":12182,"nombre":"COMUNIDAD CAMINO LA VILLA"},{"id":8811,"nombre":"COMUNIDAD EDIFICIO DON ALONSO"},{"id":10189,"nombre":"COMUNIDAD EDIFICIO LOFTS BICENTENARIO"},{"id":9858,"nombre":"CONDOMINIO CONCEPTO DESIGN SAN DAMIAN"},{"id":9748,"nombre":"Comunidad Arrayan"},{"id":10761,"nombre":"Comunidad Edificio Bellos Horizontes"},{"id":9780,"nombre":"Comunidad Edificio Galvarino Gallardo"},{"id":10157,"nombre":"Comunidad Edificio Valladolid"},{"id":9014,"nombre":"Comunidad Notocar xD"},{"id":11846,"nombre":"Comunidad Nueva España 1"},{"id":12164,"nombre":"Comunidad QA 1"},{"id":9749,"nombre":"Condominio Puertas Del Golf Oriente  "},{"id":10512,"nombre":"Condominio Step Sectores"},{"id":10181,"nombre":"DEMO Otrospagos"},{"id":8476,"nombre":"Edificio Don Angel"},{"id":10359,"nombre":"Edificio ISP"},{"id":12128,"nombre":"Edificio Nataly Farias"},{"id":12127,"nombre":"Edificio Rebeca Lobos"},{"id":11150,"nombre":"Edificio San Pablo"},{"id":8653,"nombre":"Edificios Alderete Cook (sectores)"},{"id":10158,"nombre":"NMB -Sin sector"},{"id":11534,"nombre":"OTROSPAGOS V2"},{"id":8512,"nombre":"P00020 Comunidad Edificio Torre Alcántara"},{"id":10682,"nombre":"P00270 Comunidad Edificio Consorcio Vida"},{"id":11320,"nombre":"P00450 Comunidad Edificio Matta 530"},{"id":9375,"nombre":"P00650 Edificio Neruda"},{"id":9147,"nombre":"P01640 Comunidad Edificio de oficinas San Andres Concepcion"},{"id":8756,"nombre":"P01650 Paseo Los Heroes de Chillan."},{"id":9146,"nombre":"P01750 Edificio Augusto Leguia 100"},{"id":10681,"nombre":"Parque Santa Maria - Departamentos (Respaldo)"},{"id":11044,"nombre":"Rapelco"},{"id":10760,"nombre":"SII Integrado - REC - ESPOZ 3300 - BICENTENARIO"},{"id":11043,"nombre":"SIS 2 - COMUNIDAD CAMINO LA VILLA"},{"id":10234,"nombre":"q"}]
```
Coincide en ids con el listado de `MAPA-sistema-cobranza.md` (salvo las 2 comunidades sin nombre de ese módulo, 10155 y 11042, que aquí no aparecen). Como hay nombres duplicados, el selector debe mostrar el id como texto secundario (`#10156`) para distinguirlos (propuesta).

## 6. Estados y alertas
- Vacío: evidenciado. La tabla viene sin filas para 01-10-2026 → 14-10-2026 con "Todos"; DataTables mostraría su texto por defecto. Propuesta: fila `colSpan=5` con icono `ClipboardList` y texto "No hay tareas en el rango seleccionado." + Button "Nueva tarea".
- Alertas visibles: ninguna en el HTML. Única alerta: `alert("¡Debes seleccionar al menos una Comunidad!")` al guardar sin comunidad.
- Éxito al guardar: sin evidencia (el legacy hace POST y redirige a algo no observado). Propuesta: `toast.success("Tarea creada")`, cerrar Dialog y refrescar listado.
- Confirmaciones (js-confirm): ninguna evidenciada. Eliminar con AlertDialog es propuesta.
- Cargando: Skeleton 5 columnas x 5 filas (propuesta).

## 7. Navegación saliente
- "Volver" del listado → `/` (index de comunidades, legacy `/login/`).
- "Nueva tarea" → legacy `/login/tareas/agregar`; en la app nueva abre Dialog sobre `/tareas` (opcional `?nueva=1`).
- "Volver" del formulario → `/login/tareas` (cerrar Dialog).
- Barra de módulos transversal idéntica a la de Sistema Cobranza (ya cubierta por el Sidebar).

## 8. Tipo de dato y mock
```ts
export type EstadoTarea = 'pendiente' | 'finalizada' // legacy: 1 Pendiente, 0 Finalizada
export type FiltroEstadoTarea = 'todos' | EstadoTarea // legacy name="tipo": '0,1' | '1' | '0'

export interface ComunidadOpcion {
  /** value del radio name="comunidades" */
  id: number
  /** texto de la columna "Nombre comunidad" (puede traer espacios finales) */
  nombre: string
}

export interface Tarea {
  id: number                 // no evidenciado; necesario para acciones por fila
  /** name="tarea" (textarea, required) */
  tarea: string
  /** name="fecha_inicio", DD-MM-YYYY (label "Fecha desde") */
  fechaInicio: string
  /** name="fecha_hasta", DD-MM-YYYY (label "Fecha hasta") */
  fechaHasta: string
  /** name="comunidades" (radio, una sola) */
  comunidadId: number
  comunidadNombre: string
  /** inferido del filtro "Estado"; el alta no tiene campo estado */
  estado: EstadoTarea
}

export interface FiltroTareas {
  fechaDesde: string // default primer día del mes (01-10-2026)
  fechaHasta: string // default hoy (14-10-2026)
  tipo: FiltroEstadoTarea // default 'todos'
}

export interface NuevaTareaInput {
  tarea: string
  fechaInicio: string // default hoy
  fechaHasta: string  // default hoy
  comunidadId: number | null // null hasta seleccionar; error "¡Debes seleccionar al menos una Comunidad!"
}

export const estadoTareaLabels: Record<EstadoTarea, string> = {
  pendiente: 'Pendiente',
  finalizada: 'Finalizada',
}
```

Mock sugerido en `src/data/tareas.ts` (registros ficticios, comunidades reales del catálogo; textos de tarea inventados solo para el mock):

| id | tarea | fechaInicio | fechaHasta | comunidadId | comunidadNombre | estado |
|---|---|---|---|---|---|---|
| 1 | Revisar cierre de gasto común de septiembre | 01-10-2026 | 05-10-2026 | 10156 | COMUNIDAD CAMINO LA VILLA | finalizada |
| 2 | Contactar administración por liberación pendiente | 07-10-2026 | 10-10-2026 | 11847 | Administradora Acodef Ltda | pendiente |
| 3 | Validar configuración SCA manual | 09-10-2026 | 14-10-2026 | 9858 | CONDOMINIO CONCEPTO DESIGN SAN DAMIAN | pendiente |
| 4 | Cargar lecturas de medidores | 14-10-2026 | 14-10-2026 | 11846 | Comunidad Nueva España 1 | pendiente |
| 5 | Enviar recordatorio de pago a copropietarios | 02-10-2026 | 03-10-2026 | 11044 | Rapelco | finalizada |

Catálogo `comunidadesTareas: ComunidadOpcion[]` = JSON de §5 (38 registros).

## Estructura propuesta de la vista
- `Core` > `CoreHeader title="Administrador de Tareas" environment="upselling" actions={[Volver (outline, ArrowLeft, to "/"), Nueva tarea (brand-orange, Plus)]}`.
- `CoreBody` > `Card`:
  - Barra de filtros (`form` con `onSubmit`): Desde (CalendarDays) / Hasta (CalendarDays) / Select Estado / Button "Buscar por fechas" (Search). En móvil apilar (`flex-wrap`).
  - `Separator` (equivale al `<hr>`).
  - Barra de tabla: Input búsqueda (Search).
  - `Table` 5 columnas ordenables (Fecha, Tarea, Comunidad, Estado, Herramientas); estado vacío; pie con paginación (ChevronLeft / ChevronRight).
- `Dialog` "Nueva tarea": Label + Textarea "Tarea"; grid 2 columnas "Fecha desde" / "Fecha hasta"; selector "Listado de Comunidades" (Combobox con búsqueda); `DialogFooter` con "Cancelar" (outline) y "Guardar" (brand-orange).
- `AlertDialog` de eliminación (propuesta).
- Componentes ya disponibles: button, card, table, select, input, textarea, label, badge, dialog, alert-dialog, tooltip, separator, skeleton, sonner. Faltan (si se elige la opción completa): `popover`, `calendar`, `command`, `radio-group`, `scroll-area`.
- Iconos lucide: ArrowLeft, Plus, CalendarDays, Search, ArrowUpDown, Clock, CircleCheck, RotateCcw, Pencil, Trash2, ClipboardList, ChevronLeft, ChevronRight, Check.

## 9. Pendiente de confirmar
- Contenido de la columna "Herramientas" (qué acciones existen: finalizar, editar, eliminar, ver). Necesario: HTML o captura de `/login/tareas` con un rango que tenga filas (por ejemplo Desde 01-01-2024, Estado "Todos").
- Presentación de "Estado" (texto, label Bootstrap, color) y formato de "Fecha" (inicio, fin o ambas). Misma captura anterior.
- Si existe pantalla de edición o confirmación de borrado (`js-confirm`, `alert`, modal). Necesario: HTML tras pasar el cursor/abrir cada acción de "Herramientas" (sin ejecutar borrados reales).
- Estado inicial de una tarea recién creada (se asume Pendiente; el formulario no tiene campo estado).
- Mensaje / redirección tras "Guardar". Necesario: HTML de la página que aparece después de guardar una tarea de prueba (si el usuario lo autoriza).
- Selección única vs. múltiple de comunidades: los inputs son `type="radio"` con el mismo `name` (una sola comunidad), pero el mensaje dice "al menos una Comunidad" y existía un botón "Seleccionar todas" comentado. Se mapea como selección única.
- Labels del formulario usan `for="textinput"` sin `id` correspondiente (deuda legacy); en la app nueva usar `htmlFor` correcto.
- Validación Hasta >= Desde: no existe en el legacy; es propuesta.
- `badge: '3'` en `navigation.ts` para Tareas no tiene respaldo en la evidencia (la tabla viene vacía); se dejó sin tocar por instrucción.
