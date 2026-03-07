<script setup lang="ts">
useSeoMeta({
  title: 'Projects - Thorsten Seyschab',
  description: 'Projects by Thorsten Seyschab (toddeTV).',
})

defineOgImageComponent('Project', {
  title: 'Projects',
  description: 'Tools, experiments, and applications for 3D on the web, Vue/Nuxt, and developer tooling.',
})

const { data: projects } = await useSortedProjects()
</script>

<template>
  <div>
    <AppPageHeader
      description="Tools, experiments, and applications I've built - from developer
          tooling and the Vue/Nuxt ecosystem to 3D on the web and beyond."
      title="Projects"
    >
      <template #hint>
        This is a curated selection. Some work is not listed due to NDAs or other confidentiality agreements.
      </template>
    </AppPageHeader>

    <AppSeparator />

    <AppSection heading="Projects">
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <ProjectCard v-for="project in projects" :key="project.path" :project="project" />
      </div>
    </AppSection>
  </div>
</template>
