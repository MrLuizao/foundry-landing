<script setup lang="ts">
// Heading that scrambles into place whenever it scrolls into view.
const props = defineProps<{ text: string; tag?: string }>()
const el = ref<HTMLElement | null>(null)
const hasPlayed = ref(false)

const anim = useScrambleText(el, { autoplay: false }, () => ({ text: props.text, duration: 900 }))

watch(() => props.text, async () => {
  await nextTick()
  if (hasPlayed.value) {
    anim.restart()
  }
})

onMounted(() => {
  let visible = false
  const io = new IntersectionObserver(([e]) => {
    if (!e) return
    if (e.isIntersecting && !visible) {
      visible = true
      hasPlayed.value = true
      anim.restart()
    }
    else if (!e.isIntersecting) {
      visible = false
    }
  }, { threshold: 0.4, rootMargin: '0px 0px -15% 0px' })
  if (el.value) io.observe(el.value)
  onBeforeUnmount(() => io.disconnect())
})
</script>

<template>
  <component :is="tag ?? 'h2'" ref="el">{{ text }}</component>
</template>
