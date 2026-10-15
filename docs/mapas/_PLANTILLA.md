# MAPA-<slug>: <Nombre del módulo>

- **Ruta propuesta:** `/<ruta>`
- **Categoría en navegación:** <Administración | Cobranza | Facturación | Comunidad>
- **Evidencia:** `docs/referencias/<slug>/...` (listar archivos) + clases legacy: `.clase-uno`, `.clase-dos`
- **Fecha de mapeo:** AAAA-MM-DD
- **Estado:** mapeado | parcial

## 1. Propósito
Una o dos frases: qué hace el usuario aquí.

## 2. Core header
| Elemento | Texto exacto | Componente shadcn | Icono lucide |
|---|---|---|---|
| Título | | — | — |
| Subtítulo / contador | | — | — |
| Acción primaria | | Button | |
| Acciones secundarias | | Button variant=outline / DropdownMenu | |
| Breadcrumb / volver | | Breadcrumb / Button ghost | ArrowLeft |

## 3. Filtros y búsqueda
| Control | Opciones visibles | Componente | Notas |
|---|---|---|---|

## 4. Listado
Tipo: tabla | cards | tiles.

| Columna (texto exacto) | Tipo de dato | Alineación | Badge/estado | Notas |
|---|---|---|---|---|

Acciones por fila:
| Acción | Icono lucide | Confirmación | Notas |
|---|---|---|---|

## 5. Formularios y modales
| Campo | Placeholder / label | Tipo | Requerido | Componente |
|---|---|---|---|---|

## 6. Estados y alertas
- Vacío:
- Alertas visibles (info/success/warning/danger):
- Confirmaciones (js-confirm):

## 7. Navegación saliente
- Enlaza a:

## 8. Tipo de dato y mock
```ts
export interface <Entidad> {
  // campos con tipos
}
```
Mock sugerido: 3 a 5 registros en `src/data/<slug>.ts`.

## 9. Pendiente de confirmar
- Lista de dudas y qué captura las resolvería.
