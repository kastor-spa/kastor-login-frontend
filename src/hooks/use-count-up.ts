import { useEffect, useRef, useState } from 'react'

const easeOutCubic = (t: number) => 1 - (1 - t) ** 3

/**
 * Anima un valor numérico desde su valor anterior (0 al montar) hasta `target`.
 * Respeta prefers-reduced-motion: en ese caso devuelve el valor final de inmediato.
 */
export function useCountUp(target: number | null, duration = 700) {
  const [value, setValue] = useState(target === null ? null : 0)
  const fromRef = useRef(0)

  useEffect(() => {
    if (target === null) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const from = fromRef.current
    if (reduced || from === target) {
      fromRef.current = target
      setValue(target)
      return
    }

    let frame = 0
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1)
      const current = Math.round(from + (target - from) * easeOutCubic(t))
      fromRef.current = current
      setValue(current)
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [target, duration])

  return value
}
