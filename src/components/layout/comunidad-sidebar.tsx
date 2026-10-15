import { useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, Check, ChevronRight, ChevronsUpDown, LayoutGrid, LogOut, Search } from 'lucide-react'
import { navigationContable, rutaContable, type ContableCategoria, type ContableModulo } from '@/config/navigation'
import { productos } from '@/config/productos'
import { communities, type Community } from '@/data/communities'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar'

/** Producto en el que se trabaja dentro de una comunidad. */
const PRODUCTO_ACTUAL = 'contable'

const normalizar = (text: string) =>
  text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()

/**
 * Sidebar de 2 niveles para el dashboard de una comunidad:
 * - Nivel 1 (riel): iconos de productos. Siempre en Kastor Contable.
 * - Nivel 2 (panel): menú de Kastor Contable con categorías desplegables.
 * Al colapsar el sidebar queda solo el riel.
 */
export function ComunidadSidebar({ comunidad }: { comunidad: Community }) {
  return (
    <Sidebar collapsible="icon" className="overflow-hidden *:data-[sidebar=sidebar]:flex-row">
      <RielProductos comunidad={comunidad} />
      <PanelContable comunidad={comunidad} />
    </Sidebar>
  )
}

/* ---------------------------------- Nivel 1 --------------------------------- */

function RielProductos({ comunidad }: { comunidad: Community }) {
  const navigate = useNavigate()
  return (
    <Sidebar
      collapsible="none"
      className="w-[calc(var(--sidebar-width-icon)+1px)]! border-r animate-in fade-in slide-in-from-left-4 duration-500 ease-out motion-reduce:animate-none"
    >
      <SidebarHeader className="h-16 items-center justify-center border-b p-0">
        <Link
          to="/"
          viewTransition
          aria-label="Listado de comunidades"
          className="flex size-8 items-center justify-center rounded-md bg-brand-orange font-heading text-lg font-bold text-white transition-transform hover:scale-105"
        >
          k
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup className="px-1.5">
          <SidebarGroupContent>
            <SidebarMenu className="gap-1.5">
              {productos.map((p) => {
                const actual = p.slug === PRODUCTO_ACTUAL
                const disponible = actual || p.ruta !== null || p.url !== null
                return (
                  <SidebarMenuItem key={p.slug}>
                    <SidebarMenuButton
                      tooltip={{ children: disponible ? p.nombre : `${p.nombre} · Próximamente`, hidden: false }}
                      isActive={actual}
                      aria-disabled={!disponible}
                      onClick={() => actual && navigate(rutaContable(comunidad.id), { viewTransition: true })}
                      className={cn(
                        'size-9! justify-center p-0!',
                        actual && 'bg-brand-orange/10! text-brand-orange! hover:bg-brand-orange/15',
                        !disponible && 'cursor-not-allowed aria-disabled:pointer-events-auto aria-disabled:opacity-50',
                      )}
                    >
                      <p.icon className="size-5!" />
                      <span className="sr-only">{p.nombre}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="items-center gap-2 border-t px-1.5">
        <SidebarMenu className="items-center">
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip={{ children: 'Volver al listado', hidden: false }} className="size-9! justify-center p-0!">
              <Link to="/" viewTransition>
                <ArrowLeft className="size-5!" />
                <span className="sr-only">Volver al listado de comunidades</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  aria-label="Mi cuenta"
                  className="rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring"
                >
                  <Avatar className="size-8 rounded-lg">
                    <AvatarFallback className="rounded-lg bg-brand-purple text-white">HB</AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="right" align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="text-sm font-medium">Héctor Barrera</div>
                  <div className="text-xs text-muted-foreground">hector.barrera@kastor.cl</div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => navigate('/bienvenida')}>
                  <LayoutGrid />
                  Cambiar de producto
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => navigate('/login')}>
                  <LogOut />
                  Cerrar sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

/* ---------------------------------- Nivel 2 --------------------------------- */

function PanelContable({ comunidad }: { comunidad: Community }) {
  const { pathname } = useLocation()
  const [query, setQuery] = useState('')

  const base = rutaContable(comunidad.id)
  const categoriaActiva = pathname === base ? 'inicio' : pathname.slice(base.length + 1).split('/')[0]

  // Categorías abiertas. La activa se abre sola al navegar hacia ella.
  const [abiertas, setAbiertas] = useState<Set<string>>(() => new Set([categoriaActiva]))
  const [ultimaActiva, setUltimaActiva] = useState(categoriaActiva)
  if (ultimaActiva !== categoriaActiva) {
    setUltimaActiva(categoriaActiva)
    setAbiertas((prev) => new Set(prev).add(categoriaActiva))
  }

  const toggle = (slug: string, open: boolean) =>
    setAbiertas((prev) => {
      const next = new Set(prev)
      if (open) next.add(slug)
      else next.delete(slug)
      return next
    })

  // Filtro: deja las categorías con coincidencias y solo sus módulos coincidentes.
  const categorias = useMemo(() => {
    const q = normalizar(query.trim())
    if (!q) return navigationContable
    const coincide = (m: ContableModulo) => normalizar(m.title).includes(q)
    return navigationContable.flatMap((c) => {
      if (normalizar(c.title).includes(q)) return [c]
      const modulos = c.modulos.filter(coincide)
      const informes = c.informes?.filter(coincide) ?? []
      return modulos.length || informes.length ? [{ ...c, modulos, informes }] : []
    })
  }, [query])

  return (
    <Sidebar
      collapsible="none"
      className="flex min-w-0 flex-1 animate-in fade-in slide-in-from-left-6 delay-100 duration-500 ease-out fill-mode-both motion-reduce:animate-none"
    >
      <SidebarHeader className="gap-3 border-b px-3 py-3">
        <SelectorComunidad comunidad={comunidad} />
        <div className="relative">
          <Search className="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <SidebarInput
            placeholder="Buscar módulo"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-8"
          />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="motion-stagger">
              {categorias.map((c) => (
                <ItemCategoria
                  key={c.slug}
                  categoria={c}
                  comunidadId={comunidad.id}
                  pathname={pathname}
                  activa={c.slug === categoriaActiva}
                  abierta={query.trim() !== '' || abiertas.has(c.slug)}
                  onOpenChange={(open) => toggle(c.slug, open)}
                />
              ))}
            </SidebarMenu>
            {categorias.length === 0 ? (
              <p className="px-2 py-6 text-center text-sm text-muted-foreground">Sin módulos para “{query}”.</p>
            ) : null}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

function SelectorComunidad({ comunidad }: { comunidad: Community }) {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const base = rutaContable(comunidad.id)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex w-full items-center gap-2 rounded-md p-1 text-left outline-none transition-colors hover:bg-sidebar-accent focus-visible:ring-2 focus-visible:ring-sidebar-ring data-[state=open]:bg-sidebar-accent"
        >
          <div className="grid min-w-0 flex-1 leading-tight">
            <span className="text-[11px] font-semibold uppercase tracking-wide text-brand-orange">Kastor Contable</span>
            {/* Mismo view-transition-name que el encabezado de la card: la card "se transforma" en este título. */}
            <span
              className="truncate text-sm font-semibold text-brand-darkblue"
              style={{ viewTransitionName: `comunidad-${comunidad.id}` }}
            >
              {comunidad.name}
            </span>
            <span className="truncate text-xs text-muted-foreground tabular-nums">RUT {comunidad.rut}</span>
          </div>
          <ChevronsUpDown className="size-4 shrink-0 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="max-h-80 w-(--radix-dropdown-menu-trigger-width) min-w-64">
        <DropdownMenuLabel>Cambiar de comunidad</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {communities.map((c) => (
          <DropdownMenuItem
            key={c.id}
            onSelect={() => navigate(`${rutaContable(c.id)}${pathname.slice(base.length)}`)}
          >
            <span className={cn('size-2 shrink-0 rounded-full', c.activa ? 'bg-brand-orange' : 'bg-brand-lightgray')} />
            <span className="truncate">{c.name}</span>
            <span className="ml-auto text-xs text-muted-foreground">{c.usuario}</span>
            {c.id === comunidad.id ? <Check className="text-brand-orange" /> : null}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

interface ItemCategoriaProps {
  categoria: ContableCategoria
  comunidadId: string
  pathname: string
  activa: boolean
  abierta: boolean
  onOpenChange: (open: boolean) => void
}

function ItemCategoria({ categoria, comunidadId, pathname, activa, abierta, onOpenChange }: ItemCategoriaProps) {
  const Icon = categoria.icon
  const informes = categoria.informes ?? []
  const directo = categoria.modulos.length === 0 && informes.length === 0

  if (directo) {
    const to = rutaContable(comunidadId, categoria)
    return (
      <SidebarMenuItem>
        <SidebarMenuButton asChild isActive={pathname === to} className="data-active:text-brand-orange">
          <Link to={to}>
            <Icon />
            <span>{categoria.title}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    )
  }

  const subItem = (m: ContableModulo) => {
    const to = rutaContable(comunidadId, categoria, m)
    return (
      <SidebarMenuSubItem key={m.slug}>
        <SidebarMenuSubButton
          asChild
          isActive={pathname === to}
          className="transition-colors data-active:font-medium data-active:text-brand-orange"
        >
          <Link to={to}>
            <span>{m.title}</span>
          </Link>
        </SidebarMenuSubButton>
      </SidebarMenuSubItem>
    )
  }

  return (
    <Collapsible asChild open={abierta} onOpenChange={onOpenChange} className="group/categoria">
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton className={cn(activa && 'font-medium text-brand-orange')}>
            <Icon />
            <span>{categoria.title}</span>
            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/categoria:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
          <SidebarMenuSub>
            {categoria.modulos.map(subItem)}
            {informes.length > 0 ? (
              <>
                <li className="px-2 pt-2 pb-0.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Informes
                </li>
                {informes.map(subItem)}
              </>
            ) : null}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  )
}
