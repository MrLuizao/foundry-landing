<script setup lang="ts">
import { stagger } from '#nanime/utils'

const { t } = useI18n()
const ready = useState('fundere-ready', () => false)
const stage = ref<HTMLElement | null>(null)
const heading = ref<HTMLElement | null>(null)
const subcopy = ref<HTMLElement | null>(null)
const subline = ref<HTMLElement | null>(null)

// One orchestrated page-load moment: monumental headline reveals char-by-char, followed by studio tag & word-by-word statement.
const { chars } = useSplitText(heading, { chars: true })
const { words } = useSplitText(subline, { words: true })
const intro = useAnimeTimeline({ autoplay: false })
intro
  .add(chars, { opacity: [0, 1], y: ['0.35em', 0], duration: 550, delay: stagger(32), ease: 'outCubic' }, 0)
  .add(() => (subcopy.value ? [subcopy.value] : []), {
    opacity: [0, 1],
    y: ['0.75rem', 0],
    duration: 500,
    ease: 'outCubic',
  }, 280)
  .add(words, {
    opacity: [0, 1],
    y: ['1.15rem', 0],
    filter: ['blur(8px)', 'blur(0px)'],
    duration: 620,
    delay: stagger(45),
    ease: 'outExpo',
  }, 420)

watch(ready, (r) => { if (r) intro.play() }, { immediate: true })

// Scroll parallax (0 → 1 as hero exits the viewport)
onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  let raf = 0
  const update = () => {
    raf = 0
    const s = stage.value
    if (!s) return
    const r = s.getBoundingClientRect()
    const p = r.height > 0 ? Math.min(Math.max(-r.top / r.height, 0), 1) : 0
    s.style.setProperty('--scroll', p.toFixed(4))
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

// Heat + subtle 3D depth parallax follow the pointer.
function onMove(e: PointerEvent) {
  const s = stage.value
  if (!s) return
  const r = s.getBoundingClientRect()
  const x = e.clientX - r.left
  const y = e.clientY - r.top
  s.style.setProperty('--hx', `${x}px`)
  s.style.setProperty('--hy', `${y}px`)
  s.style.setProperty('--px', (((x / (r.width || 1)) - 0.5) * 2).toFixed(4))
  s.style.setProperty('--py', (((y / (r.height || 1)) - 0.5) * 2).toFixed(4))
}

function onLeave() {
  const s = stage.value
  if (!s) return
  s.style.setProperty('--px', '0')
  s.style.setProperty('--py', '0')
}
</script>

<template>
  <section id="home" ref="stage"
    class="hero-stage relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-4 pt-24 pb-20 sm:px-6"
    style="--scroll: 0; --px: 0; --py: 0" @pointermove="onMove" @pointerleave="onLeave">
    <HeroEmbers />

    <div class="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center text-center">
      <!-- Layer 1: Monumental title (strongest scroll + pointer parallax) -->
      <div class="parallax-title-scroll">
        <div class="parallax-title-pointer">
          <h1 ref="heading" :aria-label="t.hero.ariaLabel" class="hero-title font-display font-normal text-white">
            {{ t.hero.titleLine1 }}<br>{{ t.hero.titleLine2 }}
          </h1>
        </div>
      </div>

      <!-- Layer 2: Subtitle (medium parallax depth) -->
      <div class="parallax-sub-scroll">
        <div class="parallax-sub-pointer mt-14 flex max-w-5xl flex-col items-center gap-4 sm:mt-16">
          <p ref="subcopy" class="font-display text-[clamp(1.1rem,3.8vw,3.5rem)] font-bold uppercase leading-none tracking-tight text-white/80 sm:whitespace-nowrap">
            <span class="text-accent">FUNDERE</span>
            <span class="mx-2 text-white/40">-</span>
            <strong class="font-bold text-white">{{ t.hero.studio }}.</strong>
          </p>
          <p ref="subline" class="max-w-4xl font-display text-lg font-medium leading-snug tracking-tight text-white/85 sm:text-xl md:text-2xl">
            {{ t.hero.subcopy }}
          </p>
        </div>
      </div>
    </div>

    <a href="#solutions" :aria-label="t.hero.cueAria"
      class="hero-cue absolute bottom-8 z-10 flex flex-col items-center gap-2 text-white/40 transition-colors hover:text-white/80">
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
  font-size: clamp(4.25rem, 18vw, 12.5rem);
  line-height: 0.9;
  letter-spacing: -0.05em;
  text-shadow: 0 0 80px rgb(255 122 26 / 0.18);
}

/* Scroll-driven multi-depth parallax */
.parallax-title-scroll {
  transform: translate3d(0, calc(var(--scroll) * -7rem), 0) scale(calc(1 - var(--scroll) * 0.06));
  opacity: clamp(0, calc(1 - var(--scroll) * 1.25), 1);
  will-change: transform, opacity;
}

.parallax-sub-scroll {
  transform: translate3d(0, calc(var(--scroll) * -4rem), 0);
  opacity: clamp(0, calc(1 - var(--scroll) * 1.45), 1);
  will-change: transform, opacity;
}

.hero-cue {
  opacity: clamp(0, calc(1 - var(--scroll) * 4), 1);
}

/* Pointer-driven subtle depth parallax (desktop fine pointer) */
@media (hover: hover) and (pointer: fine) {
  .parallax-title-pointer {
    transform: translate3d(calc(var(--px) * -18px), calc(var(--py) * -12px), 0);
    transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
    will-change: transform;
  }

  .parallax-sub-pointer {
    transform: translate3d(calc(var(--px) * -9px), calc(var(--py) * -6px), 0);
    transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
    will-change: transform;
  }
}

@media (prefers-reduced-motion: reduce) {

  .parallax-title-scroll,
  .parallax-sub-scroll,
  .parallax-title-pointer,
  .parallax-sub-pointer {
    transform: none !important;
    opacity: 1 !important;
    transition: none !important;
  }
}
</style>
