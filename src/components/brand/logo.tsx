import { cn } from '@/lib/utils'

/** Logotipo oficial Kastor (assets.kastor.cl/images/logo-kastor.png, 250x85). */
export function KastorLogo({ className, width = 140 }: { className?: string; width?: number }) {
  return (
    <img
      src="/logo-kastor.png"
      alt="Kastor"
      width={width}
      height={Math.round((width * 85) / 250)}
      className={cn('block select-none', className)}
      draggable={false}
    />
  )
}
