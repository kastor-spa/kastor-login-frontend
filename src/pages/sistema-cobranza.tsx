import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowUpDown,
  Bell,
  BellOff,
  Building2,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  CircleCheck,
  LoaderCircle,
  Minus,
  Search,
  Settings2,
} from 'lucide-react'
import { toast } from 'sonner'
import { Core, CoreBody, CoreHeader } from '@/components/layout/core'
import { MetricCard } from '@/components/communities/metric-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'
import {
  comunidadesSca as seed,
  estadosLiberacion,
  tiposSca,
  type ComunidadSCA,
  type TipoSca,
} from '@/data/sistema-cobranza'

type FiltroEstado = 'todos' | 'notificado' | 'no_notificado' | 'sin_liberacion'
type FiltroTipo = 'todos' | '0' | '1' | '2'
type SortKey = 'nombre' | 'ultimoGastoComun' | 'fechaUltimoCierre' | 'fechaUltimaLiberacion'

const PAGE_SIZE = 10

/** Convierte MM-YYYY a YYYY-MM para ordenar; null al final. */
function sortValue(c: ComunidadSCA, key: SortKey): string {
  const v = c[key]
  if (!v) return ''
  if (key === 'ultimoGastoComun') {
    const [m, y] = v.split('-')
    return `${y}-${m}`
  }
  return v
}

/** Mock del POST /login/dashboard/cambiar_sca. */
function cambiarSca(_id: number, _tipo: TipoSca): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, 500))
}

function EstadoLiberacionCell({ estado }: { estado: ComunidadSCA['estadoLiberacion'] }) {
  if (estado === 'notificado') {
    return (
      <span className="inline-flex items-center gap-1.5 text-success">
        <CircleCheck className="size-4" />
        {estadosLiberacion.notificado}
      </span>
    )
  }
  if (estado === 'no_notificado') {
    return (
      <span className="inline-flex items-center gap-1.5 text-warning-foreground">
        <CircleAlert className="size-4 text-warning" />
        {estadosLiberacion.no_notificado}
      </span>
    )
  }
  return <Minus className="size-4 text-muted-foreground" aria-label="Sin liberación" />
}

function SortHead({
  label,
  k,
  active,
  onSort,
}: {
  label: string
  k: SortKey
  active: boolean
  onSort: (k: SortKey) => void
}) {
  return (
    <TableHead>
      <button
        type="button"
        onClick={() => onSort(k)}
        className={cn('inline-flex items-center gap-1 hover:text-foreground', active && 'text-foreground')}
      >
        {label}
        <ArrowUpDown className="size-3.5 opacity-60" />
      </button>
    </TableHead>
  )
}

/**
 * Módulo Sistema de Cobranza (SCA). Replica /login/dashboard/sca del legacy.
 * Ver docs/mapas/MAPA-sistema-cobranza.md.
 */
export function SistemaCobranzaPage() {
  const [comunidades, setComunidades] = useState<ComunidadSCA[]>(seed)
  const [query, setQuery] = useState('')
  const [estado, setEstado] = useState<FiltroEstado>('todos')
  const [tipo, setTipo] = useState<FiltroTipo>('todos')
  const [sort, setSort] = useState<{ key: SortKey; dir: 'asc' | 'desc' }>({ key: 'nombre', dir: 'asc' })
  const [page, setPage] = useState(1)
  const [saving, setSaving] = useState<Set<number>>(new Set())

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const rows = comunidades.filter((c) => {
      if (estado === 'sin_liberacion' ? c.estadoLiberacion !== null : estado !== 'todos' && c.estadoLiberacion !== estado) return false
      if (tipo !== 'todos' && String(c.tipoSca) !== tipo) return false
      if (q && !`${c.nombre} ${c.ultimoGastoComun ?? ''}`.toLowerCase().includes(q)) return false
      return true
    })
    const dir = sort.dir === 'asc' ? 1 : -1
    return rows.sort((a, b) => {
      const va = sortValue(a, sort.key)
      const vb = sortValue(b, sort.key)
      if (va === vb) return 0
      if (va === '') return 1
      if (vb === '') return -1
      return va.localeCompare(vb, 'es') * dir
    })
  }, [comunidades, query, estado, tipo, sort])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const pageRows = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
  const from = filtered.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1
  const to = Math.min(currentPage * PAGE_SIZE, filtered.length)

  const notificadas = comunidades.filter((c) => c.estadoLiberacion === 'notificado').length
  const noNotificadas = comunidades.filter((c) => c.estadoLiberacion === 'no_notificado').length
  const scaActivo = comunidades.filter((c) => c.tipoSca !== 0).length

  function toggleSort(key: SortKey) {
    setSort((s) => (s.key === key ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' }))
  }

  async function handleTipoChange(c: ComunidadSCA, value: string) {
    const nuevo = Number(value) as TipoSca
    const anterior = c.tipoSca
    setComunidades((prev) => prev.map((x) => (x.id === c.id ? { ...x, tipoSca: nuevo } : x)))
    setSaving((s) => new Set(s).add(c.id))
    try {
      await cambiarSca(c.id, nuevo)
      toast.success('Configuración modificada exitosamente.')
    } catch {
      setComunidades((prev) => prev.map((x) => (x.id === c.id ? { ...x, tipoSca: anterior } : x)))
      toast.error('Ha surgido un inconveniente al modificar la información.')
    } finally {
      setSaving((s) => {
        const n = new Set(s)
        n.delete(c.id)
        return n
      })
    }
  }

  return (
    <Core>
      <CoreHeader
        title="Sistema de Cobranza"
        description={`Cantidad: ${comunidades.length}`}
        environment="upselling"
        actions={
          <Button variant="outline" size="sm" asChild>
            <Link to="/">
              <ArrowLeft />
              Volver
            </Link>
          </Button>
        }
      />

      <CoreBody>
        <section className="motion-stagger grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="Comunidades" value={String(comunidades.length)} icon={Building2} />
          <MetricCard label="Si Notificado" value={String(notificadas)} icon={Bell} hint="última liberación notificada" />
          <MetricCard label="No Notificado" value={String(noNotificadas)} icon={BellOff} hint="liberadas sin notificar" />
          <MetricCard label="SCA activo" value={String(scaActivo)} icon={Settings2} hint="automático o manual" />
        </section>

        <section className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="mr-auto text-sm font-medium">
              Comunidades <span className="text-muted-foreground">({filtered.length})</span>
            </h2>

            <Select value={estado} onValueChange={(v) => { setEstado(v as FiltroEstado); setPage(1) }}>
              <SelectTrigger size="sm" className="w-44">
                <SelectValue placeholder="Estado Liberación" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los estados</SelectItem>
                <SelectItem value="notificado">Si Notificado</SelectItem>
                <SelectItem value="no_notificado">No Notificado</SelectItem>
                <SelectItem value="sin_liberacion">Sin liberación</SelectItem>
              </SelectContent>
            </Select>

            <Select value={tipo} onValueChange={(v) => { setTipo(v as FiltroTipo); setPage(1) }}>
              <SelectTrigger size="sm" className="w-40">
                <SelectValue placeholder="Tipo SCA" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los tipos</SelectItem>
                {tiposSca.map((t) => (
                  <SelectItem key={t.value} value={String(t.value)}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar"
                value={query}
                onChange={(e) => { setQuery(e.target.value); setPage(1) }}
                className="h-8 w-48 pl-8 md:w-64"
              />
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-lg border border-dashed p-10 text-center text-sm text-muted-foreground">
              No se encontraron comunidades que coincidan con la búsqueda.
            </div>
          ) : (
            <div className="overflow-hidden rounded-lg border bg-card">
              <Table>
                <TableHeader>
                  <TableRow>
                    <SortHead label="Nombre Comunidad" k="nombre" active={sort.key === 'nombre'} onSort={toggleSort} />
                    <SortHead label="Último gasto común" k="ultimoGastoComun" active={sort.key === 'ultimoGastoComun'} onSort={toggleSort} />
                    <SortHead label="Fecha último cierre gasto común" k="fechaUltimoCierre" active={sort.key === 'fechaUltimoCierre'} onSort={toggleSort} />
                    <SortHead label="Fecha última liberación" k="fechaUltimaLiberacion" active={sort.key === 'fechaUltimaLiberacion'} onSort={toggleSort} />
                    <TableHead>Estado Liberación</TableHead>
                    <TableHead className="w-44">Tipo SCA</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pageRows.map((c) => {
                    const isSaving = saving.has(c.id)
                    return (
                      <TableRow key={c.id}>
                        <TableCell className="font-medium">
                          {c.nombre || <span className="italic text-muted-foreground">(sin nombre)</span>}
                        </TableCell>
                        <TableCell className="tabular-nums">{c.ultimoGastoComun ?? <Minus className="size-4 text-muted-foreground" />}</TableCell>
                        <TableCell className="tabular-nums">{c.fechaUltimoCierre ?? <Minus className="size-4 text-muted-foreground" />}</TableCell>
                        <TableCell className="tabular-nums">{c.fechaUltimaLiberacion ?? <Minus className="size-4 text-muted-foreground" />}</TableCell>
                        <TableCell>
                          <EstadoLiberacionCell estado={c.estadoLiberacion} />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Select
                              value={String(c.tipoSca)}
                              onValueChange={(v) => handleTipoChange(c, v)}
                              disabled={isSaving}
                            >
                              <SelectTrigger size="sm" className="w-36" aria-label={`Tipo SCA de ${c.nombre || c.id}`}>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {tiposSca.map((t) => (
                                  <SelectItem key={t.value} value={String(t.value)}>
                                    {t.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {isSaving ? <LoaderCircle className="size-4 animate-spin text-muted-foreground" /> : null}
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>

              <div className="flex items-center justify-between border-t px-4 py-2 text-sm text-muted-foreground">
                <span>
                  Mostrando {from} a {to} de {filtered.length}
                </span>
                <div className="flex items-center gap-1">
                  <Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => setPage((p) => p - 1)}>
                    <ChevronLeft />
                    Anterior
                  </Button>
                  <span className="px-2 tabular-nums">
                    {currentPage} / {totalPages}
                  </span>
                  <Button variant="outline" size="sm" disabled={currentPage === totalPages} onClick={() => setPage((p) => p + 1)}>
                    Siguiente
                    <ChevronRight />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </section>
      </CoreBody>
    </Core>
  )
}
