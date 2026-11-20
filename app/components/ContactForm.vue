<script setup lang="ts">
import { z } from 'zod'

const schema = z.object({
  name: z.string().trim().min(2, 'Tell us your name.'),
  email: z.string().trim().email('Enter a valid email, like you@company.com.'),
  message: z.string().trim().min(10, 'Add at least 10 characters about your project.'),
})
type Field = 'name' | 'email' | 'message'

const form = reactive({ name: '', email: '', message: '', website: '' })
const touched = reactive<Record<Field, boolean>>({ name: false, email: false, message: false })
const status = ref<'idle' | 'sending' | 'sent' | 'error'>('idle')
const serverError = ref('')
const root = ref<HTMLElement | null>(null)
const burst = ref<HTMLCanvasElement | null>(null)

const errors = computed(() => {
  const r = schema.safeParse(form)
  const out: Partial<Record<Field, string>> = {}
  if (!r.success) for (const i of r.error.issues) out[i.path[0] as Field] ??= i.message
  return out
})
const showError = (f: Field) => (touched[f] ? errors.value[f] : undefined)

async function submit() {
  Object.keys(touched).forEach(k => (touched[k as Field] = true))
  const first = (['name', 'email', 'message'] as Field[]).find(f => errors.value[f])
  if (first) { (root.value?.querySelector(`[name="${first}"]`) as HTMLElement | null)?.focus(); return }

  status.value = 'sending'
  serverError.value = ''
  try {
    await $fetch('/api/contact', { method: 'POST', body: form })
    status.value = 'sent'
    embers()
    Object.assign(form, { name: '', email: '', message: '', website: '' })
    Object.keys(touched).forEach(k => (touched[k as Field] = false))
    setTimeout(() => { if (status.value === 'sent') status.value = 'idle' }, 4000)
  }
  catch (e: any) {
    status.value = 'error'
    serverError.value = e?.data?.statusMessage || 'We could not send your message. Check your connection and try again.'
  }
}

// A short burst of embers from the button on success.
function embers() {
  const c = burst.value
  if (!c || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const ctx = c.getContext('2d')!
  const r = c.getBoundingClientRect()
  c.width = r.width; c.height = r.height
  const ps = Array.from({ length: 36 }, () => ({
    x: r.width / 2, y: r.height / 2,
    vx: (Math.random() - 0.5) * 7, vy: -Math.random() * 6 - 1, life: 0,
  }))
  const step = () => {
    ctx.clearRect(0, 0, c.width, c.height)
    let alive = false
    for (const p of ps) {
      p.vy += 0.15; p.x += p.vx; p.y += p.vy; p.life++
      const a = 1 - p.life / 60
      if (a > 0) { alive = true; ctx.fillStyle = `rgba(255,${120 + Math.random() * 80},30,${a})`; ctx.fillRect(p.x, p.y, 3, 3) }
    }
    if (alive) requestAnimationFrame(step)
    else ctx.clearRect(0, 0, c.width, c.height)
  }
  requestAnimationFrame(step)
}

const field = 'peer w-full rounded-lg border bg-panel px-4 pb-2 pt-6 text-white outline-none transition-colors placeholder-transparent focus:border-accent'
const lab = 'pointer-events-none absolute left-4 top-4 origin-left text-sm text-white/50 transition-all duration-200 peer-focus:top-2 peer-focus:scale-75 peer-focus:text-accent peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:scale-75'
</script>

<template>
  <section id="contact" ref="root" class="px-6 py-28">
    <div class="mx-auto max-w-xl">
      <ScrambleHeading text="Tell us what to build" class="font-display text-4xl sm:text-5xl" />
      <p class="mt-4 text-white/60">Share a few details and we will reply within two business days.</p>

      <form class="mt-10 space-y-5" novalidate @submit.prevent="submit">
        <div class="relative">
          <input id="f-name" v-model="form.name" name="name" placeholder="Name" autocomplete="name" :aria-invalid="!!showError('name')" aria-describedby="e-name" :class="[field, showError('name') ? 'border-red-400' : 'border-line']" @blur="touched.name = true">
          <label for="f-name" :class="lab">Name</label>
          <p id="e-name" class="mt-1 min-h-4 text-xs text-red-400" role="alert">{{ showError('name') }}</p>
        </div>
        <div class="relative">
          <input id="f-email" v-model="form.email" name="email" type="email" placeholder="Email" autocomplete="email" :aria-invalid="!!showError('email')" aria-describedby="e-email" :class="[field, showError('email') ? 'border-red-400' : 'border-line']" @blur="touched.email = true">
          <label for="f-email" :class="lab">Email</label>
          <p id="e-email" class="mt-1 min-h-4 text-xs text-red-400" role="alert">{{ showError('email') }}</p>
        </div>
        <div class="relative">
          <textarea id="f-message" v-model="form.message" name="message" rows="5" placeholder="Project details" :aria-invalid="!!showError('message')" aria-describedby="e-message" :class="[field, showError('message') ? 'border-red-400' : 'border-line']" @blur="touched.message = true" />
          <label for="f-message" :class="lab">Project details</label>
          <p id="e-message" class="mt-1 min-h-4 text-xs text-red-400" role="alert">{{ showError('message') }}</p>
        </div>
        <input v-model="form.website" tabindex="-1" autocomplete="off" class="hidden" aria-hidden="true">

        <div class="relative inline-block">
          <button
            v-magnetic="0.25"
            :disabled="status === 'sending'"
            class="relative min-w-40 overflow-hidden rounded-lg bg-accent px-6 py-3 text-sm font-medium text-black transition-all disabled:opacity-70"
            :class="status === 'sent' ? '!bg-emerald-400' : ''"
          >
            <span v-if="status === 'sending'" class="inline-flex items-center gap-2"><span class="size-3 animate-spin rounded-full border-2 border-black/30 border-t-black" />Sending</span>
            <span v-else-if="status === 'sent'">Sent ✓</span>
            <span v-else>Send message</span>
          </button>
          <canvas ref="burst" class="pointer-events-none absolute -inset-16 h-[calc(100%+8rem)] w-[calc(100%+8rem)]" aria-hidden="true" />
        </div>

        <p v-if="status === 'sent'" role="status" class="text-sm text-accent">Message sent. We will be in touch soon.</p>
        <p v-if="status === 'error'" role="alert" class="text-sm text-red-400">{{ serverError }}</p>
      </form>
    </div>
  </section>
</template>
