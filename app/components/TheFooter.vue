<script setup lang="ts">
const { t } = useI18n()
const links = computed(() => t.value.nav.links)

const showTop = ref(false)

onMounted(() => {
  const onScroll = () => {
    showTop.value = window.scrollY > window.innerHeight * 0.75
  }
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
  onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))
})
</script>

<template>
  <footer class="border-t border-line px-6 py-12">
    <div class="mx-auto flex max-w-5xl flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
      <a href="#home" class="group flex items-center gap-2 font-display text-sm text-white/70 transition-colors hover:text-white">
        <BrandLogo class="size-4 shrink-0 text-accent transition-transform duration-300 group-hover:scale-105" />
        <span><span class="font-medium text-white">FUNDERE</span> Software Studio</span>
      </a>
      <nav aria-label="Footer" class="flex flex-wrap items-center gap-x-6 gap-y-2">
        <a
          v-for="l in links"
          :key="l.href"
          :href="l.href"
          class="font-display text-xs text-white/50 transition-colors hover:text-white"
        >
          {{ l.label }}
        </a>
      </nav>
      <p class="font-display text-xs text-white/40">
        {{ t.footer.rights.replace('{year}', String(new Date().getFullYear())) }}
      </p>
    </div>

    <!-- Persistent back-to-top button showcasing the Fundere mark, morphing to an upward arrow on hover -->
    <a
      v-magnetic
      href="#home"
      :aria-label="t.footer.backToTop"
      class="group fixed bottom-6 right-6 z-30 flex size-12 items-center justify-center overflow-hidden rounded-xl border border-line bg-panel/90 shadow-lg backdrop-blur transition-all duration-300 hover:border-accent hover:bg-accent hover:shadow-[0_0_24px_rgb(255_122_26/0.4)]"
      :class="showTop ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'"
    >
      <BrandLogo
        class="size-5 text-accent transition-all duration-300 ease-out group-hover:-translate-y-3 group-hover:opacity-0"
      />
      <svg
        viewBox="0 0 24 24"
        class="absolute size-5 translate-y-3 text-black opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M6.5 17.25V13.25L12 6.75L17.5 13.25V17.25L12 10.75L6.5 17.25Z" />
      </svg>
    </a>
  </footer>
</template>
