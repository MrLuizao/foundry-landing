import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['nanime', '@nuxt/icon', '@nuxt/fonts'],
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  devServer: { port: 717 },
  css: ['~/assets/css/main.css'],
  vite: { plugins: [tailwindcss()] },
  nanime: { reducedMotion: 'system' },
  fonts: {
    families: [
      { name: 'JetBrains Mono', provider: 'google', weights: [400, 500] },
      { name: 'Fraunces', provider: 'google', weights: [500, 600, 700] },
      { name: 'Inter', provider: 'google', weights: [400, 500, 600] },
    ],
  },
  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      title: 'Foundry — Software Studio',
      meta: [
        { name: 'description', content: 'Foundry is a software studio that forges raw ideas into solid, production-ready products.' },
      ],
    },
  },
})
