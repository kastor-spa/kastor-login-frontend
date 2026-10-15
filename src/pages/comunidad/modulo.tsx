import { Link, Navigate, useParams } from 'react-router-dom'
import { ArrowLeft, Construction } from 'lucide-react'
import { Core, CoreBody, CoreHeader } from '@/components/layout/core'
import { Button } from '@/components/ui/button'
import { navigationContable, rutaContable } from '@/config/navigation'
import { useComunidad } from '@/hooks/use-comunidad'

/**
 * Vista genérica de un módulo de Kastor Contable aún no construido.
 * Cuando un módulo se clone (/clonar-modulo), su página reemplaza a esta en App.tsx.
 */
export function ComunidadModuloPage() {
  const comunidad = useComunidad()
  const { categoria: categoriaSlug, modulo: moduloSlug } = useParams()

  const categoria = navigationContable.find((c) => c.slug === categoriaSlug)
  const todos = categoria ? [...categoria.modulos, ...(categoria.informes ?? [])] : []
  const modulo = moduloSlug ? todos.find((m) => m.slug === moduloSlug) : undefined
  const esInforme = !!modulo && !!categoria?.informes?.includes(modulo)

  // Categoría inexistente, módulo inexistente o categoría con dropdown sin módulo elegido.
  if (!categoria || categoria.slug === 'inicio' || (moduloSlug ? !modulo : todos.length > 0)) {
    return <Navigate to={rutaContable(comunidad.id)} replace />
  }

  const title = modulo?.title ?? categoria.title
  const Icon = categoria.icon

  return (
    <Core>
      <CoreHeader
        title={title}
        description={modulo ? `${categoria.title}${esInforme ? ' · Informes' : ''} · ${comunidad.name}` : comunidad.name}
        environment="Kastor Contable"
      />
      <CoreBody>
        <section className="flex flex-1 flex-col items-center justify-center gap-4 rounded-xl border border-dashed p-10 text-center">
          <span className="relative flex size-16 items-center justify-center rounded-2xl bg-brand-orange/10 text-brand-orange">
            <Icon className="size-7" />
            <span className="absolute -bottom-1.5 -right-1.5 flex size-7 items-center justify-center rounded-full border-2 border-background bg-warning text-warning-foreground">
              <Construction className="size-3.5" />
            </span>
          </span>
          <div className="max-w-md">
            <h2 className="font-heading text-lg font-semibold text-brand-darkblue">{title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Esta pantalla aún no está construida en la propuesta. Se levantará desde el sistema actual con sus
              campos y acciones reales.
            </p>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link to={rutaContable(comunidad.id)}>
              <ArrowLeft />
              Volver al inicio de la comunidad
            </Link>
          </Button>
        </section>
      </CoreBody>
    </Core>
  )
}
