<script setup lang="ts">
/**
 * Page header with H1 title, optional description, and optional default slot for extra content.
 * Used on list pages (talks, projects, clients).
 */
defineProps<{
  /** Page title */
  title: string
  /** Optional description below the title */
  description?: string
}>()
</script>

<template>
  <section class="py-10 sm:py-16">
    <AppContainer>
      <h1 class="mb-3 sm:mb-4">
        {{ title }}
      </h1>
      <p v-if="description" class="max-w-xl text-lg">
        {{ description }}
      </p>
      <div v-if="$slots.hint" class="mt-3 text-xs text-text-dim italic">
        <slot name="hint" />
      </div>
    </AppContainer>
  </section>
</template>
