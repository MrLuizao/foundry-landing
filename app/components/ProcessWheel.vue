<script setup lang="ts">
const section = ref<HTMLElement | null>(null)
const wheel = ref<HTMLElement | null>(null)

const scroll = useAnimeScroll(() => ({
  target: section.value ?? undefined,
  sync: true,
  enter: 'top bottom',
  leave: 'bottom top',
}))
useAnimate(wheel, { rotate: [0, 120], ease: 'linear', autoplay: scroll })
</script>

<template>
  <section id="process" ref="section" class="overflow-hidden px-6 py-28">
    <div class="mx-auto grid max-w-5xl items-center gap-12 md:grid-cols-2">
      <div class="mx-auto aspect-square w-full max-w-sm">
        <div
          ref="wheel"
          class="h-full w-full rounded-full"
          role="img"
          aria-label="Wheel of colour segments representing the stages of a project"
          style="background: conic-gradient(#d8b84a 0 20%, #234a36 20% 40%, #c9d2d8 40% 60%, #d94a2b 60% 80%, #8a4b1e 80% 100%); -webkit-mask: radial-gradient(circle, transparent 0 14%, #000 15%); mask: radial-gradient(circle, transparent 0 14%, #000 15%);"
        />
      </div>
      <div>
        <ScrambleHeading text="Your legacy code is welcome here" class="font-serif text-4xl font-bold leading-tight sm:text-5xl" />
        <p class="mt-5 max-w-md font-serif text-lg font-medium text-white/80">
          Already have a product? We pick up existing codebases, map what works, and rebuild what doesn't, without
          stopping your business. The process stays the same: scope, forge, ship, improve.
        </p>
        <a v-magnetic href="#contact" class="mt-8 inline-block rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-black">
          Talk to us
        </a>
      </div>
    </div>
  </section>
</template>
