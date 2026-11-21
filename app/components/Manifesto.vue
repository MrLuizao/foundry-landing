<script setup lang="ts">
const section = ref<HTMLElement | null>(null)

useScrollProgress(section, { mode: 'enter', enterSpan: 0.85 })

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
    class="about-stage relative flex min-h-[85svh] items-center overflow-hidden border-t border-line px-4 py-28 sm:px-6"
    style="--p: 0"
    @pointermove="onMove"
  >
    <HeroEmbers />

    <div class="relative z-10 mx-auto w-full max-w-6xl">
      <!-- Escalating 3-line monumental statement that fills mobile width and scales up on desktop -->
      <h2 class="credo-grow origin-left font-display font-bold uppercase leading-[0.94] tracking-tight text-white">
        <span class="block whitespace-nowrap text-[clamp(1.65rem,7.4vw,5.25rem)] text-white/75">
          Founders rely on us
        </span>
        <span class="mt-1 block whitespace-nowrap text-[clamp(2.75rem,13.2vw,8.25rem)] text-white/90">
          when stakes
        </span>
        <span class="mt-1 block whitespace-nowrap text-[clamp(3.6rem,17.5vw,10.5rem)] text-white">
          are high
        </span>
      </h2>

      <div class="mt-10 flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-end">
        <p class="max-w-md font-display text-xs leading-relaxed text-white/60 sm:text-sm">
          Senior engineering team. No juniors. No account layers. Modern tools, clear architecture, and production
          systems you can evolve without us.
        </p>
        <a
          v-magnetic
          href="#contact"
          class="inline-block shrink-0 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-black"
        >
          Talk to us
        </a>
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

/* Text starts smaller and expands smoothly as you scroll into the section */
.credo-grow {
  transform: scale(calc(0.82 + 0.18 * var(--p))) translate3d(0, calc((1 - var(--p)) * 2rem), 0);
  opacity: clamp(0.25, calc(0.25 + var(--p) * 0.85), 1);
  will-change: transform, opacity;
}

@media (prefers-reduced-motion: reduce) {
  .credo-grow {
    transform: none !important;
    opacity: 1 !important;
  }
}
</style>
