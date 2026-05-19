<script setup lang="ts">
/** Renders the canonical author name from centralized project metadata. */

const projectMetadata = getProjectMetadata()
</script>

<template>
  <span>{{ projectMetadata.author.name }}</span>
</template>
