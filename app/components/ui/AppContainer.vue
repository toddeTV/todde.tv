<script setup lang="ts">
/**
 * Centered max-width container for page content.
 * Applies consistent horizontal padding, max-width, and centering.
 * Use this component to wrap content instead of repeating `max-w-3xl mx-auto px-6`.
 *
 * @param as - HTML element to render (default: 'div')
 */
defineProps<{
  /** HTML element to render (default: 'div') */
  as?: string
}>()
</script>

<template>
  <component :is="as ?? 'div'" class="mx-auto max-w-3xl px-6">
    <slot />
  </component>
</template>
