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
