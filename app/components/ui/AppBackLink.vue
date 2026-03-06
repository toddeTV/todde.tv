<script setup lang="ts">
/**
 * Back navigation link with left arrow icon.
 * Used at the top of detail pages to return to list pages.
 */
defineProps<{
  /** Route path to navigate back to */
  to: string
  /** Link label text (e.g. "All Talks") */
  label: string
}>()
</script>

<template>
  <NuxtLink
    class="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-text-muted
           no-underline transition-colors hover:text-accent sm:mb-8"
    :to="to"
  >
    <Icon name="ph:arrow-left" :size="16" />
    {{ label }}
  </NuxtLink>
</template>
