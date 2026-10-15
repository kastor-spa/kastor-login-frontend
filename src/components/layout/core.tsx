import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { NotificationsCapsule } from '@/components/notifications/notifications-capsule'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

/**
 * Core: contenedor principal de cada vista.
 * - CoreHeader: título, etiqueta de ambiente, accesos rápidos / acciones y usuario.
 * - CoreBody: imprime todo el contenido de la vista.
 */
export function Core({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn('flex min-h-svh flex-1 flex-col', className)}>{children}</div>
}

interface CoreHeaderProps {
  title: string
  description?: string
  /** Etiqueta de ambiente / contexto (ej. "upselling"). */
  environment?: string
  /** Accesos rápidos / acciones (botones, menús). */
  actions?: ReactNode
  className?: string
}

const currentUser = { email: 'hector.barrera@kastor.cl' }

function HeaderUser() {
  const navigate = useNavigate()
  return (
    <div className="flex items-center gap-1">
      <span className="hidden text-sm text-muted-foreground lg:inline">{currentUser.email}</span>
      <NotificationsCapsule />
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon-sm" aria-label="Cerrar sesión" onClick={() => navigate('/login')}>
            <LogOut />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Cerrar sesión</TooltipContent>
      </Tooltip>
    </div>
  )
}

export function CoreHeader({ title, description, environment, actions, className }: CoreHeaderProps) {
  return (
    <header
      className={cn(
        'sticky top-0 z-10 flex h-16 shrink-0 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/80 md:px-6',
        className,
      )}
    >
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-1 data-[orientation=vertical]:h-5" />
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <div data-motion="header-title" className="flex min-w-0 flex-col">
          <h1 className="truncate text-base font-semibold leading-tight text-brand-darkblue md:text-lg">{title}</h1>
          {description ? (
            <p className="truncate text-xs text-muted-foreground md:text-sm">{description}</p>
          ) : null}
        </div>
        {environment ? (
          <Badge variant="secondary" className="hidden sm:inline-flex">
            {environment}
          </Badge>
        ) : null}
      </div>
      {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
      <Separator orientation="vertical" className="mx-1 data-[orientation=vertical]:h-5" />
      <HeaderUser />
    </header>
  )
}

export function CoreBody({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div data-motion="core-body" className={cn('flex flex-1 flex-col gap-6 p-4 md:p-6', className)}>
      {children}
    </div>
  )
}
