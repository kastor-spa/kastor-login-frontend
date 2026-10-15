# MAPA-facturas-caleu: Facturas Caleu pendientes

- **Ruta propuesta:** `/facturas/caleu` (legacy: `/login/dashboard/facturas_caleu3`)
- **Categoría en navegación:** Facturación
- **Evidencia:** `docs/referencias/facturas-caleu/01-pagina.html` (HTML renderizado desde el navegador con sesión, 2026-10-14, título "Administración - upselling"). Comparación: `docs/referencias/facturas-kastor/01-pagina.html` (módulo hermano, solo lectura). Clases/selectores legacy: `.panel-heading`, `.panel-actions`, `.table.table-striped.table-bordered.table-hover.table-condensed`, `$(".table").dataTable({bLengthChange:false, bPaginate:false, aaSorting:[], sort:[]})`, `.addKhipu`, `.resumenKhipu`, `.totalKhipu`, `.selectPagoKhipu`, `.totalKhipuComision`, `.totalKhipuFinal`, `.callPagoKhipu`, `.loadingKhipu`, `.container-chekbox`, `.checkmark`, `.glyphicon-spin`, `#dialog` (jQuery UI).
- **Fecha de mapeo:** 2026-10-14
- **Estado:** parcial (estructura y flujo confirmados por HTML + JS; la tabla viene sin filas y el markup del resumen Khipu no se renderizó)

## 1. Propósito
Listar las facturas pendientes de DISTRIBUIDORA CALEU asociadas a las comunidades de la administración y permitir seleccionar una o varias para pagarlas en línea con Khipu: el usuario marca facturas, ve el total, elige el tipo de pago, se consulta la comisión y se redirige a la URL de pago de Khipu.

## 2. Core header
| Elemento | Texto exacto | Componente shadcn | Icono lucide | Evidencia |
|---|---|---|---|---|
| Título | Facturación DISTRIBUIDORA CALEU  / | CoreHeader `title` | — | `<strong>Facturación DISTRIBUIDORA CALEU  / </strong>` (dos espacios antes de la barra y barra final sin texto a continuación). Ver nota |
| Subtítulo / contador | — | CoreHeader `description` opcional | — | El legacy no muestra contador. Propuesta: "Facturas pendientes: N" solo si hay filas |
| Ambiente | upselling | CoreHeader `environment` (Badge secondary) | — | `.navbar-brand-centered` |
| Acción primaria | — | — | — | No hay botón en el header; la acción de pago vive en el resumen Khipu |
| Acciones secundarias | — | — | — | No existen (Kastor sí tiene "Suscribir PAC" y "Contacto Facturación") |
| Volver | Volver | Button variant=outline size=sm, `Link to="/"` | ArrowLeft | `<a href="/login/" class="btn btn-default btn-sm"><span class="glyphicon glyphicon-arrow-left"></span> Volver</a>` |

Nota sobre el título: la barra final sugiere que el template concatena un segundo dato (probablemente el nombre de la administración o comunidad) que en esta sesión llegó vacío. Se propone `title="Facturación DISTRIBUIDORA CALEU"` y renderizar `/ {sufijo}` solo si hay valor. Ver "Pendiente de confirmar".

Nota de navegación: el botón "Facturas Caleu pendientes" de la barra de módulos aparece `btn-default` (no resaltado) en su propia pantalla; el resaltado `btn-warning` sigue en "Usuarios". En la app nueva el Sidebar marca activo por ruta.

## 3. Filtros y búsqueda
DataTables se inicializa con `bLengthChange:false`, `bPaginate:false`, `aaSorting:[]`, `sort:[]`: sin selector de largo, sin paginación, sin orden inicial. Queda activa la caja "Search" por defecto de DataTables.

| Control | Opciones visibles | Componente | Notas |
|---|---|---|---|
| Buscar | (caja Search por defecto de DataTables) | Input + icono Search, placeholder "Buscar por Rut o Comunidad" | Placeholder propuesto. Filtra en cliente |
| Paginación | ninguna | — | `bPaginate:false`: todas las filas en una sola tabla |

## 4. Listado
Tipo: tabla (`table-striped table-bordered table-hover table-condensed`) dentro de `.panel`. Encabezados escritos con `<td>` (no `<th>`), sin `align`. Equivalente: `Card` + `Table` compacta.

| Columna (texto exacto) | Ancho legacy | Tipo de dato | Alineación | Notas |
|---|---|---|---|---|
| (vacío) | 5% | — | centro | Sin texto. Probable índice o icono; ver pendiente |
| Rut | 25% | RUT `12.345.678-9` | izq | `font-mono tabular-nums` |
| Comunidad | 55% | texto | izq | En Kastor mide 35% porque comparte espacio con "Deuda" |
| (vacío) | 15% | selección | der | Probable ubicación del checkbox `.addKhipu` dentro de `.container-chekbox` (CSS `float:right`, 25x25, checked `#2196F3`). shadcn `Checkbox` con `aria-label="Seleccionar factura {docnum}"` |

Filas reales: **0**. `<tbody>` vacío (`grep -c "<tr"` = 1, solo el encabezado). Tampoco hay en el DOM ningún `.addKhipu`, `.resumenKhipu`, `select` ni `option`; todo lo de Khipu solo existe en el JS inline.

Diferencias de columna con Kastor: Caleu no tiene "Deuda" (Kastor: vacío 5% / Rut 25% / Comunidad 35% / Deuda 20% / vacío 15%, con `<tr align="center">`).

Acciones por fila:
| Acción | Icono lucide | Confirmación | Notas |
|---|---|---|---|
| Seleccionar / deseleccionar factura | Checkbox (shadcn, indicador Check) | No | Alterna la factura en el mapa de selección por `folionum`. Recalcula total y vuelve a pedir comisión si hay tipo de pago elegido |

Payload de cada checkbox (`value` JSON de `.addKhipu`, leído por JS): `{ folionum, docnum, doctotal, cardname }`. `doctotal` se suma con `+` (puede venir como string). `cardname` se usa como nombre de comunidad en el pago.

## 5. Formularios y modales

### 5.1 Resumen de pago Khipu (`.resumenKhipu`)
Markup no presente en la evidencia (no se renderizó al no haber filas). Se reconstruye solo desde los selectores del JS; los textos de etiquetas NO están confirmados.

| Elemento (selector legacy) | Comportamiento confirmado por JS | Componente shadcn | Icono lucide |
|---|---|---|---|
| Contenedor `.resumenKhipu` | `display:block` si total > 0, si no `display:none`. CSS `.resumenKhipu td {padding:3px}` indica que es una tabla interna | `Card` (o `Card` sticky al pie) visible solo con selección | Wallet |
| Total `.totalKhipu` | Suma de `doctotal` de las facturas marcadas | Fila label/valor, `tabular-nums` | — |
| Tipo de pago `select.selectPagoKhipu` | Al `change`: deshabilita botón; si total < 1 sale; guarda `paymentType`; si valor != '' consulta comisión. Existe una opción con valor `''` (placeholder). Resto de opciones desconocido | `Select` | CreditCard |
| Comisión `.totalKhipuComision` | `fee.body - total` | Fila label/valor `text-muted-foreground` | — |
| Total final `.totalKhipuFinal` | `fee.body` | Fila label/valor `font-semibold text-brand-darkblue` | — |
| Botón `.callPagoKhipu` | Nace deshabilitado; se oculta mientras carga; se muestra y habilita si `fee.body > 0` | `Button` `bg-brand-orange hover:bg-brand-orange-hover` | ExternalLink (o Wallet) |
| Cargando `.loadingKhipu` | Visible mientras se consulta comisión (clase `.glyphicon-spin` definida en CSS) | Loader2 `animate-spin` + texto | Loader2 |

### 5.2 Modales
- `#dialog` (jQuery UI, vacío, `title="Basic dialog"`): reutilizado por JS para mensajes. En Caleu solo es alcanzable el de `#success` (ver 6).
- El JS de Caleu conserva handlers de `.btn-notificar`, `.enviar-mensaje` (envía a `/login/dashboard/mensaje_facturacion/<texto>`) y `.mostrar-pac`, pero en Caleu NO existen esos elementos ni `#myModal`/`#myModal2`/`#textarea`: es código muerto copiado de Kastor. No se mapean para Caleu.

| Campo | Placeholder / label | Tipo | Requerido | Componente |
|---|---|---|---|---|
| Tipo de pago | (desconocido; existe opción vacía) | select | sí para habilitar el pago | Select |

## 6. Estados y alertas
- Vacío (estado real de la evidencia): tabla sin filas. DataTables mostraría su texto por defecto. Propuesta: fila `colSpan=4` con icono CircleCheck `text-success` y texto "No hay facturas pendientes de DISTRIBUIDORA CALEU." (texto propuesto, no legacy).
- Sin selección: resumen Khipu oculto.
- Consultando comisión: botón oculto, spinner visible. Si la petición HTTP falla el legacy no tiene manejador (solo `.then`) y el spinner queda indefinido: en la app nueva mostrar error y restaurar el botón.
- Errores (`alert()` nativo en legacy → `toast.error` sonner), textos exactos:
  - "error al obtener el monto a pagar" (respuesta de comisión sin `status.code === 200`).
  - "error al crear el pago" (respuesta de creación de pago sin `status.code === 200`).
- Retorno desde Khipu (`#success` en la URL): diálogo modal jQuery UI de 400px, título "Procesando Pago Khipu", cuerpo "El pago esta en proceso de confirmación se te notificara por correo cuando este validado.", botón "Aceptar"; luego `removeHash()` limpia el hash con `history.pushState`. Mapeo: `AlertDialog` (o `Dialog`) con icono Clock/Hourglass, título y texto exactos (se mantiene la ortografía legacy en la paridad; se sugiere corregir a "está ... se te notificará ... esté" si producto lo aprueba), `AlertDialogAction` "Aceptar". En React: leer `location.hash === '#success'` (o query `?pago=success`) al montar y limpiar con `navigate(..., { replace: true })`.
- Confirmaciones (js-confirm): ninguna. El pago no pide confirmación previa (la confirmación ocurre en Khipu).

## 7. Navegación saliente
- "Volver" → `/` (legacy `/login/`).
- "Pagar" → URL externa `data.body.khipu.payment_url` (redirección completa de ventana). `cancel_url` = URL actual; `return_url` = URL actual + `#success`.
- Barra de módulos transversal (ya cubierta por el Sidebar): Usuarios, Sistema Cobranza, Perfiles, Tareas, UF, Facturas Kastor pendientes `/login/dashboard/facturas`, Facturas Caleu pendientes `/login/dashboard/facturas_caleu3`, salir.

## 8. Flujo Khipu (desde el JS inline)
1. Estado: `arrayKhipu` (objeto indexado por `folionum`), `totalAPagarKhipu`, `coms[]`, `folios[]`, `paymentType`.
2. Click en `.addKhipu`: agrega o quita la factura por `folionum`; recalcula `total = Σ +doctotal`, `coms = [cardname...]`, `folios = ["Factura: {docnum} - {monto}"...]`; muestra/oculta resumen; pinta `.totalKhipu`; dispara `change` del select.
3. Change de `.selectPagoKhipu`: deshabilita botón; si total < 1 termina; si tipo != '' → oculta botón, muestra spinner, `POST {KHIPU_API}/api/v1/fee` con `{ amount: parseInt(total), type }` (JSON). Respuesta OK (`status.code === 200`): `body` = monto final con comisión; pinta comisión (`body - total`) y total final (`body`); muestra botón y lo habilita si `body > 0`.
4. Click en `.callPagoKhipu`: `POST {KHIPU_API}/api/v1/payments` con:
   - `subject`: "Pago Facturas " + adm (adm = "upselling - upselling.kastor.cl")
   - `amount`: parseInt(total) (sin comisión)
   - `transaction_id`: uuid v4 generado en cliente
   - `type`: "CALEU"
   - `data`: `{ comunidades: coms.join(", "), administracion: adm, folionum: folios.join(", "), doctotal: total }`
   - `cancel_url`, `return_url` (+ "#success"), `paymentType`
   Respuesta OK → `window.location.href = body.khipu.payment_url`.
5. `KHIPU_API` de Caleu: host versionado `20200413t104654-dot-kastor-api-khipu-dot-kastor-integraciones.appspot.com` (fee y payments). No se hizo ninguna petición a estas APIs; en el front nuevo todo esto se mockea.

Formato de moneda legacy: `Intl.NumberFormat('en-US', { style:'currency', currency:'USD', minimumFractionDigits:0 })` + `.replace(",", ".")` → "$150.000". Bug: `replace` con string solo cambia la primera coma, así que montos ≥ 1.000.000 salen "$1.234,567". Propuesta: helper `formatCLP(n)` con `Intl.NumberFormat('es-CL', { style:'currency', currency:'CLP', maximumFractionDigits:0 })` → "$1.234.567" (mismo aspecto, sin el bug). Notar también que el formatter estaba pensado para 0 decimales pero no fija `maximumFractionDigits`: si `doctotal` trae decimales se mostrarían.

## 9. Diferencias con facturas-kastor
Ambos HTML comparten layout, navbar, CSS de checkbox/spinner, `#dialog`, `adm`, `uuidv4`, `removeHash` y la llamada `payments`. Lo que cambia (base para parametrizar un componente `FacturasPendientesView` con `config`):

| Aspecto | Kastor (`/login/dashboard/facturas`) | Caleu (`/login/dashboard/facturas_caleu3`) |
|---|---|---|
| Título del panel | "Facturación" | "Facturación DISTRIBUIDORA CALEU  / " |
| Bloque superior | `p.pull-right`: "DATOS BANCARIOS KASTOR SPA / BANCO : BANCO BCI / Nº CTA CTE: 10678280 / RUT: 76.722.143-6 / Correo: pagos@kastor.cl" | No existe |
| Acciones del header | "Suscribir PAC" (btn-primary, `/login/dashboard/solicitar_pac`), "Contacto Facturación" (btn-warning, abre `#myModal`), "Volver" | Solo "Volver" |
| Columnas | vacío 5 / Rut 25 / Comunidad 35 / **Deuda 20** / vacío 15, `tr align="center"` | vacío 5 / Rut 25 / Comunidad 55 / vacío 15, sin `align` |
| Modales | `#myModal` "Contacto Facturación" (textarea, Cancelar / Enviar Mensaje) y `#myModal2` "Notificar Pago" (form POST `/login/dashboard/notificar_pago`, textarea, "Adjuntar Documento" file, Cancelar / Notificar Pago) | Ninguno (handlers en JS sin markup) |
| Selección `.addKhipu` + total | Sin handler en JS (no hay cálculo de total) | Handler completo |
| Comisión (`/api/v1/fee`) y `.selectPagoKhipu` | Sin handler | Handler completo |
| Diálogo `#success` | Sin manejo | "Procesando Pago Khipu" |
| `payments.type` | "COBRANZA" | "CALEU" |
| Host API Khipu | `kastor-api-khipu-dot-kastor-integraciones.appspot.com` | `20200413t104654-dot-kastor-api-khipu-dot-...` (versión fijada) |
| Bug `enviar-mensaje` | `var table = ...; $.ajax(url)` (url no definida) | `var url = ...` (correcto, pero sin markup que lo dispare) |
| Filas en la evidencia | 0 | 0 |

Componentes compartibles: `FacturasTable` (columna Deuda opcional), `KhipuResumenCard`, `KhipuSuccessDialog`, `formatCLP`, hook `useKhipuSeleccion`. Parametrizar con:

```ts
export type EmisorFacturas = 'kastor' | 'caleu'

export interface FacturasModuloConfig {
  emisor: EmisorFacturas
  titulo: string                 // "Facturación" | "Facturación DISTRIBUIDORA CALEU"
  mostrarDeuda: boolean          // kastor true, caleu false
  mostrarDatosBancarios: boolean // kastor true, caleu false
  accionesExtra: Array<'suscribir-pac' | 'contacto-facturacion' | 'notificar-pago'> // caleu []
  khipuTipo: 'COBRANZA' | 'CALEU'
  calculaComision: boolean       // evidencia: solo caleu tiene el flujo fee
}
```

## 10. Tipo de dato y mock
```ts
/** Payload del checkbox .addKhipu (nombres legacy SAP-like). */
export interface FacturaKhipuPayload {
  folionum: string | number
  docnum: string | number
  doctotal: number
  cardname: string
}

export interface FacturaPendiente {
  /** = folionum; clave de selección. */
  id: string
  folio: string        // folionum
  numeroDocumento: string // docnum
  total: number        // doctotal, CLP entero
  rut: string          // columna "Rut"
  comunidad: string    // columna "Comunidad" (cardname)
  /** Solo Kastor (columna "Deuda"); undefined en Caleu. */
  deuda?: number
}

export type KhipuTipoPago = string // opciones reales pendientes

export interface KhipuResumen {
  seleccion: FacturaPendiente[]
  total: number
  tipoPago: KhipuTipoPago | null
  comision: number | null    // fee.body - total
  totalFinal: number | null  // fee.body
  estado: 'idle' | 'calculando' | 'listo' | 'error' | 'redirigiendo'
}
```

Mock en `src/data/facturas-caleu.ts`: **la evidencia no trae filas; el mock es ficticio y debe marcarse como tal** (`// MOCK: sin filas en la evidencia legacy`). Usar estado vacío por defecto y un toggle/fixture de demo:

| id | folio | numeroDocumento | total | rut | comunidad |
|---|---|---|---|---|---|
| 50121 | 50121 | 50121 | 89000 | 65.123.456-7 | Comunidad Edificio Los Aromos (mock) |
| 50122 | 50122 | 50122 | 145500 | 65.123.456-7 | Comunidad Edificio Los Aromos (mock) |
| 50140 | 50140 | 50140 | 1250000 | 53.987.654-3 | Condominio Parque Oriente (mock) |
| 50157 | 50157 | 50157 | 32990 | 56.444.222-K | Comunidad Torre Central (mock) |

(El monto 1250000 sirve para verificar que `formatCLP` no reproduce el bug de la coma.) Fee mock: `totalFinal = Math.round(total * 1.01)` o similar, rotulado como simulación.

## Estructura propuesta de la vista
- `Core` > `CoreHeader title="Facturación DISTRIBUIDORA CALEU" environment="upselling" actions={<Button variant="outline" size="sm" asChild><Link to="/"><ArrowLeft /> Volver</Link></Button>}`.
- `CoreBody`:
  - `Card` > `Input` búsqueda (Search) + `Table` 4 columnas (índice/vacío, Rut, Comunidad, Checkbox). Estado vacío con CircleCheck.
  - `KhipuResumenCard` (visible con selección): filas Total / Comisión / Total final, `Select` tipo de pago, `Button` pagar (Loader2 mientras calcula). Todo mockeado, sin llamadas reales.
  - `KhipuSuccessDialog` (`AlertDialog`) si la URL trae `#success`.
- `Toaster` (sonner, ya en `src/components/ui/sonner.tsx`) para errores "error al obtener el monto a pagar" / "error al crear el pago".
- Iconos lucide: ArrowLeft, Search, Check (Checkbox), Wallet, CreditCard, Loader2, ExternalLink, CircleCheck, Clock.

## 11. Pendiente de confirmar
- Filas reales: 0 en la evidencia. Falta HTML/captura de una sesión con facturas Caleu pendientes para confirmar qué hay en la primera columna (5%) y en la última (15%), si cada fila es una factura o una comunidad con varias facturas, y el formato de Rut.
- Markup completo de `.resumenKhipu`: textos de etiquetas (Total, Comisión, Total final), texto del botón `.callPagoKhipu`, texto del spinner `.loadingKhipu` y **opciones del `select.selectPagoKhipu`** (valores enviados como `type`/`paymentType`). Requiere captura/HTML con al menos una factura marcada.
- Sufijo tras "Facturación DISTRIBUIDORA CALEU  / ": qué dato debería ir después de la barra.
- Si la comisión se muestra también en Kastor (su JS no tiene handler de `fee`; podría estar en otra versión). Comparar con HTML de Kastor con filas.
- Si `payments.amount` debe incluir comisión (el legacy envía el total sin comisión).
- Captura del diálogo "Procesando Pago Khipu" para estilos (la paridad textual ya está confirmada por JS).
