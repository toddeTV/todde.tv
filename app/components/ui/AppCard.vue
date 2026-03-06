<script setup lang="ts">
/**
 * Reusable surface card with border and hover state.
 * Renders as a NuxtLink when `to` is provided, otherwise a plain div.
 */
defineProps<{
  /** Internal route path — makes card a clickable link */
  to?: string
  /** External URL — makes card an anchor link */
  href?: string
  /** Vertical gap between card children. Default: '3' */
  gap?: '2' | '3'
  /** Force full height (for grid/carousel layouts) */
  fullHeight?: boolean
  /** Enable hover styling on a static (non-link) card. Used with the stretched link pattern. */
  interactive?: boolean
}>()
</script>

<template>
  <NuxtLink
    v-if="to"
    class="app-card p-4 sm:p-6"
    :class="[`gap-${gap ?? '3'}`, { 'h-full': fullHeight }]"
    :to="to"
  >
    <slot />
  </NuxtLink>
  <NuxtLink
    v-else-if="href"
    class="app-card p-4 sm:p-6"
    :class="[`gap-${gap ?? '3'}`, { 'h-full': fullHeight }]"
    target="_blank"
    :to="href"
  >
    <slot />
  </NuxtLink>
  <div
    v-else
    class="p-4 sm:p-6"
    :class="[
      interactive ? 'app-card-interactive' : 'app-card-static',
      `gap-${gap ?? '3'}`,
      { 'h-full': fullHeight },
    ]"
  >
    <slot />
  </div>
</template>

<style scoped>
@reference "~/assets/css/main.css";

.app-card {
  @apply bg-surface border border-border rounded-lg flex flex-col no-underline text-inherit;
  @apply transition-colors hover:border-accent hover:bg-surface-hover;
}

.app-card-static {
  @apply bg-surface border border-border rounded-lg flex flex-col;
}

.app-card-interactive {
  @apply bg-surface border border-border rounded-lg flex flex-col;
  @apply transition-colors hover:border-accent hover:bg-surface-hover;
}
</style>
