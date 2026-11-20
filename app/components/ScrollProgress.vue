<script setup lang="ts">
const bar = ref<HTMLElement | null>(null)

onMounted(() => {
  let raf = 0
  const update = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight
    const p = max > 0 ? window.scrollY / max : 0
    if (bar.value) bar.value.style.transform = `scaleX(${p})`
    raf = 0
  }
  const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }
  window.addEventListener('scroll', onScroll, { passive: true })
  update()
  onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))
})
</script>

<template>
  <div class="pointer-events-none fixed inset-x-0 top-0 z-50 h-0.5" aria-hidden="true">
    <div ref="bar" class="h-full origin-left bg-accent" style="transform: scaleX(0)" />
  </div>
</template>
