// @vitest-environment happy-dom

import { afterEach, describe, expect, it, vi } from 'vite-plus/test'
import { computed } from 'vue'
import { mount } from '@vue/test-utils'

interface ProjectCardInput {
  path: string
  name: string
  description: string
  startDate: string
  endDate?: string
  liveUrl?: string
  repoUrl?: string
  repoStars?: number
  tags: string[]
}

async function mountProjectCard(project: ProjectCardInput) {
  vi.stubGlobal('computed', computed)

  const { default: ProjectCard } = await import('./ProjectCard.vue')

  return mount(ProjectCard, {
    props: { project },
    global: {
      stubs: {
        AppCard: {
          template: '<article><slot /></article>',
        },
        AppTag: {
          props: ['label'],
          template: '<span>{{ label }}</span>',
        },
        Icon: {
          template: '<span />',
        },
        NuxtLink: {
          props: ['to'],
          template: '<a :href="to"><slot /></a>',
        },
      },
    },
  })
}

afterEach(() => {
  vi.resetModules()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe('ProjectCard', () => {
  it('shows ongoing period, stars, tags, and optional links', async () => {
    const wrapper = await mountProjectCard({
      path: '/projects/demo',
      name: 'Demo Project',
      description: 'Project description',
      startDate: '2024-01-01',
      liveUrl: 'https://example.com/live',
      repoUrl: 'https://example.com/repo',
      repoStars: 42,
      tags: ['Nuxt', 'Vue'],
    })

    expect(wrapper.text()).toContain('2024-present')
    expect(wrapper.text()).toContain('42')
    expect(wrapper.text()).toContain('Nuxt')
    expect(wrapper.text()).toContain('Vue')
    expect(wrapper.find('a[href="/projects/demo"]').exists()).toBe(true)
    expect(wrapper.find('a[href="https://example.com/live"]').text()).toContain('Live')
    expect(wrapper.find('a[href="https://example.com/repo"]').text()).toContain('Repo')
  })

  it('collapses same-year projects to one year and hides empty optional sections', async () => {
    const wrapper = await mountProjectCard({
      path: '/projects/same-year',
      name: 'Same Year Project',
      description: 'Project description',
      startDate: '2024-01-01',
      endDate: '2024-10-01',
      repoStars: 0,
      tags: [],
    })

    expect(wrapper.text()).toContain('2024')
    expect(wrapper.text()).not.toContain('2024-2024')
    expect(wrapper.text()).not.toContain('Live')
    expect(wrapper.text()).not.toContain('Repo')
  })

  it('shows year ranges for completed multi-year projects', async () => {
    const wrapper = await mountProjectCard({
      path: '/projects/range',
      name: 'Range Project',
      description: 'Project description',
      startDate: '2023-01-01',
      endDate: '2025-02-01',
      tags: ['TypeScript'],
    })

    expect(wrapper.text()).toContain('2023-2025')
    expect(wrapper.text()).toContain('TypeScript')
  })
})
