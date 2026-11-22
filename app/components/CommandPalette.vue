<script setup lang="ts">
const { t, toggleLocale } = useI18n()

// Command palette: Cmd/Ctrl+K. Keyboard-first navigation and quick actions.
const open = ref(false)
const query = ref('')
const index = ref(0)
const dialog = ref<HTMLDialogElement | null>(null)
const input = ref<HTMLInputElement | null>(null)
const copied = ref(false)
const EMAIL = 'hello@fundere.software'

const actions = computed(() => [
  { id: 'home', label: t.value.palette.actions.home, run: () => go('#home') },
  { id: 'solutions', label: t.value.palette.actions.solutions, run: () => go('#solutions') },
  { id: 'cases', label: t.value.palette.actions.cases, run: () => go('#cases') },
  { id: 'about', label: t.value.palette.actions.about, run: () => go('#about') },
  { id: 'contact', label: t.value.palette.actions.contact, run: () => go('#contact') },
  { id: 'lang', label: t.value.palette.actions.toggleLang, run: () => { toggleLocale(); close() } },
  { id: 'email', label: t.value.palette.actions.email, run: async () => { await navigator.clipboard?.writeText(EMAIL); copied.value = true; setTimeout(() => (copied.value = false), 1800) } },
])

const keywords: Record<string, string> = {
  home: 'top hero start inicio principal',
  solutions: 'services web apps backend product servicios soluciones productos',
  cases: 'work projects portfolio gallery proyectos casos portafolio',
  about: 'us manifesto process legacy craft team nosotros manifiesto equipo',
  contact: 'start project form hire quote talk contacto iniciar proyecto cotizar hablar',
  lang: 'language idioma english español switch cambiar toggle traducir',
  email: 'mail copy hello correo copiar escribir',
}

const results = computed(() => {
  const q = query.value.trim().toLowerCase()
  return actions.value.filter(a => !q || `${a.label} ${keywords[a.id] ?? ''}`.toLowerCase().includes(q))
})

function go(hash: string) {
  close()
  const a = document.createElement('a')
  a.href = hash
  document.body.appendChild(a); a.click(); a.remove()
}
function close() { dialog.value?.close() }
async function show() {
  query.value = ''; index.value = 0; open.value = true
  await nextTick(); dialog.value?.showModal(); input.value?.focus()
}
function onKey(e: KeyboardEvent) {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); open.value ? close() : show() }
}
function onInputKey(e: KeyboardEvent) {
  if (e.key === 'ArrowDown') { e.preventDefault(); index.value = (index.value + 1) % Math.max(results.value.length, 1) }
  else if (e.key === 'ArrowUp') { e.preventDefault(); index.value = (index.value - 1 + results.value.length) % Math.max(results.value.length, 1) }
  else if (e.key === 'Enter') { results.value[index.value]?.run() }
}
watch(query, () => (index.value = 0))
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
defineExpose({ show })
</script>

<template>
  <dialog
    ref="dialog"
    class="mx-auto mt-[15vh] w-[min(92vw,34rem)] overflow-hidden rounded-xl border border-line bg-panel p-0 text-white backdrop:bg-black/70 backdrop:backdrop-blur-sm"
    aria-label="Command palette"
    @close="open = false"
    @click="(e: MouseEvent) => e.target === dialog && close()"
  >
    <input
      ref="input"
      v-model="query"
      role="combobox"
      aria-expanded="true"
      aria-controls="palette-list"
      :placeholder="t.palette.placeholder"
      class="w-full border-b border-line bg-transparent px-5 py-4 text-sm outline-none placeholder:text-white/40"
      @keydown="onInputKey"
    >
    <ul id="palette-list" role="listbox" class="max-h-72 overflow-auto p-2">
      <li
        v-for="(a, i) in results"
        :key="a.id"
        role="option"
        :aria-selected="i === index"
        class="flex cursor-pointer items-center justify-between rounded-lg px-3 py-2.5 text-sm"
        :class="i === index ? 'bg-accent text-black' : 'text-white/80'"
        @pointermove="index = i"
        @click="a.run()"
      >
        <span>{{ a.label }}</span>
        <span v-if="a.id === 'email' && copied" class="font-display text-xs">{{ t.palette.copied }}</span>
      </li>
      <li v-if="!results.length" class="px-3 py-6 text-center text-sm text-white/50">
        {{ t.palette.noResults }}
      </li>
    </ul>
    <p class="border-t border-line px-5 py-2 font-display text-[10px] text-white/40">
      {{ t.palette.footerHint }}
    </p>
  </dialog>
</template>
