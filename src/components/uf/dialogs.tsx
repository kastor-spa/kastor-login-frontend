import { useState, type FormEvent } from 'react'
import { KeyRound, LoaderCircle, Mail, Send } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
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

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms))

function FieldError({ children }: { children?: string | null }) {
  return children ? <p className="text-xs text-destructive">{children}</p> : null
}

/* ---------------------------------------------------------------- Autorización */
export function AutorizacionDialog({
  open,
  onOpenChange,
  verificar,
  onOk,
  onOlvide,
}: {
  open: boolean
  onOpenChange: (o: boolean) => void
  verificar: (clave: string) => Promise<boolean>
  onOk: () => void
  onOlvide: () => void
}) {
  const [clave, setClave] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  function change(o: boolean) {
    if (!o) {
      setClave('')
      setError(null)
    }
    onOpenChange(o)
  }

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!clave) return setError('Debe ingresar la contraseña.')
    setLoading(true)
    try {
      if (await verificar(clave)) {
        change(false)
        onOk()
      } else setError('Contraseña incorrecta.')
    } catch {
      setError('Error al verificar la contraseña.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={change}>
      <DialogContent className="sm:max-w-sm">
        <form onSubmit={submit} className="grid gap-4">
          <DialogHeader>
            <DialogTitle>Autorización</DialogTitle>
            <DialogDescription>Ingrese su contraseña maestra para habilitar la edición.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-2">
            <Label htmlFor="uf-clave">Contraseña maestra</Label>
            <Input id="uf-clave" type="password" placeholder="****" autoFocus value={clave} aria-invalid={!!error} onChange={(e) => { setClave(e.target.value); setError(null) }} />
            <FieldError>{error}</FieldError>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <LoaderCircle className="animate-spin" /> : <KeyRound />}
            Verificar y desbloquear
          </Button>
          <Button type="button" variant="link" size="sm" className="mx-auto" onClick={() => { change(false); onOlvide() }}>
            Olvidé mi contraseña maestra
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

/* ------------------------------------------------------ Configurar contraseña */
export function ConfigurarClaveDialog({
  open,
  onOpenChange,
  tieneClave,
  verificar,
  guardar,
}: {
  open: boolean
  onOpenChange: (o: boolean) => void
  tieneClave: boolean
  verificar: (clave: string) => Promise<boolean>
  guardar: (clave: string) => Promise<void>
}) {
  const [actual, setActual] = useState('')
  const [nueva, setNueva] = useState('')
  const [repetir, setRepetir] = useState('')
  const [errores, setErrores] = useState<{ actual?: string; repetir?: string }>({})
  const [loading, setLoading] = useState(false)

  function change(o: boolean) {
    if (!o) {
      setActual('')
      setNueva('')
      setRepetir('')
      setErrores({})
    }
    onOpenChange(o)
  }

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (tieneClave && !actual) return setErrores({ actual: 'Debe ingresar la contraseña actual.' })
    if (!nueva || !repetir) return setErrores({ repetir: 'Debe ingresar y repetir la nueva contraseña.' })
    if (nueva !== repetir) return setErrores({ repetir: 'Las contraseñas no coinciden.' })
    setLoading(true)
    try {
      if (tieneClave && !(await verificar(actual))) return setErrores({ actual: 'Contraseña actual incorrecta.' })
      await guardar(nueva)
      change(false)
    } catch {
      setErrores({ actual: 'No se pudo verificar la contraseña actual.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={change}>
      <DialogContent className="sm:max-w-sm">
        <form onSubmit={submit} className="grid gap-4">
          <DialogHeader>
            <DialogTitle>Configurar contraseña maestra</DialogTitle>
            <DialogDescription>
              {tieneClave ? 'Esta administración ya tiene una contraseña maestra configurada.' : 'No existe contraseña maestra configurada.'}
            </DialogDescription>
          </DialogHeader>
          <Alert className="border-info/30 bg-info/5 text-info">
            <AlertDescription className="text-info">
              {tieneClave
                ? 'Para modificar la contraseña maestra, ingrese primero la contraseña actual.'
                : 'Cree una contraseña maestra para poder habilitar la edición de UF.'}
            </AlertDescription>
          </Alert>
          {tieneClave ? (
            <div className="grid gap-2">
              <Label htmlFor="uf-actual">Contraseña actual</Label>
              <Input id="uf-actual" type="password" placeholder="Contraseña actual" value={actual} aria-invalid={!!errores.actual} onChange={(e) => setActual(e.target.value)} />
              <FieldError>{errores.actual}</FieldError>
            </div>
          ) : null}
          <div className="grid gap-2">
            <Label htmlFor="uf-nueva">Nueva contraseña</Label>
            <Input id="uf-nueva" type="password" placeholder="Nueva contraseña" value={nueva} aria-invalid={!!errores.repetir} onChange={(e) => setNueva(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="uf-repetir">Repetir nueva contraseña</Label>
            <Input id="uf-repetir" type="password" placeholder="Repetir nueva contraseña" value={repetir} aria-invalid={!!errores.repetir} onChange={(e) => setRepetir(e.target.value)} />
            <FieldError>{errores.repetir}</FieldError>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <LoaderCircle className="animate-spin" /> : null}
            Guardar contraseña
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

/* ------------------------------------------------------ Recuperar contraseña */
export function RecuperarClaveDialog({
  open,
  onOpenChange,
  correo,
  esAdmin,
  onEnviada,
}: {
  open: boolean
  onOpenChange: (o: boolean) => void
  correo: string | null
  esAdmin: boolean
  onEnviada: () => void
}) {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function enviar() {
    if (!esAdmin) return setError('Solo el perfil administrador puede recuperar la contraseña UF. Debe contactarse con el administrador del sistema.')
    if (!correo) return setError('No se encontró correo de usuario en sesión.')
    setLoading(true)
    await wait(600)
    setLoading(false)
    onOpenChange(false)
    onEnviada()
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) setError(null); onOpenChange(o) }}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Recuperar contraseña UF</DialogTitle>
          <DialogDescription>Se generará una nueva contraseña temporal para la configuración UF.</DialogDescription>
        </DialogHeader>
        <Alert className="border-info/30 bg-info/5">
          <Mail className="text-info" />
          <AlertDescription>
            La contraseña será enviada al correo: <strong className="text-foreground">{correo}</strong>
          </AlertDescription>
        </Alert>
        {error ? (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}
        <DialogFooter className="flex-col gap-2 sm:flex-col">
          <Button className="w-full" onClick={enviar} disabled={loading}>
            {loading ? <LoaderCircle className="animate-spin" /> : <Send />}
            {loading ? 'Enviando...' : 'Enviar contraseña temporal'}
          </Button>
          <Button variant="outline" className="w-full" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

/* ----------------------------------------------------------------- Bienvenida */
export function BienvenidaDialog({
  open,
  onOpenChange,
  estatico,
}: {
  open: boolean
  onOpenChange: (o: boolean) => void
  /** Sin clave configurada: no se cierra con X, Esc ni clic fuera. */
  estatico: boolean
}) {
  const items = [
    <>Esta sección está diseñada para administradores que trabajan con presupuestos en UF.</>,
    <>
      Desde aquí puede registrar un valor UF por período y centralizarlo para todas sus comunidades. Este valor será
      utilizado por Kastor para generar el <strong>reporte de control presupuestario en UF.</strong>
    </>,
    <>
      Solo los usuarios con perfil <strong>ADMIN</strong> pueden ingresar o modificar valores. Para hacerlo, primero
      deben crear una contraseña desde el botón <strong>Crear contraseña</strong>
    </>,
  ]
  return (
    <Dialog open={open} onOpenChange={(o) => (!estatico || o ? onOpenChange(o) : undefined)}>
      <DialogContent
        className="gap-0 overflow-hidden p-0 sm:max-w-[420px]"
        showCloseButton={!estatico}
        onEscapeKeyDown={(e) => estatico && e.preventDefault()}
        onPointerDownOutside={(e) => estatico && e.preventDefault()}
      >
        <DialogHeader className="bg-brand-orange px-6 py-4">
          <DialogTitle className="text-white">Bienvenido al configurador de UF</DialogTitle>
          <DialogDescription className="sr-only">Información sobre el configurador de UF</DialogDescription>
        </DialogHeader>
        <ol className="grid gap-4 px-6 py-5">
          {items.map((t, i) => (
            <li key={i} className="flex gap-3 text-sm leading-relaxed">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-orange/10 text-xs font-semibold text-brand-orange">
                {i + 1}
              </span>
              <span>{t}</span>
            </li>
          ))}
        </ol>
        <div className="px-6 pb-6">
          <Button className="w-full" onClick={() => onOpenChange(false)}>
            Continuar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
