<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{
  error: NuxtError
}>()

const statusCode = computed(() => props.error.statusCode ?? 404)
const statusMessage = computed(() =>
  statusCode.value === 404
    ? 'The page you are looking for does not exist or has been moved.'
    : props.error.statusMessage ?? 'An unexpected error occurred.',
)

/** Clear the error and navigate back to the homepage. */
function handleBack() {
  clearError({ redirect: '/' })
}
</script>

<template>
  <NuxtLayout>
    <section class="py-16">
      <AppContainer class="flex flex-col items-center gap-6 text-center">
        <span class="font-mono text-8xl font-bold text-accent">{{ statusCode }}</span>
        <h1>
          {{ statusCode === 404 ? 'Page Not Found' : 'An Unexpected Error Occurred' }}
        </h1>
        <p class="max-w-md text-lg">
          {{ statusMessage }}
        </p>
        <button
          class="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-surface
                 px-4 py-2.5 text-sm font-medium
                 text-text transition-colors hover:border-accent hover:bg-surface-hover"
          @click="handleBack"
        >
          <Icon name="ph:arrow-left" :size="16" />
          Back to Home
        </button>
      </AppContainer>
    </section>
  </NuxtLayout>
</template>
