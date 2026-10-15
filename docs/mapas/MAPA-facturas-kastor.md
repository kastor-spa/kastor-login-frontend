# MAPA-facturas-kastor: Facturas Kastor pendientes

- **Ruta propuesta:** `/facturas/kastor` (legacy: `/login/dashboard/facturas`)
- **Categoría en navegación:** Facturación
- **Evidencia:** `docs/referencias/facturas-kastor/01-pagina.html` (HTML renderizado desde el navegador con sesión, 2026-10-14, título "Administración - upselling"). Comparación (solo lectura, no se mapea aquí): `docs/referencias/facturas-caleu/01-pagina.html`. Apoyo: `DESIGN-SYSTEM.md`. Clases/rutas legacy: `.panel-heading`, `.panel-actions`, `.mostrar-pac`, `#myModal`, `#myModal2`, `.enviar-mensaje`, `.cancel-modal`, `.btn-notificar[data-fecha]`, `.text-notificar`, `.callPagoKhipu`, `.resumenKhipu` (solo CSS), `.container-chekbox` / `.checkmark` (solo CSS), `#dialog` (jQuery UI), `$(".table").dataTable({bLengthChange:false,bPaginate:false,aaSorting:[]})`, `/login/dashboard/solicitar_pac`, `/login/dashboard/mensaje_facturacion/<texto>`, `/login/dashboard/notificar_pago`, API Khipu `.../api/v1/payments`.
- **Fecha de mapeo:** 2026-10-14
- **Estado:** mapeado (parcial: tabla sin filas y sin marcado del resumen Khipu)

## 1. Propósito
Mostrar a la administración las facturas de Kastor (servicio de software) que tiene pendientes por comunidad, con la deuda total por comunidad, y permitir pagarlas en línea con Khipu, suscribir el pago automático (PAC), contactar al área de facturación y notificar un pago hecho por transferencia (con documento adjunto). Muestra además los datos bancarios de Kastor SpA para transferencias.

## 2. Core header
| Elemento | Texto exacto | Componente shadcn | Icono lucide | Evidencia |
|---|---|---|---|---|
| Título | Facturación | CoreHeader `title` | — | `<div class="panel-heading"><strong>Facturación</strong>` |
| Subtítulo / contador | — (sin filas) | CoreHeader `description` | — | `<tbody>` vacío. Proponer "Comunidades con deuda: N" solo cuando N > 0 (no existe en legacy) |
| Ambiente | upselling | CoreHeader `environment` (Badge secondary) | — | `.navbar-brand-centered` |
| Acción primaria | Suscribir PAC | Button (default, `bg-brand-darkblue` o `variant="default"`) que abre AlertDialog informativo | FileSignature | `<a href="/login/dashboard/solicitar_pac" class="btn btn-primary btn-sm mostrar-pac">Suscribir PAC</a>` |
| Acción secundaria | Contacto Facturación | Button `bg-brand-orange hover:bg-brand-orange-hover text-white` → Dialog | MessageSquare | `<button class="btn btn-warning btn-sm" data-toggle="modal" data-target="#myModal">Contacto Facturación</button>` |
| Volver | Volver | Button variant=outline size=sm, `Link to="/"` | ArrowLeft | `<a href="/login/" class="btn btn-default btn-sm"><span class="glyphicon glyphicon-arrow-left"></span> Volver</a>` |

Elementos comentados en el HTML (no se implementan, solo registro): botón "Facturas Pagadas" (`btn-success`, `glyphicon-history`, `href="/login/dashboard/facturas_pagadas"`) y un segundo "Volver" con `href=""`.

### Datos bancarios (bajo el header, sobre la tabla)
Texto exacto, alineado a la derecha (`p.pull-right`):

> **DATOS BANCARIOS KASTOR SPA** / **BANCO** : BANCO BCI / **Nº CTA CTE**: 10678280 / **RUT**: 76.722.143-6 / **Correo**: pagos@kastor.cl

Propuesta: `Alert` (variant default) con icono `Landmark`, título "DATOS BANCARIOS KASTOR SPA" y una lista `dl` en línea (Banco, Nº Cta Cte, RUT, Correo). Botón ghost `Copy` por dato (opcional, no existe en legacy). Correo como `mailto:pagos@kastor.cl`.

## 3. Filtros y búsqueda
DataTables con `bLengthChange:false`, `bPaginate:false`, `aaSorting:[]`. Los defaults no desactivados implican: caja de búsqueda visible (`bFilter` por defecto true), texto de info ("Showing 0 to 0 of 0 entries", sin `language` configurado → en inglés) y orden por clic en columnas habilitado (solo sin orden inicial).

| Control | Opciones visibles | Componente | Notas |
|---|---|---|---|
| Buscar | placeholder propuesto "Buscar por RUT o comunidad" | Input + icono Search | Equivale al `.dataTables_filter`. Filtra Rut y Comunidad |
| Orden | Rut, Comunidad, Deuda | TableHead clickable + ArrowUpDown | Sin orden inicial (respeta orden del servidor) |
| Paginación | ninguna | — | `bPaginate:false`: se muestran todas las filas |

## 4. Listado
Tipo: tabla (`table table-striped table-bordered table-hover table-condensed`, `<tr align="center">` en el thead). **En la evidencia el `<tbody>` está vacío: no hay facturas pendientes para esta administración.** Encabezados reales (como `<td>` con `<strong>`, no `<th>`):

| Columna (texto exacto) | Ancho legacy | Tipo de dato | Alineación | Badge/estado | Notas |
|---|---|---|---|---|---|
| (vacío) | 5% | control | centro | — | Sin texto. Por el CSS `.container-chekbox`/`.checkmark` y el patrón de la página hermana (`.addKhipu`), se infiere checkbox de selección o expansor. Propuesta: botón `ChevronRight`/`ChevronDown` para expandir facturas + Checkbox "seleccionar todas las de la comunidad" |
| Rut | 25% | RUT `NN.NNN.NNN-D` | centro (thead `align=center`) | — | `font-mono tabular-nums` |
| Comunidad | 35% | texto | izq | — | `font-medium text-brand-darkblue` |
| Deuda | 20% | moneda CLP | der | — | `$ 1.234.567` (ver formato en §6). `tabular-nums` |
| (vacío) | 15% | acción | centro | — | Sin texto. Se infiere la celda del botón `.btn-notificar` (el JS lee `data-fecha` y abre `#myModal2` "Notificar Pago"). Pendiente de confirmar |

### Detalle de facturas por comunidad (fila expandible) — propuesta
No hay filas, así que no existe evidencia de columnas de detalle (folio, fecha, vencimiento, PDF/XML). Lo único respaldado por el JS es la forma del objeto seleccionable (`value` JSON del checkbox en la página hermana: `folionum`, `docnum`, `doctotal`, `cardname`) y el texto que se arma por factura: `Factura: ${docnum} - ${monto}`. Por eso la subtabla propuesta se limita a:

| Columna propuesta | Fuente | Tipo | Alineación | Notas |
|---|---|---|---|---|
| (Checkbox) | `.addKhipu` (hermana) | booleano | centro | shadcn `Checkbox`, `aria-label="Seleccionar factura {docnum}"` |
| Factura | `docnum` | número | izq | Texto "Factura: {docnum}" en el resumen |
| Monto | `doctotal` | CLP | der | `tabular-nums` |
| Fecha / Vencimiento / Estado / PDF / XML | — | — | — | **Sin evidencia.** No implementar hasta tener HTML con filas |

Acciones por fila:
| Acción | Icono lucide | Confirmación | Notas |
|---|---|---|---|
| Seleccionar factura(s) para pagar | Checkbox | No | Recalcula total y muestra/oculta panel resumen |
| Notificar Pago | BellRing (o Send) | No (abre Dialog con formulario) | Botón `variant="outline" size="sm"`. Pasa la fecha (`data-fecha`) al campo oculto `datosFecha`. Ubicación exacta (fila comunidad o fila factura) pendiente |

## 5. Formularios y modales

### 5.1 Contacto Facturación (`#myModal`) → `Dialog`
| Elemento | Texto exacto | Componente |
|---|---|---|
| Título | Contacto Facturación | DialogTitle |
| Descripción | Envia un mensaje al área de facturación de Kastor | DialogDescription (respetar texto; "Envia" sin tilde en legacy, se propone "Envía") |
| Campo | `textarea#textarea`, sin label ni placeholder, 100% x 250px, `resize:none` | Textarea `rows={10} className="resize-none"`, label sr-only "Mensaje" |
| Botón cancelar | Cancelar | Button variant=outline (DialogClose) |
| Botón enviar | Enviar Mensaje | Button `bg-brand-orange` con icono Send; deshabilitado si el texto está vacío (propuesta) |
| Cerrar | × (`aria-label="Cerrar"`) | DialogClose por defecto |

Tras enviar (JS): limpia el textarea, cierra el modal y abre `#dialog` jQuery UI:
- Título: **Mensaje enviado exitosamente**
- Cuerpo: **Un ejecutivo se contactará con usted a la brevedad.**
- Botón: **Aceptar**

Propuesta: cerrar Dialog + `toast.success("Mensaje enviado exitosamente", { description: "Un ejecutivo se contactará con usted a la brevedad." })`.

| Campo | Placeholder / label | Tipo | Requerido | Componente |
|---|---|---|---|---|
| Mensaje | (sin label; descripción "Envia un mensaje al área de facturación de Kastor") | texto multilínea | no visible (proponer sí) | Textarea |

### 5.2 Notificar Pago (`#myModal2`) → `Dialog` con form
Form `POST /login/dashboard/notificar_pago`, `enctype="multipart/form-data"`.

| Elemento | Texto exacto | Componente |
|---|---|---|
| Título | Notificar Pago  (con espacio final) | DialogTitle "Notificar Pago" |
| Descripción | Envia un mensaje al área de Pagos de Kastor | DialogDescription |
| Botón cancelar | Cancelar | Button variant=outline |
| Botón enviar | Notificar Pago (submit, `btn-warning`) | Button `bg-brand-orange` icono Send |

| Campo | Placeholder / label | Tipo | Requerido | Componente |
|---|---|---|---|---|
| `datosFecha` | (oculto) | hidden, se llena con `data-fecha` del botón `.btn-notificar` | — | estado interno |
| `data[mensaje]` | (sin label) | texto multilínea 250px | no visible | Textarea |
| `data[Archivo][archivo]` | Adjuntar Documento | archivo | no visible | Label + Input `type="file"` (icono Paperclip) |

Separador `<hr>` entre textarea y adjunto → `Separator`. Sin mensaje de éxito en el JS (es un submit de formulario con recarga); proponer `toast.success("Pago notificado")` marcado como propuesta.

### 5.3 Suscribir PAC → `AlertDialog` informativo
El enlace navega a `/login/dashboard/solicitar_pac` y a la vez su handler `.mostrar-pac` abre `#dialog`:
- Título: **Contrato PAC**
- Cuerpo: **Se ha notificado a nuestros ejecutivos comerciales sobre la suscripción al contrato PAC, además se han descargado los contratos para su revisión.**
- Botón: **Aceptar**

Propuesta: al hacer clic se "solicita" (mock) y se muestra `AlertDialog` con ese título/texto y `AlertDialogAction` "Aceptar". No hay confirmación previa en legacy (la acción se ejecuta al clic). Se sugiere opcionalmente un paso de confirmación, marcado como mejora.

### 5.4 Resumen de pago Khipu (panel sticky) — propuesta mockeada
En **este** HTML no existe el marcado de `.resumenKhipu`, `.totalKhipu`, `.selectPagoKhipu`, `.loadingKhipu` ni `.callPagoKhipu` (solo el CSS `.resumenKhipu td {padding:3px}` y el handler de `.callPagoKhipu`). Tampoco existe en el HTML de Caleu (también sin filas). Lo que sí está respaldado:

| Elemento | Fuente | Propuesta shadcn | Icono |
|---|---|---|---|
| Panel visible solo si total > 0 | JS hermana: `display:block/none` según `totalAPagarKhipu` | `Card` sticky (`sticky bottom-4` o columna derecha `sticky top-4`) | Wallet |
| Lista de facturas seleccionadas | `folios.push("Factura: {docnum} - {monto}")` | lista compacta | Receipt |
| Total | `.totalKhipu` | fila "Total" `text-lg font-semibold tabular-nums` | — |
| Tipo de pago | `.selectPagoKhipu` (valor `''` = sin elegir) | `Select` placeholder "Seleccione tipo de pago" | CreditCard |
| Comisión | `.totalKhipuComision` = fee − total | fila "Comisión" `text-muted-foreground` | — |
| Total final | `.totalKhipuFinal` = fee | fila "Total a pagar" `text-brand-darkblue font-bold` | — |
| Cargando comisión | `.loadingKhipu` (oculta botón mientras consulta) | `Loader2 animate-spin` + Skeleton en filas | Loader2 |
| Botón pagar | `.callPagoKhipu`, deshabilitado hasta que fee > 0 | Button `bg-brand-orange` "Pagar con Khipu" (texto propuesto; el legacy no muestra el label) | ExternalLink |

Las **opciones del select de tipo de pago, los rótulos exactos del resumen y el texto del botón no están en la evidencia**: van a "Pendiente de confirmar". Mock propuesto: `[{ value: 'simplified_transfer', label: 'Transferencia simplificada' }, { value: 'regular_transfer', label: 'Transferencia bancaria' }]` marcado como ficticio.

## 6. Estados y alertas
- **Vacío (estado real de la evidencia):** tabla sin filas. Proponer `TableRow` con `TableCell colSpan={5}`: icono `CircleCheck text-success` + "No hay facturas pendientes." (texto propuesto; DataTables mostraría "No data available in table"). El panel resumen no se muestra.
- **Formato de moneda (JS hermana):** `Intl.NumberFormat('en-US', {style:'currency', currency:'USD', minimumFractionDigits:0})` + `.replace(",", ".")` → solo reemplaza la **primera** coma (bug: `$1.234,567`). Proponer `Intl.NumberFormat('es-CL', {style:'currency', currency:'CLP'})` → `$1.234.567`.
- **Errores (alert nativo):**
  - "error al obtener el monto a pagar" (consulta de comisión, página hermana) → `toast.error`.
  - "error al crear el pago" (este HTML, creación de pago Khipu) → `toast.error`.
- **Retorno de Khipu:** `return_url = location.href + "#success"`, `cancel_url = location.href`. En **este** HTML no hay handler de `#success`; en la página hermana existe con título "Procesando Pago Khipu" y cuerpo "El pago esta en proceso de confirmación se te notificara por correo cuando este validado." + `removeHash()`. Proponer el mismo comportamiento con `toast.info` o AlertDialog al detectar `#success`, marcado como tomado de la hermana. No hay manejo de `#cancel`.
- **Éxitos:** "Mensaje enviado exitosamente" / "Un ejecutivo se contactará con usted a la brevedad." (Contacto); "Contrato PAC" (PAC). Todos con botón "Aceptar" en `#dialog` jQuery UI (clase `colorNegro`). → sonner / AlertDialog.
- **Confirmaciones (js-confirm):** ninguna.
- **Cargando:** Skeleton de la tabla al cargar; Loader2 en el panel mientras se calcula la comisión; botón Pagar con `disabled` + Loader2 mientras se crea el pago.

### Bugs del legacy detectados (no replicar)
1. `.enviar-mensaje`: declara `var table = "/login/dashboard/mensaje_facturacion/"+texto` pero llama `$.ajax(url)` con `url` no definido → ReferenceError; el mensaje no se envía y el diálogo de éxito no aparece. Además el texto viaja sin `encodeURIComponent` en la ruta (en Caleu la variable sí se llama `url`).
2. Dos elementos con `id="textarea"` (en `#myModal` y `#myModal2`).
3. `#myModal2`: el `<form>` no tiene cierre `</form>`.
4. `.callPagoKhipu` usa `totalAPagarKhipu`, que en este HTML no está declarado (sí en Caleu).
5. `.mostrar-pac` es un `<a href>` sin `preventDefault`: navega a `solicitar_pac` al mismo tiempo que abre el diálogo.
6. Formato de moneda con `.replace(",", ".")` de una sola coma.

## 7. Navegación saliente
- `/` (index) vía "Volver" (`href="/login/"`).
- `/login/dashboard/solicitar_pac` (Suscribir PAC; según el texto descarga contratos).
- `mailto:pagos@kastor.cl` (propuesta, en el legacy es texto plano).
- Externo: URL de pago Khipu (`data.body.khipu.payment_url`) tras crear el pago; vuelve con `#success`.
- Comentado/no activo: `/login/dashboard/facturas_pagadas` (Facturas Pagadas).
- Barra de módulos transversal (cubierta por el Sidebar). En este HTML el botón resaltado sigue siendo "Usuarios" (`btn-warning`); el Sidebar marcará activo `/facturas/kastor`.

### Flujo Khipu (de la evidencia; endpoints solo documentados, no llamar)
1. Usuario marca checkboxes de facturas → se acumulan en un mapa por `folionum` (toggle). Se recalcula `total = Σ doctotal`, `coms = [cardname]`, `folios = ["Factura: docnum - monto"]`. *(JS de la hermana)*
2. Si total > 0 se muestra el resumen y se dispara el `change` del select de tipo de pago. *(hermana)*
3. Al elegir tipo de pago: se deshabilita y oculta el botón, se muestra loading y se hace `POST .../api/v1/fee` con `{ amount: parseInt(total), type }`. Respuesta 200 → `body` = total con comisión; comisión = body − total; se habilita el botón si body > 0. *(hermana)*
4. Pagar (`.callPagoKhipu`, **este HTML**): `POST https://kastor-api-khipu-dot-kastor-integraciones.appspot.com/api/v1/payments` con:
   `{ subject: "Pago Facturas upselling - upselling.kastor.cl", amount: parseInt(total), transaction_id: uuidv4(), type: "COBRANZA", data: { comunidades: coms.join(", "), administracion: adm, folionum: folios.join(", "), doctotal: total }, cancel_url: location.href, return_url: location.href + "#success", paymentType }`.
   Respuesta `status.code === 200` → redirige a `data.body.khipu.payment_url`; si no, alert "error al crear el pago". (En Caleu: `type: "CALEU"` y host con versión `20200413t104654-dot-...`.)
5. Retorno con `#success` → diálogo "Procesando Pago Khipu" *(solo en hermana)*.

En la app nueva todo esto se mockea: `calcularComision(total, tipo)` devuelve un valor simulado tras un `setTimeout`; "Pagar con Khipu" muestra `toast.info("Redirigiendo a Khipu… (simulado)")`.

## 8. Tipo de dato y mock
```ts
/** Objeto JSON del checkbox .addKhipu (claves exactas del legacy). */
export interface FacturaPendiente {
  /** Identificador único usado como clave de selección. */
  folionum: number
  /** Número de documento mostrado como "Factura: {docnum}". */
  docnum: number
  /** Monto en CLP (entero). */
  doctotal: number
  /** Nombre de la comunidad (cardname de la factura). */
  cardname: string
}

/** Fila de la tabla principal: Rut | Comunidad | Deuda. */
export interface ComunidadDeuda {
  rut: string
  comunidad: string
  /** Suma de doctotal de sus facturas (CLP). */
  deuda: number
  facturas: FacturaPendiente[]
  /** data-fecha del botón .btn-notificar (formato sin evidencia). */
  fechaNotificar?: string
}

/** Valor del .selectPagoKhipu; '' = sin elegir. Opciones sin evidencia. */
export interface TipoPagoKhipu {
  value: string
  label: string
}

export interface ResumenPago {
  facturas: FacturaPendiente[]
  total: number
  tipoPago: string | null
  /** fee − total; null mientras no se elige tipo o se calcula. */
  comision: number | null
  /** Respuesta de /fee (total con comisión). */
  totalFinal: number | null
  cargandoComision: boolean
}
```

Mock en `src/data/facturas-kastor.ts`. **FICTICIO**: la evidencia no trae filas (tbody vacío). Nombres y RUT inventados, coherentes con el formato; marcar con comentario `// MOCK FICTICIO: legacy sin filas en 01-pagina.html`. Exportar también `facturasKastorMockVacio: ComunidadDeuda[] = []` para reproducir el estado real.

| rut | comunidad | deuda | facturas (folionum / docnum / doctotal) |
|---|---|---|---|
| 53.312.456-7 | Comunidad Edificio Los Aromos | 285600 | 50101 / 10234 / 142800 ; 50187 / 10311 / 142800 |
| 65.104.882-3 | Condominio Parque Oriente | 99960 | 50122 / 10255 / 99960 |
| 56.078.219-K | Edificio Plaza Ñuñoa | 428400 | 50140 / 10270 / 142800 ; 50201 / 10322 / 142800 ; 50266 / 10398 / 142800 |

Tipos de pago (FICTICIO): `simplified_transfer` "Transferencia simplificada", `regular_transfer` "Transferencia bancaria". Comisión simulada: 1% redondeado.

## Estructura propuesta de la vista
- `Core` > `CoreHeader title="Facturación" environment="upselling" actions={[Suscribir PAC (FileSignature), Contacto Facturación (MessageSquare, naranja), Volver (ArrowLeft, outline)]}`.
- `CoreBody` en grid `lg:grid-cols-[1fr_320px]`:
  - Columna principal: `Alert` Datos bancarios (Landmark) → `Card` con `Input` búsqueda (Search) → `Table` 5 columnas (expansor/Checkbox, Rut, Comunidad, Deuda, acción "Notificar Pago") con `Collapsible`/fila expandida que contiene subtabla de facturas con `Checkbox`.
  - Columna derecha (o barra inferior sticky en móvil): `Card` "Resumen de pago" (solo si hay selección): lista de facturas, Total, `Select` Tipo de pago, Comisión, Total a pagar, Button "Pagar con Khipu".
- Dialogs: `ContactoFacturacionDialog` (Textarea), `NotificarPagoDialog` (Textarea + Input file + hidden fecha), `ContratoPacAlertDialog`.
- `Toaster` sonner (ya existe `src/components/ui/sonner.tsx`).
- Iconos lucide: ArrowLeft, FileSignature, MessageSquare, Send, Landmark, Copy, Search, ArrowUpDown, ChevronRight, ChevronDown, BellRing, Paperclip, Wallet, Receipt, CreditCard, Loader2, ExternalLink, CircleCheck.
- Falta componente shadcn `collapsible` (no está en `src/components/ui`); alternativa: estado local + `TableRow` extra.

## 9. Pendiente de confirmar
- **Filas reales de la tabla:** la administración no tenía facturas pendientes. Se necesita un HTML/captura de `/login/dashboard/facturas` de una administración con deuda para conocer: contenido de la columna 1 (checkbox o expansor), formato de Deuda, si hay subtabla de facturas y sus columnas (folio, fecha, vencimiento, estado, PDF/XML) y dónde está el botón `.btn-notificar` y el formato de `data-fecha`.
- **Marcado del resumen Khipu:** textos exactos, rótulos (Total, Comisión, Total final), opciones del `.selectPagoKhipu` y texto del botón `.callPagoKhipu`. No están en ninguno de los dos HTML.
- **Selección y comisión en esta página:** el JS de selección (`.addKhipu`), consulta de comisión (`/fee`) y manejo de `#success` solo existen en la página de Caleu; en este HTML falta, lo que sugiere que la plantilla los renderiza solo cuando hay filas o que la página de Kastor está incompleta. Confirmar con HTML con filas.
- Si "Suscribir PAC" cambia de estado/texto tras suscribirse (el enlace no muestra estado).
- Texto real del vacío de DataTables (inglés por defecto) y si la búsqueda se ve en pantalla.
- Valor del badge del Sidebar: se quitó porque la evidencia muestra 0 facturas.
- Capturas adicionales útiles: (1) página con facturas pendientes y una seleccionada (resumen visible), (2) select de tipo de pago desplegado, (3) modal "Notificar Pago" abierto desde su botón, (4) regreso desde Khipu con `#success`.
