<script setup lang="ts">
// Heading that scrambles into place the first time it scrolls into view.
const props = defineProps<{ text: string; tag?: string }>()
const el = ref<HTMLElement | null>(null)

const anim = useScrambleText(el, { autoplay: false }, () => ({ text: props.text, duration: 900 }))

onMounted(() => {
  const io = new IntersectionObserver(([e]) => {
    if (e?.isIntersecting) { anim.restart(); io.disconnect() }
  }, { threshold: 0.6 })
  if (el.value) io.observe(el.value)
  onBeforeUnmount(() => io.disconnect())
})
</script>

<template>
  <component :is="tag ?? 'h2'" ref="el" v-once>{{ text }}</component>
</template>
