import { useMemo, useState, type ReactNode } from 'react'
import { CalendarCheck, CalendarClock, CircleAlert, CircleCheck, Receipt, Scale } from 'lucide-react'
import { Core, CoreBody, CoreHeader } from '@/components/layout/core'
import { GraficoIncidencia } from '@/components/comunidad/grafico-incidencia'
import { BannerConciliacion, BannerRegistro, BannerSeguro } from '@/components/comunidad/banners'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { anios, incidenciaGastoComun, meses } from '@/data/indicadores'
import { useComunidad } from '@/hooks/use-comunidad'
import { useCountUp } from '@/hooks/use-count-up'
import { formatCLP } from '@/lib/format'
import { cn } from '@/lib/utils'

/**
 * Home de la comunidad (Kastor Contable) en bento.
 * Evidencia: docs/referencias/inicio-comunidad/01-home.png · Mapa: docs/mapas/MAPA-inicio-comunidad.md
 */

/** Período de la captura del legacy. */
const MES_INICIAL = 3
const ANIO_INICIAL = 2026

function Celda({ className, children }: { className?: string; children: ReactNode }) {
  return <section className={cn('min-w-0 rounded-2xl border bg-card p-5 text-card-foreground', className)}>{children}</section>
}

export function ComunidadInicioPage() {
  const comunidad = useComunidad()
  const [mostrar, setMostrar] = useState('todos')
  const [mes, setMes] = useState(MES_INICIAL)
  const [anio, setAnio] = useState(ANIO_INICIAL)

  const datos = useMemo(() => incidenciaGastoComun(comunidad.id, mes, anio), [comunidad.id, mes, anio])
  const total = datos.reduce((acc, d) => acc + d.monto, 0)
  const totalAnimado = useCountUp(total)
  const periodo = `${meses[mes - 1]} ${anio}`

  return (
    <Core>
      <CoreHeader
        title="Indicadores de la comunidad"
        description={comunidad.name}
        environment="Kastor Contable"
        actions={
          <div className="hidden items-center gap-2 xl:flex">
            <Label htmlFor="mostrar" className="text-sm font-normal text-muted-foreground">
              Información a mostrar
            </Label>
            {/* PENDIENTE DE CONFIRMAR: en la captura solo se ve la opción "Todos". */}
            <Select value={mostrar} onValueChange={setMostrar}>
              <SelectTrigger id="mostrar" size="sm" className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        }
      />

      <CoreBody className="@container">
        {/* Container queries: el bento responde al ancho real del Core (con o sin sidebar). */}
        <div className="motion-stagger grid min-w-0 gap-4 @2xl:grid-cols-2 @5xl:grid-cols-12">
          {/* Incidencia de Gasto Común: filtros del período + total */}
          <Celda className="flex flex-col gap-4 @5xl:col-span-4">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-xl bg-brand-orange/10 text-brand-orange">
                <Receipt className="size-5" />
              </span>
              <h2 className="font-heading text-base font-semibold text-brand-darkblue">Incidencia de Gasto Común</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label htmlFor="mes" className="text-xs text-muted-foreground">Mes</Label>
                <Select value={String(mes)} onValueChange={(v) => setMes(Number(v))}>
                  <SelectTrigger id="mes" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {meses.map((m, i) => (
                      <SelectItem key={m} value={String(i + 1)}>{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="anio" className="text-xs text-muted-foreground">Año</Label>
                <Select value={String(anio)} onValueChange={(v) => setAnio(Number(v))}>
                  <SelectTrigger id="anio" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {anios.map((a) => (
                      <SelectItem key={a} value={String(a)}>{a}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="mt-auto rounded-xl bg-muted/60 p-4">
              <div className="text-sm text-muted-foreground">Total Gasto Común</div>
              <div className="font-heading text-3xl font-bold tabular-nums tracking-tight text-brand-darkblue">
                {formatCLP(totalAnimado ?? total)}
              </div>
              <div className="text-xs text-muted-foreground">{periodo}</div>
            </div>
          </Celda>

          {/* Estado de la comunidad: mismos datos que la card del listado */}
          <Celda className="flex flex-col gap-3 @5xl:col-span-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-heading text-base font-semibold text-brand-darkblue">Estado de la comunidad</h2>
              {comunidad.alerta ? (
                <Badge variant="destructive"><CircleAlert />Con alertas</Badge>
              ) : (
                <Badge className="bg-success text-success-foreground"><CircleCheck />Al día</Badge>
              )}
            </div>
            <dl className="grid grid-cols-2 gap-3">
              <Dato icon={CalendarClock} label="Último prorrateo" value={comunidad.ultimoProrrateo} />
              <Dato icon={CalendarCheck} label="Último cierre Rem" value={comunidad.ultimoCierreRem} />
              <Dato icon={Scale} label="Conciliación" value={comunidad.conciliacion} className="col-span-2" />
            </dl>
            <div className="mt-auto flex flex-wrap gap-1.5">
              <Badge variant="secondary">{comunidad.activa ? 'Activa' : 'Inactiva'}</Badge>
              <Badge variant="outline">Liberado: {comunidad.liberado ? 'Sí' : 'No'}</Badge>
              <Badge variant="outline">TCEL: {comunidad.tcel ? 'Sí' : 'No'}</Badge>
            </div>
          </Celda>

          <div className="@2xl:col-span-2 @5xl:col-span-4">
            <BannerSeguro />
          </div>

          {/* Gráfico: ocupa 2 filas junto a los banners */}
          <Celda className="@2xl:col-span-2 @5xl:col-span-8 @5xl:row-span-2">
            <GraficoIncidencia datos={datos} periodo={periodo} comunidad={comunidad.name} />
          </Celda>

          <div className="@5xl:col-span-4">
            <BannerRegistro />
          </div>
          <div className="@5xl:col-span-4">
            <BannerConciliacion />
          </div>
        </div>
      </CoreBody>
    </Core>
  )
}

function Dato({
  icon: Icon,
  label,
  value,
  className,
}: {
  icon: typeof Scale
  label: string
  value: string
  className?: string
}) {
  return (
    <div className={cn('rounded-xl border p-3', className)}>
      <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Icon className="size-3.5" />
        {label}
      </dt>
      <dd className="mt-1 truncate font-semibold tabular-nums">{value}</dd>
    </div>
  )
}
