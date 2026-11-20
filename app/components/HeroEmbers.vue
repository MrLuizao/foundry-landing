<script setup lang="ts">
// Embers that drift upward and lean toward the pointer. Paused when off-screen or hidden.
const canvas = ref<HTMLCanvasElement | null>(null)

interface P { x: number; y: number; vx: number; vy: number; r: number; life: number; max: number }

onMounted(() => {
  const c = canvas.value!
  const ctx = c.getContext('2d')!
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  let w = 0, h = 0, raf = 0, running = false
  const mouse = { x: -9999, y: -9999 }
  const count = window.innerWidth < 640 ? 40 : 90
  const ps: P[] = []

  const spawn = (p?: P): P => {
    const q = p ?? ({} as P)
    q.x = Math.random() * w; q.y = h + Math.random() * 40
    q.vx = (Math.random() - 0.5) * 0.3; q.vy = -(0.3 + Math.random() * 0.9)
    q.r = 0.6 + Math.random() * 1.8; q.life = 0; q.max = 200 + Math.random() * 300
    return q
  }
  const resize = () => {
    const r = c.getBoundingClientRect()
    w = r.width; h = r.height
    c.width = w * dpr; c.height = h * dpr
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  }
  const draw = (still = false) => {
    ctx.clearRect(0, 0, w, h)
    for (const p of ps) {
      if (!still) {
        const dx = mouse.x - p.x, dy = mouse.y - p.y
        const d2 = dx * dx + dy * dy
        if (d2 < 40000) { const f = (1 - d2 / 40000) * 0.06; p.vx += dx * f * 0.05; p.vy += dy * f * 0.05 }
        p.vx *= 0.99
        p.x += p.vx + Math.sin((p.y + p.life) * 0.01) * 0.2
        p.y += p.vy; p.life++
        if (p.life > p.max || p.y < -10) spawn(p)
      }
      const a = Math.sin(Math.min(p.life / p.max, 1) * Math.PI)
      ctx.beginPath()
      ctx.fillStyle = `rgba(255, ${110 + Math.floor(p.r * 40)}, 30, ${a * 0.85})`
      ctx.shadowColor = 'rgba(255,122,26,0.8)'; ctx.shadowBlur = 8
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill()
    }
  }
  const tick = () => { draw(); raf = requestAnimationFrame(tick) }
  const start = () => { if (!running && !reduced) { running = true; raf = requestAnimationFrame(tick) } }
  const stop = () => { running = false; cancelAnimationFrame(raf) }

  resize()
  for (let i = 0; i < count; i++) { const p = spawn(); p.y = Math.random() * h; p.life = Math.random() * p.max; ps.push(p) }
  if (reduced) draw(true)

  const onMove = (e: PointerEvent) => { const r = c.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top }
  const io = new IntersectionObserver(([e]) => (e!.isIntersecting ? start() : stop()))
  const onVis = () => (document.hidden ? stop() : start())
  io.observe(c)
  window.addEventListener('pointermove', onMove, { passive: true })
  window.addEventListener('resize', resize)
  document.addEventListener('visibilitychange', onVis)
  onBeforeUnmount(() => {
    stop(); io.disconnect()
    window.removeEventListener('pointermove', onMove)
    window.removeEventListener('resize', resize)
    document.removeEventListener('visibilitychange', onVis)
  })
})
</script>

<template>
  <canvas ref="canvas" class="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true" />
</template>
