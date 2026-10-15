import { useState, type FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowLeft, BellRing, FileSignature, Landmark, MessageSquare, Paperclip, Send } from 'lucide-react'
import { toast } from 'sonner'
import { Core, CoreBody, CoreHeader } from '@/components/layout/core'
import { FacturasModulo } from '@/components/facturas/facturas-modulo'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { datosBancariosKastor, facturasKastor, type FacturaPendiente } from '@/data/facturas'

/**
 * Facturas Kastor pendientes. Replica /login/dashboard/facturas. Ver MAPA-facturas-kastor.md.
 * ?vacio=1 muestra el estado real del legacy al 2026-10-14 (sin facturas).
 */
export function FacturasKastorPage() {
  const [params] = useSearchParams()
  const [pacOpen, setPacOpen] = useState(false)
  const [contactoOpen, setContactoOpen] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const [enviadoOpen, setEnviadoOpen] = useState(false)
  const [notificando, setNotificando] = useState<FacturaPendiente | null>(null)
  const [notaPago, setNotaPago] = useState('')
  const [archivo, setArchivo] = useState<File | null>(null)

  const facturas = params.get('vacio') ? [] : facturasKastor

  function enviarMensaje(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    // Mock de /login/dashboard/mensaje_facturacion (en el legacy el envío estaba roto: $.ajax(url) sin url)
    setMensaje('')
    setContactoOpen(false)
    setEnviadoOpen(true)
  }

  function notificarPago(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    // Mock de POST multipart /login/dashboard/notificar_pago
    toast.success('Pago notificado', {
      description: `Se envió la notificación de la factura ${notificando?.numeroDocumento}${archivo ? ` con ${archivo.name}` : ''}.`,
    })
    setNotificando(null)
    setNotaPago('')
    setArchivo(null)
  }

  return (
    <Core>
      <CoreHeader
        title="Facturación"
        description="Facturas Kastor pendientes"
        environment="upselling"
        actions={
          <>
            <Button variant="outline" size="sm" onClick={() => setPacOpen(true)}>
              <FileSignature />
              Suscribir PAC
            </Button>
            <Button size="sm" onClick={() => setContactoOpen(true)}>
              <MessageSquare />
              Contacto Facturación
            </Button>
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
        <FacturasModulo
          emisor="kastor"
          facturas={facturas}
          mostrarDeuda
          accionFila={(f) => (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon-sm" aria-label="Notificar pago" onClick={() => setNotificando(f)}>
                  <BellRing />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Notificar pago</TooltipContent>
            </Tooltip>
          )}
          aside={
            <Card className="gap-3 py-4">
              <CardHeader className="flex flex-row items-center gap-2 px-4">
                <Landmark className="size-4 text-brand-orange" />
                <CardTitle className="text-sm">Datos bancarios</CardTitle>
              </CardHeader>
              <CardContent className="px-4">
                <dl className="grid gap-1.5 text-sm">
                  {datosBancariosKastor.map((d) => (
                    <div key={d.label} className="flex justify-between gap-3">
                      <dt className="text-muted-foreground">{d.label}</dt>
                      <dd className="text-right font-medium tabular-nums">{d.value}</dd>
                    </div>
                  ))}
                </dl>
              </CardContent>
            </Card>
          }
        />
      </CoreBody>

      {/* Suscribir PAC */}
      <AlertDialog open={pacOpen} onOpenChange={setPacOpen}>
        <AlertDialogContent className="sm:max-w-[400px]">
          <AlertDialogHeader>
            <AlertDialogTitle>Contrato PAC</AlertDialogTitle>
            <AlertDialogDescription>
              Se ha notificado a nuestros ejecutivos comerciales sobre la suscripción al contrato PAC, además se han
              descargado los contratos para su revisión.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>Aceptar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Contacto Facturación */}
      <Dialog open={contactoOpen} onOpenChange={setContactoOpen}>
        <DialogContent className="sm:max-w-md">
          <form onSubmit={enviarMensaje} className="grid gap-4">
            <DialogHeader>
              <DialogTitle>Contacto Facturación</DialogTitle>
              <DialogDescription>Envía un mensaje al área de facturación de Kastor.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-2">
              <Label htmlFor="msg-facturacion" className="sr-only">Mensaje</Label>
              <Textarea id="msg-facturacion" required rows={5} placeholder="Escribe tu mensaje" value={mensaje} onChange={(e) => setMensaje(e.target.value)} />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setContactoOpen(false)}>Cancelar</Button>
              <Button type="submit" disabled={!mensaje.trim()}>
                <Send />
                Enviar Mensaje
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={enviadoOpen} onOpenChange={setEnviadoOpen}>
        <AlertDialogContent className="sm:max-w-[400px]">
          <AlertDialogHeader>
            <AlertDialogTitle>Mensaje enviado exitosamente</AlertDialogTitle>
            <AlertDialogDescription>Un ejecutivo se contactará con usted a la brevedad.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>Aceptar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Notificar Pago */}
      <Dialog open={notificando !== null} onOpenChange={(o) => !o && setNotificando(null)}>
        <DialogContent className="sm:max-w-md">
          <form onSubmit={notificarPago} className="grid gap-4">
            <DialogHeader>
              <DialogTitle>Notificar Pago</DialogTitle>
              <DialogDescription>
                Envía un mensaje al área de Pagos de Kastor
                {notificando ? ` sobre la factura ${notificando.numeroDocumento} (${notificando.comunidad}).` : '.'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-2">
              <Label htmlFor="msg-pago" className="sr-only">Mensaje</Label>
              <Textarea id="msg-pago" required rows={4} placeholder="Detalle del pago realizado" value={notaPago} onChange={(e) => setNotaPago(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="adjunto" className="flex items-center gap-1.5">
                <Paperclip className="size-3.5" />
                Adjuntar Documento
              </Label>
              <Input id="adjunto" type="file" onChange={(e) => setArchivo(e.target.files?.[0] ?? null)} />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setNotificando(null)}>Cancelar</Button>
              <Button type="submit" disabled={!notaPago.trim()}>Notificar Pago</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Core>
  )
}
