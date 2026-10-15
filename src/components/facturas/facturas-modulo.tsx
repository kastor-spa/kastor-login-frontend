import { useMemo, useState, type ReactNode } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { CircleCheck, CreditCard, ExternalLink, LoaderCircle, Receipt, Search, Wallet } from 'lucide-react'
import { toast } from 'sonner'
import { MetricCard } from '@/components/communities/metric-card'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { comisionMock, deudaPorComunidad, tiposPagoKhipu, type EmisorFacturas, type FacturaPendiente } from '@/data/facturas'
import { dmyToIso, hoyIso } from '@/lib/fechas'
import { formatCLP } from '@/lib/format'
import { cn } from '@/lib/utils'

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms))

interface FacturasModuloProps {
  emisor: EmisorFacturas
  facturas: FacturaPendiente[]
  /** Muestra columna "Deuda" (total de la comunidad), solo Kastor. */
  mostrarDeuda?: boolean
  /** Bloque lateral adicional (ej. datos bancarios Kastor). */
  aside?: ReactNode
  /** Acción extra por fila (ej. "Notificar pago" en Kastor). */
  accionFila?: (f: FacturaPendiente) => ReactNode
}

/**
 * Listado de facturas pendientes con selección y pago Khipu (mock).
 * Flujo legacy: marcar facturas → total → elegir tipo de pago → consultar comisión → pagar (redirige a Khipu)
 * → vuelve con #success → diálogo "Procesando Pago Khipu". Aquí ?pago=success simula el retorno.
 */
export function FacturasModulo({ emisor, facturas, mostrarDeuda, aside, accionFila }: FacturasModuloProps) {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [query, setQuery] = useState('')
  const [sel, setSel] = useState<Set<number>>(new Set())
  const [tipoPago, setTipoPago] = useState('')
  const [comision, setComision] = useState<number | null>(null)
  const [estado, setEstado] = useState<'idle' | 'calculando' | 'redirigiendo'>('idle')
  const exito = params.get('pago') === 'success'

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return facturas.filter((f) => !q || `${f.rut} ${f.comunidad} ${f.folio}`.toLowerCase().includes(q))
  }, [facturas, query])

  const deudas = useMemo(() => deudaPorComunidad(facturas), [facturas])
  const seleccionadas = facturas.filter((f) => sel.has(f.folio))
  const total = seleccionadas.reduce((n, f) => n + f.total, 0)
  const deudaTotal = facturas.reduce((n, f) => n + f.total, 0)
  const vencidas = facturas.filter((f) => dmyToIso(f.fechaVencimiento) < hoyIso()).length
  const todasVisibles = filtered.length > 0 && filtered.every((f) => sel.has(f.folio))

  async function recalcular(nuevoTotal: number, tipo: string) {
    setComision(null)
    if (nuevoTotal < 1 || !tipo) return
    setEstado('calculando')
    await wait(500) // mock POST /api/v1/fee
    setComision(Math.round(nuevoTotal * (comisionMock[tipo] ?? 0)))
    setEstado('idle')
  }

  function aplicarSeleccion(next: Set<number>) {
    setSel(next)
    void recalcular(facturas.filter((f) => next.has(f.folio)).reduce((n, f) => n + f.total, 0), tipoPago)
  }

  function toggle(folio: number) {
    const n = new Set(sel)
    if (n.has(folio)) n.delete(folio)
    else n.add(folio)
    aplicarSeleccion(n)
  }

  function toggleTodas() {
    const n = new Set(sel)
    filtered.forEach((f) => (todasVisibles ? n.delete(f.folio) : n.add(f.folio)))
    aplicarSeleccion(n)
  }

  async function pagar() {
    setEstado('redirigiendo')
    await wait(900) // mock POST /api/v1/payments → redirect a payment_url
    setEstado('idle')
    setSel(new Set())
    setComision(null)
    setTipoPago('')
    navigate(`?pago=success`, { replace: true })
  }

  if (facturas.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed p-12 text-center text-sm text-muted-foreground">
        <CircleCheck className="size-8 text-success" />
        No hay facturas pendientes de pago.
      </div>
    )
  }

  return (
    <>
      <section className="motion-stagger grid gap-4 sm:grid-cols-3">
        <MetricCard label="Facturas pendientes" value={String(facturas.length)} icon={Receipt} />
        <MetricCard label="Deuda total" value={formatCLP(deudaTotal)} icon={Wallet} hint={`${Object.keys(deudas).length} comunidades`} />
        <MetricCard label="Vencidas" value={String(vencidas)} icon={CreditCard} hint="fecha de vencimiento pasada" />
      </section>

      <div className="grid items-start gap-6 lg:grid-cols-[1fr_320px]">
        <section className="flex min-w-0 flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="mr-auto text-sm font-medium">
              Facturas <span className="text-muted-foreground">({filtered.length})</span>
            </h2>
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Buscar" value={query} onChange={(e) => setQuery(e.target.value)} className="h-8 w-48 pl-8 md:w-64" />
            </div>
          </div>

          <div className="overflow-hidden rounded-lg border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10">
                    <Checkbox checked={todasVisibles} onCheckedChange={toggleTodas} aria-label="Seleccionar todas" />
                  </TableHead>
                  <TableHead>Folio</TableHead>
                  <TableHead>Rut</TableHead>
                  <TableHead>Comunidad</TableHead>
                  <TableHead>Vencimiento</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  {mostrarDeuda ? <TableHead className="text-right">Deuda</TableHead> : null}
                  {accionFila ? <TableHead className="w-10" /> : null}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((f) => {
                  const on = sel.has(f.folio)
                  const vencida = dmyToIso(f.fechaVencimiento) < hoyIso()
                  return (
                    <TableRow key={f.folio} data-state={on ? 'selected' : undefined} className="cursor-pointer" onClick={() => toggle(f.folio)}>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Checkbox checked={on} onCheckedChange={() => toggle(f.folio)} aria-label={`Seleccionar factura ${f.numeroDocumento}`} />
                      </TableCell>
                      <TableCell className="tabular-nums">{f.numeroDocumento}</TableCell>
                      <TableCell className="tabular-nums">{f.rut}</TableCell>
                      <TableCell className="font-medium">{f.comunidad}</TableCell>
                      <TableCell className="tabular-nums">
                        <span className={cn(vencida && 'text-destructive')}>{f.fechaVencimiento}</span>
                        {vencida ? <Badge variant="destructive" className="ml-2">Vencida</Badge> : null}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">{formatCLP(f.total)}</TableCell>
                      {mostrarDeuda ? <TableCell className="text-right tabular-nums text-muted-foreground">{formatCLP(deudas[f.comunidad])}</TableCell> : null}
                      {accionFila ? <TableCell onClick={(e) => e.stopPropagation()}>{accionFila(f)}</TableCell> : null}
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
            {filtered.length === 0 ? <p className="p-6 text-center text-sm text-muted-foreground">No hay facturas que coincidan con la búsqueda.</p> : null}
          </div>
        </section>

        <aside className="flex flex-col gap-4 lg:sticky lg:top-20">
          <Card className="gap-4">
            <CardHeader>
              <CardTitle className="text-base">Pago en línea</CardTitle>
              <CardDescription>Selecciona las facturas y paga con Khipu.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              {total === 0 ? (
                <p className="rounded-md bg-muted px-3 py-4 text-center text-sm text-muted-foreground">Ninguna factura seleccionada.</p>
              ) : (
                <>
                  <ul className="grid max-h-40 gap-1 overflow-y-auto text-sm">
                    {seleccionadas.map((f) => (
                      <li key={f.folio} className="flex justify-between gap-2">
                        <span className="truncate text-muted-foreground">Factura: {f.numeroDocumento}</span>
                        <span className="tabular-nums">{formatCLP(f.total)}</span>
                      </li>
                    ))}
                  </ul>
                  <Separator />
                  <div className="grid gap-1.5 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total</span>
                      <span className="tabular-nums">{formatCLP(total)}</span>
                    </div>
                    <Select
                      value={tipoPago}
                      onValueChange={(v) => {
                        setTipoPago(v)
                        void recalcular(total, v)
                      }}
                    >
                      <SelectTrigger className="mt-2 w-full">
                        <SelectValue placeholder="Tipo de pago" />
                      </SelectTrigger>
                      <SelectContent>
                        {tiposPagoKhipu.map((t) => (
                          <SelectItem key={t.value} value={t.value}>
                            {t.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="mt-2 flex justify-between">
                      <span className="text-muted-foreground">Comisión</span>
                      <span className="tabular-nums">{estado === 'calculando' ? '…' : comision !== null ? formatCLP(comision) : '—'}</span>
                    </div>
                    <div className="flex justify-between text-base font-semibold">
                      <span>Total a pagar</span>
                      <span className="tabular-nums">{comision !== null ? formatCLP(total + comision) : formatCLP(total)}</span>
                    </div>
                  </div>
                  <Button className="w-full" disabled={comision === null || estado !== 'idle'} onClick={pagar}>
                    {estado !== 'idle' ? <LoaderCircle className="animate-spin" /> : <ExternalLink />}
                    {estado === 'calculando' ? 'Calculando comisión…' : estado === 'redirigiendo' ? 'Redirigiendo a Khipu…' : 'Pagar con Khipu'}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
          {aside}
        </aside>
      </div>

      <AlertDialog open={exito} onOpenChange={(o) => !o && navigate('', { replace: true })}>
        <AlertDialogContent className="sm:max-w-[400px]">
          <AlertDialogHeader>
            <AlertDialogTitle>Procesando Pago Khipu</AlertDialogTitle>
            <AlertDialogDescription>
              El pago está en proceso de confirmación, se te notificará por correo cuando esté validado.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => {
                navigate('', { replace: true })
                toast.info(`Pago ${emisor === 'kastor' ? 'de facturas Kastor' : 'de facturas Caleu'} en proceso.`)
              }}
            >
              Aceptar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
