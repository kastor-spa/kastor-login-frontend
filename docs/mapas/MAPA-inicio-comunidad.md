# MAPA-inicio-comunidad: Home de la comunidad (Kastor Contable)

- **Ruta propuesta:** `/comunidades/:id`
- **Categoría en navegación:** Kastor Contable › Inicio (sidebar de comunidad)
- **Evidencia:** `docs/referencias/inicio-comunidad/01-home.png` (Administradora Acodef Ltda, 77.834.007-0)
- **Fecha de mapeo:** 2026-10-15
- **Estado:** parcial

## 1. Propósito
Portada de la comunidad: indicadores de gasto común del período y espacio de banners comerciales.

## 2. Elementos del legacy → propuesta (bento)
| Legacy | Texto exacto | Propuesta |
|---|---|---|
| Filtro superior | "Información a mostrar:" · "Todos" | Select en acciones del CoreHeader |
| Título | "Indicadores de la comunidad" | Título del CoreHeader |
| Card incidencia | "Incidencia de Gasto Común" · "Mes:" · "Año:" · "Total Gasto Común $76.818.833" | Celda con 2 Select + total con conteo animado |
| Gráfico dona + leyenda | GASTOS OFICINA, GASTOS ADMINISTRACION, GASTOS NO OPERACIONALES, GASTOS OPERACIONALES, GASTOS RRHH, Remuneraciones (monto + %) | Dona SVG interactiva + leyenda tabla (monto y %) |
| Botón descarga del gráfico | icono descarga | Descarga CSV de los datos |
| Banner 1 | "COTIZA EL SEGURO DE TU COMUNIDAD" · "¡Con precios y beneficios preferenciales!" | BannerSeguro |
| Banner 2 | "Facilita el Registro de Copropietarios" · "Tus residentes ahora pueden crear su cuenta directamente desde la app." · "Mira el tutorial" · "y compártelo con tus comunidades" | BannerRegistro |
| Banner 3 | "¿Aún concilias a mano?" · "Tu banco puede estar en Kastor automáticamente con Fintoc." · "Escribe a comercial@kastor.cl y pide 1 mes gratis" | BannerConciliacion (mailto) |

Agregado en la propuesta (datos ya existentes en la card del listado): celda "Estado de la comunidad".

## 3. Pendiente de confirmar
- Opciones de "Información a mostrar" (solo se ve "Todos").
- Qué descarga el botón del gráfico en el legacy (imagen o datos); se implementó CSV.
- Destino de "Cotiza el seguro" y "Mira el tutorial".
- Rango de años disponible en el filtro (se usó 2024–2026).
- Montos de otros meses/comunidades: mock derivado de la captura (Marzo 2026).
- Burbuja de chat flotante (esquina inferior derecha): no incluida.
