<script setup lang="ts">
useSeoMeta({
  title: 'Open Source - Thorsten Seyschab',
  description: 'Open source projects by Thorsten Seyschab (toddeTV).',
})

defineOgImageComponent('Project', {
  title: 'Open Source Projects',
  description: 'Tools, experiments, and applications for 3D on the web, Vue/Nuxt, and developer tooling.',
})

const { data: openSourceProjects } = await useAsyncData('projects', async () => {
  const projects = await queryCollection('projects').all()
  return projects.sort((a, b) => {
    // Ongoing projects (no endDate) sort to top, then by endDate descending
    const endA = a.endDate ?? '9999-12-31'
    const endB = b.endDate ?? '9999-12-31'
    return endB.localeCompare(endA)
  })
})
</script>

<template>
  <div>
    <AppPageHeader
      description="Open source tools, experiments, and applications I've built - from developer
          tooling and the Vue/Nuxt ecosystem to 3D on the web and beyond."
      title="Open Source"
    />

    <AppSeparator />
    <AppSection heading="Open Source">
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <ProjectCard v-for="project in openSourceProjects" :key="project.path" :project="project" />
      </div>
    </AppSection>
  </div>
</template>
