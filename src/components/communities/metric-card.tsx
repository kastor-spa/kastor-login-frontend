import type { LucideIcon } from 'lucide-react'
import { TrendingDown, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useCountUp } from '@/hooks/use-count-up'
import { cn } from '@/lib/utils'

interface MetricCardProps {
  label: string
  value: string
  icon: LucideIcon
  /** Variación respecto al período anterior, ej. "+4.2%". */
  delta?: string
  trend?: 'up' | 'down'
  hint?: string
}

export function MetricCard({ label, value, icon: Icon, delta, trend, hint }: MetricCardProps) {
  const TrendIcon = trend === 'down' ? TrendingDown : TrendingUp
  // Solo los enteros puros se animan; textos como "09-2026" o montos se muestran tal cual.
  const animated = useCountUp(/^\d+$/.test(value) ? Number(value) : null)
  return (
    <Card className="group/metric gap-2 py-4 transition-[box-shadow,border-color] duration-300 hover:border-brand-orange/40 hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between px-4">
        <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
        <Icon className="size-4 text-muted-foreground transition-[color,scale] duration-300 group-hover/metric:scale-110 group-hover/metric:text-brand-orange" />
      </CardHeader>
      <CardContent className="px-4">
        <div className="text-2xl font-semibold tabular-nums">{animated ?? value}</div>
        {(delta || hint) && (
          <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
            {delta ? (
              <span
                className={cn(
                  'inline-flex items-center gap-0.5 font-medium',
                  trend === 'down' ? 'text-destructive' : 'text-emerald-600 dark:text-emerald-400',
                )}
              >
                <TrendIcon className="size-3" />
                {delta}
              </span>
            ) : null}
            {hint}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
