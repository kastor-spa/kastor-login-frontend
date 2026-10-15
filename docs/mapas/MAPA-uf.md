# MAPA-uf: Configuración UF

- **Ruta propuesta:** `/uf` (legacy: `/login/dashboard/configuracion_uf?anio=AAAA`)
- **Categoría en navegación:** Cobranza
- **Evidencia:** `docs/referencias/uf/01-pagina.html` (HTML renderizado desde el navegador con sesión, 2026-10-14, año 2026 seleccionado). Apoyo: `DESIGN-SYSTEM.md`, `docs/mapas/MAPA-sistema-cobranza.md`. Clases/ids legacy: `.panel-heading.clearfix`, `.alert.alert-info`, `.well.well-sm`, `#yearSelect`, `#lastEditDisplay`, `#btnConfigClave`, `#btnAction` / `#btnText` / `#btnIcon`, `#monthsGrid`, `.icono-info-uf`, `#authModal`, `#configClaveModal`, `#recuperarClaveUfModal`, `#bienvenidaUfModal`, `#mensajeUfModal`, `.bienvenida-uf-*`, `.mensaje-uf-*`.
- **Fecha de mapeo:** 2026-10-14
- **Estado:** mapeado

## 1. Propósito
Registrar un valor UF por período (mes) para un año, centralizado para todas las comunidades de la administración que trabajan con presupuesto en UF. Ese valor lo usa el reporte "Control Presupuestario". La edición está protegida por una "contraseña maestra" que solo puede crear/usar un perfil ADMIN.

## 2. Core header
| Elemento | Texto exacto | Componente shadcn | Icono lucide | Evidencia |
|---|---|---|---|---|
| Título | Configuración UF | CoreHeader `title` | — | `<strong style="line-height: 30px;">Configuración UF</strong>` |
| Ayuda | (sin texto; `title="Ver información"`) | Button variant=ghost size=icon + Tooltip "Ver información", abre Dialog Bienvenida | CircleHelp (`text-info`) | `button.btn-link onclick="abrirModalBienvenidaUf()"` con `glyphicon-info-sign.icono-info-uf` |
| Ambiente | upselling | CoreHeader `environment` | — | `.navbar-brand-centered` |
| Acción primaria | — (las acciones están en la barra de control, ver §3) | — | — | — |
| Volver | Volver | Button variant=outline size=sm, `Link to="/"` | ArrowLeft | `<a href="/login/" class="btn btn-default btn-sm pull-right">` con `glyphicon-arrow-left` |

Nota: igual que en Sistema Cobranza, el botón resaltado (`btn-warning`) de la barra legacy sigue siendo "Usuarios"; el Sidebar nuevo marca activo `/uf`.

### Alert info (debajo del header, dentro de CoreBody)
`Alert` (variante info: `border-info/30 bg-info/5 text-foreground`, icono `Info` en `text-info`). Texto exacto:

> El valor UF ingresado en esta sección será utilizado en todas las comunidades que trabajen con presupuesto en UF para calcular la variación de cobranza en el reporte **Control Presupuestario** según el período correspondiente. **Este valor no se relaciona con el cálculo de Remuneraciones.**

## 3. Filtros y barra de control
Legacy: `.well.well-sm` con `.row` de tres `.col-md-4`. Propuesta: `Card` compacta (`bg-muted`, `py-3`) con `flex flex-wrap items-center justify-between gap-3`.

| Control | Texto / opciones visibles | Componente | Icono lucide | Notas |
|---|---|---|---|---|
| Período | Label "Seleccionar Período:"; opciones "Año 2028", "Año 2027", "Año 2026" (selected), "Año 2025" (orden descendente) | Label + Select size=sm (`w-36`) | — | `onchange="cambiarAnioUf()"` navega a `/login/dashboard/configuracion_uf?anio=<valor>` (recarga completa). En React: `useSearchParams` `?anio=`; si hay edición en curso se pierde (el legacy no avisa). El rango de años lo entrega el servidor; no se sabe la regla (ver §10) |
| Ayuda del período | Tooltip: "El sistema utilizará el valor UF del período correspondiente al consultar el reporte Control Presupuestario." | Tooltip sobre icono | Info (`text-info size-3.5`) | `span.glyphicon-info-sign.icono-info-uf[data-toggle=tooltip]` (no se inicializa el tooltip Bootstrap, el navegador muestra el `title` nativo) |
| Última edición | "Última edición: 04/09/2026 20:41" | texto `text-xs text-muted-foreground` | History (opcional) | `#lastEditDisplay.text-muted.small`. Formato `DD/MM/YYYY HH:mm`. Valor del servidor, no se actualiza por JS tras guardar (se recarga la página) |
| Crear contraseña | "Crear contraseña" | Button variant=outline size=sm | KeyRound | `#btnConfigClave.btn-default` (`fa-key`). Siempre visible y habilitado; el texto NO cambia aunque la contraseña ya exista (el modal sí cambia) |
| Acción principal | "Editar montos en UF" / "Guardar montos en UF" / "Guardando..." | Button size=sm | SquarePen / Save / Loader2 | `#btnAction` con estados, ver §6 |

## 4. Listado
Tipo: grilla de 12 tarjetas (`#monthsGrid.row` renderizado por `renderGrid()`), una por mes, Enero a Diciembre. Legacy `col-md-3 col-sm-6` → propuesta `grid gap-4 sm:grid-cols-2 xl:grid-cols-4`.

Markup legacy de cada tarjeta (texto literal de `renderGrid`):
```
div.col-md-3.col-sm-6
  div.panel.panel-default (margin-bottom 20px; transition all .3s)
    div.panel-heading > div.row
      div.col-xs-8: <strong>{Mes}</strong> + span.glyphicon-info-sign.icono-info-uf[title="El sistema utilizará el valor UF del período correspondiente al consultar el reporte Control Presupuestario."]
      div.col-xs-4.text-right: si valor === 0 → <i class="fa-solid fa-circle-info text-info" title="Sin registro">
    div.panel-body > div.input-group
      span.input-group-addon "$"
      input[type=text].form-control.text-right  (disabled si !isEditing)
        value = isEditing ? valorParaEditarUf(val) : formatearMontoUf(val)
        style en edición: border-color #f0ad4e; background-color #fffaf0
```

| Elemento (texto exacto) | Tipo de dato | Alineación | Badge/estado | Componente propuesto |
|---|---|---|---|---|
| Nombre del mes ("Enero" … "Diciembre") | texto fijo | izq | — | `CardHeader` + `CardTitle` `text-sm font-semibold text-brand-darkblue` |
| Icono ayuda del mes | tooltip (mismo texto que el del período) | junto al nombre | — | Tooltip + Info `text-info size-3.5` |
| Indicador vacío | solo si monto = 0; `title="Sin registro"` | der | icono info | Tooltip "Sin registro" + CircleDashed (o Info) `text-info`. Opcional Badge variant=outline "Sin registro" (el legacy solo muestra el icono) |
| Monto | número UF con 2 decimales y coma decimal, sin separador de miles: `1,00`, `60000,00`, `70000,00`, `0,00` | der (`text-right tabular-nums`) | — | `CardContent` > InputGroup: prefijo "$" (`span` `border-input bg-muted px-3 text-muted-foreground`) + `Input` `text-right` |

Valores 2026 en la evidencia (`valoresUfEndpoint = {"2026-01":"1","2026-09":"60000","2026-10":"70000"}`): Enero `1,00`, Septiembre `60000,00`, Octubre `70000,00`; los otros 9 meses `0,00` con icono "Sin registro".

Modo lectura: Input `disabled` (fondo gris Bootstrap). Modo edición: Input habilitado con `border-brand-orange-legacy bg-brand-orange-legacy/5` (legacy `#f0ad4e` / `#fffaf0`; no hay token exacto, se usa el naranja legacy más cercano).

No hay acciones por fila ni eliminación de un mes.

## 5. Formularios y modales
Todos los modales legacy son Bootstrap `modal fade`. Propuesta: shadcn `Dialog` (`sm:max-w-sm` para los `modal-sm`, `sm:max-w-[420px]` para bienvenida y mensaje).

### 5.1 Autorización (`#authModal`, modal-sm)
| Elemento | Texto exacto | Tipo | Componente |
|---|---|---|---|
| Título | Autorización | — | DialogTitle |
| Descripción | Ingrese su contraseña maestra para habilitar la edición. | — | DialogDescription `text-xs` |
| Campo | Label "Contraseña maestra", placeholder `****` | password | Label + Input type=password, autoFocus, Enter envía |
| Error | ver mensajes abajo, con icono triángulo | — | `p.text-destructive text-xs` + TriangleAlert; Input `aria-invalid` |
| Botón | Verificar y desbloquear | — | Button full width `bg-brand-orange-legacy` (btn-warning) |
| Link | Olvidé mi contraseña maestra | — | Button variant=link size=sm + Mail; cierra este modal y abre 5.3 |

Mensajes de error (`#errorMsg`):
- vacío: "Debe ingresar la contraseña."
- respuesta no válida: "Contraseña incorrecta."
- fallo AJAX: "Error al verificar la contraseña."

Al cerrar (`hidden.bs.modal`) se limpia: input vacío, error oculto y texto restaurado a "Contraseña incorrecta.".

### 5.2 Configurar contraseña maestra (`#configClaveModal`, modal-sm)
| Elemento | Texto exacto | Tipo | Visible | Componente |
|---|---|---|---|---|
| Título | Configurar contraseña maestra | — | siempre | DialogTitle |
| Descripción | Inicial en HTML: "Ingrese una nueva contraseña maestra para habilitar la edición de UF." Al abrir: "Consultando configuración de contraseña maestra..." → luego "Esta administración ya tiene una contraseña maestra configurada." o "No existe contraseña maestra configurada." | — | siempre | DialogDescription |
| Alert info | Con clave: "Para modificar la contraseña maestra, ingrese primero la contraseña actual." Sin clave: "Cree una contraseña maestra para poder habilitar la edición de UF." | — | tras consultar | Alert info compacto + Info |
| Contraseña actual | Label "Contraseña actual", placeholder "Contraseña actual" | password | solo si existe clave | Input |
| Nueva contraseña | Label "Nueva contraseña", placeholder "Nueva contraseña" | password | siempre | Input |
| Repetir | Label "Repetir nueva contraseña", placeholder "Repetir nueva contraseña" | password | siempre | Input |
| Botón | Guardar contraseña | — | siempre | Button full width naranja + Save |

Mientras se consulta el estado de la clave: mostrar Skeleton o Loader2 en la descripción (el legacy solo cambia el texto).

Validaciones en orden (`guardarClaveMaestra`):
1. Existe clave y "Contraseña actual" vacía → bajo actual: "Debe ingresar la contraseña actual."
2. Nueva o repetir vacía → bajo repetir (marca ambos campos): "Debe ingresar y repetir la nueva contraseña."
3. Distintas → "Las contraseñas no coinciden."
4. Si existe clave: POST `verificar_clave_uf` con la actual; no válida → "Contraseña actual incorrecta."; fallo AJAX → "No se pudo verificar la contraseña actual."
5. POST `guardar_clave_uf`. Éxito → cierra modal, botón principal pasa a habilitado, y a los 300 ms Mensaje "Contraseña guardada" / "Contraseña maestra guardada correctamente.". `success:false` → Mensaje "No se pudo guardar" / `response.message` o "No se pudo guardar la contraseña.". Fallo AJAX → Mensaje "Error de conexión" / "Error de conexión al guardar la contraseña.".

No hay validación de largo ni complejidad visible.

### 5.3 Recuperar contraseña UF (`#recuperarClaveUfModal`, modal-sm)
| Elemento | Texto exacto | Componente |
|---|---|---|
| Título | Recuperar contraseña UF | DialogTitle |
| Descripción | Se generará una nueva contraseña temporal para la configuración UF. | DialogDescription |
| Alert info | "La contraseña será enviada al correo:" + salto + correo en negrita (`correoUsuarioUf`, ej. hector.barrera@kastor.cl) | Alert info + Mail |
| Alert error | dinámico (oculto por defecto) | Alert variant=destructive + TriangleAlert |
| Botón primario | Enviar contraseña temporal (durante envío: "Enviando..." con spinner, deshabilitado) | Button full width naranja + Send / Loader2 animate-spin |
| Botón secundario | Cancelar | Button variant=outline full width (DialogClose) |

Reglas al abrir (`recuperarClaveUf`):
- `esPerfilAdminUf === false` → ocultar descripción y alert de correo; error "Solo el perfil administrador puede recuperar la contraseña UF. Debe contactarse con el administrador del sistema."; botón deshabilitado.
- Sin correo en sesión → mismo ocultamiento; error "No se encontró correo de usuario en sesión."; botón deshabilitado.
- Caso normal → muestra correo, botón habilitado.

Resultado de `confirmarRecuperarClaveUf` (POST `recuperar_clave_uf`, sin parámetros):
- Éxito → cierra modales; a los 300 ms Mensaje "Contraseña temporal enviada" / `response.message` o "Se generó una nueva contraseña temporal y fue enviada al correo.".
- `success:false` → error en el modal: `response.message` o "No se pudo recuperar la contraseña UF.".
- Fallo AJAX → "Error de conexión al recuperar la contraseña UF.".

### 5.4 Bienvenido al configurador de UF (`#bienvenidaUfModal`)
Sin botón de cierre (X), `backdrop: 'static'`, `keyboard: false`: solo se cierra con "Continuar". En shadcn: `Dialog` con `showCloseButton={false}` (si la versión lo soporta) y `onInteractOutside`/`onEscapeKeyDown` con `preventDefault`.

| Nº | Texto exacto |
|---|---|
| Título | Bienvenido al configurador de UF |
| 1 | Esta sección está diseñada para administradores que trabajan con presupuestos en UF. |
| 2 | Desde aquí puede registrar un valor UF por período y centralizarlo para todas sus comunidades. Este valor será utilizado por Kastor para generar el **reporte de control presupuestario en UF.** |
| 3 | Solo los usuarios con perfil **ADMIN** pueden ingresar o modificar valores. Para hacerlo, primero deben crear una contraseña desde el botón **Crear contraseña** |
| Botón | Continuar (Button full width naranja, `h-10 text-[15px] font-bold`) |

Cuándo se muestra: automáticamente al cargar si `existe_clave_uf` responde que NO hay clave (o si la consulta falla), y siempre al pulsar el icono de ayuda del header.

### 5.5 Mensaje genérico (`#mensajeUfModal`)
Mismo estilo que bienvenida, estático (sin X, sin Esc, sin clic fuera). Título dinámico (por defecto "Mensaje"), cuerpo `innerText` (respeta `\n`, usar `whitespace-pre-line`), botón centrado "Aceptar" (`btn-sm`, min-width 85px). Acepta callback al cerrarse (usado para recargar tras guardar montos). El parámetro `tipo` ('success' | 'warning' | 'error') se recibe pero el legacy no lo usa visualmente.

Propuesta: los mensajes de éxito/error simples → `toast` de sonner (`toast.success` / `toast.warning` / `toast.error`, title = título del mensaje, description = texto). El caso "Error al guardar" con lista multilínea de períodos puede quedar como `AlertDialog` con "Aceptar" para conservar la lectura completa. Si se quiere paridad estricta (modal bloqueante), usar `AlertDialog` con `AlertDialogAction` "Aceptar".

### 5.6 Edición de montos (inputs de la grilla)
| Evento | Comportamiento legacy |
|---|---|
| focus (`prepararInputUf`) | limpia formato: `60000,00` → `60000`; selecciona todo el texto |
| input (`actualizarValorTemporalUf`) | elimina todo lo que no sea dígito o coma; deja una sola coma (las siguientes se eliminan uniendo los dígitos) |
| blur (`formatearInputUf`) | parsea y reescribe con 2 decimales: `60000` → `60000,00` |
| valor inicial en edición (`valorParaEditarUf`) | sin decimales forzados: `60000`, `1`, `0` |

## 6. Estados y flujo
### Variables de estado legacy
`isEditing` (bool, inicia false), `tieneClaveUfConfigurada` (bool, inicia false, se resuelve por AJAX al cargar), `esPerfilAdminUf` (bool del servidor, true en la evidencia), `correoUsuarioUf` (string del servidor), `anioActual` (2026), `valoresUfEndpoint` (mapa `AAAA-MM` → string).

### Botón principal `#btnAction`
| Estado | Texto | Icono legacy → lucide | Variante legacy → propuesta | Habilitado | `title` |
|---|---|---|---|---|---|
| Cargando estado de clave (inicial del HTML) | Editar montos en UF | fa-pen-to-square → SquarePen | btn-warning → `bg-brand-orange-legacy text-white` | sí (hasta resolver AJAX; en React: deshabilitado mientras carga) | — |
| Sin contraseña maestra | Editar montos en UF | SquarePen | btn-warning disabled | no | "Por seguridad solo usuarios con perfil ADMIN pueden ingresar valores. Para continuar cree una contraseña." (Tooltip envolviendo el botón deshabilitado) |
| Bloqueado con contraseña | Editar montos en UF | SquarePen | btn-warning | sí | — |
| Edición | Guardar montos en UF | fa-floppy-disk → Save | btn-success → `bg-success text-success-foreground` | sí | — |
| Guardando | Guardando... | (el legacy mantiene floppy) → Loader2 animate-spin | btn-success | no | — |
| Error al guardar | Guardar montos en UF | Save | btn-success | sí (sigue en edición) | — |

No existe botón "Cancelar" edición en el legacy: para salir de la edición sin guardar hay que cambiar de año o recargar. Ver §10.

### Flujo
1. **Carga**: render de 12 meses en modo lectura (inputs deshabilitados, formato `0,00`). POST `existe_clave_uf`.
   - Sin clave (o error) → `tieneClaveUfConfigurada=false`, botón principal deshabilitado con tooltip, y se abre Bienvenida estática.
   - Con clave → botón "Editar montos en UF" habilitado.
2. **Bloqueado → Autorización**: clic en "Editar montos en UF" → (si no hay clave y no se está editando, abre Configurar contraseña; en la práctica el botón está deshabilitado) → abre Autorización limpio.
3. **Autorización → Edición**: "Verificar y desbloquear" → POST `verificar_clave_uf {clave}`. Válida → cierra modal, `isEditing=true`, botón a "Guardar montos en UF" (verde), inputs habilitados con borde naranja. No válida o error → permanece bloqueado con mensaje de error.
4. **Edición → Guardado**: "Guardar montos en UF" → arma payload solo con meses de monto > 0 (`{periodo:'AAAA-MM', monto:number}`).
   - Payload vacío → Mensaje "Sin valores UF" / "No hay valores UF para guardar." (sigue en edición).
   - Si no, botón "Guardando..." deshabilitado y POST secuencial a `guardar_configuracion_uf` uno por período.
   - Todos OK → `isEditing=false`, grilla a lectura, Mensaje "Valores guardados" / "Valores UF guardados correctamente."; al pulsar "Aceptar" recarga `?anio=<anioActual>` (actualiza "Última edición").
   - Algún error → sigue en edición, botón "Guardar montos en UF", Mensaje "Error al guardar" / "Algunos valores no se pudieron guardar:\n" + líneas `AAAA-MM: <response.message | 'Error desconocido'>` o `AAAA-MM: Error de conexión`.
5. **Contraseña** (en cualquier momento): "Crear contraseña" → Configurar contraseña maestra (§5.2). Desde Autorización: "Olvidé mi contraseña maestra" → Recuperar (§5.3).

Diagrama de estados propuesto:
```
cargando ──existe_clave=false/error──▶ sinClave (bienvenida abierta, botón deshabilitado)
cargando ──existe_clave=true──▶ bloqueado
sinClave ──guardar_clave_uf ok──▶ bloqueado
bloqueado ──Editar──▶ autorizando (Dialog) ──válida──▶ editando
autorizando ──inválida/cerrar──▶ bloqueado
editando ──Guardar──▶ guardando ──ok──▶ bloqueado (+ refetch)
guardando ──error parcial──▶ editando
editando ──cambiar año──▶ cargando (se pierde la edición)
```

### Otros estados
- Vacío por mes: monto 0 → icono info "Sin registro" en el header de la tarjeta e input `0,00`. No existe texto "Sin valor".
- Año sin ningún valor: 12 tarjetas en `0,00` con "Sin registro" (inferido de la lógica; no hay captura de ese año).
- Cargando: proponer Skeleton de 12 tarjetas al cambiar de año (el legacy recarga la página).
- Alertas visibles: solo la Alert info del encabezado; las demás son modales de mensaje.
- Confirmaciones (js-confirm): ninguna. El guardado no pide confirmación.

## 7. Navegación saliente
- "Volver" → `/` (legacy `/login/`).
- Cambio de año → misma página con `?anio=AAAA`.
- Tras guardar montos → recarga misma página con `?anio=<año actual>`.
- Barra de módulos transversal (ya en Sidebar): Usuarios, Sistema Cobranza, Perfiles, Tareas, UF, Facturas Kastor pendientes, Facturas Caleu pendientes.

## 8. Endpoints AJAX (solo referencia para la capa mock; todos POST, `dataType: json`)
| Endpoint | Datos enviados | Respuesta interpretada |
|---|---|---|
| `/login/dashboard/existe_clave_uf` | — | `success === true && data.exists ∈ {true, 1, '1', 'true'}` → hay clave |
| `/login/dashboard/verificar_clave_uf` | `clave` | `data.valid ∈ {true, 1, '1', 'true'}` → válida (no exige `success`) |
| `/login/dashboard/guardar_clave_uf` | `clave` | `success === false` → error con `message` opcional |
| `/login/dashboard/recuperar_clave_uf` | — | `success === false` → error; éxito usa `message` opcional |
| `/login/dashboard/guardar_configuracion_uf` | `periodo` (`AAAA-MM`), `monto` (number) | uno por período; `success === false` → error con `message` |
| GET `/login/dashboard/configuracion_uf?anio=AAAA` | — | página completa; valores y "Última edición" vienen embebidos |

## 9. Tipo de dato y mock
```ts
/** Período "AAAA-MM". */
export type PeriodoUf = `${number}-${string}`

/** Valores UF de un año tal como los entrega el legacy (solo meses con registro). */
export interface ValoresUfAnio {
  anio: number
  /** Monto por período; meses ausentes = sin registro (0). */
  valores: Partial<Record<PeriodoUf, number>>
  /** "DD/MM/YYYY HH:mm" del legacy; null si no hay edición registrada. */
  ultimaEdicion: string | null
}

export interface MesUf {
  nombre: 'Enero' | 'Febrero' | 'Marzo' | 'Abril' | 'Mayo' | 'Junio' | 'Julio' | 'Agosto' | 'Septiembre' | 'Octubre' | 'Noviembre' | 'Diciembre'
  numero: '01' | '02' | '03' | '04' | '05' | '06' | '07' | '08' | '09' | '10' | '11' | '12'
}

export type ModoPantallaUf = 'cargando' | 'sinClave' | 'bloqueado' | 'editando' | 'guardando'

export interface EstadoPantallaUf {
  anio: number
  aniosDisponibles: number[] // [2028, 2027, 2026, 2025] en la evidencia, orden desc
  modo: ModoPantallaUf
  tieneClave: boolean
  esPerfilAdmin: boolean
  correoUsuario: string | null
  /** Borrador de edición por mes (string con coma decimal mientras se escribe). */
  borrador: Record<MesUf['numero'], string>
  dialogo: null | 'autorizacion' | 'configurarClave' | 'recuperarClave' | 'bienvenida'
}

export interface GuardarMontoUfPayload {
  periodo: PeriodoUf
  monto: number
}
```

Helpers de formato a implementar en `src/lib/format.ts` (o junto al módulo), réplica del legacy:
- `formatearMontoUf(n)` → `n.toFixed(2).replace('.', ',')` (sin separador de miles: `60000,00`).
- `limpiarNumeroUf(s)` → quita puntos (miles), cambia la primera coma por punto, quita no numéricos, `parseFloat || 0`.
- `sanearEntradaUf(s)` → solo dígitos y una coma.

Mock sugerido en `src/data/uf.ts` (2026 real de la evidencia; otros años inventados para la demo y marcados como mock):

| anio | valores | ultimaEdicion |
|---|---|---|
| 2025 | `{}` (año sin registros, todas las tarjetas "Sin registro") | null |
| 2026 | `{'2026-01': 1, '2026-09': 60000, '2026-10': 70000}` (real) | '04/09/2026 20:41' (real) |
| 2027 | `{'2027-01': 70000, '2027-02': 70500}` (mock) | '04/09/2026 20:41' (mock) |
| 2028 | `{}` | null |

Estado mock inicial: `tieneClave: true`, `esPerfilAdmin: true`, `correoUsuario: 'hector.barrera@kastor.cl'`, contraseña maestra mock `'1234'` (solo demo), `anio: 2026`. Permitir con query `?sinClave=1` (opcional) forzar el flujo de bienvenida.

## Estructura propuesta de la vista
- `Core` > `CoreHeader title="Configuración UF" environment="upselling"` con, junto al título, Button ghost icon (CircleHelp, Tooltip "Ver información") y `actions` = Button outline sm Volver (ArrowLeft).
- `CoreBody`:
  - `Alert` info (Info) con el texto exacto de §2.
  - Barra de control (`Card` `bg-muted`): Label + Select de año + Info tooltip | "Última edición: …" | Button outline "Crear contraseña" (KeyRound) + Button principal (SquarePen / Save / Loader2).
  - Grilla `grid gap-4 sm:grid-cols-2 xl:grid-cols-4` con 12 `Card` (`MesUfCard`): header con nombre + Info tooltip + indicador "Sin registro"; content con prefijo "$" + `Input` `text-right tabular-nums` (`disabled` salvo en edición).
- `Dialog` x5: `AutorizacionUfDialog`, `ConfigurarClaveUfDialog`, `RecuperarClaveUfDialog`, `BienvenidaUfDialog` (estático), `MensajeUfDialog` (o toasts).
- `Toaster` sonner ya existe en `src/components/ui/sonner.tsx`.
- Iconos lucide: CircleHelp, ArrowLeft, Info, KeyRound, SquarePen, Save, Loader2, CircleDashed, TriangleAlert, Mail, Send, History (opcional).

### CSS inline legacy → tokens
| Clase legacy | Valores | Propuesta Tailwind / token |
|---|---|---|
| `.bienvenida-uf-dialog` | width 420px; max-width 92%; margin-top 70px | `sm:max-w-[420px]` (DialogContent) |
| `.bienvenida-uf-content` | radius 5px; sin borde; shadow `0 8px 25px rgba(0,0,0,.25)` | `rounded-md border-0 shadow-xl` |
| `.bienvenida-uf-header` | padding 16px 20px; border-bottom `#e5e5e5`; fondo blanco | `px-5 py-4 border-b border-border bg-background` |
| `.bienvenida-uf-title` | 17px; 700; `#222`; lh 22px | `text-[17px] font-bold text-foreground leading-[22px]` |
| `.bienvenida-uf-body` | padding 24px 22px 16px | `px-[22px] pt-6 pb-4` |
| `.bienvenida-uf-item` | flex, align start, mb 16px | `flex items-start gap-3 mb-4` |
| `.bienvenida-uf-numero` | círculo 25px; fondo `#f0ad4e`; blanco; 13px bold; mr 13px | `size-[25px] shrink-0 rounded-full bg-brand-orange-legacy text-white text-[13px] font-bold grid place-items-center` |
| `.bienvenida-uf-texto` | 14px; lh 17px; `#222` | `text-sm leading-[17px] text-foreground` |
| `.bienvenida-uf-btn` | h 41px; 15px; 700; `#f0ad4e` / borde `#eea236`; hover `#ec971f` | `h-10 w-full text-[15px] font-bold bg-brand-orange-legacy hover:bg-brand-orange-legacy/90 text-white` |
| `.mensaje-uf-contenedor` / `.mensaje-uf-texto` | mb 16px (texto sin estilo propio en el CSS) | `mb-4 text-sm whitespace-pre-line` |
| `.mensaje-uf-acciones` | text-align center | `flex justify-center` |
| `.mensaje-uf-btn` | min-width 85px; h 28px; 12px bold; mismos naranjas | `h-7 min-w-[85px] text-xs font-bold bg-brand-orange-legacy` |
| `.icono-info-uf` | 13px; `#5bc0de`; hover `#31b0d5`; cursor help; ml 6px | `size-3.5 text-info hover:text-info/80 cursor-help ml-1.5` |
| Input en edición (inline) | borde `#f0ad4e`; fondo `#fffaf0` | `border-brand-orange-legacy bg-brand-orange-legacy/5` |
| Tarjeta de mes | `panel panel-default` mb 20px; transition all .3s | `Card gap-0 transition-colors` + `gap-4` en grilla |

Nota: el naranja Bootstrap `#f0ad4e` no está en la paleta; se mapea a `brand-orange-legacy` (`#EF7D00`). El celeste `#5bc0de` (Bootstrap info) se mapea a `text-info` (`#007BFF`).

## 10. Pendiente de confirmar
- **Iconos Font Awesome**: el HTML usa 31 clases `fa-solid` pero no carga ninguna hoja de Font Awesome en `<head>`; en el legacy es probable que esos iconos (llave, lápiz, disquete, "Sin registro", sobres, triángulos) no se vean. Una captura de pantalla confirmaría si se renderizan. En React se usan lucide igualmente.
- **Regla del rango de años** del select (2025–2028 en la evidencia: ¿año actual −1 a +2?). Se resolvería con un HTML guardado en otro año o con el criterio del negocio.
- **Cancelar edición**: el legacy no tiene botón para salir del modo edición. Se propone agregar Button ghost "Cancelar" (X) junto a "Guardar montos en UF" que restaure los valores; marcar como mejora, no paridad.
- **Borrar un valor**: el payload solo envía montos > 0, por lo que poner un mes en 0 no lo borra en el servidor (queda el valor anterior al recargar). Confirmar si es intencional antes de exponer "vaciar mes".
- **"Última edición" del año 2026 (04/09/2026)** es anterior a los valores de septiembre/octubre ¿es por año o global? Un segundo HTML de otro año lo aclararía.
- **Perfil no ADMIN**: solo se conoce el efecto en Recuperar contraseña. No se sabe si un no ADMIN ve "Crear contraseña" o el botón de edición. Haría falta el HTML de la pantalla con un usuario no ADMIN.
- **Estado visual sin clave**: no hay HTML ni captura con la Bienvenida abierta al cargar ni con el botón deshabilitado; se deduce del JS.
- **Mensajes del servidor** (`response.message`) en errores de guardado/recuperación: se desconocen los textos reales.
- Capturas adicionales útiles: (1) pantalla completa en modo lectura, (2) modo edición tras desbloquear, (3) modal Mensaje tras "Valores guardados", (4) modal Configurar contraseña con clave existente.
