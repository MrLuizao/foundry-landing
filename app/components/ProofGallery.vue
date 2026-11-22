<script setup lang="ts">
import { stagger } from '#nanime/utils'
import type { Project } from '~/data/projects'

const { t } = useI18n()
const projects = computed(() => t.value.cases.projects)

const section = ref<HTMLElement | null>(null)
const cards = ref<HTMLElement | null>(null)
const selected = ref<Project | null>(null)
const origin = ref<DOMRect | null>(null)

// If selected project is open when switching locale, update its content reactively
watch(projects, (newList) => {
  if (selected.value) {
    const updated = newList.find(p => p.slug === selected.value?.slug)
    if (updated) selected.value = updated
  }
})

const scroll = useAnimeScroll(() => ({
  target: section.value ?? undefined,
  sync: true,
  enter: 'top bottom',
  leave: 'center center',
}))
useAnimate(() => cards.value?.children ?? [], {
  y: ['6rem', 0], opacity: [0, 1], delay: stagger(80), ease: 'outTwo', autoplay: scroll,
})

function open(p: Project, e: Event) {
  const el = e.currentTarget as HTMLElement
  const fig = el.querySelector('figure')
  origin.value = (fig ?? el).getBoundingClientRect()
  selected.value = p
}
</script>

<template>
  <section id="cases" ref="section" class="border-t border-line px-4 py-24 sm:px-6 md:py-28">
    <div class="mx-auto max-w-5xl">
      <ScrambleHeading
        :text="t.cases.heading"
        class="font-display text-4xl font-bold uppercase tracking-tight text-white sm:text-6xl"
      />

      <!-- Asymmetric 1+2 editorial work grid -->
      <div
        ref="cards"
        class="mt-12 grid gap-10 md:grid-cols-2 md:gap-x-8 md:gap-y-14"
      >
        <button
          v-for="(p, i) in projects"
          :key="p.slug"
          type="button"
          class="group text-left focus-visible:outline-none"
          :class="i === 0 ? 'md:col-span-2' : ''"
          :aria-label="t.cases.cardAria.replace('{title}', p.title)"
          @click="open(p, $event)"
        >
          <div
            v-tilt
            :data-cursor="t.cases.cursorView"
            class="relative overflow-hidden rounded-card border border-line bg-panel transition-transform duration-300 active:scale-[0.99]"
            :class="i === 0 ? 'aspect-[16/10] md:aspect-[21/9]' : 'aspect-[4/3]'"
          >
            <ArtCard
              :variant="p.variant"
              :label="p.title"
              :image="p.image"
              :show-label="false"
              class="h-full w-full transition-transform duration-500 group-hover:scale-[1.03]"
            />
          </div>

          <div class="mt-4 flex flex-col gap-1.5">
            <p class="font-display text-[11px] tracking-[0.18em] text-accent uppercase">
              {{ p.scope }}
            </p>
            <h3 class="font-display text-xl font-semibold tracking-tight text-white transition-colors group-hover:text-accent sm:text-2xl">
              {{ p.title }}
            </h3>
            <p class="max-w-xl text-sm leading-relaxed text-white/60">
              {{ p.tagline }}
            </p>
          </div>
        </button>
      </div>
    </div>

    <ProjectModal :project="selected" :origin="origin" @close="selected = null" />
  </section>
</template>
