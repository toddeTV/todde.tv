<script setup lang="ts">
/**
 * Renders the VAT identification number from runtimeConfig.
 * Value is injected via GitHub Variables at build time to keep it out of Git.
 */

const config = useRuntimeConfig()

const vatId = computed(() => config.public.legalVatId as string)
</script>

<template>
  <span>{{ vatId }}</span>
</template>
