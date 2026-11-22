<script setup lang="ts">
import { animate, stagger } from '#nanime/utils'

const { t } = useI18n()

type IndustryId = 'ai' | 'web' | 'backend' | 'cybersecurity'

const industries = computed(() => t.value.solutions.areas)

const section = ref<HTMLElement | null>(null)
const track = ref<HTMLElement | null>(null)
const stage = ref<HTMLElement | null>(null)
const panelRef = ref<HTMLElement | null>(null)
const activeId = ref<IndustryId>('ai')
const current = computed(() => industries.value.find(a => a.id === activeId.value) || industries.value[0]!)
const tabs = ref<HTMLElement[]>([])

// Scrubs --p (0 → 1) while scrolling through the sticky track; fully reversible on scroll-up.
const { progress } = useScrollProgress(track, { mode: 'sticky', target: stage, smooth: false })

function selectIndustry(id: string) {
  activeId.value = id as IndustryId
}

watch(activeId, async () => {
  await nextTick()
  if (!panelRef.value || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  const pitchItems = panelRef.value.querySelectorAll('[data-pitch]')
  const pointItems = panelRef.value.querySelectorAll('[data-point]')

  if (pitchItems.length) {
    animate(pitchItems, {
      opacity: [0, 1],
      x: [-20, 0],
      duration: 420,
      delay: stagger(55),
      ease: 'outCubic',
    })
  }
  if (pointItems.length) {
    animate(pointItems, {
      opacity: [0, 1],
      x: [28, 0],
      duration: 440,
      delay: stagger(75, { start: 60 }),
      ease: 'outCubic',
    })
  }
})

function onKey(e: KeyboardEvent) {
  const i = industries.value.findIndex(a => a.id === activeId.value)
  let n = i
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') n = (i + 1) % industries.value.length
  else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') n = (i - 1 + industries.value.length) % industries.value.length
  else return
  e.preventDefault()
  selectIndustry(industries.value[n]!.id)
  tabs.value[n]?.focus()
}

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
    id="solutions"
    ref="section"
    class="solutions-section relative overflow-x-clip border-t border-line px-4 py-16 sm:px-6 md:py-20"
    @pointermove="onMove"
  >
    <div class="mx-auto max-w-5xl">
      <!-- On mobile (< md): editorial header followed by open-canvas showcase.
           On desktop (md+): lines reveal 1 by 1, description slides in from the side, then opposing halves lock together. -->
      <div ref="track" class="relative md:h-[195vh]">
        <div
          ref="stage"
          class="solutions-stage md:sticky md:top-24"
          style="--p: 0"
        >
          <div class="relative">
            <!-- Editorial header -->
            <div
              class="editorial-intro mb-14 flex flex-col items-start md:absolute md:inset-x-0 md:top-8 md:mb-0"
              :class="progress < 0.58 ? 'md:pointer-events-auto' : 'md:pointer-events-none'"
            >
              <h2 class="origin-left font-display font-bold uppercase leading-[0.94] tracking-tight text-white">
                <span class="editorial-line-1 block whitespace-nowrap text-[clamp(1.5rem,5.5vw,3.75rem)] text-white/75">
                  {{ t.solutions.line1 }}
                </span>
                <span class="editorial-line-2 mt-1 block whitespace-nowrap text-[clamp(2.25rem,8.5vw,5.75rem)] text-white/90">
                  {{ t.solutions.line2 }}
                </span>
                <span class="editorial-line-3 mt-1 block whitespace-nowrap text-[clamp(3rem,12vw,8rem)] text-white">
                  {{ t.solutions.line3 }}
                </span>
              </h2>
              <div class="editorial-desc mt-8 max-w-2xl">
                <p class="font-display text-base leading-relaxed text-white/75 sm:text-xl md:text-2xl">
                  {{ t.solutions.subcopy }}
                </p>
              </div>
            </div>

            <!-- Open-canvas architectural showcase -->
            <div
              class="solutions-showcase"
              :class="progress >= 0.56 ? 'md:pointer-events-auto' : 'md:pointer-events-none'"
            >
              <!-- Clean architectural index bar -->
              <div
                role="tablist"
                aria-label="Capabilities"
                class="showcase-bar flex flex-nowrap items-center gap-x-7 overflow-x-auto border-y border-line [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-x-10 md:gap-x-12"
                @keydown="onKey"
              >
                <button
                  v-for="(area, i) in industries"
                  :id="`focus-tab-${area.id}`"
                  :key="area.id"
                  :ref="(el) => { if (el) tabs[i] = el as HTMLElement }"
                  type="button"
                  role="tab"
                  :tabindex="activeId === area.id ? 0 : -1"
                  :aria-selected="activeId === area.id"
                  :aria-controls="`focus-panel-${area.id}`"
                  class="group relative shrink-0 whitespace-nowrap py-4 font-display text-sm font-medium tracking-tight transition-colors sm:py-5 sm:text-base md:text-lg"
                  :class="activeId === area.id ? 'text-white' : 'text-white/40 hover:text-white/75'"
                  @click="selectIndustry(area.id)"
                >
                  <span>{{ area.label }}</span>
                  <span
                    class="absolute bottom-0 left-0 right-0 h-[3px] origin-left bg-accent transition-transform duration-300"
                    :class="activeId === area.id ? 'scale-x-100' : 'scale-x-0'"
                    aria-hidden="true"
                  />
                </button>
              </div>

              <!-- 12-column editorial split: left & right halves lock in horizontally -->
              <div
                :id="`focus-panel-${current.id}`"
                ref="panelRef"
                :key="current.id"
                role="tabpanel"
                :aria-labelledby="`focus-tab-${current.id}`"
                class="grid gap-10 pt-10 md:grid-cols-12 md:gap-12 md:pt-12"
              >
                <!-- Left: Value proposition & integration summary -->
                <div class="showcase-pitch flex flex-col justify-center md:col-span-5">
                  <p data-pitch class="font-display text-[11px] tracking-[0.2em] text-accent uppercase">
                    {{ current.eyebrow }}
                  </p>
                  <h3 data-pitch class="mt-3 font-display text-2xl font-semibold leading-snug tracking-tight text-white sm:text-3xl">
                    {{ current.headline }}
                  </h3>
                  <p data-pitch class="mt-4 text-sm leading-relaxed text-white/65 sm:text-base">
                    {{ current.summary }}
                  </p>
                </div>

                <!-- Right: Architectural capability list -->
                <div class="divide-y divide-line border-y border-line md:col-span-7">
                  <div
                    v-for="pt in current.points"
                    :key="pt.title"
                    class="showcase-point group relative overflow-hidden py-5 transition-colors hover:bg-white/[0.02] sm:py-6"
                  >
                    <span
                      class="absolute bottom-0 left-0 top-0 w-0.5 origin-top scale-y-0 bg-accent transition-transform duration-300 group-hover:scale-y-100"
                      aria-hidden="true"
                    />
                    <div data-point class="flex items-start gap-4 pl-2 sm:gap-5 sm:pl-3">
                      <span
                        class="mt-2 size-1.5 shrink-0 rounded-full bg-accent transition-all duration-300 group-hover:scale-150 group-hover:shadow-[0_0_12px_rgb(255_122_26/0.75)]"
                        aria-hidden="true"
                      />
                      <div>
                        <h4 class="font-display text-sm font-medium text-white transition-colors group-hover:text-accent sm:text-base">
                          {{ pt.title }}
                        </h4>
                        <p class="mt-1.5 text-xs leading-relaxed text-white/60 sm:text-sm">
                          {{ pt.body }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.solutions-section {
  background:
    radial-gradient(640px circle at var(--hx, 50%) var(--hy, 50%), rgb(255 122 26 / 0.08), transparent 70%);
}

/* Desktop (md+): 1-by-1 line reveal → side slide-in description → intro out → opposing halves lock in */
@media (min-width: 768px) {
  .editorial-line-1 {
    --l1: clamp(0, calc(var(--p) / 0.08), 1);
    opacity: calc(0.25 + 0.75 * var(--l1));
    transform: translate3d(0, calc((1 - var(--l1)) * 0.75rem), 0);
    will-change: transform, opacity;
  }

  .editorial-line-2 {
    --l2: clamp(0, calc((var(--p) - 0.06) / 0.10), 1);
    opacity: var(--l2);
    transform: translate3d(0, calc((1 - var(--l2)) * 1rem), 0);
    will-change: transform, opacity;
  }

  .editorial-line-3 {
    --l3: clamp(0, calc((var(--p) - 0.14) / 0.11), 1);
    opacity: var(--l3);
    transform: translate3d(0, calc((1 - var(--l3)) * 1.25rem), 0);
    will-change: transform, opacity;
  }

  .editorial-desc {
    --desc-in: clamp(0, calc((var(--p) - 0.23) / 0.15), 1);
    opacity: var(--desc-in);
    transform: translate3d(calc((1 - var(--desc-in)) * 4.5rem), 0, 0);
    filter: blur(calc((1 - var(--desc-in)) * 6px));
    will-change: transform, opacity, filter;
  }

  .editorial-intro {
    --intro-out: clamp(0, calc((var(--p) - 0.45) / 0.13), 1);
    opacity: calc(1 - var(--intro-out));
    transform: translate3d(0, calc(var(--intro-out) * -2rem), 0);
    will-change: transform, opacity;
  }

  .showcase-bar {
    --bar-in: clamp(0, calc((var(--p) - 0.54) / 0.18), 1);
    opacity: var(--bar-in);
    clip-path: inset(0 calc((1 - var(--bar-in)) * 100%) 0 0);
    will-change: clip-path, opacity;
  }

  .showcase-pitch {
    --pitch-in: clamp(0, calc((var(--p) - 0.58) / 0.20), 1);
    opacity: var(--pitch-in);
    transform: translate3d(calc((1 - var(--pitch-in)) * -2.5rem), 0, 0);
    will-change: transform, opacity;
  }

  .showcase-point:nth-child(1) {
    --pt-in: clamp(0, calc((var(--p) - 0.62) / 0.18), 1);
    opacity: var(--pt-in);
    transform: translate3d(calc((1 - var(--pt-in)) * 3rem), 0, 0);
    will-change: transform, opacity;
  }

  .showcase-point:nth-child(2) {
    --pt-in: clamp(0, calc((var(--p) - 0.69) / 0.18), 1);
    opacity: var(--pt-in);
    transform: translate3d(calc((1 - var(--pt-in)) * 3rem), 0, 0);
    will-change: transform, opacity;
  }

  .showcase-point:nth-child(3) {
    --pt-in: clamp(0, calc((var(--p) - 0.76) / 0.18), 1);
    opacity: var(--pt-in);
    transform: translate3d(calc((1 - var(--pt-in)) * 3rem), 0, 0);
    will-change: transform, opacity;
  }
}

@media (prefers-reduced-motion: reduce) {
  .editorial-line-1,
  .editorial-line-2,
  .editorial-line-3,
  .editorial-intro,
  .editorial-desc,
  .showcase-bar,
  .showcase-pitch,
  .showcase-point {
    position: static !important;
    transform: none !important;
    filter: none !important;
    clip-path: none !important;
    opacity: 1 !important;
  }
}
</style>
