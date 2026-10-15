import { useMemo, useState, type FormEvent } from 'react'
import { Pencil, Plus, Search, Trash2, UserCheck, Users, UserX } from 'lucide-react'
import { Core, CoreBody, CoreHeader } from '@/components/layout/core'
import { MetricCard } from '@/components/communities/metric-card'
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
import { Switch } from '@/components/ui/switch'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { perfiles, usuarios as seed, type PerfilUsuario, type Usuario } from '@/data/usuarios'

type FiltroPerfil = 'todos' | PerfilUsuario
type FiltroEstado = 'todos' | 'activos' | 'inactivos'

const emptyForm = { nombre: '', correo: '', perfil: '' as PerfilUsuario | '', activo: true }

/**
 * Módulo Usuarios. Mapa parcial: ver docs/mapas/MAPA-usuarios.md.
 * Columnas y campos son supuestos basados en patrones transversales del legacy.
 */
export function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>(seed)
  const [perfil, setPerfil] = useState<FiltroPerfil>('todos')
  const [estado, setEstado] = useState<FiltroEstado>('todos')
  const [query, setQuery] = useState('')

  const [editing, setEditing] = useState<Usuario | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [deleting, setDeleting] = useState<Usuario | null>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return usuarios.filter((u) => {
      if (perfil !== 'todos' && u.perfil !== perfil) return false
      if (estado === 'activos' && !u.activo) return false
      if (estado === 'inactivos' && u.activo) return false
      if (q && !`${u.nombre} ${u.correo}`.toLowerCase().includes(q)) return false
      return true
    })
  }, [usuarios, perfil, estado, query])

  const activos = usuarios.filter((u) => u.activo).length

  function openCreate() {
    setEditing(null)
    setForm(emptyForm)
    setFormOpen(true)
  }

  function openEdit(u: Usuario) {
    setEditing(u)
    setForm({ nombre: u.nombre, correo: u.correo, perfil: u.perfil, activo: u.activo })
    setFormOpen(true)
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!form.perfil) return
    if (editing) {
      setUsuarios((prev) =>
        prev.map((u) => (u.id === editing.id ? { ...u, ...form, perfil: form.perfil as PerfilUsuario } : u)),
      )
    } else {
      setUsuarios((prev) => [
        {
          id: `u${Date.now()}`,
          nombre: form.nombre,
          correo: form.correo,
          perfil: form.perfil as PerfilUsuario,
          comunidades: 0,
          ultimoAcceso: '—',
          activo: form.activo,
        },
        ...prev,
      ])
    }
    setFormOpen(false)
  }

  function toggleActivo(id: string, activo: boolean) {
    setUsuarios((prev) => prev.map((u) => (u.id === id ? { ...u, activo } : u)))
  }

  function confirmDelete() {
    if (deleting) setUsuarios((prev) => prev.filter((u) => u.id !== deleting.id))
    setDeleting(null)
  }

  return (
    <Core>
      <CoreHeader
        title="Usuarios"
        description={`Cantidad: ${usuarios.length}`}
        environment="upselling"
        actions={
          <Button size="sm" onClick={openCreate}>
            <Plus />
            Agregar usuario
          </Button>
        }
      />

      <CoreBody>
        <section className="motion-stagger grid gap-4 sm:grid-cols-3">
          <MetricCard label="Usuarios" value={String(usuarios.length)} icon={Users} />
          <MetricCard label="Activos" value={String(activos)} icon={UserCheck} hint="con acceso al sistema" />
          <MetricCard label="Inactivos" value={String(usuarios.length - activos)} icon={UserX} hint="sin acceso" />
        </section>

        <section className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="mr-auto text-sm font-medium">
              Listado <span className="text-muted-foreground">({filtered.length})</span>
            </h2>

            <Select value={perfil} onValueChange={(v) => setPerfil(v as FiltroPerfil)}>
              <SelectTrigger size="sm" className="w-40">
                <SelectValue placeholder="Perfil" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los perfiles</SelectItem>
                {perfiles.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={estado} onValueChange={(v) => setEstado(v as FiltroEstado)}>
              <SelectTrigger size="sm" className="w-32">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="activos">Activos</SelectItem>
                <SelectItem value="inactivos">Inactivos</SelectItem>
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
              No hay usuarios que coincidan con la búsqueda.
            </div>
          ) : (
            <div className="overflow-hidden rounded-lg border bg-card">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Correo electrónico</TableHead>
                    <TableHead>Perfil</TableHead>
                    <TableHead className="text-right">Comunidades</TableHead>
                    <TableHead>Último acceso</TableHead>
                    <TableHead className="text-center">Estado</TableHead>
                    <TableHead className="w-24 text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((u) => (
                    <TableRow key={u.id} className={u.activo ? undefined : 'text-muted-foreground'}>
                      <TableCell className="font-medium">{u.nombre}</TableCell>
                      <TableCell>{u.correo}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{u.perfil}</Badge>
                      </TableCell>
                      <TableCell className="text-right tabular-nums">{u.comunidades}</TableCell>
                      <TableCell className="tabular-nums">{u.ultimoAcceso}</TableCell>
                      <TableCell className="text-center">
                        <Switch
                          checked={u.activo}
                          onCheckedChange={(v) => toggleActivo(u.id, v)}
                          aria-label={u.activo ? 'Desactivar usuario' : 'Activar usuario'}
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            aria-label={`Editar ${u.nombre}`}
                            onClick={() => openEdit(u)}
                          >
                            <Pencil />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            className="text-muted-foreground hover:text-destructive"
                            aria-label={`Eliminar ${u.nombre}`}
                            onClick={() => setDeleting(u)}
                          >
                            <Trash2 />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </section>
      </CoreBody>

      {/* Alta / edición */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-md">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>{editing ? 'Editar usuario' : 'Agregar usuario'}</DialogTitle>
              <DialogDescription>
                {editing ? 'Modifica los datos de la cuenta.' : 'Crea una cuenta de acceso al sistema.'}
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="nombre">Nombre</Label>
                <Input
                  id="nombre"
                  placeholder="Nombre completo"
                  required
                  value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="correo">Correo electrónico</Label>
                <Input
                  id="correo"
                  type="email"
                  placeholder="correo@empresa.cl"
                  required
                  value={form.correo}
                  onChange={(e) => setForm({ ...form, correo: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="perfil">Perfil</Label>
                <Select
                  value={form.perfil}
                  onValueChange={(v) => setForm({ ...form, perfil: v as PerfilUsuario })}
                >
                  <SelectTrigger id="perfil" className="w-full">
                    <SelectValue placeholder="Seleccione un perfil" />
                  </SelectTrigger>
                  <SelectContent>
                    {perfiles.map((p) => (
                      <SelectItem key={p} value={p}>
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between rounded-md border px-3 py-2">
                <Label htmlFor="activo" className="font-normal">
                  Usuario activo
                </Label>
                <Switch
                  id="activo"
                  checked={form.activo}
                  onCheckedChange={(v) => setForm({ ...form, activo: v })}
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setFormOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={!form.perfil}>
                {editing ? 'Guardar cambios' : 'Crear usuario'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Confirmación de eliminación (patrón js-confirm) */}
      <AlertDialog open={deleting !== null} onOpenChange={(open) => !open && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar usuario?</AlertDialogTitle>
            <AlertDialogDescription>
              Se eliminará la cuenta de <strong>{deleting?.nombre}</strong> ({deleting?.correo}). Esta
              acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={confirmDelete}>
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Core>
  )
}
