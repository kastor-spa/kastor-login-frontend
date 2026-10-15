import { Link } from 'react-router-dom'
import { CircleAlert, CircleCheck, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'
import type { Community } from '@/data/communities'

const yesNo = (v: boolean) => (v ? 'SI' : 'NO')

interface CommunityTableProps {
  communities: Community[]
  onDelete?: (community: Community) => void
}

export function CommunityTable({ communities, onDelete }: CommunityTableProps) {
  return (
    <div className="overflow-hidden rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-8" />
            <TableHead>Comunidad</TableHead>
            <TableHead>Rut</TableHead>
            <TableHead>Último prorrateo</TableHead>
            <TableHead>Último cierre Rem</TableHead>
            <TableHead>Liberado</TableHead>
            <TableHead>TCEL</TableHead>
            <TableHead>Conciliación</TableHead>
            <TableHead>Usuario</TableHead>
            <TableHead className="w-10" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {communities.map((c) => {
            const StatusIcon = c.alerta ? CircleAlert : CircleCheck
            return (
              <TableRow key={c.id}>
                <TableCell>
                  <StatusIcon
                    className={cn('size-4', c.alerta ? 'text-destructive' : 'text-success')}
                  />
                </TableCell>
                <TableCell className="font-medium">
                  <Link to={`/comunidades/${c.id}`} viewTransition className="hover:underline">
                    {c.name}
                  </Link>
                  {!c.activa ? (
                    <Badge variant="outline" className="ml-2">
                      Inactiva
                    </Badge>
                  ) : null}
                </TableCell>
                <TableCell className="tabular-nums">{c.rut}</TableCell>
                <TableCell className="tabular-nums">{c.ultimoProrrateo}</TableCell>
                <TableCell className="tabular-nums">{c.ultimoCierreRem}</TableCell>
                <TableCell>{yesNo(c.liberado)}</TableCell>
                <TableCell>{yesNo(c.tcel)}</TableCell>
                <TableCell className="tabular-nums">{c.conciliacion}</TableCell>
                <TableCell className="text-muted-foreground">{c.usuario}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="text-muted-foreground hover:text-destructive"
                    aria-label={`Eliminar ${c.name}`}
                    onClick={() => onDelete?.(c)}
                  >
                    <Trash2 />
                  </Button>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
