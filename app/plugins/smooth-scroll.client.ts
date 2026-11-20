import Lenis from 'lenis'

export default defineNuxtPlugin(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return {}

  const lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1 })
  let raf = 0
  const loop = (t: number) => { lenis.raf(t); raf = requestAnimationFrame(loop) }
  raf = requestAnimationFrame(loop)

  // In-page anchors glide to their section, leaving room for the navbar.
  document.addEventListener('click', (e) => {
    const a = (e.target as Element).closest?.('a[href^="#"]') as HTMLAnchorElement | null
    if (!a) return
    const hash = a.getAttribute('href')!
    e.preventDefault()
    if (hash === '#' || hash === '#main') return void lenis.scrollTo(0)
    const target = document.querySelector(hash) as HTMLElement | null
    if (target) {
      lenis.scrollTo(target, { offset: -72 })
      history.replaceState(null, '', hash)
    }
  })

  return { provide: { lenis, stopLenis: () => cancelAnimationFrame(raf) } }
})
