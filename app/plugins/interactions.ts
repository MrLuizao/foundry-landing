import type { Directive } from 'vue'

const canHover = () => typeof window !== 'undefined'
  && window.matchMedia('(hover: hover) and (pointer: fine)').matches
  && !window.matchMedia('(prefers-reduced-motion: reduce)').matches

type Cleanup = { off: () => void }
const store = new WeakMap<HTMLElement, Cleanup>()

/** v-magnetic: element drifts toward the pointer while it is nearby. */
const magnetic: Directive<HTMLElement, number | undefined> = {
  mounted(el, { value }) {
    if (!canHover()) return
    const strength = value ?? 0.3
    el.setAttribute('data-magnetic', '')
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      const x = e.clientX - (r.left + r.width / 2)
      const y = e.clientY - (r.top + r.height / 2)
      el.style.transform = `translate(${x * strength}px, ${y * strength}px)`
    }
    const leave = () => { el.style.transform = '' }
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerleave', leave)
    store.set(el, { off: () => { el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave) } })
  },
  unmounted(el) { store.get(el)?.off() },
  getSSRProps: () => ({}),
}

/** v-tilt: 3D tilt that follows the pointer, plus a moving highlight. */
const tilt: Directive<HTMLElement, number | undefined> = {
  mounted(el, { value }) {
    if (!canHover()) return
    const max = value ?? 8
    el.setAttribute('data-tilt', '')
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      const px = (e.clientX - r.left) / r.width
      const py = (e.clientY - r.top) / r.height
      el.style.setProperty('--ry', `${(px - 0.5) * 2 * max}deg`)
      el.style.setProperty('--rx', `${-(py - 0.5) * 2 * max}deg`)
      el.style.setProperty('--mx', `${px * 100}%`)
      el.style.setProperty('--my', `${py * 100}%`)
      el.style.setProperty('--glow', '1')
    }
    const leave = () => {
      el.style.setProperty('--rx', '0deg')
      el.style.setProperty('--ry', '0deg')
      el.style.setProperty('--glow', '0')
    }
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerleave', leave)
    store.set(el, { off: () => { el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave) } })
  },
  unmounted(el) { store.get(el)?.off() },
  getSSRProps: () => ({}),
}

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('magnetic', magnetic)
  nuxtApp.vueApp.directive('tilt', tilt)
})
