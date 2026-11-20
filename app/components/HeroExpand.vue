<script setup lang="ts">
import { stagger } from '#nanime/utils'

const ready = useState('foundry-ready', () => false)
const stage = ref<HTMLElement | null>(null)
const heading = ref<HTMLElement | null>(null)
const subcopy = ref<HTMLElement | null>(null)
const cta = ref<HTMLElement | null>(null)

// One orchestrated page-load moment: monumental headline reveals char-by-char, followed by copy & CTA.
const { chars } = useSplitText(heading, { chars: true })
const intro = useAnimeTimeline({ autoplay: false })
intro
  .add(chars, { opacity: [0, 1], y: ['0.35em', 0], duration: 550, delay: stagger(32), ease: 'outCubic' }, 0)
  .add(() => [subcopy.value, cta.value].filter(Boolean) as HTMLElement[], {
    opacity: [0, 1],
    y: ['1rem', 0],
    duration: 500,
    delay: stagger(90),
    ease: 'outCubic',
  }, 320)

watch(ready, (r) => { if (r) intro.play() }, { immediate: true })

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
  <section
    ref="stage"
    class="hero-stage relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 pt-24 pb-20"
    @pointermove="onMove"
  >
    <HeroEmbers />

    <div class="relative z-10 mx-auto flex max-w-6xl flex-col items-center text-center">
      <h1
        ref="heading"
        v-once
        aria-label="Forged in code"
        class="hero-title font-display font-normal text-white"
      >
        Forged<br>in code
      </h1>

      <p
        ref="subcopy"
        class="mx-auto mt-8 max-w-lg text-base leading-relaxed text-white/65 sm:text-lg"
      >
        Foundry is a software studio. We melt raw ideas down and cast them as products that last.
      </p>

      <div ref="cta" class="mt-10">
        <a
          v-magnetic="0.4"
          href="#work"
          class="inline-flex items-center justify-center rounded-lg bg-accent px-6 py-3 text-sm font-medium text-black transition-transform active:scale-95"
        >
          See our work
        </a>
      </div>
    </div>

    <a
      href="#work"
      aria-label="Scroll to work"
      class="absolute bottom-8 z-10 flex flex-col items-center gap-2 text-white/40 transition-colors hover:text-white/80"
    >
      <span class="h-10 w-px bg-gradient-to-b from-current to-transparent" aria-hidden="true" />
    </a>
  </section>
</template>

<style scoped>
.hero-stage {
  background:
    radial-gradient(620px circle at var(--hx, 50%) var(--hy, 55%), rgb(255 122 26 / 0.14), transparent 70%),
    radial-gradient(ellipse 58% 42% at 50% 56%, rgb(255 122 26 / 0.09), transparent 75%);
}

.hero-title {
  font-size: clamp(3.25rem, 11.5vw, 9.5rem);
  line-height: 0.94;
  letter-spacing: -0.045em;
  text-shadow: 0 0 80px rgb(255 122 26 / 0.18);
}
</style>
