<script setup lang="ts">
/**
 * Renders the VAT identification number from runtimeConfig.
 * Value is injected via GitHub Variables at build time to keep it out of Git.
 */

const config = useRuntimeConfig()

const vatId = computed(() => config.public.legalVatId as string)
</script>

<template>
  <span v-if="vatId">{{ vatId }}</span>
  <span v-else class="text-text-dim italic">
    [VAT ID not configured - set NUXT_PUBLIC_LEGAL_VAT_ID env var]
  </span>
</template>
