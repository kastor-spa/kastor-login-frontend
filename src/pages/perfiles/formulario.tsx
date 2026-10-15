import { useMemo, useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, CheckCheck, Save, Search, X } from 'lucide-react'
import { toast } from 'sonner'
import { Core, CoreBody, CoreHeader } from '@/components/layout/core'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { perfilesStore } from '@/data/perfiles'
import { gruposPermisos, totalPermisos, type PermisoGrupo } from '@/data/permisos'
import { cn } from '@/lib/utils'

function estadoGrupo(g: PermisoGrupo, sel: Set<number>): boolean | 'indeterminate' {
  const n = g.permisos.filter((p) => sel.has(p.id)).length
  if (n === 0) return false
  if (n === g.permisos.length) return true
  return 'indeterminate'
}

/**
 * Nuevo / Modificar perfil. Replica /login/perfiles/agregar y /modificar/:id.
 * Fila marcada = tr.activeLine del legacy (naranja, texto blanco, negrita).
 */
export function PerfilFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const perfiles = perfilesStore.useStore()
  const editando = id ? perfiles.find((p) => p.id === Number(id)) : undefined

  const [nombre, setNombre] = useState(editando?.nombre ?? '')
  const [sel, setSel] = useState<Set<number>>(new Set(editando?.permisos ?? []))
  const [filtro, setFiltro] = useState('')

  const grupos = useMemo(() => {
    const q = filtro.trim().toLowerCase()
    if (!q) return gruposPermisos
    return gruposPermisos
      .map((g) => ({ ...g, permisos: g.permisos.filter((p) => p.label.toLowerCase().includes(q) || g.nombre.toLowerCase().includes(q)) }))
      .filter((g) => g.permisos.length > 0)
  }, [filtro])

  if (id && !editando) return <Navigate to="/perfiles" replace />

  const todas = sel.size === totalPermisos

  function toggle(permisoId: number) {
    setSel((prev) => {
      const n = new Set(prev)
      if (n.has(permisoId)) n.delete(permisoId)
      else n.add(permisoId)
      return n
    })
  }

  function toggleGrupo(g: PermisoGrupo) {
    const marcar = estadoGrupo(g, sel) !== true
    setSel((prev) => {
      const n = new Set(prev)
      g.permisos.forEach((p) => (marcar ? n.add(p.id) : n.delete(p.id)))
      return n
    })
  }

  function toggleTodas() {
    setSel(todas ? new Set() : new Set(gruposPermisos.flatMap((g) => g.permisos.map((p) => p.id))))
  }

  function guardar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (sel.size === 0) {
      toast.error('¡Debes seleccionar al menos un submodulo!')
      return
    }
    const limpio = nombre.trim()
    const duplicado = perfiles.some((p) => p.nombre.toLowerCase() === limpio.toLowerCase() && p.id !== editando?.id)
    if (duplicado) {
      toast.error(`Ya existe un perfil llamado ${limpio}.`)
      return
    }
    // Conserva el orden del catálogo legacy
    const permisos = gruposPermisos.flatMap((g) => g.permisos.map((p) => p.id)).filter((pid) => sel.has(pid))
    if (editando) {
      perfilesStore.set((prev) => prev.map((p) => (p.id === editando.id ? { ...p, nombre: limpio, permisos } : p)))
      toast.success(`Perfil ${limpio} modificado.`)
    } else {
      perfilesStore.set((prev) => [...prev, { id: Math.max(0, ...prev.map((p) => p.id)) + 1, nombre: limpio, permisos }])
      toast.success(`Perfil ${limpio} creado.`)
    }
    navigate('/perfiles')
  }

  return (
    <Core>
      <form onSubmit={guardar} className="contents">
        <CoreHeader
          title={editando ? `Modificar perfil ${editando.nombre}` : 'Nuevo perfil'}
          description="Administrador de Perfiles"
          environment="upselling"
          actions={
            <>
              <Button type="button" variant="outline" size="sm" asChild>
                <Link to="/perfiles">
                  <ArrowLeft />
                  Volver
                </Link>
              </Button>
              <Button type="submit" size="sm">
                <Save />
                Guardar
              </Button>
            </>
          }
        />

        <CoreBody>
          <Card className="py-4">
            <CardContent className="grid gap-2 px-4 sm:max-w-md">
              <Label htmlFor="nombre">Nombre perfil</Label>
              <Input id="nombre" name="nombre" required autoComplete="off" value={nombre} onChange={(e) => setNombre(e.target.value)} />
            </CardContent>
          </Card>

          <section className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-sm font-medium">Permisos</h2>
              <Badge variant="secondary" className="tabular-nums">
                {sel.size} / {totalPermisos} seleccionados
              </Badge>
              <div className="ml-auto flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Buscar permiso" value={filtro} onChange={(e) => setFiltro(e.target.value)} className="h-8 w-48 pl-8 md:w-56" />
                </div>
                <Button type="button" variant="outline" size="sm" onClick={toggleTodas}>
                  {todas ? <X /> : <CheckCheck />}
                  {todas ? 'Deseleccionar todas' : 'Seleccionar todas'}
                </Button>
              </div>
            </div>

            {grupos.length === 0 ? (
              <div className="rounded-lg border border-dashed p-10 text-center text-sm text-muted-foreground">
                No hay permisos que coincidan con la búsqueda.
              </div>
            ) : (
              <div className="gap-4 sm:columns-2 xl:columns-3 2xl:columns-4">
                {grupos.map((g) => {
                  const full = gruposPermisos.find((x) => x.id === g.id)!
                  const estado = estadoGrupo(full, sel)
                  return (
                    <Card key={g.id} className="mb-4 gap-0 break-inside-avoid py-0">
                      <CardHeader className="flex flex-row items-center gap-2 border-b px-4 py-3">
                        <Checkbox
                          id={`g-${g.id}`}
                          checked={estado}
                          onCheckedChange={() => toggleGrupo(full)}
                          aria-label={`Seleccionar todo ${g.nombre}`}
                        />
                        <CardTitle className="flex-1 text-sm">
                          <label htmlFor={`g-${g.id}`} className="cursor-pointer" title={g.nombreLegacy}>
                            {g.nombre}
                          </label>
                        </CardTitle>
                        <span className="text-xs tabular-nums text-muted-foreground">
                          {full.permisos.filter((p) => sel.has(p.id)).length}/{full.permisos.length}
                        </span>
                      </CardHeader>
                      <CardContent className="p-1">
                        {g.permisos.map((p) => {
                          const on = sel.has(p.id)
                          return (
                            <label
                              key={p.id}
                              className={cn(
                                'flex cursor-pointer items-center justify-between gap-3 rounded-sm px-3 py-1.5 text-sm transition-colors hover:bg-accent',
                                p.informe && 'mt-1 border-t pt-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground',
                                on && 'bg-brand-orange font-semibold text-white hover:bg-brand-orange-hover',
                              )}
                            >
                              <span>{p.label}</span>
                              <Checkbox
                                checked={on}
                                onCheckedChange={() => toggle(p.id)}
                                className={cn(on && 'border-white data-[state=checked]:bg-white data-[state=checked]:text-brand-orange')}
                              />
                            </label>
                          )
                        })}
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </section>
        </CoreBody>
      </form>
    </Core>
  )
}
