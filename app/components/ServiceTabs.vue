<script setup lang="ts">
const services = [
  { id: 'web', label: 'Web', title: 'Fast sites and web apps', body: 'Nuxt and Vue front ends with server-side rendering, built for speed, SEO and the long run.', variant: 1 },
  { id: 'apps', label: 'Apps', title: 'Mobile and cross-platform', body: 'Apps your users keep on their home screen, with one codebase and native-feeling polish.', variant: 2 },
  { id: 'backend', label: 'Backend', title: 'APIs that hold up', body: 'Secure APIs, payments, email and integrations, validated at every edge.', variant: 5 },
  { id: 'product', label: 'Product', title: 'From idea to launch', body: 'Scoping, design and delivery in short cycles, so you see working software every week.', variant: 4 },
]
const active = ref(services[0]!.id)
const current = computed(() => services.find(s => s.id === active.value)!)
const tabs = ref<HTMLElement[]>([])
const list = ref<HTMLElement | null>(null)
const pill = reactive({ x: 0, w: 0 })

function movePill() {
  const i = services.findIndex(s => s.id === active.value)
  const el = tabs.value[i]
  if (el) { pill.x = el.offsetLeft; pill.w = el.offsetWidth }
}
function onKey(e: KeyboardEvent) {
  const i = services.findIndex(s => s.id === active.value)
  let n = i
  if (e.key === 'ArrowRight') n = (i + 1) % services.length
  else if (e.key === 'ArrowLeft') n = (i - 1 + services.length) % services.length
  else return
  e.preventDefault()
  active.value = services[n]!.id
  tabs.value[n]?.focus()
}
watch(active, () => nextTick(movePill))
onMounted(() => { movePill(); window.addEventListener('resize', movePill); onBeforeUnmount(() => window.removeEventListener('resize', movePill)) })
</script>

<template>
  <section id="services" class="px-6 py-28">
    <div class="mx-auto max-w-4xl text-center">
      <ScrambleHeading text="One studio, every layer of your product" class="font-serif text-4xl font-semibold sm:text-5xl" />
      <p class="mx-auto mt-5 max-w-xl text-sm text-white/60 sm:text-base">
        Pick what you need. We take the project from first sketch to production and stay for what comes next.
      </p>

      <div ref="list" role="tablist" aria-label="Services" class="relative mx-auto mt-10 inline-flex rounded-full border border-line bg-panel p-1" @keydown="onKey">
        <span class="absolute left-0 top-1 h-[calc(100%-0.5rem)] rounded-full bg-white transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" :style="{ transform: `translateX(${pill.x}px)`, width: `${pill.w}px` }" aria-hidden="true" />
        <button
          v-for="s in services"
          :id="`tab-${s.id}`"
          :key="s.id"
          :ref="(el) => { if (el) tabs[services.indexOf(s)] = el as HTMLElement }"
          role="tab"
          :tabindex="active === s.id ? 0 : -1"
          :aria-selected="active === s.id"
          :aria-controls="`panel-${s.id}`"
          class="relative z-10 rounded-full px-5 py-2 text-sm transition-colors duration-300"
          :class="active === s.id ? 'text-black' : 'text-white/80 hover:text-white'"
          @click="active = s.id"
        >
          {{ s.label }}
        </button>
      </div>

      <AnimeTransition mode="out-in">
        <div
          :id="`panel-${current.id}`"
          :key="current.id"
          role="tabpanel"
          :aria-labelledby="`tab-${current.id}`"
          class="mt-10 grid items-center gap-8 rounded-card border border-line bg-panel p-6 text-left md:grid-cols-2 md:p-10"
        >
          <div v-tilt="6" class="relative rounded-card"><ArtCard :variant="current.variant" class="aspect-[4/3]" /></div>
          <div>
            <h3 class="font-serif text-3xl font-semibold">{{ current.title }}</h3>
            <p class="mt-4 text-white/70">{{ current.body }}</p>
          </div>
        </div>
      </AnimeTransition>
    </div>
  </section>
</template>
