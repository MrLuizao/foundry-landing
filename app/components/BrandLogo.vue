<script setup lang="ts">
withDefaults(defineProps<{
  decorative?: boolean
}>(), {
  decorative: true,
})
</script>

<template>
  <svg
    viewBox="0 0 32 32"
    fill="currentColor"
    :aria-hidden="decorative ? 'true' : undefined"
    :role="decorative ? undefined : 'img'"
    :aria-label="decorative ? undefined : 'Fundere logo'"
  >
    <path d="M5 4H26L20 10H11V28H5V4Z" />
    <path d="M14 12.5H18L24.5 18L18 23.5H14L20.5 18L14 12.5Z" />
  </svg>
</template>
