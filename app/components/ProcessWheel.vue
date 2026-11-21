<script setup lang="ts">
const section = ref<HTMLElement | null>(null)

useScrollProgress(section, { mode: 'enter', enterSpan: 0.92 })
</script>

<template>
  <section ref="section" class="process-section border-t border-line overflow-hidden px-6 py-28" style="--p: 0">
    <div class="mx-auto max-w-5xl">
      <!-- Heartbeat-inspired escalating studio credo -->
      <div class="mb-20 border-b border-line pb-16">
        <p class="font-display text-xs tracking-[0.22em] text-accent uppercase">
          About Fundere
        </p>
        <h2 class="mt-5 font-serif font-semibold leading-[1.02] tracking-tight text-white">
          <span class="block text-3xl text-white/65 sm:text-5xl">Founders rely on us</span>
          <span class="block text-4xl text-white/85 sm:text-6xl">when stakes</span>
          <span class="block text-5xl text-white sm:text-7xl">are high.</span>
        </h2>
        <p class="mt-6 max-w-xl font-display text-xs leading-relaxed text-white/60 sm:text-sm">
          Small senior engineering team. No juniors hidden behind account layers. Direct access to the people designing,
          architecting, and shipping your code.
        </p>
      </div>

      <!-- Orbital hairline ring + scroll-scrubbed segmented wheel -->
      <div class="grid items-center gap-12 md:grid-cols-2">
        <div class="process-wheel-wrap relative mx-auto flex aspect-square w-full max-w-sm items-center justify-center">
          <!-- Concentric hairline orbital arcs -->
          <div class="pointer-events-none absolute -inset-6 rounded-full border border-white/10" aria-hidden="true" />
          <div class="pointer-events-none absolute -inset-12 rounded-full border border-white/[0.05]" aria-hidden="true" />
          <div
            class="process-wheel h-full w-full rounded-full"
            role="img"
            aria-label="Wheel of colour segments representing the stages of a project"
            style="background: conic-gradient(#d8b84a 0 20%, #234a36 20% 40%, #c9d2d8 40% 60%, #d94a2b 60% 80%, #8a4b1e 80% 100%); -webkit-mask: radial-gradient(circle, transparent 0 14%, #000 15%); mask: radial-gradient(circle, transparent 0 14%, #000 15%);"
          />
        </div>

        <div class="process-copy">
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
    </div>
  </section>
</template>

<style scoped>
/* Wheel rolls in, scales down from oversized, and unblurs as you scroll */
.process-wheel-wrap {
  transform:
    translate3d(calc((1 - var(--p)) * -3rem), calc((1 - var(--p)) * 2rem), 0)
    scale(calc(1.22 - 0.22 * var(--p)));
  filter: blur(calc((1 - var(--p)) * 7px));
  opacity: clamp(0.15, calc(var(--p) * 1.3), 1);
  will-change: transform, filter, opacity;
}

.process-wheel {
  transform: rotate(calc(-160deg + 160deg * var(--p)));
  will-change: transform;
}

/* Copy rises and sharpens in sync with the wheel */
.process-copy {
  transform: translate3d(0, calc((1 - var(--p)) * 3.5rem), 0);
  filter: blur(calc((1 - var(--p)) * 4px));
  opacity: clamp(0.1, calc((var(--p) - 0.1) * 1.25), 1);
  will-change: transform, filter, opacity;
}

@media (prefers-reduced-motion: reduce) {
  .process-wheel-wrap,
  .process-wheel,
  .process-copy {
    transform: none !important;
    filter: none !important;
    opacity: 1 !important;
  }
}
</style>
