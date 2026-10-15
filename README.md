# Frontend Kastor

Stack: Vite + React 19 + TypeScript · Tailwind CSS v4 (tokens) · shadcn/ui (componentes) · lucide-react (iconos) · react-router-dom.

## Comandos

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
npm run lint
```

## Estructura

```
src/
├── index.css                  # Tokens de diseño (CSS variables) cargados por Tailwind v4
├── main.tsx                   # Router + TooltipProvider
├── App.tsx                    # Rutas: /login y / (dentro de AppLayout)
├── layouts/
│   └── app-layout.tsx         # Sidebar + Core (SidebarProvider + SidebarInset + Outlet)
├── components/
│   ├── ui/                    # Componentes shadcn (generados por CLI)
│   ├── brand/logo.tsx         # Wordmark Kastor (naranja + barra bicolor)
│   ├── layout/
│   │   ├── app-sidebar.tsx    # Sidebar: logo, módulos en 4 categorías, soporte, usuario
│   │   └── core.tsx           # Core, CoreHeader (título, ambiente, acciones, usuario) y CoreBody
│   └── communities/
│       ├── community-card.tsx # Card de comunidad (formato Rut / prorrateo / cierre / etc.)
│       ├── community-table.tsx# Vista lista de comunidades
│       └── metric-card.tsx    # Tarjeta de métrica
├── pages/
│   ├── login.tsx
│   └── index.tsx              # Métricas + grilla de 12 comunidades (4 por fila en xl)
├── data/
│   └── communities.ts         # Datos mock
├── hooks/
└── lib/utils.ts               # cn()
```

## Convenciones

- **Tokens**: se definen en `src/index.css` (`:root` y `.dark`) y se exponen a Tailwind vía `@theme inline`. Tokens de marca: `--brand-orange`, `--brand-purple`, `--success` (clases `bg-brand-orange`, `text-brand-purple`, etc.). `--primary` apunta al naranja Kastor.
- **Marca**: paleta, tipografías y assets mapeados desde el login real están documentados en `DESIGN-SYSTEM.md`.
- **Componentes**: agregar con `npx shadcn@latest add <componente>`. Config en `components.json` (estilo `radix-nova`, iconos `lucide`).
- **Iconos**: siempre `lucide-react`.
- **Vistas**: cada página arma su propio `<Core>` con `<CoreHeader title actions>` y `<CoreBody>`.
