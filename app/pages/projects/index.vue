<script setup lang="ts">
useSeoMeta({
  title: 'Open Source - Thorsten Seyschab',
  description: 'Open source projects and academic publications by Thorsten Seyschab (toddeTV).',
})

defineOgImageComponent('Project', {
  title: 'Open Source Projects',
  description: 'Tools, experiments, and applications for 3D on the web, Vue/Nuxt, and developer tooling.',
})

const { data: openSourceProjects } = await useAsyncData('projects', () =>
  queryCollection('projects').all(),
)

const { data: publications } = await useAsyncData('publications', () =>
  queryCollection('publications').all(),
)
</script>

<template>
  <div>
    <AppPageHeader
      description="Open source tools, experiments, and applications I've built. Most of my work
          revolves around 3D on the web, the Vue/Nuxt ecosystem, and developer tooling."
      title="Open Source"
    />

    <AppSeparator />
    <AppSection heading="Open Source">
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <ProjectCard v-for="project in openSourceProjects" :key="project.path" :project="project" />
      </div>
    </AppSection>

    <AppSeparator />
    <AppSection heading="Academic Publications">
      <div class="flex flex-col gap-4">
        <AppCard
          v-for="pub in publications"
          :key="pub.title"
          :href="pub.url"
        >
          <h3 class="mb-1 text-base">
            {{ pub.title }}
          </h3>
          <p class="mb-1 text-sm font-medium text-accent">
            {{ pub.venue }}
          </p>
          <p class="font-mono text-xs text-text-dim">
            {{ pub.authors }}
          </p>
        </AppCard>
      </div>
    </AppSection>
  </div>
</template>
