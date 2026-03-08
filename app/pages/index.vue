<script setup lang="ts">
// Override the default titleTemplate (`%s %separator %siteName`) from `@nuxtjs/seo` so the home
// page title is rendered as-is without appending `| Thorsten Seyschab`.
useHead({
  titleTemplate: '%s',
})

useSeoMeta({
  title: 'Thorsten Seyschab - @toddeTV',
  description: 'IT consultant, senior full-stack developer, and conference speaker. Specializing in Vue.js, '
    + 'Nuxt, 3D on the web, and full-stack development.',
})

defineOgImageComponent('Home', {
  title: 'Thorsten Seyschab',
  description: 'IT consultant, senior full-stack developer, and conference speaker.',
})

/**
 * High-level skill areas displayed on the landing page.
 * Order: consulting & leadership → core engineering → data & infrastructure →
 * quality & process → tooling & community → creative / specialty.
 */
const skills = [
  'Technical Consulting',
  'System Architecture',
  'Code Reviews & Mentoring',
  'Full-Stack Web Development',
  'Frontend Architecture',
  'Backend & APIs',
  'Database Design',
  'Cloud Infrastructure',
  'DevOps & CI/CD',
  'Testing & Quality Assurance',
  'Performance Optimization',
  'Migration & Refactoring',
  'Agile & Scrum',
  'Build Tooling',
  'Technical Writing',
  'Open Source',
  '3D on the Web',
  'App Development',
  'Game Development',
]

const [
  { data: socials },
  { data: testimonials },
  { data: recentTalks },
  { data: recentProjects },
] = await Promise.all([
  useAsyncData('index-socials-all', () =>
    queryCollection('socials').where('active', '=', true).order('sortOrder', 'ASC').all(),
  ),
  useAllTestimonials(),
  useAsyncData('recent-talks', () =>
    queryCollection('talks').order('date', 'DESC').limit(3).all(),
  ),
  useSortedProjects(2),
])
</script>

<template>
  <div>
    <!-- Hero -->
    <section class="pt-24 pb-16 sm:pt-28 sm:pb-20">
      <AppContainer class="flex items-center justify-between gap-8 max-sm:flex-col-reverse max-sm:text-center">
        <div class="flex-1">
          <p class="mb-2 font-mono text-sm text-accent">
            Hi, I'm
          </p>
          <h1 class="mb-3 text-4xl sm:text-5xl">
            Thorsten Seyschab
          </h1>
          <p class="mb-3 text-lg">
            IT consultant, senior full-stack developer, and conference speaker
          </p>
          <p class="flex items-center gap-1.5 text-sm text-text-dim max-sm:justify-center">
            <Icon name="ph:map-pin" :size="16" />
            Dresden, Germany
          </p>
        </div>
        <div>
          <NuxtImg
            alt="Thorsten Seyschab"
            class="h-45 w-45 rounded-full border-3 border-accent object-cover max-sm:h-35 max-sm:w-35"
            height="180"
            src="/avatar-thorsten-seyschab.jpg"
            width="180"
          />
        </div>
      </AppContainer>
    </section>

    <!-- About -->
    <AppSeparator />
    <AppSection heading="About Me">
      <p class="mb-4">
        I'm an IT consultant, senior full-stack developer, and conference speaker from Germany,
        <strong>self-employed since 2014</strong>. I help companies ship their projects, provide
        technical guidance, and build robust applications - from architecture to deployment.
      </p>
      <p class="mb-4">
        My main stack revolves around <strong>web technologies</strong>, modern build tooling, and
        <strong>databases</strong>. Beyond classic web development, I have a particular passion for
        bringing <strong>3D experiences to the browser</strong>.
      </p>
      <p class="mb-4">
        I hold a <strong>Master's degree in Computer Science</strong> from TUD Dresden University
        of Technology, where I contributed to database research published at IEEE ICDE 2016 and
        BTW 2017.
      </p>
      <p>
        When I'm not working with clients, you'll find me contributing to
        <strong>open-source projects</strong>, giving talks at international conferences like
        Vue.js Amsterdam, NuxtNation, ViteConf, and Vue Fes Japan - or tinkering with my
        <strong>3D printers</strong>.
      </p>
    </AppSection>

    <!-- Skills -->
    <AppSeparator />
    <AppSection heading="What I Work With">
      <p class="-mt-2 mb-4 text-sm text-text-dim sm:-mt-4">
        A selection of areas I frequently work in - not a complete list.
      </p>
      <div class="flex flex-wrap gap-2">
        <AppTag
          v-for="skill in skills"
          :key="skill"
          :label="skill"
          size="md"
        />
      </div>
    </AppSection>

    <!-- Connect -->
    <AppSeparator />
    <AppSection id="connect" heading="Connect">
      <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <AppCard
          v-for="social in socials"
          :key="social.url"
          :href="social.url"
        >
          <div class="flex items-center gap-3">
            <Icon :name="social.icon" :size="24" />
            <div>
              <div class="text-sm font-medium">
                {{ social.name }}
              </div>
              <div class="font-mono text-xs text-text-dim">
                {{ social.handle }}
              </div>
            </div>
          </div>
        </AppCard>
      </div>
    </AppSection>

    <!-- Testimonials -->
    <AppSeparator v-if="testimonials?.length" />
    <AppSection v-if="testimonials?.length" heading="What People Say">
      <TestimonialCarousel :testimonials="testimonials.slice(0, 3)" />
    </AppSection>

    <!-- Recent Talks -->
    <AppSeparator v-if="recentTalks?.length" />
    <AppSection v-if="recentTalks?.length">
      <div class="mb-6 flex items-center justify-between">
        <h2>
          Recent Talks
        </h2>
        <NuxtLink
          class="flex items-center gap-1.5 text-sm font-medium whitespace-nowrap"
          to="/talks"
        >
          View all talks
          <Icon name="ph:arrow-right" :size="16" />
        </NuxtLink>
      </div>
      <div class="flex flex-col gap-4">
        <TalkCard v-for="talk in recentTalks" :key="talk.path" :talk="talk" />
      </div>
    </AppSection>

    <!-- Recent Projects -->
    <AppSeparator v-if="recentProjects?.length" />
    <AppSection v-if="recentProjects?.length">
      <div class="mb-6 flex items-center justify-between">
        <h2>
          Recent Projects
        </h2>
        <NuxtLink
          class="flex items-center gap-1.5 text-sm font-medium whitespace-nowrap"
          to="/projects"
        >
          View all projects
          <Icon name="ph:arrow-right" :size="16" />
        </NuxtLink>
      </div>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <ProjectCard v-for="project in recentProjects" :key="project.path" :project="project" />
      </div>
    </AppSection>
  </div>
</template>
