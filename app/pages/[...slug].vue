<script setup lang="ts">
const route = useRoute()

const { data: page } = await useAsyncData('page-' + route.path, () => {
  return queryCollection('content').path(route.path).first()
})

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

if (page.value.seo) {
  useSeoMeta(page.value.seo)
}
if (page.value.head) {
  useHead(page.value.head as Record<string, unknown>)
}
if (page.value.ogImage) {
  defineOgImage(page.value.ogImage)
}
</script>

<template>
  <AppSection v-if="page">
    <h1
      v-if="page.title"
      class="mb-6"
    >
      {{ page.title }}
    </h1>
    <div class="text-text-muted text-lg leading-relaxed">
      <ContentRenderer :value="page" />
    </div>
  </AppSection>
</template>
