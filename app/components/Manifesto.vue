<script setup lang="ts">
const section = ref<HTMLElement | null>(null)
const floaters = ref<HTMLElement | null>(null)

const scroll = useAnimeScroll(() => ({
  target: section.value ?? undefined,
  sync: true,
  enter: 'top bottom',
  leave: 'center center',
}))
// Each card starts pushed out toward its corner and settles into place.
const offsets = [
  { x: '-40vw', y: '-30vh' },
  { x: '40vw', y: '-30vh' },
  { x: '-40vw', y: '30vh' },
  { x: '40vw', y: '30vh' },
]
useAnimate(() => floaters.value?.children ?? [], {
  x: (_el: unknown, i: number) => [offsets[i]!.x, 0],
  y: (_el: unknown, i: number) => [offsets[i]!.y, 0],
  opacity: [0, 1],
  ease: 'outCubic',
  autoplay: scroll,
})
</script>

<template>
  <section ref="section" class="px-6 py-16">
    <div class="relative mx-auto flex min-h-[70vh] max-w-5xl items-center justify-center overflow-hidden rounded-card bg-panel px-6 py-24">
      <div ref="floaters" class="pointer-events-none absolute inset-0" aria-hidden="true">
        <ArtCard :variant="0" class="absolute left-[4%] top-[6%] size-28 sm:size-40" />
        <ArtCard :variant="4" class="absolute right-[4%] top-[8%] size-28 sm:size-40" />
        <ArtCard :variant="2" class="absolute bottom-[6%] left-[10%] size-28 sm:size-40" />
        <ArtCard :variant="3" class="absolute bottom-[8%] right-[8%] size-28 sm:size-40" />
      </div>
      <p class="relative max-w-md text-center font-serif text-2xl font-semibold leading-snug sm:text-3xl">
        Foundry is for teams obsessed with craft, built by engineers who respect it. Whether you need a sharp MVP or a
        platform that scales, we build it to last.
      </p>
    </div>
  </section>
</template>
