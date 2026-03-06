<script setup lang="ts">
/**
 * Load social links from the `socials` content collection and injects them into the Schema.org Person identity
 * via `sameAs` and `email`.
 */
const { data: socials } = await useAsyncData('socials-all', () =>
  queryCollection('socials').where('active', '=', true).order('sortOrder', 'ASC').all(),
)
if (socials.value?.length) {
  const emailEntry = socials.value.find(s => s.url.startsWith('mailto:'))
  useSchemaOrg([
    definePerson({
      sameAs: socials.value.filter(s => !s.url.startsWith('mailto:')).map(s => s.url),
      ...(emailEntry ? { email: emailEntry.url.replace('mailto:', '') } : {}),
    }),
  ])
}
</script>

<template>
  <NuxtRouteAnnouncer />
  <NuxtPage />
</template>
