import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowUpDown, KeyRound, Pencil, Plus, Search, ShieldCheck, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Core, CoreBody, CoreHeader } from '@/components/layout/core'
import { MetricCard } from '@/components/communities/metric-card'
import { TablePagination } from '@/components/shared/table-pagination'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { perfilesStore, type Perfil } from '@/data/perfiles'
import { totalPermisos } from '@/data/permisos'

const PAGE_SIZE = 10

/** Administrador de Perfiles. Replica /login/perfiles. Ver docs/mapas/MAPA-perfiles.md. */
export function PerfilesPage() {
  const perfiles = perfilesStore.useStore()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [dir, setDir] = useState<'asc' | 'desc'>('asc')
  const [page, setPage] = useState(1)
  const [deleting, setDeleting] = useState<Perfil | null>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return perfiles
      .filter((p) => !q || p.nombre.toLowerCase().includes(q))
      .sort((a, b) => a.nombre.localeCompare(b.nombre, 'es') * (dir === 'asc' ? 1 : -1))
  }, [perfiles, query, dir])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const rows = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
  const promedio = perfiles.length ? Math.round(perfiles.reduce((n, p) => n + p.permisos.length, 0) / perfiles.length) : 0

  function confirmarEliminar() {
    if (deleting) {
      perfilesStore.set((prev) => prev.filter((p) => p.id !== deleting.id))
      toast.success(`Perfil ${deleting.nombre} eliminado.`)
    }
    setDeleting(null)
  }

  return (
    <Core>
      <CoreHeader
        title="Administrador de Perfiles"
        description={`Cantidad: ${perfiles.length}`}
        environment="upselling"
        actions={
          <>
            <Button variant="outline" size="sm" asChild>
              <Link to="/">
                <ArrowLeft />
                Volver
              </Link>
            </Button>
            <Button size="sm" asChild>
              <Link to="/perfiles/nuevo">
                <Plus />
                Nuevo perfil
              </Link>
            </Button>
          </>
        }
      />

      <CoreBody>
        <section className="motion-stagger grid gap-4 sm:grid-cols-2">
          <MetricCard label="Perfiles" value={String(perfiles.length)} icon={ShieldCheck} />
          <MetricCard label="Permisos promedio" value={String(promedio)} icon={KeyRound} hint={`de ${totalPermisos} disponibles`} />
        </section>

        <section className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="mr-auto text-sm font-medium">
              Perfiles <span className="text-muted-foreground">({filtered.length})</span>
            </h2>
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Buscar" value={query} onChange={(e) => { setQuery(e.target.value); setPage(1) }} className="h-8 w-48 pl-8 md:w-64" />
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-lg border border-dashed p-10 text-center text-sm text-muted-foreground">
              No hay perfiles que coincidan con la búsqueda.
            </div>
          ) : (
            <div className="overflow-hidden rounded-lg border bg-card">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <button type="button" onClick={() => setDir((d) => (d === 'asc' ? 'desc' : 'asc'))} className="inline-flex items-center gap-1 text-foreground">
                        Perfil
                        <ArrowUpDown className="size-3.5 opacity-60" />
                      </button>
                    </TableHead>
                    <TableHead>Permisos</TableHead>
                    <TableHead className="w-28 text-right">Herramientas</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((p) => (
                    <TableRow key={p.id} className="cursor-pointer" onClick={() => navigate(`/perfiles/${p.id}`)}>
                      <TableCell className="font-medium">{p.nombre}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="tabular-nums">
                          {p.permisos.length} / {totalPermisos}
                        </Badge>
                      </TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-end gap-1">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon-sm" asChild aria-label="Editar perfil">
                                <Link to={`/perfiles/${p.id}`}>
                                  <Pencil />
                                </Link>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Editar perfil</TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon-sm" className="text-muted-foreground hover:text-destructive" onClick={() => setDeleting(p)} aria-label="Eliminar perfil">
                                <Trash2 />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Eliminar perfil</TooltipContent>
                          </Tooltip>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <TablePagination page={currentPage} totalPages={totalPages} total={filtered.length} pageSize={PAGE_SIZE} onPageChange={setPage} />
            </div>
          )}
        </section>
      </CoreBody>

      <AlertDialog open={deleting !== null} onOpenChange={(o) => !o && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar perfil</AlertDialogTitle>
            <AlertDialogDescription>¿Está seguro de eliminar el perfil {deleting?.nombre}?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={confirmarEliminar}>
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Core>
  )
}
