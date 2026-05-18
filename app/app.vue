<script setup lang="ts">
/**
 * Loads prepared project metadata and injects the derived Schema.org identity fields.
 */
const { data: projectMetadata } = await useProjectMetadata()

if (projectMetadata.value) {
  useSchemaOrg([
    definePerson({
      sameAs: projectMetadata.value.author.sameAs,
      ...(projectMetadata.value.author.contact ? { email: projectMetadata.value.author.contact } : {}),
    }),
  ])
}
</script>

<template>
  <div>
    <NuxtLoadingIndicator color="var(--ui-primary)" />
    <NuxtRouteAnnouncer />

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
