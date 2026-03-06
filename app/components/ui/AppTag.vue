<script setup lang="ts">
/**
 * Accent-tinted mono tag/badge. Two size variants.
 */
defineProps<{
  /** Display label */
  label: string
  /** Size variant: 'sm' = small card tags, 'md' = detail page tags */
  size?: 'sm' | 'md'
}>()
</script>

<template>
  <span
    class="app-tag"
    :class="[size === 'md' ? 'app-tag-md' : 'app-tag-sm']"
  >
    {{ label }}
  </span>
</template>

<style scoped>
@reference "~/assets/css/main.css";

.app-tag {
  @apply inline-block font-mono font-medium bg-accent-dim text-accent rounded;
}

.app-tag-sm {
  @apply px-2 py-0.5 text-xs sm:px-2.5;
}

.app-tag-md {
  @apply px-2.5 py-0.5 text-xs sm:px-3 sm:py-1 sm:text-sm;
}
</style>
