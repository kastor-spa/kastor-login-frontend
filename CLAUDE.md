# Frontend kastor

Propuesta de frontend nuevo para Kastor (administración de comunidades, Chile). Solo frontend: este repo no contiene ni debe tocar backend.

## Stack fijo
- Vite + React 19 + TypeScript. Alias `@/` → `src/`.
- Tailwind CSS v4 carga los tokens (`src/index.css`, `@theme inline`).
- shadcn/ui es la librería de componentes (`components.json`, preset radix-nova). No editar `src/components/ui/*` a mano; regenerar con `npx shadcn@latest add`.
- lucide-react para todos los iconos.
- react-router-dom para rutas.

## Estructura
- Layout: Sidebar + Core. Cada página arma `<Core>` → `<CoreHeader title description environment actions>` + `<CoreBody>`.
- Módulos y categorías del menú viven en `src/config/navigation.ts` (único lugar). El sidebar lo lee.
- Datos mock en `src/data/`. Páginas en `src/pages/`. Componentes de dominio en `src/components/<dominio>/`.

## Marca
- Paleta, tipografías y assets mapeados desde el login real están en `DESIGN-SYSTEM.md`. Usar tokens (`bg-brand-orange`, `text-brand-darkblue`, `bg-success`...), nunca hex sueltos en componentes.
- Logo: `public/logo-kastor.png` vía `<KastorLogo />`.

## Mapeo del sistema legacy (frontend only)
- Referencia pública: `https://upselling.kastor.cl/login/`. Solo se inspecciona /login. Nunca iniciar sesión ni navegar dentro del sistema.
- Evidencia de módulos: capturas o HTML guardado en `docs/referencias/<slug>/`. Mapas resultantes en `docs/mapas/MAPA-<slug>.md`. Inventario en `docs/mapas/MODULOS.md`.
- Flujo completo (ir al módulo → mapear → copiar a nuestro stack): `/clonar-modulo <slug> [fuente]`. Solo mapear: `/mapear-modulo <slug>`. Ambos usan el agente `front-mapper`. Prohibido leer PHP, SQL, controladores o `.ctp`.
- No inventar campos ni acciones sin evidencia; lo dudoso va a "Pendiente de confirmar".

## Comandos
- `npm run dev` (http://localhost:5173), `npm run build`, `npm run lint`, `npx tsc -b`.
- Verificar siempre con `npx tsc -b` antes de reportar.

## Commits
- Regla del negocio: los commits y PRs no llevan co-autoría ni firma de Claude (sin `Co-Authored-By: Claude`, sin "Generated with Claude Code").
- Lo aplican `.claude/settings.json` (`attribution` vacío) y el hook `.githooks/commit-msg` (se activa con `npm install` vía `prepare`).

## Idioma
Español en UI, docs, commits y respuestas.
