<script setup lang="ts">
const links = [
  { label: 'Work', href: '#work' },
  { label: 'Services', href: '#services' },
  { label: 'Process', href: '#process' },
  { label: 'Contact', href: '#contact' },
]
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
  links.forEach((l) => { const s = document.querySelector(l.href); if (s) io.observe(s) })

  onBeforeUnmount(() => { window.removeEventListener('scroll', onScroll); io.disconnect() })
})

function openPalette() { window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true })) }
</script>

<template>
  <header
    class="fixed inset-x-0 top-4 z-40 flex justify-center px-4 transition-transform duration-500 ease-out"
    :class="hidden ? '-translate-y-24' : 'translate-y-0'"
  >
    <nav aria-label="Main" class="flex w-full max-w-3xl items-center justify-between rounded-xl border border-line bg-panel/90 px-4 py-2.5 backdrop-blur">
      <a href="#" class="flex items-baseline gap-2" aria-label="Fundere Software Studio, home">
        <span class="font-display text-base font-medium tracking-wide text-accent">FUNDERE</span>
        <span class="hidden font-display text-[10px] tracking-[0.25em] text-white/50 sm:inline">SOFTWARE STUDIO</span>
      </a>
      <ul class="hidden items-center gap-6 md:flex">
        <li v-for="l in links" :key="l.href" class="relative">
          <a :href="l.href" class="nav-link font-display text-xs text-white/60 transition-colors hover:text-white" :aria-current="active === l.href ? 'true' : undefined">{{ l.label }}</a>
          <span class="absolute -bottom-1.5 left-1/2 size-1 -translate-x-1/2 rounded-full bg-accent transition-all duration-300" :class="active === l.href ? 'scale-100 opacity-100' : 'scale-0 opacity-0'" />
        </li>
      </ul>
      <div class="flex items-center gap-2">
        <button class="rounded-md border border-line px-2 py-1 font-display text-[10px] text-white/70 transition-colors hover:text-white" aria-label="Open menu and command palette" @click="openPalette">
          <span class="lg:hidden">Menu</span><span class="hidden lg:inline">⌘K</span>
        </button>
        <a v-magnetic href="#contact" class="rounded-lg bg-accent px-3 py-1.5 text-sm font-medium text-black">Start a project</a>
      </div>
    </nav>
  </header>
</template>
