<script setup lang="ts">
// Renders real case study imagery when provided, falling back to stylized studio gradients.
const props = defineProps<{ variant: number; label?: string; image?: string }>()

const arts = [
  'radial-gradient(circle at 28% 30%, #f2c230 0 16%, transparent 17%), linear-gradient(160deg, #f1e8d6 0 55%, #5b8fb9 55% 78%, #e8501a 78%)',
  'radial-gradient(circle at 70% 25%, #ffb347 0 14%, transparent 15%), linear-gradient(200deg, #0e1a2b, #1d3a5f)',
  'radial-gradient(circle at 50% 40%, #fff 0 8%, transparent 9%), linear-gradient(135deg, #f06fb0 0 50%, #ffcb2e 50%)',
  'radial-gradient(ellipse at 40% 50%, #b3243a 0 30%, transparent 31%), linear-gradient(160deg, #e7c9cc, #cf9aa2)',
  'radial-gradient(ellipse at 50% 50%, #cfe3f2 0 28%, transparent 29%), linear-gradient(160deg, #a8c8e6, #f4c4a8)',
  'radial-gradient(circle at 30% 60%, #ff7a1a 0 18%, transparent 19%), linear-gradient(160deg, #1a1a1a, #3a2a1e)',
]
const background = computed(() => arts[props.variant % arts.length])
</script>

<template>
  <figure
    class="relative overflow-hidden rounded-card bg-panel"
    :style="image ? undefined : { background }"
    role="img"
    :aria-label="label ?? 'Project artwork'"
  >
    <img
      v-if="image"
      :src="image"
      :alt="label ?? 'Project showcase'"
      loading="lazy"
      decoding="async"
      class="h-full w-full object-cover"
    >
    <div
      v-if="image"
      class="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"
      aria-hidden="true"
    />
    <figcaption v-if="label" class="absolute bottom-3 left-3 rounded-full bg-black/65 px-3 py-1 text-xs font-medium text-white backdrop-blur">
      {{ label }}
    </figcaption>
  </figure>
</template>
