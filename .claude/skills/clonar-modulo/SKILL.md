---
name: clonar-modulo
description: Flujo completo para traer un módulo del sistema legacy Kastor a este frontend - (1) va al módulo y obtiene su evidencia (capturas, HTML guardado o URL pública), (2) lo mapea con el agente front-mapper en docs/mapas/MAPA-<slug>.md y (3) lo copia a nuestro stack generando página React + shadcn + lucide, datos mock, ruta y navegación, verificado con tsc, lint y screenshot. Úsala cuando Héctor pida "clonar", "traer", "replicar", "crear el módulo X con las funcionalidades actuales" o "mapea y genera" un módulo (Usuarios, Perfiles, Tareas, Sistema Cobranza, UF, Facturas). Solo frontend, nunca backend ni login.
---

# Clonar módulo: ir → mapear → copiar

Argumentos: `<slug> [fuente]`
- `<slug>`: igual al `slug` en `src/config/navigation.ts` (ej. `usuarios`, `perfiles`, `sistema-cobranza`). Si el módulo no existe en el registro, se agrega al final del paso 3.
- `[fuente]` opcional: una URL pública, una ruta a HTML o carpeta de capturas, o nada (se usa `docs/referencias/<slug>/`).

Límites inquebrantables: solo frontend. Nunca leer PHP, SQL, controladores, modelos ni `.ctp`. Nunca iniciar sesión ni navegar dentro de `upselling.kastor.cl`. Nunca inventar campos: lo no evidenciado va a "Pendiente de confirmar".

---

## Paso 1 · Ir al módulo (obtener evidencia)

Resolver la evidencia en este orden y detenerse en la primera que exista (si Héctor da una URL del sistema, ir directo al punto 4):

1. **Carpeta del repo** `docs/referencias/<slug>/` con `.png`, `.jpg` o `.html`.
2. **Imágenes pegadas en el chat** en este turno: copiarlas a `docs/referencias/<slug>/NN-descripcion.png` antes de seguir, para que queden versionadas.
3. **Ruta local** pasada como `[fuente]` (HTML o carpeta): copiarla a `docs/referencias/<slug>/`.
4. **URL del sistema con sesión de Héctor** (modo navegador, el habitual): Héctor tiene la sesión en su Chrome principal (la llave de acceso vive ahí). Ejecutar

   ```bash
   bash .claude/skills/clonar-modulo/scripts/capturar-chrome.sh <slug> "<url>"
   ```

   El script controla el Chrome principal por AppleScript: busca o navega la pestaña de kastor.cl a la URL, espera la carga y guarda el HTML renderizado con el comando "save as only html" de Chrome (no necesita el permiso "JavaScript para eventos de Apple" ni toca cookies). Si la pestaña está en el login, aborta y hay que pedir a Héctor que inicie sesión en su Chrome. El screenshot se omite si la terminal no tiene permiso de grabación de pantalla; el HTML basta para mapear. Nunca abrir un Chrome aparte: no tendría la sesión.
   Antes de la primera captura conviene guardar también el dashboard (`/login/dashboard/index`) con slug `comunidades`: su barra de navegación trae los `href` reales de todos los módulos.

5. **URL pública** (solo `/login`): `bash .claude/skills/clonar-modulo/scripts/capturar-url.sh "<url>" <slug>`. Descarga con curl y screenshot headless. Aborta en cualquier ruta que exija sesión.

Si no hay evidencia en ninguna fuente: **no continuar**. Responder con la lista exacta de lo que falta: listado completo, formulario de alta/edición, modales o confirmaciones, alertas, y cualquier subpantalla del módulo. Terminar el turno ahí.

Leer toda la evidencia con Read antes del paso 2 (las imágenes se ven, el HTML se analiza con Grep para tablas, formularios, botones, selects y textos).

## Paso 2 · Mapear

Lanzar el agente `front-mapper` con este brief (ajustar slug y rutas):

> Mapea el módulo `<slug>` usando únicamente la evidencia en `docs/referencias/<slug>/` (lista los archivos). Sigue `docs/mapas/_PLANTILLA.md` y escribe `docs/mapas/MAPA-<slug>.md`. Actualiza `src/config/navigation.ts` (status `'mapeado'`, y título/icono/ruta si la evidencia los corrige) y agrega la fila en `docs/mapas/MODULOS.md`. No leas backend ni entres al sistema. Devuelve: columnas, acciones, campos de formulario, estados, tipo TS y lo pendiente de confirmar.

Al volver, leer el mapa completo. Si el agente reporta que faltan pantallas críticas (por ejemplo no se vio el formulario), seguir igual al paso 3 con lo que hay y dejar esas partes marcadas en el mapa.

## Paso 3 · Copiar a nuestro sistema

Construir el módulo con el stack del proyecto, siguiendo el mapa al pie de la letra (nombres de columnas, botones y textos tal cual).

1. **Componentes shadcn**: revisar `src/components/ui/` y agregar los que falten:
   `npx shadcn@latest add <componentes> -y -o` (típicos: table, dialog, alert-dialog, select, switch, badge, tabs, breadcrumb, checkbox, textarea, tooltip, dropdown-menu, sheet, alert).
2. **Datos**: `src/data/<slug>.ts` con el `interface` del mapa y un mock de 5 a 10 registros coherentes con la evidencia (RUTs chilenos válidos en formato, fechas DD-MM-YYYY o MM-YYYY según el mapa, montos CLP).
3. **Página**: `src/pages/<slug>.tsx` exportando `<Nombre>Page`, con:
   - `<Core>` → `<CoreHeader title description environment="upselling" actions>` con el contador "Cantidad: N" y las acciones primarias del mapa.
   - `<CoreBody>` con, en este orden si existen en el mapa: métricas (`MetricCard`), barra de filtros/búsqueda/vista, listado (Table o cards), paginación si la evidencia la muestra.
   - Acciones por fila con icono lucide del mapa. Eliminar siempre con `AlertDialog`. Alta/edición en `Dialog` con los campos del mapa, estado local sobre el mock.
   - Estado vacío con texto en español.
   - Componentes de dominio reutilizables en `src/components/<slug>/` si la página supera ~250 líneas.
4. **Ruta**: registrar en `src/App.tsx` dentro de `<AppLayout>` usando el `to` del registro de navegación.
5. **Navegación**: confirmar en `src/config/navigation.ts` que el módulo quedó `status: 'mapeado'` y con la ruta correcta. Si es un módulo nuevo, agregarlo a la categoría que corresponda con `source: 'captura'`.
6. **Inventario**: en `docs/mapas/MODULOS.md` dejar la fila con "implementado en `src/pages/<slug>.tsx`".

## Verificación obligatoria

```bash
npx tsc -b
npm run lint
```

Luego captura de la vista con el servidor de Vite corriendo (levantarlo si no está):

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --disable-gpu --hide-scrollbars \
  --window-size=1600,1000 --virtual-time-budget=6000 --screenshot=<scratchpad>/<slug>.png http://localhost:5173<ruta>
```

Ver la captura con Read y compararla con la evidencia del paso 1. Corregir diferencias de estructura, orden de columnas o textos antes de reportar.

## Reporte final

Breve, en español:
- Qué evidencia se usó y de dónde.
- Ruta de la vista y archivos creados.
- Qué quedó "Pendiente de confirmar" según el mapa y qué captura lo resolvería.
