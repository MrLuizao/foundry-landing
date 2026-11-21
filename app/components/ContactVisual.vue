<script setup lang="ts">
// Sculpted orange wireframe mesh + floating code card for the contact split layout.
const rows = 14
const cols = 14

// Generate organic warped 2D projection of a curved surface grid (viewBox 0 0 420 420)
function point(u: number, v: number) {
  const x0 = 42 + u * 336
  const y0 = 42 + v * 336
  const dx = u - 0.5
  const dy = v - 0.5
  const pinch = Math.exp(-((dx * dx) / 0.14 + (dy * dy) / 0.18))
  const waveX = Math.sin(v * Math.PI * 1.6) * 26 * (1 - Math.abs(dx) * 1.1) - dx * pinch * 72
  const waveY = Math.cos(u * Math.PI * 1.4) * 22 * (1 - Math.abs(dy) * 0.9) + Math.sin((u + v) * Math.PI) * 14 - dy * pinch * 36
  return { x: +(x0 + waveX).toFixed(1), y: +(y0 + waveY).toFixed(1) }
}

function buildPath(pts: { x: number; y: number }[]) {
  return pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')
}

const hPaths = Array.from({ length: rows + 1 }, (_, r) =>
  buildPath(Array.from({ length: cols + 1 }, (_, c) => point(c / cols, r / rows))),
)

const vPaths = Array.from({ length: cols + 1 }, (_, c) =>
  buildPath(Array.from({ length: rows + 1 }, (_, r) => point(c / cols, r / rows))),
)

const focusRow = buildPath(Array.from({ length: cols + 1 }, (_, c) => point(c / cols, 7 / rows)))
const focusCol = buildPath(Array.from({ length: rows + 1 }, (_, r) => point(7 / cols, r / rows)))
const focalNode = point(7 / cols, 7 / rows)
</script>

<template>
  <div class="contact-visual relative flex min-h-[380px] flex-col justify-between overflow-hidden p-6 sm:min-h-[460px] sm:p-8">
    <!-- Brand mark -->
    <div class="relative z-10 flex items-center justify-between">
      <span class="font-display text-xs font-medium tracking-[0.22em] text-white/95">
        FUNDERE<sup class="ml-0.5 text-[9px] opacity-80">®</sup>
      </span>
    </div>

    <!-- Organic warped wireframe mesh -->
    <svg
      viewBox="0 0 420 420"
      class="pointer-events-none absolute inset-0 h-full w-full"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="fundere-node-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.95" />
          <stop offset="28%" stop-color="#ffd2b0" stop-opacity="0.55" />
          <stop offset="100%" stop-color="#ff5a14" stop-opacity="0" />
        </radialGradient>
      </defs>

      <g fill="none" stroke="rgba(255,255,255,0.22)" stroke-width="0.9">
        <path v-for="(d, i) in hPaths" :key="`h-${i}`" :d="d" />
        <path v-for="(d, i) in vPaths" :key="`v-${i}`" :d="d" />
      </g>

      <!-- Highlighted meridian lines intersecting at focal node -->
      <g fill="none" stroke="rgba(255,255,255,0.72)" stroke-width="1.25">
        <path :d="focusRow" />
        <path :d="focusCol" />
      </g>

      <!-- Luminous focal node -->
      <circle :cx="focalNode.x" :cy="focalNode.y" r="30" fill="url(#fundere-node-glow)" />
      <circle :cx="focalNode.x" :cy="focalNode.y" r="5" fill="#ffffff" />
    </svg>

    <!-- Floating dark code window -->
    <div class="relative z-10 ml-auto mt-auto w-full max-w-[260px] overflow-hidden border border-white/15 bg-[#1a0a04]/85 shadow-2xl backdrop-blur-md">
      <div class="flex items-center gap-1.5 border-b border-white/10 bg-white/[0.04] px-3 py-2">
        <span class="size-2 rounded-full bg-[#ff5f56]" />
        <span class="size-2 rounded-full bg-[#ffbd2e]" />
        <span class="size-2 rounded-full bg-[#27c93f]" />
      </div>
      <pre class="overflow-x-auto p-3.5 font-display text-[11px] leading-relaxed text-white/80"><code><span class="text-[#7aa2f7]">import</span> { cast } <span class="text-[#7aa2f7]">from</span> <span class="text-[#ff9e64]">'@fundere/core'</span>

<span class="text-[#7aa2f7]">export function</span> <span class="text-[#ff7a1a]">forge</span>(brief) {
  <span class="text-[#7aa2f7]">return</span> cast(brief, {
    craft: <span class="text-[#ff9e64]">'production'</span>
  })
}</code></pre>
    </div>
  </div>
</template>

<style scoped>
.contact-visual {
  background:
    radial-gradient(circle at 30% 25%, #ff7a1a 0%, transparent 55%),
    linear-gradient(145deg, #ff5912 0%, #f04308 55%, #d93604 100%);
}
</style>
