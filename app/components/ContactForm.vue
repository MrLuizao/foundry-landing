<script setup lang="ts">
import { z } from 'zod'

const schema = z.object({
  name: z.string().trim().min(2, 'Tell us your name.'),
  email: z.string().trim().email('Enter a valid email, like you@company.com.'),
  message: z.string().trim().min(10, 'Add at least 10 characters about your project.'),
  accepted: z.literal(true, { message: 'Please accept to continue.' }),
})

type Field = 'name' | 'email' | 'message' | 'accepted'

const audienceOptions = [
  'A business I own or work for',
  'A client\'s business',
] as const

const form = reactive({
  projectFor: audienceOptions[0] as string,
  name: '',
  email: '',
  message: '',
  accepted: false,
  website: '',
})
const touched = reactive<Record<Field, boolean>>({
  name: false,
  email: false,
  message: false,
  accepted: false,
})
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
  const first = (['name', 'email', 'message', 'accepted'] as Field[]).find(f => errors.value[f])
  if (first) {
    (root.value?.querySelector(`[name="${first}"]`) as HTMLElement | null)?.focus()
    return
  }

  status.value = 'sending'
  serverError.value = ''
  try {
    await $fetch('/api/contact', {
      method: 'POST',
      body: {
        projectFor: form.projectFor,
        name: form.name,
        email: form.email,
        message: form.message,
        website: form.website,
      },
    })
    status.value = 'sent'
    embers()
    Object.assign(form, {
      projectFor: audienceOptions[0],
      name: '',
      email: '',
      message: '',
      accepted: false,
      website: '',
    })
    Object.keys(touched).forEach(k => (touched[k as Field] = false))
  }
  catch (e: any) {
    status.value = 'error'
    serverError.value = e?.data?.statusMessage || 'We could not send your message. Check your connection and try again.'
  }
}

function resetForm() {
  status.value = 'idle'
  serverError.value = ''
}

// A short burst of embers from the button on success.
function embers() {
  const c = burst.value
  if (!c || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const ctx = c.getContext('2d')!
  const r = c.getBoundingClientRect()
  c.width = r.width
  c.height = r.height
  const ps = Array.from({ length: 36 }, () => ({
    x: r.width / 2,
    y: r.height / 2,
    vx: (Math.random() - 0.5) * 7,
    vy: -Math.random() * 6 - 1,
    life: 0,
  }))
  const stepFrame = () => {
    ctx.clearRect(0, 0, c.width, c.height)
    let alive = false
    for (const p of ps) {
      p.vy += 0.15
      p.x += p.vx
      p.y += p.vy
      p.life++
      const a = 1 - p.life / 60
      if (a > 0) {
        alive = true
        ctx.fillStyle = `rgba(255,${120 + Math.random() * 80},30,${a})`
        ctx.fillRect(p.x, p.y, 3, 3)
      }
    }
    if (alive) requestAnimationFrame(stepFrame)
    else ctx.clearRect(0, 0, c.width, c.height)
  }
  requestAnimationFrame(stepFrame)
}
</script>

<template>
  <section id="contact" ref="root" class="px-6 py-28">
    <div class="mx-auto max-w-2xl">
      <ScrambleHeading text="Tell us what to build" class="font-display text-4xl sm:text-5xl" />
      <p class="mt-4 text-white/60">
        Share a few details and we will reply within two business days.
      </p>

      <div class="relative mt-10 rounded-card border border-line bg-panel p-6 sm:p-10">
        <!-- Sent confirmation state -->
        <div v-if="status === 'sent'" class="py-10" role="status">
          <span class="inline-flex size-10 items-center justify-center rounded-lg border border-accent/40 bg-accent/10 text-sm text-accent">
            ✓
          </span>
          <h3 class="mt-5 font-display text-2xl text-white">Message received</h3>
          <p class="mt-2 max-w-sm text-sm leading-relaxed text-white/60">
            Thanks for reaching out. We will review your note and reply within two business days.
          </p>
          <button
            v-magnetic
            type="button"
            class="mt-8 inline-block rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-black"
            @click="resetForm"
          >
            Send another message
          </button>
        </div>

        <!-- Single-step form -->
        <form v-else class="space-y-8" novalidate @submit.prevent="submit">
          <fieldset>
            <legend class="text-xs font-medium tracking-wide text-white/50">
              Who's this project for?
            </legend>
            <div class="mt-3.5 flex flex-col gap-3 sm:flex-row sm:gap-8">
              <label
                v-for="opt in audienceOptions"
                :key="opt"
                class="flex cursor-pointer items-center gap-3 text-sm transition-colors"
                :class="form.projectFor === opt ? 'text-white' : 'text-white/50 hover:text-white/80'"
              >
                <input
                  v-model="form.projectFor"
                  type="radio"
                  name="projectFor"
                  :value="opt"
                  class="sr-only"
                >
                <span
                  class="flex size-4 shrink-0 items-center justify-center rounded-full border transition-colors"
                  :class="form.projectFor === opt ? 'border-accent' : 'border-white/25'"
                >
                  <span
                    class="size-1.5 rounded-full bg-accent transition-transform duration-200"
                    :class="form.projectFor === opt ? 'scale-100' : 'scale-0'"
                  />
                </span>
                <span>{{ opt }}</span>
              </label>
            </div>
          </fieldset>

          <div class="space-y-5">
            <div>
              <label for="f-name" class="sr-only">Your name</label>
              <input
                id="f-name"
                v-model="form.name"
                name="name"
                type="text"
                autocomplete="name"
                placeholder="Your name"
                :aria-invalid="!!showError('name')"
                aria-describedby="e-name"
                class="w-full border-l-2 bg-transparent py-2 pl-4 text-base text-white outline-none transition-colors placeholder:text-white/30"
                :class="showError('name') ? 'border-red-400' : form.name ? 'border-white' : 'border-white/25 focus:border-accent'"
                @blur="touched.name = true"
              >
              <p v-if="showError('name')" id="e-name" class="mt-1.5 pl-4 text-xs text-red-400" role="alert">
                {{ showError('name') }}
              </p>
            </div>

            <div>
              <label for="f-email" class="sr-only">Email address</label>
              <input
                id="f-email"
                v-model="form.email"
                name="email"
                type="email"
                autocomplete="email"
                placeholder="you@company.com"
                :aria-invalid="!!showError('email')"
                aria-describedby="e-email"
                class="w-full border-l-2 bg-transparent py-2 pl-4 text-base text-white outline-none transition-colors placeholder:text-white/30"
                :class="showError('email') ? 'border-red-400' : form.email ? 'border-accent' : 'border-white/25 focus:border-accent'"
                @blur="touched.email = true"
              >
              <p v-if="showError('email')" id="e-email" class="mt-1.5 pl-4 text-xs text-red-400" role="alert">
                {{ showError('email') }}
              </p>
            </div>

            <div>
              <label for="f-message" class="sr-only">Project details</label>
              <textarea
                id="f-message"
                v-model="form.message"
                name="message"
                rows="4"
                placeholder="Tell us about your project, timeline, and goals..."
                :aria-invalid="!!showError('message')"
                aria-describedby="e-message"
                class="w-full resize-none border-l-2 bg-transparent py-2 pl-4 text-base leading-relaxed text-white outline-none transition-colors placeholder:text-white/30"
                :class="showError('message') ? 'border-red-400' : form.message ? 'border-accent' : 'border-white/25 focus:border-accent'"
                @blur="touched.message = true"
              />
              <p v-if="showError('message')" id="e-message" class="mt-1.5 pl-4 text-xs text-red-400" role="alert">
                {{ showError('message') }}
              </p>
            </div>
          </div>

          <div>
            <label class="flex cursor-pointer items-center gap-3 text-sm text-white/60">
              <input
                v-model="form.accepted"
                name="accepted"
                type="checkbox"
                class="sr-only"
                @change="touched.accepted = true"
              >
              <span
                class="flex size-4 shrink-0 items-center justify-center rounded border transition-colors"
                :class="form.accepted ? 'border-accent bg-accent text-black' : showError('accepted') ? 'border-red-400' : 'border-white/25'"
              >
                <svg v-if="form.accepted" viewBox="0 0 12 12" class="size-2.5" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M2 6.5 4.5 9 10 3" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </span>
              <span>
                I accept the <span class="text-accent">Fundere Project Inquiry Terms</span>
              </span>
            </label>
            <p v-if="showError('accepted')" class="mt-1.5 pl-7 text-xs text-red-400" role="alert">
              {{ showError('accepted') }}
            </p>
          </div>

          <p v-if="status === 'error'" role="alert" class="text-sm text-red-400">
            {{ serverError }}
          </p>

          <input v-model="form.website" tabindex="-1" autocomplete="off" class="hidden" aria-hidden="true">

          <div class="relative inline-block">
            <button
              v-magnetic
              type="submit"
              :disabled="status === 'sending'"
              class="inline-flex min-w-40 items-center justify-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-black disabled:opacity-70"
            >
              <span v-if="status === 'sending'" class="inline-flex items-center gap-2">
                <span class="size-3.5 animate-spin rounded-full border-2 border-black/30 border-t-black" />
                Sending
              </span>
              <span v-else>Send message</span>
            </button>
            <canvas
              ref="burst"
              class="pointer-events-none absolute -inset-16 h-[calc(100%+8rem)] w-[calc(100%+8rem)]"
              aria-hidden="true"
            />
          </div>
        </form>
      </div>
    </div>
  </section>
</template>
