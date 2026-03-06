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
      <h1 class="mb-3 sm:mb-4">
        {{ title }}
      </h1>
      <p v-if="description" class="text-lg max-w-xl">
        {{ description }}
      </p>
    </AppContainer>
  </section>
</template>
