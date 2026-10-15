import { Link } from 'react-router-dom'
import { CircleAlert, CircleCheck, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { Community } from '@/data/communities'

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b py-1.5 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium tabular-nums">{value}</span>
    </div>
  )
}

const yesNo = (v: boolean) => (v ? 'SI' : 'NO')

interface CommunityCardProps {
  community: Community
  onDelete?: (community: Community) => void
}

export function CommunityCard({ community, onDelete }: CommunityCardProps) {
  const StatusIcon = community.alerta ? CircleAlert : CircleCheck
  return (
    <Card className="relative gap-0 overflow-hidden py-0 transition-[box-shadow,translate] duration-300 hover:-translate-y-1 hover:shadow-lg motion-reduce:hover:translate-y-0 has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-ring">
      {/* Encabezado: naranja si está activa, gris si no */}
      {/* view-transition-name compartido con el título del sidebar de la comunidad. */}
      <div
        style={{ viewTransitionName: `comunidad-${community.id}` }}
        className={cn(
          'min-h-14 px-4 py-3 text-base font-medium uppercase leading-tight text-white',
          community.activa ? 'bg-brand-orange' : 'bg-brand-lightgray',
        )}
      >
        <Link
          to={`/comunidades/${community.id}`}
          viewTransition
          className="outline-none after:absolute after:inset-0 after:content-['']"
        >
          {community.name}
        </Link>
      </div>

      <div className="px-4 pb-3 pt-2">
        <div className="flex justify-end border-b pb-1">
          <span
            title={community.alerta ? 'Con alertas' : 'Al día'}
            className={cn(
              'inline-flex size-5 items-center justify-center rounded-full text-white',
              community.alerta ? 'bg-destructive' : 'bg-success',
            )}
          >
            <StatusIcon className="size-5" strokeWidth={2.5} />
          </span>
        </div>

        <Row label="Rut" value={community.rut} />
        <Row label="Último prorrateo" value={community.ultimoProrrateo} />
        <Row label="Último cierre Rem" value={community.ultimoCierreRem} />
        <Row label="Liberado" value={yesNo(community.liberado)} />
        <Row label="TCEL" value={yesNo(community.tcel)} />

        <div className="py-1.5 text-sm">
          <div className="text-muted-foreground">Conciliación</div>
          <div className="mt-1 text-xs font-medium tabular-nums">{community.conciliacion}</div>
        </div>

        <div className="mt-4 border-t pt-2 text-center text-sm">{community.usuario}</div>

        <div className="mt-1 flex justify-end">
          <Button
            variant="ghost"
            size="icon-sm"
            className="relative z-10 text-muted-foreground hover:text-destructive"
            aria-label={`Eliminar ${community.name}`}
            onClick={() => onDelete?.(community)}
          >
            <Trash2 />
          </Button>
        </div>
      </div>
    </Card>
  )
}
