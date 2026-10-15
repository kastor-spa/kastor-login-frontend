# MAPA-usuarios: Usuarios

- **Ruta propuesta:** `/usuarios`
- **Categoría en navegación:** Administración
- **Evidencia:** botón "Usuarios" en `docs/referencias/comunidades/03-navegacion.png` (activo, naranja). Patrones transversales de `docs/referencias/main2.css`: DATATABLE, BOTONES PARA TAG a (agregar +), BOTONES SECUNDARIOS PARA DATATABLE, SWITCH, BOTONES PARA MODAL DE JS-CONFIRM, ALERTS, BOX HERRAMIENTAS DE TABLA.
- **Fecha de mapeo:** 2026-10-14
- **Estado:** parcial (sin captura del módulo; campos y acciones son supuestos a confirmar)

## 1. Propósito
Administrar los usuarios que acceden al sistema desde la administración: crear, editar, activar o desactivar y eliminar cuentas, y ver qué perfil y comunidades tiene cada una.

## 2. Core header
| Elemento | Texto exacto | Componente shadcn | Icono lucide | Evidencia |
|---|---|---|---|---|
| Título | Usuarios | — | — | botón de navegación |
| Subtítulo / contador | Cantidad: N | — | — | patrón "Listado de Comunidades ( Cantidad: 40 )" |
| Acción primaria | + Agregar usuario | Button | Plus | patrón `.btn-k-mas` (botón agregar +) — texto supuesto |

## 3. Filtros y búsqueda
| Control | Opciones visibles | Componente | Evidencia |
|---|---|---|---|
| Perfil | Todos / Administrador / Supervisor / Operador | Select | supuesto; existe módulo Perfiles en la navegación |
| Estado | Todos / Activos / Inactivos | Select | patrón select "Todas" de la barra de listado |
| Buscar | placeholder "Buscar" | Input + Search | patrón barra de listado + `.dataTables_filter` |

## 4. Listado
Tipo: tabla (patrón DataTables confirmado en CSS).

| Columna | Tipo de dato | Alineación | Badge/estado | Evidencia |
|---|---|---|---|---|
| Nombre | texto | izq | — | supuesto |
| Correo electrónico | email | izq | — | login usa correo como identificador |
| Perfil | texto | izq | Badge secondary | supuesto, módulo Perfiles existe |
| Comunidades | número (cantidad asignada) | der | — | supuesto, relación con cards de comunidades |
| Último acceso | fecha DD-MM-YYYY HH:mm | izq | — | supuesto |
| Estado | booleano activo | centro | Switch | patrón SWITCH ON/OFF |

Acciones por fila:
| Acción | Icono lucide | Confirmación | Evidencia |
|---|---|---|---|
| Editar | Pencil | no | patrón herramientas de tabla (`.tabla-herramientas`, `a.action-on`) |
| Activar / desactivar | Switch | no | patrón SWITCH |
| Eliminar | Trash2 | AlertDialog | patrón papelera en cards + js-confirm |

## 5. Formularios y modales
Alta y edición en Dialog (patrón modal Bootstrap).

| Campo | Placeholder / label | Tipo | Requerido | Componente | Evidencia |
|---|---|---|---|---|---|
| Nombre | Nombre completo | texto | sí | Input | supuesto |
| Correo electrónico | correo@empresa.cl | email | sí | Input | login por correo |
| Perfil | Seleccione un perfil | select | sí | Select | supuesto |
| Activo | — | switch | no | Switch | patrón SWITCH |

## 6. Estados y alertas
- Vacío: "No hay usuarios que coincidan con la búsqueda."
- Confirmación de eliminación: AlertDialog con botón destructivo (patrón js-confirm).
- Alertas success/danger tras guardar: pendiente, no se ha visto el texto real.

## 7. Navegación saliente
- Perfiles (`/perfiles`) desde la columna Perfil (supuesto).

## 8. Tipo de dato y mock
```ts
export interface Usuario {
  id: string
  nombre: string
  correo: string
  perfil: 'Administrador' | 'Supervisor' | 'Operador'
  comunidades: number
  ultimoAcceso: string // DD-MM-YYYY HH:mm
  activo: boolean
}
```
Mock: 8 registros en `src/data/usuarios.ts`.

## 9. Pendiente de confirmar
Todo el contenido de las secciones 3, 4 y 5 es supuesto. Para cerrar el mapa se necesita:
- Captura del listado de Usuarios completo (columnas, botones superiores, paginación).
- Captura del formulario de alta o edición de usuario.
- Captura del modal de confirmación al eliminar y de cualquier alerta tras guardar.
- Si hay asignación de comunidades por usuario, captura de esa pantalla.
