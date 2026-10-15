# MAPA-sistema-cobranza: Sistema de Cobranza

- **Ruta propuesta:** `/cobranza` (legacy: `/login/dashboard/sca`)
- **Categoría en navegación:** Cobranza
- **Evidencia:** `docs/referencias/sistema-cobranza/01-pagina.html` (HTML renderizado desde el navegador con sesión, título "Administración - upselling"). Apoyo transversal: `docs/referencias/comunidades/04-pagina.html` (barra de navegación del index) y `DESIGN-SYSTEM.md`. Clases/rutas legacy: `.panel-heading`, `.panel-actions`, `.table.table-striped.table-bordered.table-hover.table-condensed`, `$(".table").dataTable()`, `select.change_com[data-id]`, POST `/login/dashboard/cambiar_sca`.
- **Fecha de mapeo:** 2026-10-14
- **Estado:** mapeado

## 1. Propósito
Listar todas las comunidades de la administración con el estado de su último gasto común (período, fecha de cierre, fecha y estado de la última liberación) y configurar por comunidad el tipo de Sistema de Cobranza Automática (SCA): Desactivado, Automático o Manual. Es una pantalla de solo lectura salvo por el select inline de "Tipo SCA".

## 2. Core header
| Elemento | Texto exacto | Componente shadcn | Icono lucide | Evidencia |
|---|---|---|---|---|
| Título | Sistema de Cobranza | CoreHeader `title` | — | `<div class="panel-heading"><strong>Sistema de Cobranza</strong>` |
| Subtítulo / contador | Cantidad: 40 | CoreHeader `description` | — | 40 `<tr>` en `<tbody>`; patrón "Listado de Comunidades ( Cantidad: 40 )" del index. El legacy no muestra contador en esta pantalla, se propone por consistencia |
| Ambiente | upselling | CoreHeader `environment` (Badge secondary) | — | `.navbar-brand-centered` = "upselling" |
| Acción primaria | — | — | — | no existe botón "agregar" ni exportar en la evidencia |
| Breadcrumb / volver | Volver | Button variant=outline size=sm, `Link to="/"` | ArrowLeft | `<a href="/login/" class="btn btn-default btn-sm"><span class="glyphicon glyphicon-arrow-left"></span> Volver</a>` en `.panel-actions` |

Nota de navegación: en el HTML de esta pantalla el botón resaltado (`btn-warning`) de la barra de módulos sigue siendo "Usuarios", no "Sistema Cobranza". En la app nueva el Sidebar marca activo por `location.pathname === '/cobranza'`, lo que corrige ese comportamiento. El texto del botón de navegación es "Sistema Cobranza " (con espacio final) y el heading del panel "Sistema de Cobranza"; se mantiene `title: 'Sistema Cobranza'` en `navigation.ts` y "Sistema de Cobranza" como título de la vista.

## 3. Filtros y búsqueda
El legacy inicializa DataTables con la configuración por defecto (`$(".table").dataTable()`), lo que entrega: caja "Search", orden por cualquier columna, selector de largo de página (10/25/50/100) y paginación. No hay filtros propios del módulo en el HTML.

| Control | Opciones visibles | Componente | Notas |
|---|---|---|---|
| Buscar | placeholder "Buscar comunidad" | Input + icono Search | Equivale al `.dataTables_filter` por defecto. Busca sobre "Nombre Comunidad" (y opcionalmente período) |
| Estado Liberación | Todos / Si Notificado / No Notificado / Sin liberación ("-") | Select | Propuesta (no existe en legacy). Valores tomados de la columna: 24 / 6 / 10 filas respectivamente |
| Tipo SCA | Todos / Desactivado / Automático / Manual | Select | Propuesta (no existe en legacy). Opciones exactas del `select.change_com` |
| Orden por columna | todas las columnas | TableHead clickable + ArrowUpDown | Comportamiento por defecto de DataTables |
| Paginación | Anterior / Siguiente + "Mostrando X a Y de 40" | Button ghost size=sm x2 + texto | Reemplaza `.dataTables_paginate` y `.dataTables_info`. Largo de página fijo 25 (o Select 10/25/50/100 si se quiere paridad) |

## 4. Listado
Tipo: tabla (`table-striped table-bordered table-hover table-condensed` + DataTables). Equivalente: shadcn `Table` dentro de `Card`, filas con `hover:bg-muted/50`, tamaño compacto.

| Columna (texto exacto) | Tipo de dato | Alineación | Badge/estado | Notas |
|---|---|---|---|---|
| Nombre Comunidad | texto | izq | — | Puede venir vacío (2 filas) o con espacios finales ("Condominio Puertas Del Golf Oriente  "). Nombres repetidos con ids distintos ("COMUNIDAD CAMINO LA VILLA" x4). Mostrar `font-medium text-brand-darkblue`; si vacío, mostrar "(sin nombre)" en `text-muted-foreground italic` |
| Último gasto común | período `MM-YYYY` o "-" | centro | — | Rango observado 10-2024 a 09-2026 (15 períodos distintos). 7 filas con "-". `tabular-nums` |
| Fecha último cierre gasto común | fecha-hora `YYYY-MM-DD HH:mm:ss` o "-" | izq | — | 7 filas con "-". Se propone mostrar `DD-MM-YYYY HH:mm` (formato del resto del proyecto) manteniendo el ISO en el dato |
| Fecha última liberación | fecha-hora `YYYY-MM-DD HH:mm:ss` o "-" | izq | — | 12 filas con "-" (7 sin cierre + 5 con cierre pero aún sin liberación) |
| Estado Liberación | enum: "Si Notificado" / "No Notificado" / "-" | centro | Badge con icono | 24 "Si Notificado", 6 "No Notificado", 10 "-". Ver mapeo de iconos abajo |
| Tipo SCA | enum 0/1/2 (select inline) | centro | Select | `select.change_com` con `data-id` numérico (id de comunidad) y opciones value 0 "Desactivado", 1 "Automático", 2 "Manual". 21 filas traen `selected` (9 Automático, 12 Manual); 19 filas no traen `selected` y el navegador muestra "Desactivado" |

Mapeo de "Estado Liberación" a iconos lucide y tokens:
| Valor legacy | Valor TS | Icono lucide | Clases |
|---|---|---|---|
| Si Notificado | `'notificado'` | CircleCheck | `text-success` |
| No Notificado | `'no_notificado'` | CircleAlert | `text-warning` |
| - | `null` | Minus | `text-muted-foreground` |

Acciones por fila:
| Acción | Icono lucide | Confirmación | Notas |
|---|---|---|---|
| Cambiar Tipo SCA | Select inline (ChevronDown nativo del trigger). Opcional: Power (Desactivado), Zap (Automático), Hand (Manual) dentro de cada SelectItem | No (el legacy dispara el POST en `change` sin confirmar) | Al cambiar: guardar y mostrar toast success "Configuración modificada exitosamente." o toast error "Ha surgido un inconveniente al modificar la información." Mientras guarda: deshabilitar el Select de esa fila (Loader2 animado al lado). Si falla, revertir al valor anterior |

Sin acciones de editar, eliminar ni ver detalle en la evidencia. Las celdas no son enlaces.

## 5. Formularios y modales
No hay formularios ni modales propios. Existe un `<div id="dialog" title="Basic dialog" style="display:none;">` vacío (jQuery UI) sin uso en esta pantalla.

| Campo | Placeholder / label | Tipo | Requerido | Componente |
|---|---|---|---|---|
| Tipo SCA (inline por fila) | Desactivado / Automático / Manual | select | sí (siempre tiene valor) | Select (shadcn) size=sm, `aria-label="Tipo SCA de {nombre}"` |

## 6. Estados y alertas
- Vacío: no hay estado vacío en la evidencia (40 filas). Para la búsqueda sin resultados usar el texto de DataTables por defecto adaptado: "No se encontraron comunidades que coincidan con la búsqueda." en una fila `TableCell colSpan=6`.
- Alertas visibles (info/success/warning/danger): ninguna en el HTML. El feedback del legacy es `alert()` nativo:
  - success: "Configuración modificada exitosamente." → `toast.success` (sonner)
  - error: "Ha surgido un inconveniente al modificar la información." → `toast.error` (sonner)
- Confirmaciones (js-confirm): ninguna. El cambio de Tipo SCA se guarda de inmediato.
- Cargando: proponer `Skeleton` de 6 columnas x 8 filas mientras llega el listado, y Select deshabilitado por fila durante el guardado.

## 7. Navegación saliente
- Enlaza a: `/` (index de comunidades) mediante "Volver" (`href="/login/"`).
- Barra de módulos superior (transversal, ya cubierta por el Sidebar): Usuarios `/login/usuarios`, Sistema Cobranza `/login/dashboard/sca`, Perfiles `/login/perfiles`, Tareas `/login/tareas`, UF `/login/dashboard/configuracion_uf`, Facturas Kastor pendientes `/login/dashboard/facturas`, Facturas Caleu pendientes `/login/dashboard/facturas_caleu3`, salir `/login/dashboard/salir`.
- No hay enlaces desde las filas hacia la comunidad ni hacia el gasto común.

## 8. Tipo de dato y mock
```ts
export type TipoSca = 0 | 1 | 2 // 0 Desactivado, 1 Automático, 2 Manual
export type EstadoLiberacion = 'notificado' | 'no_notificado'

export interface ComunidadSCA {
  /** data-id del select.change_com (id de comunidad). */
  id: number
  /** Puede venir vacío en el legacy. */
  nombre: string
  /** Período MM-YYYY; null cuando el legacy muestra "-". */
  ultimoGastoComun: string | null
  /** YYYY-MM-DD HH:mm:ss; null cuando el legacy muestra "-". */
  fechaUltimoCierre: string | null
  /** YYYY-MM-DD HH:mm:ss; null cuando el legacy muestra "-". */
  fechaUltimaLiberacion: string | null
  /** "Si Notificado" | "No Notificado" | "-" → null. */
  estadoLiberacion: EstadoLiberacion | null
  tipoSca: TipoSca
}

export const tipoScaLabels: Record<TipoSca, string> = {
  0: 'Desactivado',
  1: 'Automático',
  2: 'Manual',
}
```

Mock sugerido (8 registros reales tomados del HTML) en `src/data/sistema-cobranza.ts`:

| id | nombre | ultimoGastoComun | fechaUltimoCierre | fechaUltimaLiberacion | estadoLiberacion | tipoSca |
|---|---|---|---|---|---|---|
| 11847 | Administradora Acodef Ltda | 03-2026 | 2026-04-01 12:24:10 | 2026-04-01 18:55:03 | no_notificado | 0 (sin `selected`) |
| 10156 | COMUNIDAD CAMINO LA VILLA | 07-2026 | 2026-08-05 13:08:52 | 2026-08-05 13:11:21 | notificado | 1 |
| 10189 | COMUNIDAD EDIFICIO LOFTS BICENTENARIO | 09-2026 | 2026-10-07 11:35:21 | null | null | 0 (sin `selected`) |
| 9858 | CONDOMINIO CONCEPTO DESIGN SAN DAMIAN | 08-2026 | 2026-09-23 09:31:45 | null | null | 2 |
| 11846 | Comunidad Nueva España 1 | 09-2026 | 2026-10-05 16:43:44 | 2026-10-05 17:00:48 | notificado | 2 |
| 11044 | Rapelco | 08-2025 | 2025-08-04 10:24:21 | 2025-08-04 10:25:01 | no_notificado | 2 |
| 10359 | Edificio ISP | null | null | null | null | 0 (sin `selected`) |
| 10155 | (vacío) | null | null | null | null | 0 (sin `selected`) |

Distribución real para calibrar filtros y badges: 40 filas; Estado Liberación 24 / 6 / 10 (Si / No / "-"); Tipo SCA con `selected` 9 Automático + 12 Manual, 19 sin `selected`; períodos 10-2024 → 09-2026; fechas 2024-11-11 19:13:26 → 2026-10-14 12:33:09.

## Estructura propuesta de la vista
- `Core` > `CoreHeader title="Sistema de Cobranza" description="Cantidad: 40" environment="upselling" actions={<Button variant="outline" size="sm" asChild><Link to="/"><ArrowLeft /> Volver</Link></Button>}`.
- `CoreBody` > `Card`:
  - Barra de herramientas: `Input` búsqueda (Search) + `Select` Estado Liberación (Filter) + `Select` Tipo SCA.
  - `Table` con 6 `TableHead` ordenables; `TableCell` de Tipo SCA con `Select` controlado por fila.
  - Pie: texto "Mostrando X a Y de N" + `Button` Anterior / Siguiente (ChevronLeft / ChevronRight).
- `Toaster` (sonner) montado en `AppLayout`. Requiere agregar `sonner` (`pnpm dlx shadcn@latest add sonner`); hoy no está en `package.json` ni en `src/components/ui`.
- Iconos lucide usados: ArrowLeft, Search, Filter, ArrowUpDown, CircleCheck, CircleAlert, Minus, Loader2, ChevronLeft, ChevronRight (opcionales en SelectItem: Power, Zap, Hand).

## 9. Pendiente de confirmar
- Valor real de Tipo SCA en las 19 filas sin `selected`: el navegador muestra "Desactivado" (primera opción), pero no se puede distinguir entre "0 guardado" y "sin configurar". Se asume `0`. Resolver con una captura de la pantalla real o un segundo HTML tras cambiar un valor a Desactivado y recargar (si aparece `selected value="0"` la hipótesis se confirma).
- Dos filas con "Nombre Comunidad" vacío (ids 10155 y 11042): se desconoce si son comunidades sin nombre o datos corruptos. Mostrar "(sin nombre)" hasta confirmar.
- "COMUNIDAD CAMINO LA VILLA" aparece 4 veces con ids distintos (10156, 12040, 12173, 12182; las dos últimas con fechas idénticas). Se trata como registros distintos.
- Si la respuesta del POST `cambiar_sca` devuelve el valor guardado o solo un estado: el legacy ignora `msg` y siempre muestra el alert de éxito. En la app nueva se asume éxito = conservar el valor elegido.
- Configuración visible de DataTables en pantalla (largo de página mostrado, texto de paginación en inglés o español): solo se sabe que usa los defaults. Una captura del pie de la tabla lo confirmaría.
- Contador "Cantidad: 40" en el header es una propuesta por consistencia con el index; el legacy no lo muestra en esta vista.
- Captura adicional útil: pantalla completa en el navegador (para ver anchos de columna, el estado visual de los selects y el `alert()` tras un cambio).
