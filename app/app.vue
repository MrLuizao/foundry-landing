<script setup lang="ts">
const { locale, t } = useI18n()

useHead(() => ({
  htmlAttrs: { lang: locale.value },
  title: t.value.meta.title,
  meta: [
    { name: 'description', content: t.value.meta.description },
  ],
}))
</script>

<template>
  <div class="min-h-screen bg-ink text-white antialiased">
    <NuxtRouteAnnouncer />
    <Preloader />
    <ScrollProgress />
    <CustomCursor />
    <CommandPalette />
    <a href="#main" class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-accent focus:px-3 focus:py-2 focus:text-black">Skip to content</a>
    <TheNavbar />
    <NuxtPage />
    <TheFooter />
  </div>
</template>
