<script setup lang="ts">
/**
 * Page section wrapper with consistent container and optional heading.
 */
defineProps<{
  /** Section heading text (renders as H2) */
  heading?: string
  /** Padding size: 'lg' = py-10 sm:py-16 (default), 'md' = py-6 sm:py-10, 'bottom' = pb-10 sm:pb-16 only */
  spacing?: 'lg' | 'md' | 'bottom'
}>()
</script>

<template>
  <section
    :class="[
      spacing === 'md' ? 'py-6 sm:py-10'
      : spacing === 'bottom' ? 'pb-10 sm:pb-16'
        : 'py-10 sm:py-16',
    ]"
  >
    <AppContainer>
      <h2
        v-if="heading"
        class="mb-4 sm:mb-6"
      >
        {{ heading }}
      </h2>
      <slot />
    </AppContainer>
  </section>
</template>
