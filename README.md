# kastor-login-frontend

Frontend del **login de K2** (Kastor). Incluye la pantalla de acceso y las vistas posteriores al ingreso: selector de productos, listado de comunidades y dashboard de la comunidad en Kastor Contable.

Es solo frontend: no contiene backend, autenticación real ni conexión a APIs. Los datos son mock (`src/data/`).

Stack: Vite + React 19 + TypeScript · Tailwind CSS v4 (tokens) · shadcn/ui (componentes) · lucide-react (iconos) · react-router-dom.

## Comandos

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
npm run lint
npx tsc -b       # verificación de tipos
```

## Rutas

| Ruta | Vista |
|---|---|
| `/login` | Login de K2 |
| `/bienvenida` | Selector de productos post-login |
| `/` | Listado de comunidades |
| `/usuarios`, `/perfiles`, `/tareas`, `/cobranza`, `/uf`, `/facturas/*` | Módulos de administración |
| `/comunidades/:id` | Dashboard de la comunidad (sidebar de 2 niveles: productos + Kastor Contable) |
| `/comunidades/:id/:categoria/:modulo` | Módulos de Kastor Contable |

## Estructura

```
src/
├── index.css            # Tokens de diseño (paleta, tipografías, escala de tamaños, radio) y animaciones
├── App.tsx              # Rutas
├── config/
│   ├── navigation.ts    # Menús: administración y Kastor Contable (único lugar)
│   └── productos.ts     # Productos de la suite (nivel 1 del sidebar)
├── layouts/             # app-layout (sidebar simple) y comunidad-layout (sidebar de 2 niveles)
├── components/
│   ├── ui/              # shadcn (generados por CLI, no editar a mano)
│   ├── layout/          # Sidebars y Core (CoreHeader + CoreBody)
│   └── <dominio>/       # Componentes por dominio (communities, comunidad, facturas, uf...)
├── pages/               # Una página por ruta
├── data/                # Datos mock
├── hooks/
└── lib/
docs/
├── referencias/         # Evidencia del sistema legacy (capturas y HTML)
└── mapas/               # MAPA-<slug>.md por módulo + inventario MODULOS.md
```

## Convenciones

- **Tokens**: en `src/index.css` (`:root` y `.dark`), expuestos a Tailwind con `@theme inline`. Nunca hex sueltos en componentes.
- **Marca**: paleta, tipografías (Montserrat títulos, Roboto textos), escala desde 12px y radio de 6px en `DESIGN-SYSTEM.md`.
- **Componentes**: agregar con `npx shadcn@latest add <componente>` (estilo `radix-nova`).
- **Iconos**: siempre `lucide-react`.
- **Vistas**: cada página arma su `<Core>` con `<CoreHeader>` y `<CoreBody>`.
