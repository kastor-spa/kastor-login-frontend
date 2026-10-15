---
name: mapear-modulo
description: Mapea un módulo del sistema legacy Kastor desde evidencia frontend (capturas o HTML guardado en docs/referencias/<slug>/) usando el agente front-mapper, y deja docs/mapas/MAPA-<slug>.md listo para implementar la vista en React + shadcn. Úsala cuando Héctor pida mapear, levantar o documentar un módulo (Usuarios, Sistema Cobranza, Perfiles, Tareas, UF, Facturas) o entregue capturas de una pantalla.
---

# Mapear módulo (frontend only)

Argumento esperado: `<slug>` del módulo, igual al `slug` en `src/config/navigation.ts` (ej. `usuarios`, `sistema-cobranza`, `facturas-kastor`).

## Pasos

1. Verifica evidencia en `docs/referencias/<slug>/`. Si el usuario pegó imágenes en el chat, guárdalas ahí primero (copiar desde la ruta temporal de la imagen) para que queden en el repo.
2. Si no hay evidencia, no mapees: pide al usuario capturas de (a) el listado completo, (b) el formulario de alta/edición, (c) cualquier modal o confirmación, y (d) los estados de alerta. Opcionalmente el HTML guardado con "Guardar como... página completa".
3. Lanza el agente `front-mapper` con el slug y la ruta de la evidencia. No leas backend ni entres al sistema.
4. Revisa el `MAPA-<slug>.md` resultante y confirma que `src/config/navigation.ts` quedó con `status: 'mapeado'`.
5. Si el usuario pide construir la vista: crea `src/pages/<slug>.tsx` con `<Core>`, `<CoreHeader>` y `<CoreBody>`, datos mock en `src/data/<slug>.ts`, y registra la ruta en `src/App.tsx`. Agrega componentes shadcn que falten con `npx shadcn@latest add <componente>`.
6. Ejecuta `npx tsc -b` y `npm run lint` antes de reportar.

## Reglas

- Solo frontend. Nada de PHP, SQL, controladores ni `.ctp`.
- Nunca iniciar sesión ni navegar dentro de upselling.kastor.cl.
- Colores y fuentes siempre por token (`DESIGN-SYSTEM.md`), iconos siempre lucide.
