import { ArrowRight, Landmark, MousePointerClick, RefreshCw, ShieldCheck, Smartphone } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

/**
 * Banners comerciales del home de la comunidad (textos de docs/referencias/inicio-comunidad/01-home.png).
 * PENDIENTE DE CONFIRMAR: destino de "Cotiza el seguro" y "Mira el tutorial".
 */

const base =
  'group relative isolate flex h-full flex-col overflow-hidden rounded-2xl border p-5 transition-[translate,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-lg motion-reduce:hover:translate-y-0'

const pendiente = (que: string) => toast.info(`Destino de "${que}" pendiente de confirmar.`)

export function BannerSeguro() {
  return (
    <article className={cn(base, 'justify-center gap-3 border-transparent bg-brand-orange text-brand-orange-foreground')}>
      <div className="absolute -right-10 -top-10 -z-10 size-40 rounded-full bg-white/10 transition-transform duration-500 group-hover:scale-125" />
      <div className="absolute -bottom-14 right-10 -z-10 size-32 rounded-full bg-white/10 transition-transform duration-700 group-hover:scale-110" />
      <ShieldCheck className="size-8 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110" />
      <div>
        <h3 className="font-heading text-lg font-bold uppercase leading-tight">Cotiza el seguro de tu comunidad</h3>
        <p className="mt-1 text-sm text-white/90">¡Con precios y beneficios preferenciales!</p>
      </div>
      <Button
        size="sm"
        variant="secondary"
        className="w-fit bg-white text-brand-orange hover:bg-white/90"
        onClick={() => pendiente('Cotiza el seguro')}
      >
        Cotizar
        <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
      </Button>
    </article>
  )
}

export function BannerRegistro() {
  return (
    <article className={cn(base, 'gap-3 bg-card')}>
      <div className="absolute inset-x-0 top-0 flex h-1.5">
        <span className="flex-[4] bg-brand-orange" />
        <span className="flex-1 bg-brand-purple" />
      </div>
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-heading text-xl font-bold leading-tight text-brand-purple">
          Facilita el Registro de Copropietarios
        </h3>
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-purple/10 text-brand-purple transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:rotate-6">
          <Smartphone className="size-5" />
        </span>
      </div>
      <p className="text-sm text-muted-foreground">Tus residentes ahora pueden crear su cuenta directamente desde la app.</p>
      <div className="mt-auto flex flex-wrap items-center gap-3">
        <Button size="sm" className="bg-brand-purple text-brand-purple-foreground hover:bg-brand-purple/90" onClick={() => pendiente('Mira el tutorial')}>
          Mira el tutorial
          <MousePointerClick />
        </Button>
        <span className="border-l pl-3 text-xs text-brand-orange">y compártelo con tus comunidades</span>
      </div>
    </article>
  )
}

export function BannerConciliacion() {
  return (
    <article className={cn(base, 'gap-3 border-transparent bg-brand-purple text-brand-purple-foreground')}>
      <div className="absolute inset-x-0 top-0 flex h-1.5">
        <span className="flex-[3] bg-brand-orange" />
        <span className="flex-1 bg-white/40" />
      </div>
      {/* Ilustración: banco ↔ Kastor sincronizados (reemplaza la foto del legacy). */}
      <div className="flex items-center gap-2" aria-hidden>
        <span className="flex size-10 items-center justify-center rounded-xl bg-white/15">
          <Landmark className="size-5" />
        </span>
        <RefreshCw className="size-4 text-white/70 transition-transform duration-700 group-hover:rotate-180" />
        <span className="flex size-10 items-center justify-center rounded-xl bg-white font-heading text-lg font-bold text-brand-orange">
          k
        </span>
      </div>
      <div>
        <h3 className="font-heading text-xl font-bold leading-tight">¿Aún concilias a mano?</h3>
        <p className="mt-1 text-sm text-white/85">Tu banco puede estar en Kastor automáticamente con Fintoc.</p>
      </div>
      <Button size="sm" asChild className="mt-auto h-auto w-fit whitespace-normal py-2 bg-brand-orange text-brand-orange-foreground hover:bg-brand-orange-hover">
        <a href="mailto:comercial@kastor.cl?subject=Conciliaci%C3%B3n%20autom%C3%A1tica%20con%20Fintoc">
          Escribe a comercial@kastor.cl y pide 1 mes gratis
        </a>
      </Button>
    </article>
  )
}
