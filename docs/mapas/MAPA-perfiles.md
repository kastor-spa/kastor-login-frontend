# MAPA-perfiles: Perfiles

- **Ruta propuesta:** `/perfiles` (listado), `/perfiles/nuevo` (alta), `/perfiles/:id` (edición). Legacy: `/login/perfiles`, `/login/perfiles/agregar`, `/login/perfiles/modificar/:id`, `/login/perfiles/eliminar/:id`.
- **Categoría en navegación:** Administración
- **Evidencia:** HTML renderizado desde el navegador con sesión (2026-10-14), título "Administración - upselling":
  - `docs/referencias/perfiles/01-pagina.html` → listado `/login/perfiles`
  - `docs/referencias/perfiles/02-pagina.html` → formulario `/login/perfiles/agregar` (archivo con codificación mixta: la línea "Configuración" viene en ISO-8859-1, el resto en UTF-8)
  - `docs/referencias/perfiles/03-pagina.html` → formulario `/login/perfiles/modificar/2326` (perfil DANILO)
  - Clases / JS legacy: `.panel-heading`, `.panel-actions`, `.tabla-herramientas`, `table.table-striped.table-bordered.table-hover.table-condensed` + `$(".table").dataTable()`, `.row-especial` (layout en columnas CSS `column-width: 25em`), `tr.activeLine` (fila marcada: fondo naranja, texto blanco, negrita), `button.todas`, `button.todas_sub[data-id]`, `input.checksub.check{grupoId}[name="submodulos[]"]`.
- **Fecha de mapeo:** 2026-10-14
- **Estado:** mapeado

## 1. Propósito
Administrar los perfiles de permisos de la administración: listar perfiles, crear uno nuevo con un nombre y un conjunto de submódulos habilitados (checkboxes agrupados por módulo), modificar nombre y permisos de uno existente, y eliminarlo con confirmación.

## 2. Core header

### Listado (`/perfiles`)
| Elemento | Texto exacto | Componente shadcn | Icono lucide | Evidencia |
|---|---|---|---|---|
| Título | Administrador de Perfiles_ (legacy, con guion bajo final) → usar "Administrador de Perfiles" | CoreHeader `title` | — | `<strong>Administrador de Perfiles_</strong>` en 01; en 02/03 el mismo panel dice "Administrador de Perfiles" sin guion. Se asume errata del legacy |
| Subtítulo / contador | — (propuesta: "Cantidad: 4") | CoreHeader `description` | — | 4 filas en `<tbody>`. El legacy no muestra contador |
| Ambiente | upselling | CoreHeader `environment` | — | `<title>Administración - upselling</title>` |
| Acción primaria | Nuevo perfil | Button (default, `bg-brand-orange hover:bg-brand-orange-hover`) size=sm, `Link to="/perfiles/nuevo"` | Plus | `<a href="/login/perfiles/agregar" class="btn btn-warning btn-sm"><span class="glyphicon glyphicon-plus"></span> Nuevo perfil</a>` |
| Volver | Volver | Button variant=outline size=sm, `Link to="/"` | ArrowLeft | `<a href="/login/" class="btn btn-default btn-sm">…glyphicon-arrow-left… Volver</a>` (hay otro "Volver" con `href=""` comentado en el HTML; no se usa) |

### Formulario (`/perfiles/nuevo` y `/perfiles/:id`)
| Elemento | Texto exacto | Componente shadcn | Icono lucide | Evidencia |
|---|---|---|---|---|
| Título de panel | Administrador de Perfiles | CoreHeader `title` | — | `<strong>Administrador de Perfiles</strong>` en 02 y 03 |
| Subtítulo (alta) | Nuevo perfil | CoreHeader `description` o `CardTitle` | — | `<legend>Nuevo perfil</legend>` |
| Subtítulo (edición) | Modificar perfil **{nombre}** | CoreHeader `description` (nombre en `font-semibold`) | — | `<legend>Modificar perfil <b>DANILO</b></legend>` |
| Volver | Volver | Button variant=outline size=sm, `Link to="/perfiles"` | ArrowLeft | `<a href="/login/perfiles" class="btn btn-default btn-sm">…arrow-left… Volver</a>` |
| Guardar | Guardar | Button (default `bg-brand-orange`), `type="submit"`, centrado al pie | Save | `<div class="text-center"><button type="submit" class="btn btn-warning">Guardar</button></div>` |

## 3. Filtros y búsqueda
Solo en el listado. DataTables por defecto (`$(".table").dataTable()`): búsqueda global, orden por columna, selector de largo de página y paginación.

| Control | Opciones visibles | Componente | Notas |
|---|---|---|---|
| Buscar | placeholder propuesto "Buscar perfil" | Input + icono Search | Sustituye `.dataTables_filter`. Filtra por "Perfil" |
| Orden | columna "Perfil" | TableHead clickable + ArrowUpDown | "Herramientas" no ordenable (en DataTables sí lo era por defecto; no tiene sentido) |
| Paginación | Anterior / Siguiente + "Mostrando X a Y de N" | Button ghost size=sm (ChevronLeft / ChevronRight) | Largo de página 10 (default DataTables) |

En el formulario no hay búsqueda de permisos en el legacy. Propuesta opcional (no existe en legacy): Input "Buscar permiso" sobre el catálogo; marcar como mejora, no como paridad.

## 4. Listado
Tipo: tabla. shadcn `Table` dentro de `Card`, compacta, `hover:bg-muted/50`.

| Columna (texto exacto) | Tipo de dato | Alineación | Badge/estado | Notas |
|---|---|---|---|---|
| Perfil | texto | izq | — | Nombre libre, mayúsculas tal cual se guardaron ("DANILO", "Perfil Qa"). Orden observado alfabético |
| Herramientas | acciones | centro | — | `style="width:100px;"`, celda `.tabla-herramientas` con tooltips jQuery UI (`title`) |

Acciones por fila:
| Acción | Icono lucide | Confirmación | Notas |
|---|---|---|---|
| Editar perfil | SquarePen (equivale a `glyphicon-edit`) | No | Button ghost size=icon + Tooltip "Editar perfil", `aria-label="Editar perfil {nombre}"`. Navega a `/perfiles/{id}` (legacy `/login/perfiles/modificar/{id}`) |
| Eliminar perfil | X (equivale a `glyphicon-remove`); alternativa Trash2 | Sí: AlertDialog con texto exacto "¿Está seguro de eliminar el perfil {nombre}?" | Button ghost size=icon `text-destructive` + Tooltip "Eliminar perfil". Legacy: `onclick="if (! confirm('¿Está seguro de eliminar el perfil DANILO?')) { return false; }"` y GET `/login/perfiles/eliminar/{id}`. AlertDialog: título = texto del confirm, botones "Cancelar" / "Eliminar" (AlertDialogAction `variant="destructive"`). Los botones del AlertDialog no tienen texto en el legacy (es `confirm()` nativo: Aceptar/Cancelar) |

## 5. Formularios y modales
Recomendación: página propia (`/perfiles/nuevo`, `/perfiles/:id`) en lugar de Sheet/Dialog, porque el catálogo tiene 9 grupos y 89 checkboxes que el legacy reparte en columnas (`column-width: 25em`, masonry). Si se prefiere modal, usar `Sheet side="right"` con `className="sm:max-w-5xl"` y scroll interno; el header (Nombre + "Seleccionar todas") debe quedar fijo.

Estructura (orden del legacy):
1. `Card` "Nuevo perfil" / "Modificar perfil {nombre}".
2. Campo Nombre perfil (fila con label a la izquierda, input a la derecha: `form-horizontal`, `col-md-4` + `col-md-4`).
3. `Card` anidado "Permisos" con botón global "Seleccionar todas" en el header.
4. Grilla masonry de `Card` por grupo (`columns-1 md:columns-2 xl:columns-3 gap-2`, cada card `break-inside-avoid mb-2`). Cada card: header con nombre del grupo (strong) + botón "Seleccionar todas"; body: tabla de 2 columnas sin encabezado (label | checkbox).
5. Botón "Guardar" centrado.

| Campo | Placeholder / label | Tipo | Requerido | Componente |
|---|---|---|---|---|
| nombre | label "Nombre perfil", sin placeholder | text | sí (`required` HTML5) | Label + Input (`autocomplete="off"`, el form legacy lo tiene) |
| id_perfil | — | hidden numérico | solo edición | no se renderiza; viene de `:id` (`<input type="hidden" name="id_perfil" value="2326">`) |
| submodulos[] | label = texto del permiso (columna izquierda) | checkbox múltiple, value numérico | al menos 1 (validación JS al enviar) | Checkbox + Label, fila completa clickable |

Botones del formulario:
| Botón | Texto exacto | Alcance | Comportamiento legacy | Componente |
|---|---|---|---|---|
| Global | Seleccionar todas / Deseleccionar todas | todos los grupos | `.todas`: si su texto es "Seleccionar todas" cambia a "Deseleccionar todas" y dispara click en cada `.todas_sub` que diga "Seleccionar todas"; al revés en el segundo click | Button variant=outline size=sm (icono CheckCheck / Square) |
| Por grupo | Seleccionar todas / Deseleccionar todas | un grupo (`data-id` = id de grupo) | `.todas_sub`: marca todos los `.check{id}` no marcados (o desmarca los marcados) y alterna el texto | Button variant=outline size=sm |
| Envío | Guardar | formulario | submit POST a la misma URL | Button `type="submit"` naranja |

Comportamiento a replicar y a corregir:
- El texto del botón en el legacy es un toggle manual, no refleja el estado real: en el perfil DANILO (con "Elementos" marcado) todos los botones dicen "Seleccionar todas". En la app nueva derivar el estado: si todos los permisos del grupo están marcados → "Deseleccionar todas", en otro caso → "Seleccionar todas". Igual para el global. Opcional: Checkbox tri-estado (`checked="indeterminate"`) en el header del grupo junto al botón.
- Fila marcada (`tr.activeLine`): `bg-brand-orange text-white font-semibold` (legacy: `background: orange; color: white; font-weight: bold`). En el HTML de edición, las filas marcadas vienen con `class="activeLine"` desde el servidor.
- Las filas "INFORMES" son checkboxes reales (tienen value propio: 11, 59, 60, 61, 62) con label en `<b>`. No marcan ni desmarcan a los ítems siguientes; son un permiso más que además actúa como separador visual. Renderizar con label `font-bold uppercase` y un `Separator` encima, conservando el checkbox.
- Validación al enviar: si no hay ningún `.checksub` marcado → `alert("¡Debes seleccionar al menos un submodulo!")` y se cancela el envío. Reemplazar por mensaje inline (`Alert variant="destructive"` sobre el botón Guardar o `toast.error`) con el texto exacto.

## 6. Estados y alertas
- Vacío (listado): sin evidencia. Proponer fila única "No hay perfiles registrados." y en búsqueda sin resultados "No se encontraron perfiles que coincidan con la búsqueda."
- Alertas visibles (info/success/warning/danger): ninguna en los tres HTML (no hay flash messages tras guardar/eliminar en la evidencia).
- Validación: "¡Debes seleccionar al menos un submodulo!" (texto exacto, sin tilde en "submodulo"). "Nombre perfil" requerido (validación nativa del navegador; proponer "Ingresa el nombre del perfil." como mensaje inline, marcado como propuesta).
- Confirmaciones (js-confirm): "¿Está seguro de eliminar el perfil {nombre}?" → AlertDialog.
- Cargando: Skeleton de filas en listado; en el formulario, Button Guardar con Loader2 y `disabled` mientras guarda.
- Éxito tras guardar/eliminar: sin evidencia (el legacy redirige). Proponer `toast.success` y volver a `/perfiles`.

## 7. Navegación saliente
- Listado: "Volver" → `/` (legacy `/login/`); "Nuevo perfil" → `/perfiles/nuevo`; editar → `/perfiles/{id}`; eliminar → acción (legacy GET `/login/perfiles/eliminar/{id}`).
- Formulario: "Volver" → `/perfiles`.
- Transversal: el módulo vive en el dropdown "Herramientas" de la navbar legacy (Tareas, Usuarios, Perfiles, Sistema Cobranza) y en la barra de botones. En los tres HTML el botón resaltado (`btn-warning`) de la barra sigue siendo "Usuarios"; el Sidebar nuevo marcará activo por ruta `/perfiles*`.

## 8. Tipo de dato y mock
```ts
/** value de input[name="submodulos[]"] */
export type PermisoId = number

export interface Permiso {
  id: PermisoId
  /** Texto exacto de la columna izquierda (sin etiquetas HTML). */
  label: string
  /** true para las filas "<b>INFORMES</b>" (checkbox real que además separa secciones). */
  esEncabezado?: boolean
}

export interface PermisoGrupo {
  /** data-id del botón .todas_sub y sufijo de la clase .check{id}. */
  id: number
  /** Texto exacto del <strong> del panel (incluye prefijo "DEV" y dobles espacios del legacy). */
  nombre: string
  permisos: Permiso[]
}

export interface Perfil {
  id: number
  nombre: string
  permisos: PermisoId[]
}

export interface PerfilFormValues {
  nombre: string
  permisos: PermisoId[] // min 1
}
```

Catálogo: `src/data/permisos.ts` exporta `catalogoPermisos: PermisoGrupo[]` con los 9 grupos y 89 permisos de la tabla de abajo, **en el mismo orden** (el orden de los values no es correlativo y debe respetarse). Etiqueta visible propuesta del grupo: `nombre.replace(/^DEV\s+/, '')` (p. ej. "Crear Unidades"), conservando `nombre` exacto en el dato; ver Pendiente.

Mock `src/data/perfiles.ts` (registros reales del listado; permisos solo confirmados para DANILO):

| id | nombre | permisos |
|---|---|---|
| 2326 | DANILO | `[1]` (Elementos), confirmado en 03 |
| 2414 | Perfil Qa | sin evidencia; sugerido `[4, 69, 7, 8, 9, 10]` (grupo DEV Configuracion completo) |
| 2417 | Sin remuneraciones | sin evidencia; sugerido todos los permisos menos el grupo 5 (`DEV  Remuneraciones`), coherente con el nombre |
| 2331 | Test 1 | sin evidencia; sugerido `[12, 13, 14, 15, 18, 19]` |

## Catálogo de permisos (íntegro, orden del HTML)
Columnas: id de grupo (`data-id`), nombre exacto del grupo, posición dentro del grupo, value del checkbox, label exacto, tipo de fila, estado en perfil DANILO (03). El catálogo es idéntico en 02 y 03 (89 checkboxes en ambos; verificado con parser). En DANILO solo hay 1 checkbox `checked` (value 1).

| Grupo id | Grupo (texto exacto) | # | value | Label exacto | Tipo de fila | DANILO |
|---|---|---|---|---|---|---|
| 1 | `DEV Crear Unidades` | 1 | 1 | Elementos | módulo | marcado |
| 1 | `DEV Crear Unidades` | 2 | 3 | Unidades | módulo |  |
| 1 | `DEV Crear Unidades` | 3 | 109 | Listado de Unidades | módulo |  |
| 1 | `DEV Crear Unidades` | 4 | 107 | Carga de comunidad | módulo |  |
| 1 | `DEV Crear Unidades` | 5 | 217 | Sectores | módulo |  |
| 2 | `DEV Configuracion` | 1 | 4 | Datos Comunidad | módulo |  |
| 2 | `DEV Configuracion` | 2 | 69 | Sistema de Cobranza | módulo |  |
| 2 | `DEV Configuracion` | 3 | 7 | Proveedores | módulo |  |
| 2 | `DEV Configuracion` | 4 | 8 | Categorias | módulo |  |
| 2 | `DEV Configuracion` | 5 | 9 | Subcategorias | módulo |  |
| 2 | `DEV Configuracion` | 6 | 10 | Categorias de Recargo | módulo |  |
| 3 | `DEV Gastos Comunidad` | 1 | 1010 | Ordenes de Compra | módulo |  |
| 3 | `DEV Gastos Comunidad` | 2 | 220 | Seguros CCS | módulo |  |
| 3 | `DEV Gastos Comunidad` | 3 | 12 | Ver Gastos | módulo |  |
| 3 | `DEV Gastos Comunidad` | 4 | 13 | Ingresar Gastos | módulo |  |
| 3 | `DEV Gastos Comunidad` | 5 | 14 | Asignar Gastos | módulo |  |
| 3 | `DEV Gastos Comunidad` | 6 | 87 | Codigos de Cuenta | módulo |  |
| 3 | `DEV Gastos Comunidad` | 7 | 15 | Pagar Gastos | módulo |  |
| 3 | `DEV Gastos Comunidad` | 8 | 17 | Medidores | módulo |  |
| 3 | `DEV Gastos Comunidad` | 9 | 231 | Libro de compras SII | módulo |  |
| 3 | `DEV Gastos Comunidad` | 10 | 11 | **INFORMES** | encabezado (checkbox real, label en negrita) |  |
| 3 | `DEV Gastos Comunidad` | 11 | 84 | Egresos 2 | informe |  |
| 3 | `DEV Gastos Comunidad` | 12 | 1011 | Cartola Proveedores | informe |  |
| 3 | `DEV Gastos Comunidad` | 13 | 16 | Egresos | informe |  |
| 3 | `DEV Gastos Comunidad` | 14 | 54 | Detalle Gastos | informe |  |
| 4 | `DEV Pagos G. C.` | 1 | 18 | Pagos Unidad | módulo |  |
| 4 | `DEV Pagos G. C.` | 2 | 19 | Recargos Unidad | módulo |  |
| 4 | `DEV Pagos G. C.` | 3 | 20 | Reversa de Pagos | módulo |  |
| 4 | `DEV Pagos G. C.` | 4 | 59 | **INFORMES** | encabezado (checkbox real, label en negrita) |  |
| 4 | `DEV Pagos G. C.` | 5 | 49 | Ingresos | informe |  |
| 4 | `DEV Pagos G. C.` | 6 | 68 | Informe de Pagos | informe |  |
| 5 | `DEV  Remuneraciones` | 1 | 21 | Trabajadores | módulo |  |
| 5 | `DEV  Remuneraciones` | 2 | 22 | Remuneraciones | módulo |  |
| 5 | `DEV  Remuneraciones` | 3 | 26 | Asignacion Familiar | módulo |  |
| 5 | `DEV  Remuneraciones` | 4 | 60 | **INFORMES** | encabezado (checkbox real, label en negrita) |  |
| 5 | `DEV  Remuneraciones` | 5 | 44 | Libro de Remuneraciones | informe |  |
| 5 | `DEV  Remuneraciones` | 6 | 45 | Recibo de Liquidaciones | informe |  |
| 5 | `DEV  Remuneraciones` | 7 | 90 | Detalle Leyes Sociales | informe |  |
| 5 | `DEV  Remuneraciones` | 8 | 202 | Reporte de liquidaciones | informe |  |
| 5 | `DEV  Remuneraciones` | 9 | 56 | Detalle de Remuneraciones | informe |  |
| 5 | `DEV  Remuneraciones` | 10 | 47 | Archivos Previred | informe |  |
| 5 | `DEV  Remuneraciones` | 11 | 201 | Nomina de pago trabajadores | informe |  |
| 5 | `DEV  Remuneraciones` | 12 | 203 | Archivos LRE | informe |  |
| 5 | `DEV  Remuneraciones` | 13 | 46 | Recibo de Anticipos | informe |  |
| 5 | `DEV  Remuneraciones` | 14 | 111 | Consolidacion de Sueldos | informe |  |
| 5 | `DEV  Remuneraciones` | 15 | 108 | Declaracion Jurada de Rentas | informe |  |
| 5 | `DEV  Remuneraciones` | 16 | 73 | Abrir Remuneraciones | informe |  |
| 5 | `DEV  Remuneraciones` | 17 | 81 | Impresion Hojas Foliadas | informe |  |
| 6 | `DEV  Banco` | 1 | 79 | Provision Transbank | módulo |  |
| 6 | `DEV  Banco` | 2 | 30 | Cuentas Bancarias | módulo |  |
| 6 | `DEV  Banco` | 3 | 31 | Chequeras | módulo |  |
| 6 | `DEV  Banco` | 4 | 29 | Ingreso a Cuenta | módulo |  |
| 6 | `DEV  Banco` | 5 | 76 | Conciliacion Bancaria | módulo |  |
| 6 | `DEV  Banco` | 6 | 50 | Fondos | módulo |  |
| 6 | `DEV  Banco` | 7 | 222 | Rendimiento de fondos | módulo |  |
| 6 | `DEV  Banco` | 8 | 61 | **INFORMES** | encabezado (checkbox real, label en negrita) |  |
| 6 | `DEV  Banco` | 9 | 230 | Flujo de caja | informe |  |
| 6 | `DEV  Banco` | 10 | 85 | Libro Banco | informe |  |
| 6 | `DEV  Banco` | 11 | 221 | Estado de Resultado | informe |  |
| 6 | `DEV  Banco` | 12 | 78 | Estado Financiero | informe |  |
| 6 | `DEV  Banco` | 13 | 51 | Cartera de Cheques | informe |  |
| 6 | `DEV  Banco` | 14 | 28 | Cartola Caja Chica | informe |  |
| 7 | `DEV Cobranza G.C.` | 1 | 80 | Liberar Gasto Comun | módulo |  |
| 7 | `DEV Cobranza G.C.` | 2 | 89 | No Prorrateables | módulo |  |
| 7 | `DEV Cobranza G.C.` | 3 | 33 | Minutas | módulo |  |
| 7 | `DEV Cobranza G.C.` | 4 | 35 | Cartola por Unidad | módulo |  |
| 7 | `DEV Cobranza G.C.` | 5 | 62 | **INFORMES** | encabezado (checkbox real, label en negrita) |  |
| 7 | `DEV Cobranza G.C.` | 6 | 91 | Asistencia Asamblea | informe |  |
| 7 | `DEV Cobranza G.C.` | 7 | 34 | Cobranza de Gastos Comunes | informe |  |
| 7 | `DEV Cobranza G.C.` | 8 | 37 | Aviso de cobro (Boletas) | informe |  |
| 7 | `DEV Cobranza G.C.` | 9 | 38 | Aviso suspension de servicios | informe |  |
| 7 | `DEV Cobranza G.C.` | 10 | 42 | Elementos por Unidad | informe |  |
| 7 | `DEV Cobranza G.C.` | 11 | 43 | Planilla General de Cobranza | informe |  |
| 7 | `DEV Cobranza G.C.` | 12 | 104 | Prorrateo por elementos | informe |  |
| 7 | `DEV Cobranza G.C.` | 13 | 110 | Detalle Interes multa | informe |  |
| 7 | `DEV Cobranza G.C.` | 14 | 55 | Reporte de Morosos | informe |  |
| 7 | `DEV Cobranza G.C.` | 15 | 88 | Mailing | informe |  |
| 7 | `DEV Cobranza G.C.` | 16 | 67 | Movimientos Unidad | informe |  |
| 7 | `DEV Cobranza G.C.` | 17 | 75 | Log Usuarios | informe |  |
| 7 | `DEV Cobranza G.C.` | 18 | 74 | Desprorratear | informe |  |
| 10 | `DEV Historico` | 1 | 211 | Ver gastos | módulo |  |
| 11 | `DEV TCEL` | 1 | 1001 | Usuarios / Unidades | módulo |  |
| 11 | `DEV TCEL` | 2 | 1002 | Biblioteca | módulo |  |
| 11 | `DEV TCEL` | 3 | 1003 | Solicitudes / Novedades | módulo |  |
| 11 | `DEV TCEL` | 4 | 1004 | Reservas / Instalaciones | módulo |  |
| 11 | `DEV TCEL` | 5 | 1005 | Comunicados | módulo |  |
| 11 | `DEV TCEL` | 6 | 1006 | Citaciones | módulo |  |
| 11 | `DEV TCEL` | 7 | 1007 | Votaciones | módulo |  |
| 11 | `DEV TCEL` | 8 | 1008 | Configuración | módulo |  |

Resumen por grupo: 1 → 5, 2 → 6, 3 → 14, 4 → 6, 5 → 17, 6 → 14, 7 → 18, 10 → 1, 11 → 8. Total 89. Ids de grupo 8 y 9 no aparecen (salto en la numeración).

## Estructura propuesta de la vista
- `src/pages/perfiles.tsx` (listado): `Core` > `CoreHeader title="Administrador de Perfiles" environment="upselling" actions={[Volver (outline, ArrowLeft), Nuevo perfil (naranja, Plus)]}` > `CoreBody` > `Card` con Input búsqueda (Search), `Table` (Perfil | Herramientas), pie con paginación. `AlertDialog` controlado por estado `perfilAEliminar`.
- `src/pages/perfil-form.tsx` (alta/edición, misma vista; modo según `:id`): `CoreHeader` con Volver → `/perfiles`; `Card` con Label/Input "Nombre perfil"; `Card` "Permisos" con botón global; grilla `columns-*` de `Card` por `PermisoGrupo`, cada uno con `Table` sin header de filas `Checkbox`; fila marcada `bg-brand-orange text-white font-semibold`; Button "Guardar" centrado.
- Componentes shadcn: Card, Button, Input, Label, Checkbox, Table, Tooltip, AlertDialog, Alert, Separator, Skeleton, sonner (todos ya existen en `src/components/ui`).
- Iconos lucide: ArrowLeft, Plus, Search, ArrowUpDown, SquarePen, X (o Trash2), ChevronLeft, ChevronRight, Save, CheckCheck, Square, Loader2.

## 9. Pendiente de confirmar
- Prefijo "DEV" en todos los grupos (y dobles espacios en "DEV  Remuneraciones" y "DEV  Banco"): parece propio del ambiente "upselling"/desarrollo. Confirmar si en producción los grupos se llaman igual o sin prefijo; mientras tanto mostrar sin "DEV " y guardar el nombre exacto.
- Guion bajo final en "Administrador de Perfiles_" del listado: se asume errata (en 02/03 no aparece).
- Permisos de "Perfil Qa", "Sin remuneraciones" y "Test 1": no hay HTML de su edición; el mock usa valores sugeridos. Resolver guardando `/login/perfiles/modificar/2414`, `/2417` y `/2331`.
- Comportamiento de las filas "INFORMES" (values 11, 59, 60, 61, 62): son checkboxes independientes en el HTML; se desconoce si el sistema las trata como permiso real o solo como contenedor de menú. Se mantienen como permisos.
- Mensajes posteriores a guardar o eliminar (flash success/danger) y si el nombre debe ser único: no hay evidencia. Captura útil: listado inmediatamente después de crear, editar y eliminar un perfil.
- Validación del nombre vacío: solo `required` nativo; el texto del navegador no está en la evidencia.
- Configuración visible de DataTables (largo de página, idioma de "Search"/"Showing"): defaults; una captura del listado lo confirmaría.
- Si un perfil en uso por usuarios puede eliminarse (y qué mensaje sale): sin evidencia.
