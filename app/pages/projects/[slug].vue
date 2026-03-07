<script setup lang="ts">
const route = useRoute()

const { data: project } = await useAsyncData(`project-${route.params.slug}`, () =>
  queryCollection('projects').path(`/projects/${route.params.slug}`).first(),
)

if (!project.value) {
  throw createError({ statusCode: 404, statusMessage: 'Project not found' })
}

/**
 * Formats a year or year span for display.
 * - Ongoing (no endDate): "2024-present"
 * - Same year: "2024"
 * - Different years: "2023-2025"
 */
const displayPeriod = computed(() => {
  const startYear = project.value!.startDate.slice(0, 4)
  if (!project.value!.endDate) return `${startYear}-present`
  const endYear = project.value!.endDate.slice(0, 4)
  return startYear === endYear ? startYear : `${startYear}-${endYear}`
})

useSeoMeta({
  title: project.value.name,
  description: project.value.description,
})

defineOgImageComponent('Project', {
  title: project.value.name,
  description: project.value.description,
  repoStars: project.value.repoStars,
  tags: project.value.tags,
})
</script>

<template>
  <div v-if="project">
    <AppSection>
      <AppBackLink label="All Projects" to="/projects" />

      <div class="mb-4 flex items-center gap-4 text-sm text-text-dim">
        <span class="flex items-center gap-1 font-mono">
          <Icon name="ph:calendar-blank" :size="14" />
          {{ displayPeriod }}
        </span>
        <span v-if="project.repoStars" class="flex items-center gap-1 font-mono">
          <Icon name="ph:star" :size="14" />
          {{ project.repoStars }}
        </span>
      </div>

      <h1 class="mb-3">
        {{ project.name }}
      </h1>

      <div class="mb-6 flex flex-wrap gap-1.5">
        <AppTag
          v-for="tag in project.tags"
          :key="tag"
          :label="tag"
          size="md"
        />
      </div>

      <div class="mb-8 text-lg leading-relaxed text-text-muted">
        <ContentRenderer :value="project" />
      </div>

      <NuxtImg
        v-if="project.image"
        :alt="`Screenshot of ${project.name}`"
        class="mb-8 w-full rounded-lg border border-border"
        :src="project.image"
      />

      <div class="flex flex-wrap gap-3">
        <AppButton
          v-if="project.repoUrl"
          :href="project.repoUrl"
          icon="ph:github-logo"
          label="View on GitHub"
        />
        <AppButton
          v-if="project.liveUrl"
          :href="project.liveUrl"
          icon="ph:arrow-square-out"
          label="Live Demo"
        />
      </div>
    </AppSection>

    <AppSeparator v-if="project.testimonials?.length" />
    <AppSection v-if="project.testimonials?.length" heading="Testimonials">
      <TestimonialCarousel :testimonials="project.testimonials!" />
    </AppSection>
  </div>
</template>
