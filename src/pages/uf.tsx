import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowLeft, CircleHelp, Info, KeyRound, LoaderCircle, Save, SquarePen, X } from 'lucide-react'
import { toast } from 'sonner'
import { Core, CoreBody, CoreHeader } from '@/components/layout/core'
import { AutorizacionDialog, BienvenidaDialog, ConfigurarClaveDialog, RecuperarClaveDialog } from '@/components/uf/dialogs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import {
  ahoraLegacy,
  aniosUf,
  formatearMontoUf,
  limpiarNumeroUf,
  mesesUf,
  sanearEntradaUf,
  sesionUf,
  TOOLTIP_PERIODO_UF,
  valoresUfSeed,
  type ValoresUfAnio,
} from '@/data/uf'
import { cn } from '@/lib/utils'

type Modo = 'bloqueado' | 'editando' | 'guardando'
type Dialogo = null | 'autorizacion' | 'configurarClave' | 'recuperarClave' | 'bienvenida'

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms))

function InfoTip({ text }: { text: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Info className="ml-1.5 inline size-3.5 cursor-help text-info hover:text-info/80" aria-label={text} />
      </TooltipTrigger>
      <TooltipContent className="max-w-64">{text}</TooltipContent>
    </Tooltip>
  )
}

/**
 * Configuración UF. Replica /login/dashboard/configuracion_uf.
 * Flujo: bloqueado → Autorización (contraseña maestra) → edición → guardado.
 * Ver docs/mapas/MAPA-uf.md. Demo: contraseña maestra "1234"; ?sinClave=1 fuerza el flujo sin clave.
 */
export function UfPage() {
  const [params] = useSearchParams()
  const [datos, setDatos] = useState<Record<number, ValoresUfAnio>>(valoresUfSeed)
  const [anio, setAnio] = useState(2026)
  const [modo, setModo] = useState<Modo>('bloqueado')
  const [borrador, setBorrador] = useState<Record<string, string>>({})
  const [claveMaestra, setClaveMaestra] = useState<string | null>(params.get('sinClave') ? null : sesionUf.claveMaestraDemo)
  // Sin clave configurada: la bienvenida se abre al cargar, en modo estático.
  const [dialogo, setDialogo] = useState<Dialogo>(params.get('sinClave') ? 'bienvenida' : null)

  const tieneClave = claveMaestra !== null
  const actual = datos[anio] ?? { valores: {}, ultimaEdicion: null }
  const editando = modo !== 'bloqueado'

  const borradorDesde = (v: ValoresUfAnio, a: number) =>
    Object.fromEntries(mesesUf.map((m) => [m.numero, formatearMontoUf(v.valores[`${a}-${m.numero}`] ?? 0)]))

  function cambiarAnio(v: string) {
    setAnio(Number(v))
    setModo('bloqueado')
  }

  function habilitarEdicion() {
    setBorrador(borradorDesde(actual, anio))
    setModo('editando')
  }

  async function guardarMontos() {
    const payload = mesesUf
      .map((m) => ({ periodo: `${anio}-${m.numero}`, monto: limpiarNumeroUf(borrador[m.numero] ?? '0') }))
      .filter((p) => p.monto > 0)
    if (payload.length === 0) {
      toast.warning('Sin valores UF', { description: 'No hay valores UF para guardar.' })
      return
    }
    setModo('guardando')
    await wait(80 * payload.length) // mock: POST guardar_configuracion_uf secuencial por mes
    setDatos((prev) => ({
      ...prev,
      [anio]: {
        valores: { ...prev[anio]?.valores, ...Object.fromEntries(payload.map((p) => [p.periodo, p.monto])) },
        ultimaEdicion: ahoraLegacy(),
      },
    }))
    setModo('bloqueado')
    toast.success('Valores guardados', { description: 'Valores UF guardados correctamente.' })
  }

  async function verificar(clave: string) {
    await wait(400)
    return clave === claveMaestra
  }

  async function guardarClave(clave: string) {
    await wait(400)
    setClaveMaestra(clave)
    toast.success('Contraseña guardada', { description: 'Contraseña maestra guardada correctamente.' })
  }

  const botonPrincipal =
    modo === 'bloqueado' ? (
      <Tooltip>
        <TooltipTrigger asChild>
          <span tabIndex={tieneClave ? -1 : 0}>
            <Button size="sm" disabled={!tieneClave} onClick={() => setDialogo('autorizacion')}>
              <SquarePen />
              Editar montos en UF
            </Button>
          </span>
        </TooltipTrigger>
        {!tieneClave ? (
          <TooltipContent className="max-w-64">
            Por seguridad solo usuarios con perfil ADMIN pueden ingresar valores. Para continuar cree una contraseña.
          </TooltipContent>
        ) : null}
      </Tooltip>
    ) : (
      <Button size="sm" className="bg-success text-success-foreground hover:bg-success/90" disabled={modo === 'guardando'} onClick={guardarMontos}>
        {modo === 'guardando' ? <LoaderCircle className="animate-spin" /> : <Save />}
        {modo === 'guardando' ? 'Guardando...' : 'Guardar montos en UF'}
      </Button>
    )

  return (
    <Core>
      <CoreHeader
        title="Configuración UF"
        environment="upselling"
        actions={
          <>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon-sm" aria-label="Ver información" onClick={() => setDialogo('bienvenida')}>
                  <CircleHelp />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Ver información</TooltipContent>
            </Tooltip>
            <Button variant="outline" size="sm" asChild>
              <Link to="/">
                <ArrowLeft />
                Volver
              </Link>
            </Button>
          </>
        }
      />

      <CoreBody>
        <Alert className="border-info/30 bg-info/5">
          <Info className="text-info" />
          <AlertDescription className="text-foreground/80">
            <p>
              El valor UF ingresado en esta sección será utilizado en todas las comunidades que trabajen con presupuesto en UF
              para calcular la variación de cobranza en el reporte <strong>Control Presupuestario</strong> según el período
              correspondiente. <strong>Este valor no se relaciona con el cálculo de Remuneraciones.</strong>
            </p>
          </AlertDescription>
        </Alert>

        {/* Barra de control (well del legacy) */}
        <Card className="bg-muted/60 py-3">
          <CardContent className="flex flex-wrap items-center gap-x-6 gap-y-3 px-4">
            <div className="flex items-center gap-2">
              <Label className="whitespace-nowrap">
                Seleccionar Período:
                <InfoTip text={TOOLTIP_PERIODO_UF} />
              </Label>
              <Select value={String(anio)} onValueChange={cambiarAnio} disabled={modo === 'guardando'}>
                <SelectTrigger size="sm" className="w-32 bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {aniosUf.map((a) => (
                    <SelectItem key={a} value={String(a)}>
                      Año {a}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <span className="text-sm text-muted-foreground">
              Última edición: <span className="tabular-nums text-foreground">{actual.ultimaEdicion ?? '—'}</span>
            </span>
            <div className="ml-auto flex flex-wrap items-center gap-2">
              {modo === 'editando' ? (
                <Button variant="ghost" size="sm" onClick={() => setModo('bloqueado')}>
                  <X />
                  Cancelar
                </Button>
              ) : null}
              <Button variant="outline" size="sm" className="bg-background" onClick={() => setDialogo('configurarClave')} disabled={editando}>
                <KeyRound />
                {tieneClave ? 'Cambiar contraseña' : 'Crear contraseña'}
              </Button>
              {botonPrincipal}
            </div>
          </CardContent>
        </Card>

        {/* Grilla de 12 meses */}
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {mesesUf.map((m) => {
            const periodo = `${anio}-${m.numero}`
            const guardado = actual.valores[periodo] ?? 0
            const valor = editando ? (borrador[m.numero] ?? '0,00') : formatearMontoUf(guardado)
            return (
              <Card key={m.numero} className={cn('gap-3 py-4 transition-colors', editando && 'border-brand-orange/60')}>
                <CardHeader className="flex flex-row items-center justify-between px-4">
                  <CardTitle className="flex items-center text-sm font-semibold">
                    {m.nombre}
                    <InfoTip text={TOOLTIP_PERIODO_UF} />
                  </CardTitle>
                  {guardado === 0 ? (
                    <span className="text-xs text-muted-foreground" title="Sin registro">
                      Sin registro
                    </span>
                  ) : (
                    <span className="text-xs tabular-nums text-muted-foreground">{periodo}</span>
                  )}
                </CardHeader>
                <CardContent className="px-4">
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
                    <Input
                      inputMode="decimal"
                      aria-label={`Valor UF ${m.nombre} ${anio}`}
                      disabled={modo !== 'editando'}
                      value={valor}
                      onFocus={(e) => {
                        const n = limpiarNumeroUf(e.target.value)
                        setBorrador((b) => ({ ...b, [m.numero]: String(n).replace('.', ',') }))
                        requestAnimationFrame(() => e.target.select())
                      }}
                      onChange={(e) => setBorrador((b) => ({ ...b, [m.numero]: sanearEntradaUf(e.target.value) }))}
                      onBlur={(e) => setBorrador((b) => ({ ...b, [m.numero]: formatearMontoUf(limpiarNumeroUf(e.target.value)) }))}
                      className={cn(
                        'pl-7 text-right tabular-nums disabled:opacity-100',
                        modo === 'editando' && 'border-brand-orange bg-brand-orange/5',
                        modo !== 'editando' && guardado === 0 && 'text-muted-foreground',
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </section>
      </CoreBody>

      <AutorizacionDialog
        open={dialogo === 'autorizacion'}
        onOpenChange={(o) => setDialogo(o ? 'autorizacion' : null)}
        verificar={verificar}
        onOk={habilitarEdicion}
        onOlvide={() => setDialogo('recuperarClave')}
      />
      <ConfigurarClaveDialog
        open={dialogo === 'configurarClave'}
        onOpenChange={(o) => setDialogo(o ? 'configurarClave' : null)}
        tieneClave={tieneClave}
        verificar={verificar}
        guardar={guardarClave}
      />
      <RecuperarClaveDialog
        open={dialogo === 'recuperarClave'}
        onOpenChange={(o) => setDialogo(o ? 'recuperarClave' : null)}
        correo={sesionUf.correo}
        esAdmin={sesionUf.esPerfilAdmin}
        onEnviada={() =>
          toast.success('Contraseña temporal enviada', { description: 'Se generó una nueva contraseña temporal y fue enviada al correo.' })
        }
      />
      <BienvenidaDialog
        open={dialogo === 'bienvenida'}
        onOpenChange={(o) => setDialogo(o ? 'bienvenida' : null)}
        estatico={!tieneClave}
      />
    </Core>
  )
}
