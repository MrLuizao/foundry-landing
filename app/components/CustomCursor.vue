<script setup lang="ts">
const dot = ref<HTMLElement | null>(null)
const ring = ref<HTMLElement | null>(null)
const label = ref('')
const mode = ref<'idle' | 'link' | 'drag' | 'text'>('idle')

onMounted(() => {
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
  if (!fine) return
  document.documentElement.classList.add('has-cursor')

  let x = -100, y = -100, rx = -100, ry = -100, raf = 0
  const move = (e: PointerEvent) => { x = e.clientX; y = e.clientY }
  const over = (e: PointerEvent) => {
    const t = e.target as Element
    const drag = t.closest('[data-cursor]')
    if (drag) { mode.value = 'drag'; label.value = drag.getAttribute('data-cursor') || ''; return }
    if (t.closest('input,textarea')) { mode.value = 'text'; return }
    mode.value = t.closest('a,button,[role="tab"]') ? 'link' : 'idle'
    label.value = ''
  }
  const loop = () => {
    rx += (x - rx) * 0.18
    ry += (y - ry) * 0.18
    if (dot.value) dot.value.style.transform = `translate3d(${x}px, ${y}px, 0)`
    if (ring.value) ring.value.style.transform = `translate3d(${rx}px, ${ry}px, 0)`
    raf = requestAnimationFrame(loop)
  }
  raf = requestAnimationFrame(loop)
  window.addEventListener('pointermove', move, { passive: true })
  document.addEventListener('pointerover', over, { passive: true })
  onBeforeUnmount(() => {
    cancelAnimationFrame(raf)
    window.removeEventListener('pointermove', move)
    document.removeEventListener('pointerover', over)
    document.documentElement.classList.remove('has-cursor')
  })
})
</script>

<template>
  <div class="pointer-events-none fixed left-0 top-0 z-[100] hidden [@media(hover:hover)_and_(pointer:fine)]:block" aria-hidden="true">
    <div ref="dot" class="fixed left-0 top-0">
      <span class="-ml-1 -mt-1 block size-2 rounded-full bg-accent transition-opacity" :class="mode === 'text' ? 'opacity-0' : 'opacity-100'" />
    </div>
    <div ref="ring" class="fixed left-0 top-0">
      <span
        class="-ml-5 -mt-5 flex size-10 items-center justify-center rounded-full border border-accent/70 font-display text-[10px] uppercase tracking-widest text-black transition-all duration-300"
        :class="{
          'scale-[1.8] bg-accent/20': mode === 'link',
          'scale-[2.4] border-transparent bg-accent': mode === 'drag',
          'scale-50 opacity-0': mode === 'text',
        }"
      >{{ mode === 'drag' ? label : '' }}</span>
    </div>
  </div>
</template>
