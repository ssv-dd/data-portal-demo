import { useCallback, useLayoutEffect, useRef, useState } from 'react'

interface ContainerSize {
  readonly width: number
  readonly height: number
}

/**
 * Tracks the pixel dimensions of a container element via ResizeObserver.
 * More reliable than Recharts' built-in ResponsiveContainer for
 * cases where the parent layout changes (e.g. sidebar collapse).
 */
export function useContainerSize(
  fallbackWidth = 600,
  fallbackHeight = 400
): { ref: React.RefObject<HTMLDivElement | null>; width: number; height: number } {
  const ref = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState<ContainerSize>({
    width: fallbackWidth,
    height: fallbackHeight,
  })

  const measure = useCallback(() => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const w = Math.floor(rect.width)
    const h = Math.floor(rect.height)
    if (w > 0 && h > 0) {
      setSize((prev) => (prev.width === w && prev.height === h ? prev : { width: w, height: h }))
    }
  }, [])

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return

    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [measure])

  return { ref, ...size }
}
