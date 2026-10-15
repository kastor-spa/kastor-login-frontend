import { Link, useSearchParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Core, CoreBody, CoreHeader } from '@/components/layout/core'
import { FacturasModulo } from '@/components/facturas/facturas-modulo'
import { Button } from '@/components/ui/button'
import { facturasCaleu } from '@/data/facturas'

/**
 * Facturas Caleu pendientes. Replica /login/dashboard/facturas_caleu3. Ver MAPA-facturas-caleu.md.
 * ?vacio=1 muestra el estado real del legacy al 2026-10-14 (sin facturas).
 */
export function FacturasCaleuPage() {
  const [params] = useSearchParams()
  return (
    <Core>
      <CoreHeader
        title="Facturación DISTRIBUIDORA CALEU"
        description="Facturas pendientes"
        environment="upselling"
        actions={
          <Button variant="outline" size="sm" asChild>
            <Link to="/">
              <ArrowLeft />
              Volver
            </Link>
          </Button>
        }
      />
      <CoreBody>
        <FacturasModulo emisor="caleu" facturas={params.get('vacio') ? [] : facturasCaleu} />
      </CoreBody>
    </Core>
  )
}
