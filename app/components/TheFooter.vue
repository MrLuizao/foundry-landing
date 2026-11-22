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
      <a href="#home" class="font-display text-sm text-white/70 transition-colors hover:text-white">
        <span class="text-accent">FUNDERE</span> Software Studio
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

    <!-- Heartbeat-inspired persistent back-to-top button with Fundere's magnetic accent style -->
    <a
      v-magnetic
      href="#home"
      :aria-label="t.footer.backToTop"
      class="fixed bottom-6 right-6 z-30 flex size-11 items-center justify-center rounded-lg bg-accent text-black shadow-lg transition-opacity duration-300"
      :class="showTop ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'"
    >
      <svg viewBox="0 0 16 16" class="size-4" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M8 12.5V3.5M4 7.5 8 3.5l4 4" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </a>
  </footer>
</template>
