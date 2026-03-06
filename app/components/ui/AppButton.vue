<script setup lang="ts">
/**
 * Surface-styled action button rendered as an external link.
 * Used on detail pages for "View Slides", "View on GitHub", etc.
 */
defineProps<{
  /** External URL */
  href: string
  /** Icon name (e.g. 'ph:github-logo') */
  icon?: string
  /** Button label text */
  label: string
}>()
</script>

<template>
  <NuxtLink
    class="app-button"
    target="_blank"
    :to="href"
  >
    <Icon v-if="icon" :name="icon" :size="18" />
    {{ label }}
  </NuxtLink>
</template>

<style scoped>
@reference "~/assets/css/main.css";

.app-button {
  @apply inline-flex items-center gap-2 px-3 py-2 text-sm font-medium bg-surface sm:px-4 sm:py-2.5;
  @apply border border-border rounded-lg text-text no-underline;
  @apply transition-colors hover:border-accent hover:bg-surface-hover;
}
</style>
