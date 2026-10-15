import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { LoaderCircle } from 'lucide-react'
import { KastorLogo } from '@/components/brand/logo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

/**
 * Login replicado desde upselling.kastor.cl/login (main2.css, bloque "banner-log").
 * - Izquierda: logo 140px, "Bienvenido" Raleway 40, "Iniciar sesión" Raleway 16, form.
 * - Derecha: banner PNG (incluye franja morado/naranja), texto Montserrat/Roboto abajo-derecha.
 */
export function LoginPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [recover, setRecover] = useState(false)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    // Simulación: reemplazar por llamada real de autenticación.
    window.setTimeout(() => {
      setLoading(false)
      if (!recover) navigate('/bienvenida')
    }, 600)
  }

  return (
    <div className="grid min-h-svh bg-background md:grid-cols-2">
      {/* Columna izquierda: formulario */}
      <div className="flex items-center justify-center px-[5%] py-8">
        <div className="w-full max-w-[480px]">
          <KastorLogo width={140} />

          <h1 className="mt-[26px] font-heading text-[40px] font-light leading-none text-foreground">
            Bienvenido
          </h1>
          <h2 className="mt-[11px] font-heading text-base font-normal text-brand-gray">
            {recover ? 'Recuperar contraseña' : 'Iniciar sesión'}
          </h2>

          <form onSubmit={handleSubmit} className="mt-6 grid gap-[15px]">
            <div className="grid gap-1.5">
              <Label htmlFor="email" className="sr-only">
                Correo electrónico
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Correo electrónico"
                autoComplete="email"
                required
                className="h-[34px] rounded-[4px] bg-white"
              />
            </div>
            {!recover ? (
              <div className="grid gap-1.5">
                <Label htmlFor="password" className="sr-only">
                  Contraseña
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Contraseña"
                  autoComplete="current-password"
                  required
                  className="h-[34px] rounded-[4px] bg-white"
                />
              </div>
            ) : null}

            <Button
              type="submit"
              className="h-[34px] w-full rounded-[4px] bg-brand-orange font-sans text-sm font-normal hover:bg-brand-orange-hover"
              disabled={loading}
            >
              {loading ? <LoaderCircle className="animate-spin" /> : null}
              {recover ? 'Recuperar' : 'Ingresar'}
            </Button>

            <button
              type="button"
              onClick={() => setRecover((v) => !v)}
              className="-mt-2 w-fit text-xs text-info underline-offset-4 hover:underline"
            >
              {recover ? 'Volver' : '¿Olvidó su contraseña?'}
            </button>
          </form>
        </div>
      </div>

      {/* Columna derecha: banner "Tu banco directo en Kastor" */}
      <div
        className="relative hidden min-h-svh overflow-hidden bg-[#F4F4F5] bg-cover bg-left-top bg-no-repeat md:block"
        style={{ backgroundImage: 'url(/login-hero.png)' }}
      >
        <div className="absolute inset-x-0 bottom-0 pb-[10%] pl-[12%] pr-[7%] text-right">
          <h2 className="font-heading text-[clamp(22px,2.3vw,36px)] font-bold leading-[1.2] text-brand-purple">
            Tu banco directo en Kastor
          </h2>
          <h3 className="ml-auto mt-2.5 max-w-[420px] font-heading text-[clamp(16px,1.7vw,27px)] font-semibold leading-[1.3] text-brand-orange">
            Conecta tu cuenta bancaria y concilia en automático
          </h3>
          <p className="ml-auto mt-6 max-w-[420px] font-sans text-[clamp(13px,1.3vw,20px)] leading-[1.45] text-brand-gray">
            Sin descargar cartolas, sin digitar datos, sin errores. Los movimientos de tu banco
            aparecen solos y el sistema sugiere el match por ti.
          </p>
          <a
            href="https://wa.me/56988341428"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-block rounded-lg bg-brand-orange px-[1.3em] py-[0.9em] font-heading text-[clamp(14px,1.4vw,22px)] font-semibold leading-none text-white transition-colors hover:bg-brand-orange-hover"
          >
            Solicita el primer mes gratis <span className="ml-2 inline-block">&rarr;</span>
          </a>
        </div>
      </div>
    </div>
  )
}
