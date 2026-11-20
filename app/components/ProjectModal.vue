<script setup lang="ts">
import { animate } from '#nanime/utils'
import type { Project } from '~/data/projects'

const props = defineProps<{ project: Project | null; origin: DOMRect | null }>()
const emit = defineEmits<{ close: [] }>()

const dialog = ref<HTMLDialogElement | null>(null)
const art = ref<HTMLElement | null>(null)
const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

watch(() => props.project, async (p) => {
  const d = dialog.value
  if (!d) return
  if (!p) { if (d.open) d.close(); return }
  d.showModal()
  await nextTick()
  // FLIP: start the artwork at the clicked card's rect, then settle in place.
  if (props.origin && art.value && !reduced()) {
    const to = art.value.getBoundingClientRect()
    const dx = props.origin.left - to.left
    const dy = props.origin.top - to.top
    animate(art.value, {
      x: [dx, 0], y: [dy, 0],
      scaleX: [props.origin.width / to.width, 1],
      scaleY: [props.origin.height / to.height, 1],
      duration: 550, ease: 'outExpo',
    })
  }
  const body = d.querySelector('[data-body]')
  if (body && !reduced()) animate(body, { opacity: [0, 1], y: [20, 0], delay: 200, duration: 500, ease: 'outCubic' })
})

function onBackdrop(e: MouseEvent) { if (e.target === dialog.value) emit('close') }
</script>

<template>
  <dialog
    ref="dialog"
    class="m-auto w-[min(92vw,56rem)] overflow-hidden rounded-card border border-line bg-panel p-0 text-white backdrop:bg-black/80 backdrop:backdrop-blur-sm"
    aria-labelledby="project-title"
    @close="emit('close')"
    @click="onBackdrop"
  >
    <div v-if="project" class="grid md:grid-cols-2">
      <div ref="art" class="origin-top-left">
        <ArtCard :variant="project.variant" class="aspect-square h-full w-full !rounded-none" :label="project.title" />
      </div>
      <div data-body class="flex flex-col justify-center gap-4 p-8">
        <h3 id="project-title" class="font-serif text-3xl font-semibold">{{ project.title }}</h3>
        <p class="text-white/70">{{ project.tagline }}</p>
        <p class="rounded-lg border border-line px-4 py-3 text-sm text-white/90"><strong class="text-accent">Result:</strong> {{ project.result }}</p>
        <ul class="flex flex-wrap gap-2" aria-label="Stack">
          <li v-for="s in project.stack" :key="s" class="rounded-full border border-line px-3 py-1 font-display text-xs text-white/70">{{ s }}</li>
        </ul>
        <div class="mt-2 flex gap-3">
          <a href="#contact" v-magnetic class="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-black" @click="emit('close')">Build something similar</a>
          <button class="rounded-lg border border-line px-4 py-2 text-sm text-white/80 hover:text-white" @click="emit('close')">Close</button>
        </div>
      </div>
    </div>
  </dialog>
</template>
