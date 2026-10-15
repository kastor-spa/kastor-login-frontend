import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, LoaderCircle, LogOut } from 'lucide-react'
import { KastorLogo } from '@/components/brand/logo'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { productos, type Producto } from '@/config/productos'
import { cn } from '@/lib/utils'

const usuario = { nombre: 'Héctor', correo: 'hector.barrera@kastor.cl' }

function saludo(hora = new Date().getHours()) {
  if (hora < 12) return 'Buenos días'
  if (hora < 20) return 'Buenas tardes'
  return 'Buenas noches'
}

/** Clases de entrada escalonada (tw-animate-css). Se desactivan con prefers-reduced-motion. */
const entrada = 'animate-in fade-in slide-in-from-bottom-4 fill-mode-both duration-700 ease-out motion-reduce:animate-none'

/**
 * Bienvenida post-login: selector de producto. Rutea a Kastor Contable (dashboard de comunidades)
 * o a las otras plataformas configuradas en src/config/productos.ts.
 */
export function BienvenidaPage() {
  const navigate = useNavigate()
  const [eligiendo, setEligiendo] = useState<string | null>(null)

  function elegir(p: Producto) {
    if (eligiendo || (!p.ruta && !p.url)) return
    setEligiendo(p.slug)
    // Pequeña pausa para la animación de salida
    window.setTimeout(() => {
      if (p.ruta) navigate(p.ruta)
      else if (p.url) window.location.assign(p.url)
    }, 450)
  }

  return (
    <div className="relative flex min-h-svh flex-col overflow-hidden bg-background">
      {/* Fondo suave de marca */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 -top-40 size-[520px] rounded-full bg-brand-orange/10 blur-3xl animate-in fade-in duration-1000 motion-reduce:animate-none" />
        <div className="absolute -bottom-48 -right-40 size-[560px] rounded-full bg-brand-purple/10 blur-3xl animate-in fade-in duration-1000 delay-300 fill-mode-both motion-reduce:animate-none" />
      </div>

      <header className={cn('relative z-10 flex items-center justify-between px-6 py-5 md:px-10', entrada)}>
        <KastorLogo width={120} />
        <div className="flex items-center gap-2">
          <span className="hidden text-sm text-muted-foreground sm:inline">{usuario.correo}</span>
          <Button variant="ghost" size="icon-sm" aria-label="Cerrar sesión" onClick={() => navigate('/login')}>
            <LogOut />
          </Button>
        </div>
      </header>

      <main
        className={cn(
          'relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center px-6 pb-16 transition-all duration-500 md:px-10',
          eligiendo && 'scale-[0.98] opacity-0',
        )}
      >
        <div className="text-center">
          <p className={cn('text-sm font-medium text-brand-orange', entrada, 'delay-100')}>{saludo()}, {usuario.nombre}</p>
          <h1 className={cn('mt-2 font-heading text-4xl font-light tracking-tight md:text-5xl', entrada, 'delay-200')}>
            Bienvenido a Kastor
          </h1>
          <p className={cn('mx-auto mt-3 max-w-lg text-muted-foreground', entrada, 'delay-300')}>
            ¿Qué producto quieres usar hoy?
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {productos.map((p, i) => {
            const disponible = Boolean(p.ruta || p.url)
            const activo = eligiendo === p.slug
            return (
              <button
                key={p.slug}
                type="button"
                onClick={() => elegir(p)}
                disabled={!disponible || Boolean(eligiendo)}
                aria-disabled={!disponible}
                style={{ animationDelay: `${400 + i * 110}ms` }}
                className={cn(
                  entrada,
                  'group relative flex items-start gap-4 rounded-xl border bg-card p-5 text-left shadow-xs outline-none transition-all duration-300',
                  'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                  disponible
                    ? 'hover:-translate-y-0.5 hover:border-brand-orange/50 hover:shadow-md'
                    : 'cursor-not-allowed opacity-70',
                  activo && 'border-brand-orange shadow-md',
                )}
              >
                <span className={cn('flex size-12 shrink-0 items-center justify-center rounded-lg transition-transform duration-300 group-hover:scale-105', p.acento)}>
                  <p.icon className="size-6" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span className="font-heading text-base font-semibold">{p.nombre}</span>
                    {!disponible ? <Badge variant="secondary">Próximamente</Badge> : null}
                  </span>
                  <span className="mt-1 block text-sm text-muted-foreground">{p.descripcion}</span>
                </span>
                {disponible ? (
                  <span className="self-center text-muted-foreground transition-all duration-300 group-hover:translate-x-1 group-hover:text-brand-orange">
                    {activo ? <LoaderCircle className="size-5 animate-spin" /> : <ArrowRight className="size-5" />}
                  </span>
                ) : null}
              </button>
            )
          })}
        </div>
      </main>

      <footer className={cn('relative z-10 pb-6 text-center text-xs text-muted-foreground', entrada, 'delay-1000')}>
        ¿Necesitas ayuda? Soporte 02-2 833 8269 / 02-2 833 8307
      </footer>
    </div>
  )
}
