<script setup lang="ts">
const links = [
  { to: '/', label: 'About' },
  { to: '/talks', label: 'Talks' },
  { to: '/projects', label: 'Open Source' },
  // { to: '/clients', label: 'Client Work' },
  // { to: '/publications', label: 'Publications' },
]

const mobileOpen = ref(false)
const route = useRoute()

const isActiveLink = (to: string): boolean =>
  to === '/' ? route.path === '/' : route.path === to || route.path.startsWith(to + '/')

watch(() => route.path, () => {
  mobileOpen.value = false
})
</script>

<template>
  <header class="sticky top-0 z-50 border-b border-border bg-bg/85 backdrop-blur-md">
    <AppContainer class="flex h-16 items-center justify-between">
      <!-- desktop: Left logo -->
      <NuxtLink class="flex h-full items-center text-xl font-bold text-text" to="/">
        todde<span class="text-accent">.</span><span class="text-text-muted">tv</span>
      </NuxtLink>

      <!-- desktop: right menu -->
      <nav aria-label="Main navigation" class="hidden h-full sm:flex">
        <NuxtLink
          v-for="link in links"
          :key="link.to"
          class="relative flex h-full items-center px-4 text-sm font-medium text-text-muted hover:text-text"
          :class="{
            ['text-text! after:absolute after:bottom-0'
              + ' after:left-0 after:right-0 after:h-0.5'
              + ' after:bg-accent after:rounded-sm']: isActiveLink(link.to),
          }"
          :to="link.to"
        >
          {{ link.label }}
        </NuxtLink>
      </nav>

      <button
        :aria-expanded="mobileOpen"
        aria-label="Toggle navigation"
        class="cursor-pointer border-none bg-transparent p-1 text-text sm:hidden"
        @click="mobileOpen = !mobileOpen"
      >
        <Icon v-if="!mobileOpen" name="ph:list-bold" :size="24" />
        <Icon v-else name="ph:x-bold" :size="24" />
      </button>
    </AppContainer>

    <Transition
      enter-active-class="transition-all duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      leave-active-class="transition-all duration-200 ease-out"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <nav
        v-if="mobileOpen"
        aria-label="Mobile navigation"
        class="flex flex-col border-t border-border px-6 pt-2 pb-4 sm:hidden"
      >
        <NuxtLink
          v-for="link in links"
          :key="link.to"
          class="py-2 text-sm font-medium text-text-muted hover:text-text"
          :class="{ 'text-text!': isActiveLink(link.to) }"
          :to="link.to"
        >
          {{ link.label }}
        </NuxtLink>
      </nav>
    </Transition>
  </header>
</template>
