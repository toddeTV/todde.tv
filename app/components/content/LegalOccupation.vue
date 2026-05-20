<script setup lang="ts">
/** Renders the legal occupation from runtimeConfig. */

const config = useRuntimeConfig()

const occupation = computed(() => config.public.legalOccupation as string)
const occupationDe = computed(() => config.public.legalOccupationDe as string)
</script>

<template>
  <span>
    {{ occupation }}
    <template v-if="occupationDe">
      (<em>{{ occupationDe }}</em>)
    </template>
  </span>
</template>
