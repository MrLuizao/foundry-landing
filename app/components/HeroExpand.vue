<script setup lang="ts">
import { stagger } from '#nanime/utils'

const ready = useState('foundry-ready', () => false)
const section = ref<HTMLElement | null>(null)
const stage = ref<HTMLElement | null>(null)
const heading = ref<HTMLElement | null>(null)

// One page-load moment: the headline types in once the preloader is done.
const { chars } = useSplitText(heading, { chars: true })
const intro = useAnimeTimeline({ autoplay: false })
intro.add(chars, { opacity: [0, 1], y: ['0.4em', 0], duration: 500, delay: stagger(35) }, 0)
watch(ready, (r) => { if (r) intro.play() }, { immediate: true })

// Scroll progress (0 → 1) drives the "unpacking" through CSS variables on the stage.
// The card, its artwork and the copy all derive from --p, so they always stay in sync.
onMounted(() => {
  let raf = 0
  const update = () => {
    raf = 0
    const s = section.value
    const st = stage.value
    if (!s || !st) return
    const r = s.getBoundingClientRect()
    const span = r.height - window.innerHeight
    const raw = span > 0 ? Math.min(Math.max(-r.top / span, 0), 1) : 0
    const p = raw * raw * (3 - 2 * raw) // smoothstep
    st.style.setProperty('--p', p.toFixed(4))
  }
  const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll)
  update()
  onBeforeUnmount(() => {
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('resize', onScroll)
    if (raf) cancelAnimationFrame(raf)
  })
})

// Heat follows the pointer.
function onMove(e: PointerEvent) {
  const s = stage.value
  if (!s) return
  const r = s.getBoundingClientRect()
  s.style.setProperty('--hx', `${e.clientX - r.left}px`)
  s.style.setProperty('--hy', `${e.clientY - r.top}px`)
}
</script>

<template>
  <section ref="section" class="relative h-[300vh]">
    <div
      ref="stage"
      class="hero-stage sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden px-6"
      style="--p: 0; background: radial-gradient(520px circle at var(--hx, 50%) var(--hy, 60%), rgb(255 122 26 / 0.16), transparent 70%)"
      @pointermove="onMove"
    >
      <HeroEmbers />

      <!-- The card starts small and tilted, then unpacks to the gallery width. -->
      <div class="hero-card absolute overflow-hidden" data-cursor="Scroll">
        <div class="hero-art h-full w-full">
          <ArtCard :variant="0" class="h-full w-full !rounded-none" label="Idea → Product" />
        </div>
      </div>

      <div class="hero-copy relative z-10 text-center">
        <h1 ref="heading" v-once aria-label="Forged in code" class="font-display text-5xl font-normal leading-tight mix-blend-difference sm:text-7xl">Forged in code</h1>
        <p class="mx-auto mt-4 max-w-md text-sm text-white/80 mix-blend-difference sm:text-base">
          Foundry is a software studio. We melt raw ideas down and cast them as products that last.
        </p>
        <a v-magnetic="0.4" href="#work" class="mt-8 inline-block rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-black">See our work</a>
      </div>

      <p class="hero-hint absolute bottom-8 font-display text-[11px] tracking-[0.3em] text-white/50" aria-hidden="true">SCROLL TO UNPACK</p>
    </div>
  </section>
</template>

<style scoped>
.hero-card {
  width: calc(18rem + (min(100vw - 3rem, 64rem) - 18rem) * var(--p));
  height: calc(22rem + (62vh - 22rem) * var(--p));
  border-radius: calc(1.75rem - 0.5rem * var(--p));
  transform: rotate(calc((1 - var(--p)) * -5deg));
  will-change: width, height, transform;
}
.hero-art {
  transform: scale(calc(1.45 - 0.45 * var(--p)));
  will-change: transform;
}
/* Copy lifts away during the first half so the unpacked card is fully visible. */
.hero-copy {
  opacity: clamp(0, calc(1 - var(--p) * 2.2), 1);
  transform: translateY(calc(var(--p) * -4rem));
  pointer-events: auto;
}
.hero-hint { opacity: clamp(0, calc(1 - var(--p) * 6), 1); }

@media (prefers-reduced-motion: reduce) {
  .hero-card, .hero-art, .hero-copy { transition: none; }
}
</style>
