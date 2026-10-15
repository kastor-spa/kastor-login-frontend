# Inventario de módulos del legacy Kastor

Fuente de verdad del menú: `src/config/navigation.ts`. Este archivo registra el avance del mapeo.

| Slug | Módulo | Categoría | Origen | Estado | Evidencia | Mapa |
|---|---|---|---|---|---|---|
| comunidades | Comunidades | Administración | captura | mapeado | capturas 2026-10-14 (cards, navegación) | implementado en `src/pages/index.tsx` |
| inicio-comunidad | Home de la comunidad (Kastor Contable) | Comunidad | captura | parcial | captura 2026-10-15 (`docs/referencias/inicio-comunidad/`) | `MAPA-inicio-comunidad.md`, implementado en `src/pages/comunidad/inicio.tsx` |
| usuarios | Usuarios | Administración | captura | confirmado (mapa parcial) | botón en barra de navegación + patrones CSS | `MAPA-usuarios.md`, implementado en `src/pages/usuarios.tsx` con campos supuestos |
| perfiles | Perfiles | Administración | html navegador | mapeado | `docs/referencias/perfiles/01-pagina.html` (listado), `02-pagina.html` (agregar), `03-pagina.html` (modificar 2326) (2026-10-14) | `MAPA-perfiles.md`, implementado en `src/pages/perfiles/` (rutas /perfiles, /perfiles/nuevo, /perfiles/:id) |
| tareas | Tareas | Administración | html navegador | mapeado (parcial: sin filas) | `docs/referencias/tareas/01-pagina.html` (listado) y `02-pagina.html` (formulario Nueva tarea) (2026-10-14) | `MAPA-tareas.md`, implementado en `src/pages/tareas.tsx` (ruta /tareas) |
| sistema-cobranza | Sistema Cobranza | Cobranza | html navegador | mapeado | `docs/referencias/sistema-cobranza/01-pagina.html` (2026-10-14) | `MAPA-sistema-cobranza.md`, implementado en `src/pages/sistema-cobranza.tsx` (ruta /cobranza) |
| uf | UF | Cobranza | html navegador | mapeado | `docs/referencias/uf/01-pagina.html` (2026-10-14) | `MAPA-uf.md`, implementado en `src/pages/uf.tsx` (ruta /uf) |
| facturas-kastor | Facturas Kastor pendientes | Facturación | html navegador | mapeado (parcial: sin filas ni marcado del resumen Khipu) | `docs/referencias/facturas-kastor/01-pagina.html` (2026-10-14) | `MAPA-facturas-kastor.md`, implementado en `src/pages/facturas-kastor.tsx` (ruta /facturas/kastor) |
| facturas-caleu | Facturas Caleu pendientes | Facturación | html navegador | mapeado (parcial: sin filas ni markup de resumen Khipu) | `docs/referencias/facturas-caleu/01-pagina.html` (2026-10-14), comparado con `facturas-kastor/01-pagina.html` | `MAPA-facturas-caleu.md`, implementado en `src/pages/facturas-caleu.tsx` (ruta /facturas/caleu) |


## Módulos descartados (2026-10-14)
Inferidos desde clases de `main2.css`, sin pantalla real. Se buscaron en todas las capturas con sesión (`docs/referencias/*/*.html`): la navegación del sistema solo enlaza Usuarios, Sistema Cobranza, Perfiles, Tareas, UF, Facturas Kastor y Facturas Caleu. Probablemente son clases de la vista de comunidad o del portal del residente, no de la administración. Se quitaron de `src/config/navigation.ts`.

| Slug | Módulo | Pista CSS que lo originó |
|---|---|---|
| otros-pagos | Otros pagos | `otrospagos.png`, `.logo_webpay` |
| medidores | Medidores y lecturas | `.tabla-medidores`, `.box-contador-medida-lecturas*`, `.texto-informe-medidores` |
| control-acceso | Control de acceso | `.box-autorizados`, "BOX ELIMINAR RUTS CONTROL ACCESO" |
| contacto | Contacto | `.box-contacto`, `.textarea-output.bg-chat-*` |
| mi-perfil | Mi perfil | "PERFIL ANTIGUO", `.img-kastorsito` |
| manual | Manual de usuario | `.box-manual`, `.link-manual` |

## Elementos transversales confirmados (header / navegación)
- Logo Kastor a la izquierda, etiqueta de ambiente al centro ("upselling"), correo del usuario + configuración + salir a la derecha.
- Barra de módulos con botón activo naranja.
- Bloque Soporte con teléfonos 02-2 833 8269 / 02-2 833 8307.
- Barra de listado: "Listado de Comunidades ( Cantidad: N )", select de vista (Grilla), select de filtro (Todas), búsqueda.

## Cómo agregar evidencia
1. Crear `docs/referencias/<slug>/` y dejar ahí capturas (`.png`) o HTML guardado (`.html`).
2. Ejecutar `/mapear-modulo <slug>`.
