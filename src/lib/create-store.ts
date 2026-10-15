import { useSyncExternalStore } from 'react'

/**
 * Store mínimo en memoria para compartir datos mock entre páginas (ej. listado y formulario).
 * Se reemplaza por llamadas reales al integrar backend.
 */
export function createStore<T>(initial: T) {
  let state = initial
  const listeners = new Set<() => void>()
  const get = () => state
  const set = (next: T | ((prev: T) => T)) => {
    state = typeof next === 'function' ? (next as (p: T) => T)(state) : next
    listeners.forEach((l) => l())
  }
  const subscribe = (l: () => void) => {
    listeners.add(l)
    return () => listeners.delete(l)
  }
  const useStore = () => useSyncExternalStore(subscribe, get, get)
  return { get, set, useStore }
}
