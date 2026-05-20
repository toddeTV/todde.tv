<script setup lang="ts">
/** Renders the legal name from runtimeConfig. */

const config = useRuntimeConfig()

const legalName = computed(() => config.public.legalName as string)
</script>

<template>
  <span>{{ legalName }}</span>
</template>
