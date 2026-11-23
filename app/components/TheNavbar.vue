<script setup lang="ts">
const { t, locale, toggleLocale } = useI18n()
const links = computed(() => t.value.nav.links.filter(l => l.href !== '#about'))
const hidden = ref(false)
const active = ref('')

onMounted(() => {
  let last = window.scrollY
  const onScroll = () => {
    const y = window.scrollY
    hidden.value = y > last && y > 160
    last = y
  }
  window.addEventListener('scroll', onScroll, { passive: true })

  const io = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) active.value = `#${e.target.id}`
  }, { rootMargin: '-45% 0px -45% 0px' })
  links.value.forEach((l) => { const s = document.querySelector(l.href); if (s) io.observe(s) })

  onBeforeUnmount(() => { window.removeEventListener('scroll', onScroll); io.disconnect() })
})

function openPalette() { window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true })) }
</script>

<template>
  <header class="fixed inset-x-0 top-4 z-40 flex justify-center px-4 transition-transform duration-500 ease-out"
    :class="hidden ? '-translate-y-24' : 'translate-y-0'">
    <nav aria-label="Main"
      class="flex w-full max-w-3xl items-center justify-between gap-2 rounded-xl border border-line bg-panel/90 px-3.5 py-2.5 backdrop-blur sm:px-4">
      <a href="#home" class="group flex shrink-0 items-center gap-2" aria-label="Fundere Software Studio, home">
        <BrandLogo class="size-5 shrink-0 text-accent transition-transform duration-300 group-hover:scale-105" />
        <span class="font-display text-sm font-medium tracking-wide text-white sm:text-base">FUNDERE</span>
      </a>

              <!-- Language Switcher: Segmented Toggle -->
        <button
          type="button"
          class="flex shrink-0 items-center gap-1 rounded-lg border border-line bg-black/40 px-2.5 py-1.5 font-display text-[11px] transition-colors hover:border-white/30 sm:text-xs"
          :aria-label="t.nav.switchLang"
          @click="toggleLocale"
        >
          <span :class="locale === 'en' ? 'font-semibold text-accent' : 'text-white/40'">EN</span>
          <span class="text-white/20" aria-hidden="true">/</span>
          <span :class="locale === 'es' ? 'font-semibold text-accent' : 'text-white/40'">ES</span>
        </button>
        
      <ul class="hidden items-center gap-6 md:flex">
        <li v-for="l in links" :key="l.href" class="relative">
          <a :href="l.href" class="nav-link whitespace-nowrap font-display text-xs text-white/60 transition-colors hover:text-white"
            :aria-current="active === l.href ? 'true' : undefined">{{ l.label }}</a>
          <span
            class="absolute -bottom-1.5 left-1/2 size-1 -translate-x-1/2 rounded-full bg-accent transition-all duration-300"
            :class="active === l.href ? 'scale-100 opacity-100' : 'scale-0 opacity-0'" />
        </li>
      </ul>
      <div class="flex shrink-0 items-center gap-2">
        <a
          v-magnetic
          href="#contact"
          class="hidden whitespace-nowrap rounded-lg bg-accent px-3 py-1.5 text-sm font-medium text-black sm:inline-block"
        >
          {{ t.nav.cta }}
        </a>
        <button
          class="shrink-0 whitespace-nowrap rounded-lg border border-line px-3 py-1.5 font-display text-[11px] text-white/80 transition-colors hover:border-white/30 hover:text-white md:hidden"
          :aria-label="t.nav.menu" @click="openPalette">
          {{ t.nav.menu }}
        </button>
      </div>
    </nav>
  </header>
</template>
