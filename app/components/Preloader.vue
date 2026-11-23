<script setup lang="ts">
import { animate, stagger } from '#nanime/utils'

const ready = useState('fundere-ready', () => false)
const letters = ref<HTMLElement | null>(null)
const root = ref<HTMLElement | null>(null)
const visible = ref(true)

useHead({
  script: [{
    innerHTML: "try{if(sessionStorage.getItem('fundere-seen'))document.documentElement.classList.add('seen')}catch(e){}",
    tagPosition: 'head',
  }],
})

onMounted(() => {
  const seen = document.documentElement.classList.contains('seen')
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (seen || reduced) { visible.value = false; ready.value = true; return }

  document.documentElement.style.overflow = 'hidden'
  const chars = letters.value?.children
  if (chars) {
    animate(chars, { opacity: [0, 1], y: ['40%', 0], filter: ['blur(8px)', 'blur(0px)'], duration: 600, delay: stagger(60), ease: 'outCubic' })
  }
  setTimeout(() => {
    if (root.value) {
      animate(root.value, {
        opacity: [1, 0], duration: 500, ease: 'inOutQuad',
        onComplete: () => { visible.value = false },
      })
    }
    document.documentElement.style.overflow = ''
    sessionStorage.setItem('fundere-seen', '1')
    ready.value = true
  }, 1500)
})
</script>

<template>
  <div v-if="visible" ref="root" class="preloader fixed inset-0 z-[90] flex flex-col items-center justify-center bg-ink" aria-hidden="true">
    <BrandLogo class="mb-6 size-20 text-white sm:size-28" />
    <div ref="letters" class="flex font-display text-4xl tracking-[0.3em] text-accent sm:text-6xl">
      <span v-for="(c, i) in 'FUNDERE'.split('')" :key="i" class="inline-block">{{ c }}</span>
    </div>
    <p class="mt-4 font-display text-[10px] tracking-[0.4em] text-white/40">SOFTWARE STUDIO</p>
  </div>
</template>
