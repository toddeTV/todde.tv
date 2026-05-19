<script setup lang="ts">
/** Renders the canonical repository link from centralized project metadata. */

const projectMetadata = getProjectMetadata()
</script>

<template>
  <NuxtLink target="_blank" :to="projectMetadata.repository.url">
    GitHub
  </NuxtLink>
</template>
