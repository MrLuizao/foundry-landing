<script setup lang="ts">
import { stagger } from '#nanime/utils'
import { projects, type Project } from '~/data/projects'

const section = ref<HTMLElement | null>(null)
const cards = ref<HTMLElement | null>(null)
const selected = ref<Project | null>(null)
const origin = ref<DOMRect | null>(null)

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
  origin.value = (e.currentTarget as HTMLElement).getBoundingClientRect()
  selected.value = p
}
</script>

<template>
  <section id="cases" ref="section" class="border-t border-line px-6 py-28">
    <div class="mx-auto max-w-5xl text-center">
      <ScrambleHeading text="Built to ship" class="font-display text-4xl sm:text-6xl" />
      <p class="mx-auto mt-4 max-w-md text-sm text-white/60 sm:text-base">
        Web apps, mobile apps and the backends behind them, delivered end to end by one small team.
      </p>
      <a v-magnetic href="#contact" class="mt-8 inline-block rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-black">Start a project</a>
    </div>

    <!-- Desktop: 3x2 grid. Mobile: swipeable row with snap. -->
    <div
      ref="cards"
      class="gallery mx-auto mt-14 flex max-w-5xl snap-x snap-mandatory gap-4 overflow-x-auto pb-4 md:grid md:grid-cols-3 md:overflow-visible md:pb-0"
    >
      <button
        v-for="p in projects"
        :key="p.slug"
        v-tilt
        data-cursor="View"
        class="card relative aspect-[4/5] w-[72%] shrink-0 snap-center rounded-card text-left transition-opacity active:scale-[0.98] md:w-auto"
        :aria-label="`Open case study: ${p.title}`"
        @click="open(p, $event)"
      >
        <ArtCard :variant="p.variant" :label="p.title" :image="p.image" class="h-full w-full" />
      </button>
    </div>

    <ProjectModal :project="selected" :origin="origin" @close="selected = null" />
  </section>
</template>
