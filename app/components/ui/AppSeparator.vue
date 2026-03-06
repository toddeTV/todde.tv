<script setup lang="ts">
/**
 * Horizontal separator line with configurable vertical spacing.
 * Renders a semantic <hr> inside a max-width container matching the site layout.
 */
defineProps<{
  /** Vertical spacing around the rule: 'lg' | 'md' | 'sm' | 'none' (default) */
  spacing?: 'lg' | 'md' | 'sm' | 'none'
}>()
</script>

<template>
  <AppContainer>
    <hr
      :class="[
        { 'my-4 sm:my-6': spacing === 'lg',
          'my-2 sm:my-4': spacing === 'md',
          'my-1 sm:my-2': spacing === 'sm',
          'my-0': !spacing || spacing === 'none' },
      ]"
    >
  </AppContainer>
</template>
