<script setup lang="ts">
const { t } = useI18n()
const section = ref<HTMLElement | null>(null)
const track = ref<HTMLElement | null>(null)
const stage = ref<HTMLElement | null>(null)

const { progress } = useScrollProgress(track, { mode: 'sticky', target: stage, smooth: false })

interface WatermarkToken {
  text: string
  wordId?: number
}

const rows: { offset: string; drift: 'left' | 'right'; tokens: WatermarkToken[] }[] = [
  {
    offset: '',
    drift: 'left',
    tokens: [{ text: 'FUNDERE', wordId: 0 }, { text: 'FUNDERE', wordId: 1 }, { text: 'FUNDERE', wordId: 2 }],
  },
  {
    offset: '-ml-12',
    drift: 'right',
    tokens: [{ text: 'FUNDERE', wordId: 3 }, { text: 'FUNDERE', wordId: 4 }, { text: 'FUNDERE', wordId: 5 }],
  },
  {
    offset: '-ml-4',
    drift: 'left',
    tokens: [{ text: 'ERE' }, { text: 'FUNDERE', wordId: 6 }, { text: 'FUNDERE', wordId: 7 }, { text: 'FUN' }],
  },
  {
    offset: '-ml-16',
    drift: 'right',
    tokens: [{ text: 'DERE' }, { text: 'FUNDERE', wordId: 8 }, { text: 'FUNDERE', wordId: 9 }, { text: 'FUN' }],
  },
  {
    offset: '-ml-8',
    drift: 'left',
    tokens: [{ text: 'E' }, { text: 'FUNDERE', wordId: 10 }, { text: 'FUNDERE', wordId: 11 }, { text: 'FUNDE' }],
  },
  {
    offset: '-ml-20',
    drift: 'right',
    tokens: [{ text: 'RE' }, { text: 'FUNDERE', wordId: 12 }, { text: 'FUNDERE', wordId: 13 }, { text: 'FUNDE' }],
  },
]

// Non-adjacent sequence so highlighted words jump organically across the canvas
const sequence = [6, 11, 1, 9, 4, 13, 7, 3, 10, 2, 8, 12]
const secondaryColors = [
  'text-white/90 drop-shadow-[0_0_16px_rgb(255_255_255/0.2)]',
  'text-white/35',
]

const step = ref(0)
const primaryId = computed(() => sequence[step.value % sequence.length])
const secondaryId = computed(() => sequence[(step.value + 4) % sequence.length])
const secondaryColor = computed(() => secondaryColors[step.value % secondaryColors.length])

function tokenClass(wordId?: number) {
  if (wordId === undefined) return 'text-white/[0.06]'
  if (wordId === primaryId.value) return 'text-accent drop-shadow-[0_0_24px_rgb(255_122_26/0.35)]'
  if (wordId === secondaryId.value) return secondaryColor.value
  return 'text-white/[0.06]'
}

function logoClass(wordId?: number) {
  if (wordId === undefined) return 'text-white/[0.06]'
  if (wordId === primaryId.value) return 'text-white/95 drop-shadow-[0_0_16px_rgb(255_255_255/0.25)]'
  if (wordId === secondaryId.value) {
    return step.value % secondaryColors.length === 0
      ? 'text-accent drop-shadow-[0_0_20px_rgb(255_122_26/0.35)]'
      : 'text-accent/70'
  }
  return 'text-white/[0.06]'
}

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const timer = setInterval(() => {
    step.value = (step.value + 1) % sequence.length
  }, 1100)
  onBeforeUnmount(() => clearInterval(timer))
})

// Heat follows the pointer (same interactive background as Home).
function onMove(e: PointerEvent) {
  const s = section.value
  if (!s) return
  const r = s.getBoundingClientRect()
  s.style.setProperty('--hx', `${e.clientX - r.left}px`)
  s.style.setProperty('--hy', `${e.clientY - r.top}px`)
}
</script>

<template>
  <section
    id="about"
    ref="section"
    class="about-stage relative overflow-x-clip border-t border-line px-4 py-14 sm:px-6 md:py-16"
    @pointermove="onMove"
  >
    <HeroEmbers />

    <div ref="track" class="relative z-10 mx-auto max-w-7xl md:h-[170vh]">
      <div
        ref="stage"
        class="grid items-center gap-10 md:sticky md:top-28 md:grid-cols-12 md:gap-10"
        style="--p: 0"
      >
        <!-- Left: Open-canvas typographic FUNDERE watermark -->
        <div
          aria-hidden="true"
          class="watermark-mask relative overflow-hidden py-4 select-none md:col-span-7 md:py-8 lg:col-span-8"
        >
          <div class="flex flex-col gap-1.5 font-display text-[clamp(2.5rem,5.2vw,4.5rem)] font-bold italic uppercase leading-[0.92] tracking-tight">
            <div
              v-for="(row, rIdx) in rows"
              :key="rIdx"
              class="flex gap-5 whitespace-nowrap"
              :class="[row.offset, row.drift === 'left' ? 'drift-left' : 'drift-right']"
            >
              <span
                v-for="(tok, tIdx) in row.tokens"
                :key="tIdx"
                class="inline-flex items-center gap-2.5"
              >
                <BrandLogo
                  v-if="tok.wordId !== undefined"
                  class="size-[0.72em] shrink-0 transition-all duration-700 ease-out"
                  :class="logoClass(tok.wordId)"
                />
                <span
                  class="transition-all duration-700 ease-out"
                  :class="tokenClass(tok.wordId)"
                >{{ tok.text }}</span>
              </span>
            </div>
          </div>
        </div>

        <!-- Right: Large sequential scroll-driven story beats (CSS Grid overlap prevents clipping/overlap at any width) -->
        <div class="flex flex-col items-end md:col-span-5 lg:col-span-4">
          <div class="grid w-full gap-y-8 md:gap-y-0">
            <div
              v-for="(para, idx) in t.manifesto.paragraphs"
              :key="idx"
              class="story-beat md:col-start-1 md:row-start-1 md:self-center"
              :class="[
                `story-beat-${idx + 1}`,
                idx === 2 && progress >= 0.58 ? 'md:pointer-events-auto' : 'md:pointer-events-none',
              ]"
            >
              <p class="text-right font-display text-lg leading-snug text-white/85 sm:text-xl lg:text-[1.4rem] xl:text-2xl">
                <span
                  v-for="(seg, sIdx) in para"
                  :key="sIdx"
                  :class="seg.accent ? 'font-semibold text-accent' : ''"
                >{{ seg.text }}</span>
              </p>

            </div>
          </div>

          <!-- Subtle 3-beat progress indicator aligned bottom-right on desktop -->
          <div class="mt-6 hidden w-36 grid-cols-3 gap-2 self-end md:grid" aria-hidden="true">
            <span class="h-0.5 rounded-full transition-colors duration-300" :class="progress < 0.34 ? 'bg-accent' : 'bg-white/15'" />
            <span class="h-0.5 rounded-full transition-colors duration-300" :class="progress >= 0.34 && progress < 0.68 ? 'bg-accent' : 'bg-white/15'" />
            <span class="h-0.5 rounded-full transition-colors duration-300" :class="progress >= 0.68 ? 'bg-accent' : 'bg-white/15'" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.about-stage {
  background:
    radial-gradient(620px circle at var(--hx, 50%) var(--hy, 55%), rgb(255 122 26 / 0.14), transparent 70%),
    radial-gradient(ellipse 58% 42% at 50% 56%, rgb(255 122 26 / 0.08), transparent 75%);
}

.watermark-mask {
  -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
  mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
}

.drift-left {
  transform: translate3d(calc((var(--p) - 0.5) * -2rem), 0, 0);
  will-change: transform;
}

.drift-right {
  transform: translate3d(calc((var(--p) - 0.5) * 2rem), 0, 0);
  will-change: transform;
}

/* Desktop: sequential 3-beat reveal sliding from the right as user scrolls */
@media (min-width: 768px) {
  /* Beat 1: visible on arrival (0.00 -> 0.24), exits cleanly (0.24 -> 0.38) */
  .story-beat-1 {
    --out1: clamp(0, calc((var(--p) - 0.24) / 0.14), 1);
    opacity: calc(1 - var(--out1));
    transform: translate3d(calc(var(--out1) * -3rem), 0, 0);
    filter: blur(calc(var(--out1) * 4px));
    will-change: transform, opacity, filter;
  }

  /* Beat 2: enters from right (0.28 -> 0.42), holds, exits (0.58 -> 0.72) */
  .story-beat-2 {
    --in2: clamp(0, calc((var(--p) - 0.28) / 0.14), 1);
    --out2: clamp(0, calc((var(--p) - 0.58) / 0.14), 1);
    opacity: calc(var(--in2) * (1 - var(--out2)));
    transform: translate3d(calc((1 - var(--in2)) * 4rem - var(--out2) * 3rem), 0, 0);
    filter: blur(calc(((1 - var(--in2)) + var(--out2)) * 4px));
    will-change: transform, opacity, filter;
  }

  /* Beat 3 + CTA: enters from right (0.62 -> 0.78) and stays visible at end of scroll */
  .story-beat-3 {
    --in3: clamp(0, calc((var(--p) - 0.62) / 0.16), 1);
    opacity: var(--in3);
    transform: translate3d(calc((1 - var(--in3)) * 4rem), 0, 0);
    filter: blur(calc((1 - var(--in3)) * 4px));
    will-change: transform, opacity, filter;
  }
}

@media (prefers-reduced-motion: reduce) {
  .story-beat,
  .drift-left,
  .drift-right {
    position: static !important;
    transform: none !important;
    filter: none !important;
    opacity: 1 !important;
  }
}
</style>
