<script setup lang="ts">
/** Renders the legal occupation from runtimeConfig. */

const config = useRuntimeConfig()

const occupation = computed(() => config.public.legalOccupation as string)
const occupationDe = computed(() => config.public.legalOccupationDe as string)
</script>

<template>
  <span v-if="occupation">
    {{ occupation }}
    <template v-if="occupationDe">
      (<em>{{ occupationDe }}</em>)
    </template>
  </span>
  <span v-else class="text-text-dim italic">
    [Legal occupation not configured - set NUXT_PUBLIC_LEGAL_OCCUPATION]
  </span>
</template>
