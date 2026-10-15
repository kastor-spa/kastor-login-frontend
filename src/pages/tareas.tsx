import { useMemo, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowLeft,
  Check,
  CircleCheck,
  ClipboardList,
  Clock,
  ListTodo,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  Trash2,
} from 'lucide-react'
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Textarea } from '@/components/ui/textarea'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { comunidadesCatalogo, nombreComunidad } from '@/data/comunidades-catalogo'
import { estadoTareaLabels, tareas as seed, type FiltroEstadoTarea, type Tarea } from '@/data/tareas'
import { dmyToIso, hoyIso, inicioMesIso, isoToDmy } from '@/lib/fechas'
import { cn } from '@/lib/utils'

const PAGE_SIZE = 10

interface FormState {
  tarea: string
  fechaInicio: string // ISO
  fechaHasta: string // ISO
  comunidadId: number | null
}

const emptyForm = (): FormState => ({ tarea: '', fechaInicio: hoyIso(), fechaHasta: hoyIso(), comunidadId: null })

/** Rango de la tarea se cruza con el rango del filtro. */
function enRango(t: Tarea, desdeIso: string, hastaIso: string) {
  return dmyToIso(t.fechaInicio) <= hastaIso && dmyToIso(t.fechaHasta) >= desdeIso
}

/**
 * Módulo Administrador de Tareas. Replica /login/tareas del legacy.
 * Ver docs/mapas/MAPA-tareas.md. Acciones por fila son propuesta (listado legacy sin filas).
 */
export function TareasPage() {
  const [tareas, setTareas] = useState<Tarea[]>(seed)

  // Filtros del formulario (se aplican al presionar "Buscar por fechas")
  const [desde, setDesde] = useState(inicioMesIso())
  const [hasta, setHasta] = useState(hoyIso())
  const [tipo, setTipo] = useState<FiltroEstadoTarea>('todos')
  const [aplicado, setAplicado] = useState({ desde: inicioMesIso(), hasta: hoyIso(), tipo: 'todos' as FiltroEstadoTarea })

  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Tarea | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [busquedaComunidad, setBusquedaComunidad] = useState('')
  const [deleting, setDeleting] = useState<Tarea | null>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return tareas
      .filter((t) => enRango(t, aplicado.desde, aplicado.hasta))
      .filter((t) => aplicado.tipo === 'todos' || t.estado === aplicado.tipo)
      .filter((t) => !q || `${t.tarea} ${t.comunidadNombre}`.toLowerCase().includes(q))
      .sort((a, b) => dmyToIso(b.fechaInicio).localeCompare(dmyToIso(a.fechaInicio)))
  }, [tareas, aplicado, query])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const pageRows = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const pendientes = tareas.filter((t) => t.estado === 'pendiente').length

  const comunidadesFiltradas = useMemo(() => {
    const q = busquedaComunidad.trim().toLowerCase()
    return comunidadesCatalogo.filter((c) => !q || `${c.nombre} ${c.id}`.toLowerCase().includes(q))
  }, [busquedaComunidad])

  function buscar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setAplicado({ desde, hasta, tipo })
    setPage(1)
  }

  function openCreate() {
    setEditing(null)
    setForm(emptyForm())
    setBusquedaComunidad('')
    setFormOpen(true)
  }

  function openEdit(t: Tarea) {
    setEditing(t)
    setForm({ tarea: t.tarea, fechaInicio: dmyToIso(t.fechaInicio), fechaHasta: dmyToIso(t.fechaHasta), comunidadId: t.comunidadId })
    setBusquedaComunidad('')
    setFormOpen(true)
  }

  function guardar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (form.comunidadId === null) {
      toast.error('¡Debes seleccionar al menos una Comunidad!')
      return
    }
    if (form.fechaHasta < form.fechaInicio) {
      toast.error('La "Fecha hasta" no puede ser anterior a la "Fecha desde".')
      return
    }
    const datos = {
      tarea: form.tarea.trim(),
      fechaInicio: isoToDmy(form.fechaInicio),
      fechaHasta: isoToDmy(form.fechaHasta),
      comunidadId: form.comunidadId,
      comunidadNombre: nombreComunidad(form.comunidadId).trim(),
    }
    if (editing) {
      setTareas((prev) => prev.map((t) => (t.id === editing.id ? { ...t, ...datos } : t)))
      toast.success('Tarea actualizada.')
    } else {
      setTareas((prev) => [{ id: Math.max(0, ...prev.map((t) => t.id)) + 1, estado: 'pendiente', ...datos }, ...prev])
      toast.success('Tarea creada.')
    }
    setFormOpen(false)
  }

  function toggleEstado(t: Tarea) {
    const estado = t.estado === 'pendiente' ? 'finalizada' : 'pendiente'
    setTareas((prev) => prev.map((x) => (x.id === t.id ? { ...x, estado } : x)))
    toast.success(estado === 'finalizada' ? 'Tarea marcada como finalizada.' : 'Tarea reabierta.')
  }

  function confirmarEliminar() {
    if (deleting) {
      setTareas((prev) => prev.filter((t) => t.id !== deleting.id))
      toast.success('Tarea eliminada.')
    }
    setDeleting(null)
  }

  return (
    <Core>
      <CoreHeader
        title="Administrador de Tareas"
        description={`Cantidad: ${tareas.length}`}
        environment="upselling"
        actions={
          <>
            <Button variant="outline" size="sm" asChild>
              <Link to="/">
                <ArrowLeft />
                Volver
              </Link>
            </Button>
            <Button size="sm" onClick={openCreate}>
              <Plus />
              Nueva tarea
            </Button>
          </>
        }
      />

      <CoreBody>
        <section className="motion-stagger grid gap-4 sm:grid-cols-3">
          <MetricCard label="Tareas" value={String(tareas.length)} icon={ListTodo} />
          <MetricCard label="Pendientes" value={String(pendientes)} icon={Clock} hint="por realizar" />
          <MetricCard label="Finalizadas" value={String(tareas.length - pendientes)} icon={CircleCheck} hint="completadas" />
        </section>

        <section className="flex flex-col gap-3 rounded-lg border bg-card p-4">
          {/* Filtros legacy: Desde / Hasta / Estado / Buscar por fechas */}
          <form onSubmit={buscar} className="flex flex-wrap items-end gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="f-desde" className="text-xs text-muted-foreground">Desde</Label>
              <Input id="f-desde" type="date" value={desde} onChange={(e) => setDesde(e.target.value)} className="h-8 w-40" />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="f-hasta" className="text-xs text-muted-foreground">Hasta</Label>
              <Input id="f-hasta" type="date" value={hasta} onChange={(e) => setHasta(e.target.value)} className="h-8 w-40" />
            </div>
            <div className="grid gap-1.5">
              <Label className="text-xs text-muted-foreground">Estado</Label>
              <Select value={tipo} onValueChange={(v) => setTipo(v as FiltroEstadoTarea)}>
                <SelectTrigger size="sm" className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="pendiente">Pendiente</SelectItem>
                  <SelectItem value="finalizada">Finalizada</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" variant="outline" size="sm">
              <Search />
              Buscar por fechas
            </Button>
          </form>

          <Separator />

          <div className="flex flex-wrap items-center gap-2">
            <h2 className="mr-auto text-sm font-medium">
              Tareas <span className="text-muted-foreground">({filtered.length})</span>
            </h2>
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Buscar" value={query} onChange={(e) => { setQuery(e.target.value); setPage(1) }} className="h-8 w-48 pl-8 md:w-64" />
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed p-10 text-center text-sm text-muted-foreground">
              <ClipboardList className="size-8" />
              No hay tareas en el rango de fechas seleccionado.
              <Button size="sm" onClick={openCreate}>
                <Plus />
                Nueva tarea
              </Button>
            </div>
          ) : (
            <div className="overflow-hidden rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-48">Fecha</TableHead>
                    <TableHead>Tarea</TableHead>
                    <TableHead>Comunidad</TableHead>
                    <TableHead className="w-28">Estado</TableHead>
                    <TableHead className="w-32 text-right">Herramientas</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pageRows.map((t) => (
                    <TableRow key={t.id} className={cn(t.estado === 'finalizada' && 'text-muted-foreground')}>
                      <TableCell className="tabular-nums">
                        {t.fechaInicio === t.fechaHasta ? t.fechaInicio : `${t.fechaInicio} al ${t.fechaHasta}`}
                      </TableCell>
                      <TableCell className={cn('max-w-md whitespace-normal', t.estado === 'finalizada' && 'line-through')}>{t.tarea}</TableCell>
                      <TableCell>{t.comunidadNombre}</TableCell>
                      <TableCell>
                        <Badge variant={t.estado === 'pendiente' ? 'secondary' : 'outline'} className={cn(t.estado === 'finalizada' && 'text-success')}>
                          {t.estado === 'pendiente' ? <Clock /> : <CircleCheck />}
                          {estadoTareaLabels[t.estado]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-1">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon-sm" onClick={() => toggleEstado(t)} aria-label={t.estado === 'pendiente' ? 'Marcar finalizada' : 'Reabrir'}>
                                {t.estado === 'pendiente' ? <Check /> : <RotateCcw />}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>{t.estado === 'pendiente' ? 'Marcar finalizada' : 'Reabrir'}</TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon-sm" onClick={() => openEdit(t)} aria-label="Editar tarea">
                                <Pencil />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Editar tarea</TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon-sm" className="text-muted-foreground hover:text-destructive" onClick={() => setDeleting(t)} aria-label="Eliminar tarea">
                                <Trash2 />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Eliminar tarea</TooltipContent>
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

      {/* Nueva / editar tarea (campos exactos de /login/tareas/agregar) */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-xl">
          <form onSubmit={guardar} className="grid gap-4">
            <DialogHeader>
              <DialogTitle>{editing ? 'Editar tarea' : 'Nueva tarea'}</DialogTitle>
              <DialogDescription>Describe la tarea, su rango de fechas y la comunidad asignada.</DialogDescription>
            </DialogHeader>

            <div className="grid gap-2">
              <Label htmlFor="tarea">Tarea</Label>
              <Textarea id="tarea" required rows={5} className="resize-none" value={form.tarea} onChange={(e) => setForm({ ...form, tarea: e.target.value })} />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="fecha_inicio">Fecha desde</Label>
                <Input id="fecha_inicio" type="date" required value={form.fechaInicio} onChange={(e) => setForm({ ...form, fechaInicio: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="fecha_hasta">Fecha hasta</Label>
                <Input id="fecha_hasta" type="date" required value={form.fechaHasta} onChange={(e) => setForm({ ...form, fechaHasta: e.target.value })} />
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Listado de Comunidades</Label>
              <div className="rounded-md border">
                <div className="relative border-b">
                  <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Buscar comunidad"
                    value={busquedaComunidad}
                    onChange={(e) => setBusquedaComunidad(e.target.value)}
                    className="h-9 rounded-none border-0 pl-8 shadow-none focus-visible:ring-0"
                  />
                </div>
                <div role="radiogroup" aria-label="Asignar comunidad" className="max-h-56 overflow-y-auto p-1">
                  {comunidadesFiltradas.length === 0 ? (
                    <p className="p-3 text-center text-sm text-muted-foreground">Sin resultados.</p>
                  ) : (
                    comunidadesFiltradas.map((c) => {
                      const selected = form.comunidadId === c.id
                      return (
                        <button
                          key={c.id}
                          type="button"
                          role="radio"
                          aria-checked={selected}
                          onClick={() => setForm({ ...form, comunidadId: c.id })}
                          className={cn(
                            'flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm hover:bg-accent',
                            selected && 'bg-brand-orange/10 font-medium text-foreground',
                          )}
                        >
                          <span className={cn('flex size-4 shrink-0 items-center justify-center rounded-full border', selected && 'border-brand-orange bg-brand-orange text-white')}>
                            {selected ? <Check className="size-3" /> : null}
                          </span>
                          <span className="flex-1 truncate">{c.nombre.trim()}</span>
                          <span className="text-xs tabular-nums text-muted-foreground">#{c.id}</span>
                        </button>
                      )
                    })
                  )}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setFormOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">Guardar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleting !== null} onOpenChange={(o) => !o && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar tarea?</AlertDialogTitle>
            <AlertDialogDescription>
              Se eliminará la tarea <strong>{deleting?.tarea}</strong> de {deleting?.comunidadNombre}. Esta acción no se puede deshacer.
            </AlertDialogDescription>
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
