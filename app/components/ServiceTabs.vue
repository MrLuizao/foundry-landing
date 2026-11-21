<script setup lang="ts">
interface IndustryPoint {
  title: string
  body: string
}

interface IndustryArea {
  id: 'ai' | 'web3' | 'fintech' | 'cybersecurity'
  label: string
  eyebrow: string
  headline: string
  summary: string
  splitTitle: string
  points: IndustryPoint[]
  stack: string[]
}

const industries: IndustryArea[] = [
  {
    id: 'ai',
    label: 'AI',
    eyebrow: 'Artificial Intelligence',
    headline: 'Software and product engineering for AI companies',
    summary: 'We turn raw models, agents, and retrieval pipelines into fast, reliable products.',
    splitTitle: 'Built for AI teams shipping to production',
    points: [
      { title: 'Streaming & Copilots', body: 'Low-latency chat, generative UI, and transparent tool-call states.' },
      { title: 'Agents & Retrieval', body: 'Durable multi-step workflows and grounded RAG over your data.' },
      { title: 'Guardrails & Evals', body: 'Schema-enforced outputs, fallbacks, and trace observability.' },
    ],
    stack: ['AI SDK', 'TypeScript', 'Postgres', 'Edge APIs'],
  },
  {
    id: 'web3',
    label: 'Web3',
    eyebrow: 'Decentralized Systems',
    headline: 'Clear interfaces and resilient backends for Web3',
    summary: 'Fast, legible applications around wallets, chains, and live on-chain state.',
    splitTitle: 'Built for protocols that want real adoption',
    points: [
      { title: 'Wallet & Signing UX', body: 'Frictionless multi-chain connection, previews, and clear tx states.' },
      { title: 'On-Chain Indexing', body: 'Fast read layers so balances, positions, and feeds load instantly.' },
      { title: 'Protocol Dashboards', body: 'Clean staking, governance, and treasury tools built for clarity.' },
    ],
    stack: ['Vue 3 / Nuxt', 'Viem / Wagmi', 'TypeScript', 'Nitro'],
  },
  {
    id: 'fintech',
    label: 'Fintech',
    eyebrow: 'Financial Infrastructure',
    headline: 'High-trust financial products built for zero silent failures',
    summary: 'Onboarding, payouts, and auditable ledgers engineered with strict validation.',
    splitTitle: 'Built for teams moving real money',
    points: [
      { title: 'KYC & Onboarding', body: 'Streamlined verification flows that convert without cutting corners.' },
      { title: 'Payments & Ledgers', body: 'Idempotent webhooks, Stripe Connect, and clean reconciliation.' },
      { title: 'Audit & Permissions', body: 'Role-based access, immutable logs, and exportable reporting.' },
    ],
    stack: ['Nuxt', 'Stripe Connect', 'Postgres', 'Zod'],
  },
  {
    id: 'cybersecurity',
    label: 'Cybersecurity',
    eyebrow: 'Security & Compliance',
    headline: 'Sharp operational interfaces for security-first platforms',
    summary: 'Fast triage consoles, strict access boundaries, and compliance workflows.',
    splitTitle: 'Built for teams protecting critical systems',
    points: [
      { title: 'Threat & Posture UI', body: 'High-contrast triage views and fast search over large telemetry.' },
      { title: 'Zero-Trust Access', body: 'Granular RBAC, scoped API keys, and strict tenant isolation.' },
      { title: 'Audit Readiness', body: 'Tamper-evident trails and clean compliance evidence exports.' },
    ],
    stack: ['TypeScript', 'Node / Nitro', 'Postgres', 'Edge Security'],
  },
]

const track = ref<HTMLElement | null>(null)
const stage = ref<HTMLElement | null>(null)
const activeId = ref<IndustryArea['id']>('ai')
const current = computed(() => industries.find(a => a.id === activeId.value)!)
const tabs = ref<HTMLElement[]>([])
const pill = reactive({ x: 0, w: 0 })

// Scrubs --p (0 → 1) while scrolling through the sticky track; fully reversible on scroll-up.
const { progress } = useScrollProgress(track, { mode: 'sticky', target: stage, smooth: false })

function movePill() {
  const i = industries.findIndex(a => a.id === activeId.value)
  const el = tabs.value[i]
  if (el) {
    pill.x = el.offsetLeft
    pill.w = el.offsetWidth
  }
}

function selectIndustry(id: IndustryArea['id']) {
  activeId.value = id
  if (typeof window !== 'undefined' && track.value) {
    const isDesktop = window.innerWidth >= 768
    if (isDesktop && progress.value > 0.55) {
      const span = track.value.offsetHeight - window.innerHeight
      const targetTop = window.scrollY + track.value.getBoundingClientRect().top + Math.max(span * 0.48, 0)
      window.scrollTo({ top: targetTop, behavior: 'smooth' })
    }
    else if (!isDesktop && progress.value > 0.05) {
      const top = window.scrollY + track.value.getBoundingClientRect().top - 80
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }
}

function onKey(e: KeyboardEvent) {
  const i = industries.findIndex(a => a.id === activeId.value)
  let n = i
  if (e.key === 'ArrowRight') n = (i + 1) % industries.length
  else if (e.key === 'ArrowLeft') n = (i - 1 + industries.length) % industries.length
  else return
  e.preventDefault()
  selectIndustry(industries[n]!.id)
  tabs.value[n]?.focus()
}

watch(activeId, () => nextTick(movePill))
onMounted(() => {
  movePill()
  window.addEventListener('resize', movePill)
  onBeforeUnmount(() => window.removeEventListener('resize', movePill))
})
</script>

<template>
  <section id="solutions" class="border-t border-line px-4 py-20 sm:px-6 md:py-28">
    <div class="mx-auto max-w-5xl">
      <!-- On mobile (< md): header & card appear together.
           On desktop (md+): header appears first, fades out on scroll as the card enters, then card transitions Mini-Hero → split. -->
      <div ref="track" class="relative h-[185vh] md:h-[290vh]">
        <div
          ref="stage"
          class="solutions-stage sticky top-20 md:top-24"
          style="--p: 0"
        >
          <div class="relative">
            <!-- Editorial header -->
            <div
              class="editorial-intro mb-8 grid gap-6 md:absolute md:inset-x-0 md:top-16 md:mb-0 md:grid-cols-12 md:items-end"
              :class="progress < 0.38 ? 'md:pointer-events-auto' : 'md:pointer-events-none'"
            >
              <div class="md:col-span-8">
                <ScrambleHeading
                  text="You know the product is strong. Execution makes it undeniable."
                  class="font-serif text-3xl font-semibold leading-tight sm:text-5xl"
                />
              </div>
              <div class="md:col-span-4">
                <p class="font-display text-xs leading-relaxed text-white/60 sm:text-sm">
                  One senior team covering architecture, interface craft, and production delivery.
                </p>
              </div>
            </div>

            <!-- Unified rounded-card container -->
            <div
              class="solutions-card overflow-hidden rounded-card border border-line bg-panel"
              :class="progress >= 0.24 ? 'md:pointer-events-auto' : 'md:pointer-events-none'"
            >
            <!-- Signature Fundere sliding-pill tab bar inside the card -->
            <div class="flex justify-center border-b border-line px-4 py-4 sm:py-5">
              <div
                role="tablist"
                aria-label="Industries"
                class="relative inline-flex max-w-full overflow-x-auto rounded-full border border-line bg-ink p-1"
                @keydown="onKey"
              >
                <span
                  class="absolute left-0 top-1 h-[calc(100%-0.5rem)] rounded-full bg-accent transition-all duration-500 ease-[cubic-bezier(0.09,0.68,0.33,0.91)]"
                  :style="{ transform: `translateX(${pill.x}px)`, width: `${pill.w}px` }"
                  aria-hidden="true"
                />
                <button
                  v-for="(area, i) in industries"
                  :id="`focus-tab-${area.id}`"
                  :key="area.id"
                  :ref="(el) => { if (el) tabs[i] = el as HTMLElement }"
                  type="button"
                  role="tab"
                  :tabindex="activeId === area.id ? 0 : -1"
                  :aria-selected="activeId === area.id"
                  :aria-controls="`focus-panel-${area.id}`"
                  class="relative z-10 whitespace-nowrap rounded-full px-4 py-2 text-xs font-medium transition-colors duration-300 sm:px-5 sm:text-sm"
                  :class="activeId === area.id ? 'text-black' : 'text-white/75 hover:text-white'"
                  @click="selectIndustry(area.id)"
                >
                  {{ area.label }}
                </button>
              </div>
            </div>

            <!-- Subtle scroll-phase progress hairline -->
            <div class="h-px w-full bg-white/[0.06]" aria-hidden="true">
              <div class="phase-bar h-full bg-accent/70" />
            </div>

            <!-- Dual-phase industry showcase stage (works identically on mobile & desktop) -->
            <AnimeTransition mode="out-in">
              <div
                :id="`focus-panel-${current.id}`"
                :key="current.id"
                role="tabpanel"
                :aria-labelledby="`focus-tab-${current.id}`"
                class="relative min-h-[450px] overflow-hidden md:min-h-[420px]"
              >
                <!-- BLOCK 1: Centered Mini-Hero -->
                <div
                  class="stage-one absolute inset-0 flex flex-col items-center justify-center overflow-hidden px-5 py-10 text-center sm:px-12 md:py-16"
                  :class="progress < 0.65 ? 'md:pointer-events-auto' : 'pointer-events-none'"
                >
                  <div
                    class="orbital-ring pointer-events-none absolute left-1/2 top-1/2 size-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.06] sm:size-[440px]"
                    aria-hidden="true"
                  />
                  <div
                    class="orbital-ring-inner pointer-events-none absolute left-1/2 top-1/2 size-[200px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent/15 sm:size-[290px]"
                    aria-hidden="true"
                  />

                  <div class="relative z-10 mx-auto max-w-2xl">
                    <p class="font-display text-[11px] tracking-[0.22em] text-accent uppercase">
                      {{ current.eyebrow }}
                    </p>
                    <h3 class="mt-4 font-serif text-3xl font-semibold leading-tight text-white sm:text-4xl">
                      {{ current.headline }}
                    </h3>
                    <p class="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-white/65 sm:text-base">
                      {{ current.summary }}
                    </p>
                    <div class="mt-6 flex flex-wrap justify-center gap-2">
                      <span
                        v-for="tech in current.stack"
                        :key="tech"
                        class="rounded-full border border-line bg-ink/60 px-3 py-1 font-display text-[11px] text-white/65"
                      >
                        {{ tech }}
                      </span>
                    </div>
                  </div>
                </div>

                <!-- BLOCK 2: Concise 2-column execution split (no button, fits cleanly on mobile & desktop) -->
                <div
                  class="stage-two absolute inset-0 flex flex-col justify-center px-5 py-8 sm:px-12"
                  :class="progress >= 0.65 ? 'pointer-events-auto' : 'pointer-events-none'"
                >
                  <div class="grid items-center gap-6 md:grid-cols-12 md:gap-10">
                    <div class="md:col-span-5">
                      <p class="font-display text-[11px] tracking-[0.2em] text-accent uppercase">
                        {{ current.label }}
                      </p>
                      <h4 class="mt-2 font-serif text-xl font-semibold leading-snug text-white sm:mt-3 sm:text-3xl">
                        {{ current.splitTitle }}
                      </h4>
                    </div>

                    <div class="divide-y divide-line border-y border-line md:col-span-7">
                      <div
                        v-for="(pt, idx) in current.points"
                        :key="pt.title"
                        class="flex items-start gap-3.5 py-3.5 sm:gap-4 sm:py-5"
                      >
                        <span class="mt-0.5 font-display text-xs text-accent">
                          0{{ idx + 1 }}
                        </span>
                        <div>
                          <p class="text-sm font-medium text-white sm:text-base">
                            {{ pt.title }}
                          </p>
                          <p class="mt-1 text-xs leading-relaxed text-white/60 sm:text-sm">
                            {{ pt.body }}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </AnimeTransition>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.phase-bar {
  width: calc(var(--p) * 100%);
  will-change: width;
}

.stage-one {
  --out: clamp(0, calc((var(--p) - 0.16) / 0.34), 1);
  opacity: calc(1 - var(--out));
  transform: translate3d(0, calc(var(--out) * -2rem), 0) scale(calc(1 - var(--out) * 0.04));
  will-change: transform, opacity;
}

.orbital-ring {
  transform: scale(calc(1 + var(--p) * 0.12));
}

.orbital-ring-inner {
  transform: scale(calc(1 - var(--p) * 0.08));
}

.stage-two {
  --in: clamp(0, calc((var(--p) - 0.44) / 0.32), 1);
  opacity: var(--in);
  transform: translate3d(0, calc((1 - var(--in)) * 2rem), 0);
  will-change: transform, opacity;
}

/* Desktop (md+): separate editorial intro → card reveal → internal 2-phase card transition */
@media (min-width: 768px) {
  .editorial-intro {
    --intro-out: clamp(0, calc((var(--p) - 0.16) / 0.24), 1);
    opacity: calc(1 - var(--intro-out));
    transform: translate3d(0, calc(var(--intro-out) * -2.25rem), 0);
    will-change: transform, opacity;
  }

  .solutions-card {
    --card-in: clamp(0, calc((var(--p) - 0.22) / 0.26), 1);
    opacity: var(--card-in);
    transform: translate3d(0, calc((1 - var(--card-in)) * 3rem), 0) scale(calc(0.96 + 0.04 * var(--card-in)));
    will-change: transform, opacity;
  }

  .phase-bar {
    width: calc(clamp(0, calc((var(--p) - 0.45) / 0.55), 1) * 100%);
  }

  .stage-one {
    --out: clamp(0, calc((var(--p) - 0.54) / 0.22), 1);
  }

  .stage-two {
    --in: clamp(0, calc((var(--p) - 0.68) / 0.22), 1);
  }
}

@media (prefers-reduced-motion: reduce) {
  .editorial-intro,
  .solutions-card,
  .stage-one,
  .stage-two,
  .orbital-ring,
  .orbital-ring-inner {
    position: static !important;
    transform: none !important;
    opacity: 1 !important;
  }
}
</style>
