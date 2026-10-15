import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { LucideIcon } from 'lucide-react'
import { Bell, BellOff, CheckCheck, ClipboardList, Coins, Info, Landmark, Receipt, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  eliminarNotificacion,
  marcarLeida,
  marcarTodasLeidas,
  notificacionesStore,
  tiempoRelativo,
  type Notificacion,
  type Severidad,
  type TipoNotificacion,
} from '@/data/notificaciones'
import { cn } from '@/lib/utils'

const iconos: Record<TipoNotificacion, LucideIcon> = {
  tarea: ClipboardList,
  factura: Receipt,
  cobranza: Landmark,
  uf: Coins,
  sistema: Info,
}

const tonos: Record<Severidad, string> = {
  info: 'bg-info/10 text-info',
  warning: 'bg-warning/15 text-warning-foreground',
  danger: 'bg-destructive/10 text-destructive',
  success: 'bg-success/10 text-success',
}

function NotificacionItem({ n, onOpen }: { n: Notificacion; onOpen: (n: Notificacion) => void }) {
  const Icon = iconos[n.tipo]
  return (
    <li className="group relative">
      <button
        type="button"
        onClick={() => onOpen(n)}
        className={cn(
          'flex w-full gap-3 px-4 py-3 text-left transition-colors hover:bg-accent focus-visible:bg-accent focus-visible:outline-none',
          !n.leida && 'bg-brand-orange/[0.04]',
        )}
      >
        <span className={cn('flex size-8 shrink-0 items-center justify-center rounded-full', tonos[n.severidad])}>
          <Icon className="size-4" />
        </span>
        <span className="min-w-0 flex-1 pr-5">
          <span className="flex items-center gap-2">
            <span className={cn('truncate text-sm', n.leida ? 'font-normal' : 'font-semibold')}>{n.titulo}</span>
            {!n.leida ? <span className="size-2 shrink-0 rounded-full bg-brand-orange" aria-label="No leída" /> : null}
          </span>
          <span className="mt-0.5 line-clamp-2 block text-xs text-muted-foreground">{n.descripcion}</span>
          <span className="mt-1 block text-[11px] text-muted-foreground/80">{tiempoRelativo(n.fecha)}</span>
        </span>
      </button>
      <Button
        variant="ghost"
        size="icon-xs"
        className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
        aria-label="Descartar notificación"
        onClick={() => eliminarNotificacion(n.id)}
      >
        <X />
      </Button>
    </li>
  )
}

/**
 * Cápsula de notificaciones del header: campana con contador + panel (Popover).
 * Datos dummy en src/data/notificaciones.ts (estado compartido entre páginas).
 */
export function NotificationsCapsule() {
  const navigate = useNavigate()
  const notificaciones = notificacionesStore.useStore()
  const [open, setOpen] = useState(false)
  const [filtro, setFiltro] = useState<'todas' | 'no-leidas'>('todas')

  const noLeidas = notificaciones.filter((n) => !n.leida).length
  const visibles = filtro === 'todas' ? notificaciones : notificaciones.filter((n) => !n.leida)

  function abrir(n: Notificacion) {
    marcarLeida(n.id)
    if (n.href) {
      setOpen(false)
      navigate(n.href)
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn('relative h-8 gap-1.5 rounded-full px-2.5', noLeidas > 0 && 'bg-brand-orange/10 text-brand-orange hover:bg-brand-orange/15 hover:text-brand-orange')}
          aria-label={noLeidas ? `Notificaciones, ${noLeidas} sin leer` : 'Notificaciones'}
        >
          <Bell className={cn(noLeidas > 0 && 'animate-[wiggle_1s_ease-in-out_1]')} />
          {noLeidas > 0 ? (
            <span className="min-w-4 rounded-full bg-brand-orange px-1 text-[11px] font-semibold leading-4 text-white tabular-nums">
              {noLeidas > 9 ? '9+' : noLeidas}
            </span>
          ) : null}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-[380px] max-w-[calc(100vw-2rem)] gap-0 p-0 outline-none"
        tabIndex={-1}
        onOpenAutoFocus={(e) => {
          e.preventDefault()
          ;(e.currentTarget as HTMLElement | null)?.focus()
        }}
      >
        <div className="flex items-center justify-between gap-2 border-b px-4 py-3">
          <div>
            <p className="text-sm font-semibold">Notificaciones</p>
            <p className="text-xs text-muted-foreground">
              {noLeidas ? `${noLeidas} sin leer` : 'Estás al día'}
            </p>
          </div>
          <Button variant="ghost" size="sm" className="h-7 text-xs" disabled={noLeidas === 0} onClick={marcarTodasLeidas}>
            <CheckCheck />
            Marcar todas como leídas
          </Button>
        </div>

        <div className="border-b px-4 py-2">
          <Tabs value={filtro} onValueChange={(v) => setFiltro(v as typeof filtro)}>
            <TabsList className="w-full">
              <TabsTrigger value="todas" className="flex-1">
                Todas
                <span className="text-muted-foreground tabular-nums">{notificaciones.length}</span>
              </TabsTrigger>
              <TabsTrigger value="no-leidas" className="flex-1">
                No leídas
                <span className="text-muted-foreground tabular-nums">{noLeidas}</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {visibles.length === 0 ? (
          <div className="flex flex-col items-center gap-2 px-4 py-10 text-center text-sm text-muted-foreground">
            <BellOff className="size-6" />
            {filtro === 'no-leidas' ? 'No tienes notificaciones sin leer.' : 'No tienes notificaciones.'}
          </div>
        ) : (
          <ul className="max-h-[420px] divide-y overflow-y-auto">
            {visibles.map((n) => (
              <NotificacionItem key={n.id} n={n} onOpen={abrir} />
            ))}
          </ul>
        )}
      </PopoverContent>
    </Popover>
  )
}
