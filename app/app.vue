<script setup lang="ts">
/**
 * Load social links from the `socials` content collection and injects them into the Schema.org Person identity
 * via `sameAs`.
 */
const { data: socials } = await useAsyncData('socials', () =>
  queryCollection('socials').order('sortOrder', 'ASC').all(),
)
if (socials.value?.length) {
  useSchemaOrg([
    definePerson({
      sameAs: socials.value.map(s => s.url),
    }),
  ])
}
</script>

<template>
  <NuxtRouteAnnouncer />
  <!-- <NuxtPage /> -->
  <div class="bg-[var(--color-accent-dim)]">
    hallo
  </div>
  <div class="bg-[var(--color-accent-dim2)]">
    hallo
  </div>
</template>
