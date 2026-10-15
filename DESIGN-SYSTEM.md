# Sistema visual Kastor (mapeado desde upselling.kastor.cl/login)

Fuente: `https://upselling.kastor.cl/login/` (HTML + `/login/resources/styles/main2.css`, versión 20260907b).
Solo se inspeccionó la pantalla pública de login. No se navegó dentro del sistema.

## Assets

| Asset | Origen | En este repo |
|---|---|---|
| Logo | `https://assets.kastor.cl/images/logo-kastor.png` (250x85) | `public/logo-kastor.png` |
| Banner login | `/login/img/Banner-7sept-2026.png` (1300x1360, incluye franja morado/naranja) | `public/login-hero.png` |
| Favicon | `repositorio.kastor.cl/.../icono.ico` (no accesible, respondió 500) | `public/favicon.svg` (recreado) |

## Tipografías

| Uso en legacy | Familia | Token Tailwind |
|---|---|---|
| UI del sistema (navbar, títulos, botones `.btn-k`) | Source Sans Pro | `font-sans` (Source Sans 3 Variable) |
| Títulos hero login (`.banner-log-titulo`, CTA) | Montserrat 600/700 | `font-heading` |
| Párrafos login, botón Ingresar | Roboto 400/500 | `font-body` |
| "Bienvenido" / "Iniciar sesión" (`.line-title`) | Raleway 300/400 | `font-display` |

## Paleta (hex exactos de main2.css)

| Token | Hex | Clase legacy |
|---|---|---|
| `--brand-orange` | `#F97A4D` | `.banner-log-cta`, `.btn-warning.submit` |
| `--brand-orange-hover` | `#E66B40` | hover de los anteriores |
| `--brand-orange-legacy` | `#EF7D00` | `.bg-orange`, `.btn-k-two`, `.txt-orange` |
| `--brand-orange-disabled` | `#E6AA76` | `.btn-k-two:disabled` |
| `--brand-purple` | `#6640DF` | `.banner-log-titulo` |
| `--brand-darkblue` | `#364155` | `.bg-darkblue`, hover de `.box-modulo` |
| `--brand-gray` | `#55585A` | `.txt-gray`, `.titulo-comunidad` |
| `--foreground` | `#393939` | `.txt-gray-dos` |
| `--brand-lightgray` | `#C0C9D3` | `.bg-ligthgray-two` (encabezado de card inactiva) |
| `--border` | `#DFE2E6` | `.bg-ligthgray-three` |
| `--muted` | `#F6F6F6` | `.box-modulo` |
| `--sidebar` / `--accent` | `#FDFDFE` | `.bg-ligthgray-one` |
| `--input` | `#CED4DA` | bordes de `.form-control` |
| `--chart-4` | `#616D89` | `.txt-blue` |
| `--success` | `#28A745` | `.bg-success` |
| `--warning` | `#FFC107` | `.txt-warning` |
| `--info` | `#007BFF` | `.txt-confirm` |
| `--destructive` | `#DC3545` | `.bg-alert` |

Todos viven en `src/index.css` y se exponen a Tailwind vía `@theme inline` (`bg-brand-orange`, `text-brand-darkblue`, `bg-success`, etc.).

## Login (estructura legacy → React)

- Grid 50/50 desde 768px (`.fila-log`). Formulario centrado, `max-width: 480px`, padding `30px 5%`.
- Logo 140px → `Bienvenido` (Raleway 40px, margin-top 26px) → `Iniciar sesión` (Raleway 16px, gris).
- Inputs sin label visible, placeholders "Correo electrónico" / "Contraseña". Botón `Ingresar` naranja `#F97A4D`, Roboto.
- Link "¿Olvidó su contraseña?" alterna a modo recuperación (oculta contraseña, botón pasa a "Recuperar", link a "Volver").
- Banner: fondo `background-size: cover; position: left top`. Texto absoluto abajo-derecha, padding `0 7% 10% 12%`, alineado a la derecha, tamaños fluidos con `clamp()`.
- CTA enlaza a `https://wa.me/56988341428`.
