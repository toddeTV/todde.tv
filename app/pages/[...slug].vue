<script setup lang="ts">
const route = useRoute()

// Strip trailing slash to prevent hydration key mismatches on CDNs that redirect
// directory URLs (e.g. Cloudflare Pages: `/g` -> `/g/`).
const path = route.path.replace(/\/$/, '') || '/'

const { data: page } = await useAsyncData('page-' + path, () => {
  return queryCollection('content').path(path).first()
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
else {
  defineOgImageComponent('Default')
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
    <div class="content-prose text-lg leading-relaxed text-text-muted">
      <ContentRenderer :value="page" />
    </div>
  </AppSection>
</template>
