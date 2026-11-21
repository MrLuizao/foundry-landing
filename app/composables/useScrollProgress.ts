import type { Ref } from 'vue'

export interface ScrollProgressOptions {
  /** 'sticky': tracks progress while a tall sticky section scrolls past the viewport.
   *  'enter': tracks progress as a section enters from the bottom to the center of the viewport.
   *  'through': tracks continuous progress (0 → 1) from entering bottom to exiting top (ideal for parallax). */
  mode?: 'sticky' | 'enter' | 'through'
  /** Optional target element to receive `--p`. Defaults to the observed section element. */
  target?: Ref<HTMLElement | null>
  /** Fraction of viewport height over which 'enter' reaches 1. Default: 0.82. */
  enterSpan?: number
  /** Apply smoothstep easing. Defaults to true for enter/sticky, false for linear parallax 'through'. */
  smooth?: boolean
}

/**
 * Scrubs a CSS custom property `--p` (0 → 1) on scroll via rAF.
 * Reversible on scroll-up, zero Vue re-renders per frame, respects prefers-reduced-motion.
 */
export function useScrollProgress(
  section: Ref<HTMLElement | null>,
  options: ScrollProgressOptions = {},
) {
  const mode = options.mode ?? 'enter'
  const enterSpan = options.enterSpan ?? 0.82
  const smooth = options.smooth ?? (mode !== 'through')
  const progress = ref(0)

  onMounted(() => {
    const targetEl = () => options.target?.value ?? section.value
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reduced) {
      const rest = mode === 'through' ? 0.5 : 1
      progress.value = rest
      targetEl()?.style.setProperty('--p', String(rest))
      return
    }

    let raf = 0
    const update = () => {
      raf = 0
      const s = section.value
      const t = targetEl()
      if (!s || !t) return

      const r = s.getBoundingClientRect()
      const vh = window.innerHeight || 1
      let raw = 0

      if (mode === 'sticky') {
        const span = r.height - vh
        raw = span > 0 ? Math.min(Math.max(-r.top / span, 0), 1) : 1
      }
      else if (mode === 'through') {
        const span = vh + r.height
        raw = span > 0 ? Math.min(Math.max((vh - r.top) / span, 0), 1) : 0.5
      }
      else {
        const span = vh * enterSpan
        raw = span > 0 ? Math.min(Math.max((vh - r.top) / span, 0), 1) : 1
      }

      const p = smooth ? raw * raw * (3 - 2 * raw) : raw
      progress.value = p
      t.style.setProperty('--p', p.toFixed(4))
    }

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    update()

    onBeforeUnmount(() => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    })
  })

  return { progress }
}
