import { useMemo, useState } from 'react'
import { Building2, CircleAlert, LayoutGrid, List, Lock, Plus, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Core, CoreBody, CoreHeader } from '@/components/layout/core'
import { CommunityCard } from '@/components/communities/community-card'
import { CommunityTable } from '@/components/communities/community-table'
import { MetricCard } from '@/components/communities/metric-card'
import { communities as allCommunities, type Community } from '@/data/communities'

type ViewMode = 'grilla' | 'lista'
type Filter = 'todas' | 'activas' | 'inactivas' | 'alertas'

export function IndexPage() {
  const [communities, setCommunities] = useState<Community[]>(allCommunities)
  const [view, setView] = useState<ViewMode>('grilla')
  const [filter, setFilter] = useState<Filter>('todas')
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return communities.filter((c) => {
      if (filter === 'activas' && !c.activa) return false
      if (filter === 'inactivas' && c.activa) return false
      if (filter === 'alertas' && !c.alerta) return false
      if (q && !`${c.name} ${c.rut} ${c.usuario}`.toLowerCase().includes(q)) return false
      return true
    })
  }, [communities, filter, query])

  const active = communities.filter((c) => c.activa).length
  const alerts = communities.filter((c) => c.alerta).length
  const released = communities.filter((c) => c.liberado).length

  function handleDelete(community: Community) {
    // Mock: en producción abrir confirmación y llamar al backend.
    setCommunities((prev) => prev.filter((c) => c.id !== community.id))
  }

  return (
    <Core>
      <CoreHeader
        title="Listado de Comunidades"
        description={`Cantidad: ${communities.length}`}
        environment="upselling"
        actions={
          <Button size="sm">
            <Plus />
            Nueva comunidad
          </Button>
        }
      />

      <CoreBody>
        <section className="motion-stagger grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="Comunidades" value={String(communities.length)} icon={Building2} hint={`${active} activas`} />
          <MetricCard label="Con alertas" value={String(alerts)} icon={CircleAlert} hint="requieren revisión" />
          <MetricCard label="Liberadas" value={String(released)} icon={Lock} hint={`de ${communities.length}`} />
          <MetricCard label="Último cierre Rem" value="09-2026" icon={Building2} hint="período más reciente" />
        </section>

        {/* Barra de listado: vista, filtro y búsqueda */}
        <section className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="mr-auto text-sm font-medium">
              Comunidades{' '}
              <span className="text-muted-foreground">({filtered.length})</span>
            </h2>

            <ToggleGroup
              type="single"
              variant="outline"
              size="sm"
              value={view}
              onValueChange={(v) => v && setView(v as ViewMode)}
              aria-label="Modo de vista"
            >
              <ToggleGroupItem value="grilla" aria-label="Grilla">
                <LayoutGrid />
                <span className="hidden sm:inline">Grilla</span>
              </ToggleGroupItem>
              <ToggleGroupItem value="lista" aria-label="Lista">
                <List />
                <span className="hidden sm:inline">Lista</span>
              </ToggleGroupItem>
            </ToggleGroup>

            <Select value={filter} onValueChange={(v) => setFilter(v as Filter)}>
              <SelectTrigger size="sm" className="w-36">
                <SelectValue placeholder="Filtrar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas</SelectItem>
                <SelectItem value="activas">Activas</SelectItem>
                <SelectItem value="inactivas">Inactivas</SelectItem>
                <SelectItem value="alertas">Con alertas</SelectItem>
              </SelectContent>
            </Select>

            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="h-8 w-48 pl-8 md:w-64"
              />
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-lg border border-dashed p-10 text-center text-sm text-muted-foreground">
              No hay comunidades que coincidan con la búsqueda.
            </div>
          ) : view === 'grilla' ? (
            <div className="motion-stagger grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((community) => (
                <CommunityCard key={community.id} community={community} onDelete={handleDelete} />
              ))}
            </div>
          ) : (
            <CommunityTable communities={filtered} onDelete={handleDelete} />
          )}
        </section>
      </CoreBody>
    </Core>
  )
}
