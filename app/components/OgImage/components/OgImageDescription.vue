<script setup lang="ts">
/**
 * Description/subtitle text for OG images.
 * Satori constraints: inline styles only, no Tailwind, hardcoded colors.
 */
withDefaults(defineProps<{
  /** Description text to display. */
  text: string
  /** Truncate text to this character count (with ellipsis). 0 = no truncation. */
  maxLength?: number
  /**
   * Font size tier.
   * - 'lg' (28px): for Default/Home descriptions.
   * - 'md' (24px): for category page descriptions (Project, Talk, Client).
   */
  size?: 'lg' | 'md'
}>(), {
  maxLength: 0,
  size: 'md',
})
</script>

<template>
  <div
    :style="{
      fontSize: size === 'lg' ? '28px' : '24px',
      fontWeight: 400,
      color: '#a1a1aa',
      lineHeight: 1.4,
      maxWidth: '800px',
    }"
  >
    {{ maxLength > 0 && text.length > maxLength ? text.slice(0, maxLength - 3) + '...' : text }}
  </div>
</template>
