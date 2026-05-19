<script setup lang="ts">
/** Renders the legal name from runtimeConfig. */

const config = useRuntimeConfig()

const legalName = computed(() => config.public.legalName as string)
</script>

<template>
  <span v-if="legalName">{{ legalName }}</span>
  <span v-else class="text-text-dim italic">
    [Legal name not configured - set NUXT_PUBLIC_LEGAL_NAME]
  </span>
</template>
