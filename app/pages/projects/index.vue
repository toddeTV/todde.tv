<script setup lang="ts">
useSeoMeta({
  title: 'Projects - Thorsten Seyschab',
  description: 'Projects by Thorsten Seyschab (toddeTV).',
})

defineOgImageComponent('Project', {
  title: 'Projects',
  description: 'Tools, experiments, and applications for 3D on the web, Vue/Nuxt, and developer tooling.',
})

const { data: projects } = await useAsyncData('projects', async () => {
  const projects = await queryCollection('projects').all()
  return projects.sort((a, b) => {
    // 1. Ongoing (no endDate) before completed
    const aOngoing = a.endDate == null
    const bOngoing = b.endDate == null
    if (aOngoing !== bOngoing) return aOngoing ? -1 : 1

    // 2. Within completed: newest endDate first
    if (!aOngoing && !bOngoing) {
      const endCmp = b.endDate!.localeCompare(a.endDate!)
      if (endCmp !== 0) return endCmp
    }

    // 3. Newest startDate first
    const startCmp = b.startDate.localeCompare(a.startDate)
    if (startCmp !== 0) return startCmp

    // 4. More stars first
    return (b.repoStars ?? 0) - (a.repoStars ?? 0)
  })
})
</script>

<template>
  <div>
    <AppPageHeader
      description="Tools, experiments, and applications I've built - from developer
          tooling and the Vue/Nuxt ecosystem to 3D on the web and beyond."
      title="Projects"
    >
      <p class="mt-3 text-xs text-text-dim italic">
        This is a curated selection. Some work is not listed due to NDAs or other confidentiality
        agreements.
      </p>
    </AppPageHeader>

    <AppSeparator />

    <AppSection heading="Projects">
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <ProjectCard v-for="project in projects" :key="project.path" :project="project" />
      </div>
    </AppSection>
  </div>
</template>
