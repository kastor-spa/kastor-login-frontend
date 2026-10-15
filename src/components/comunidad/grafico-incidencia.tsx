import { useEffect, useRef, useState } from 'react'
import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { categoriasGasto, type IncidenciaGasto } from '@/data/indicadores'
import { formatCLP } from '@/lib/format'
import { cn } from '@/lib/utils'

const pct = new Intl.NumberFormat('es-CL', { style: 'percent', minimumFractionDigits: 2, maximumFractionDigits: 2 })

/** Radio y grosor de la dona en un viewBox de 200x200 centrado en 0,0. */
const R = 76
const GROSOR = 26
const GROSOR_ACTIVO = 34
/** Separación entre segmentos, en unidades de pathLength (100 = vuelta completa). */
const GAP = 0.5

interface GraficoIncidenciaProps {
  datos: IncidenciaGasto[]
  /** Nombre del período para el título del CSV, ej. "Marzo 2026". */
  periodo: string
  comunidad: string
}

/**
 * Dona "Incidencia de Gasto Común" + leyenda con montos (sirve de vista tabla).
 * Hover/foco en un segmento o fila de la leyenda resalta ambos y muestra el detalle al centro.
 */
export function GraficoIncidencia({ datos, periodo, comunidad }: GraficoIncidenciaProps) {
  const total = datos.reduce((acc, d) => acc + d.monto, 0)
  const [activo, setActivo] = useState<string | null>(null)
  const [tooltip, setTooltip] = useState<{ x: number; y: number } | null>(null)
  const contenedor = useRef<HTMLDivElement>(null)

  // Barrido inicial: los segmentos crecen desde 0 (CSS transition sobre stroke-dasharray).
  const [dibujado, setDibujado] = useState(false)
  useEffect(() => {
    const frame = requestAnimationFrame(() => setDibujado(true))
    return () => cancelAnimationFrame(frame)
  }, [])

  const filas = categoriasGasto.map((c) => {
    const monto = datos.find((d) => d.slug === c.slug)?.monto ?? 0
    return { ...c, monto, share: total ? monto / total : 0 }
  })

  // Cada segmento parte donde terminó la suma de los anteriores.
  const segmentos = filas.map((f, i) => {
    const inicio = filas.slice(0, i).reduce((acc, prev) => acc + prev.share * 100, 0)
    return { ...f, largo: Math.max(f.share * 100 - GAP, 0.01), inicio }
  })

  const filaActiva = filas.find((f) => f.slug === activo)

  function descargarCsv() {
    const lineas = [
      `Incidencia de Gasto Común;${comunidad};${periodo}`,
      'Categoría;Monto;Porcentaje',
      ...filas.map((f) => `${f.nombre};${f.monto};${pct.format(f.share)}`),
      `Total;${total};100%`,
    ]
    const blob = new Blob([`﻿${lineas.join('\n')}`], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = Object.assign(document.createElement('a'), { href: url, download: `incidencia-gasto-comun-${periodo.replace(' ', '-').toLowerCase()}.csv` })
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="@container relative flex h-full flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-heading text-base font-semibold text-brand-darkblue">Distribución del gasto común</h2>
          <p className="text-sm text-muted-foreground">{periodo} · por categoría</p>
        </div>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon-sm" aria-label="Descargar datos" onClick={descargarCsv}>
              <Download />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Descargar datos (CSV)</TooltipContent>
        </Tooltip>
      </div>

      <div className="grid flex-1 items-center gap-6 @2xl:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        {/* Dona */}
        <div
          ref={contenedor}
          className="relative mx-auto aspect-square w-full max-w-72"
          onPointerLeave={() => {
            setActivo(null)
            setTooltip(null)
          }}
        >
          <svg viewBox="-100 -100 200 200" className="size-full -rotate-90" role="img" aria-label={`Distribución del gasto común ${periodo}`}>
            <circle r={R} fill="none" stroke="var(--muted)" strokeWidth={GROSOR} />
            {segmentos.map((s) => {
              const esActivo = activo === s.slug
              return (
                <circle
                  key={s.slug}
                  r={R}
                  fill="none"
                  stroke={s.color}
                  pathLength={100}
                  strokeWidth={esActivo ? GROSOR_ACTIVO : GROSOR}
                  strokeDasharray={dibujado ? `${s.largo} ${100 - s.largo}` : '0 100'}
                  strokeDashoffset={dibujado ? -s.inicio : 0}
                  className={cn(
                    'cursor-pointer transition-[stroke-dasharray,stroke-dashoffset,stroke-width,opacity] duration-700 ease-[cubic-bezier(0.2,0.7,0.2,1)] motion-reduce:transition-none',
                    activo && !esActivo && 'opacity-30',
                  )}
                  style={{ pointerEvents: 'stroke' }}
                  onPointerEnter={() => setActivo(s.slug)}
                  onPointerMove={(e) => {
                    const box = contenedor.current?.getBoundingClientRect()
                    if (box) setTooltip({ x: e.clientX - box.left, y: e.clientY - box.top })
                  }}
                />
              )
            })}
          </svg>

          {/* Centro: total o la categoría resaltada */}
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
            <span key={filaActiva?.slug ?? 'total'} className="flex flex-col items-center animate-in fade-in zoom-in-95 duration-200">
              <span className="max-w-32 truncate text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                {filaActiva ? filaActiva.nombre : 'Total'}
              </span>
              <span className="text-lg font-semibold tabular-nums text-foreground">
                {formatCLP(filaActiva ? filaActiva.monto : total)}
              </span>
              {filaActiva ? <span className="text-xs tabular-nums text-muted-foreground">{pct.format(filaActiva.share)}</span> : null}
            </span>
          </div>

          {/* Tooltip que sigue al cursor */}
          {filaActiva && tooltip ? (
            <div
              className="pointer-events-none absolute z-10 w-max -translate-x-1/2 -translate-y-[calc(100%+12px)] rounded-md border bg-popover px-3 py-2 text-xs shadow-md"
              style={{ left: tooltip.x, top: tooltip.y }}
            >
              <div className="flex items-center gap-2 font-medium text-popover-foreground">
                <span className="size-2.5 rounded-sm" style={{ background: filaActiva.color }} />
                {filaActiva.nombre}
              </div>
              <div className="mt-0.5 tabular-nums text-muted-foreground">
                {formatCLP(filaActiva.monto)} · {pct.format(filaActiva.share)}
              </div>
            </div>
          ) : null}
        </div>

        {/* Leyenda = tabla de datos */}
        <ul className="flex flex-col gap-0.5" aria-label="Detalle por categoría">
          {filas.map((f) => (
            <li key={f.slug}>
              <button
                type="button"
                onPointerEnter={() => setActivo(f.slug)}
                onPointerLeave={() => setActivo(null)}
                onFocus={() => setActivo(f.slug)}
                onBlur={() => setActivo(null)}
                className={cn(
                  'grid w-full grid-cols-[auto_minmax(0,1fr)_auto_auto] items-center gap-3 rounded-md px-2 py-2 text-left text-sm outline-none transition-[background-color,opacity] duration-200 focus-visible:ring-2 focus-visible:ring-ring',
                  activo === f.slug && 'bg-muted',
                  activo && activo !== f.slug && 'opacity-50',
                )}
              >
                <span className="size-3 rounded-sm" style={{ background: f.color }} />
                <span className="truncate">{f.nombre}</span>
                <span className="tabular-nums font-medium">{formatCLP(f.monto)}</span>
                <span className="w-16 text-right tabular-nums text-muted-foreground">{pct.format(f.share)}</span>
              </button>
            </li>
          ))}
          <li className="mt-1 grid grid-cols-[auto_minmax(0,1fr)_auto_auto] gap-3 border-t px-2 pt-3 text-sm font-semibold">
            <span className="size-3" />
            <span>Total</span>
            <span className="tabular-nums">{formatCLP(total)}</span>
            <span className="w-16 text-right tabular-nums text-muted-foreground">100%</span>
          </li>
        </ul>
      </div>
    </div>
  )
}
