<script setup lang="ts">
/**
 * Main title text for OG images.
 * Satori constraints: inline styles only, no Tailwind, hardcoded colors.
 */
withDefaults(defineProps<{
  /** Title text to display. */
  text: string
  /**
   * Font size tier.
   * - 'lg' (72px): for short titles (Home, Project, Client).
   * - 'md' (64px): for potentially longer titles (Default, Talk).
   */
  size?: 'lg' | 'md'
}>(), {
  size: 'lg',
})
</script>

<template>
  <div
    :style="{
      fontSize: size === 'lg' ? '72px' : '64px',
      fontWeight: 800,
      color: '#fafafa',
      lineHeight: 1.05,
      letterSpacing: '-0.03em',
      marginBottom: '20px',
    }"
  >
    {{ text }}
  </div>
</template>
