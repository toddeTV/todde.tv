<script setup lang="ts">
/**
 * Page header with H1 title and optional description paragraph.
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
      <h1 class="text-3xl sm:text-4xl font-bold tracking-tight mb-3 sm:mb-4">
        {{ title }}
      </h1>
      <p v-if="description" class="text-text-muted text-lg max-w-xl">
        {{ description }}
      </p>
    </AppContainer>
  </section>
</template>
