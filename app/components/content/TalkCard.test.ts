// @vitest-environment happy-dom

import { afterEach, describe, expect, it, vi } from 'vite-plus/test'
import { computed, ref } from 'vue'
import { mount } from '@vue/test-utils'

interface TalkCardInput {
  path: string
  date: string
  title: string
  event: string
  location?: string
  slidesUrl?: string
  videoUrl?: string
  repoUrl?: string
}

async function mountTalkCard(talk: TalkCardInput, today = '2025-01-01') {
  vi.stubGlobal('computed', computed)
  vi.stubGlobal('useTodayDate', () => ref(today))

  const { default: TalkCard } = await import('./TalkCard.vue')

  return mount(TalkCard, {
    props: { talk },
    global: {
      stubs: {
        AppCard: {
          template: '<article><slot /></article>',
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

describe('TalkCard', () => {
  it('shows the upcoming badge and optional action links for future talks', async () => {
    const wrapper = await mountTalkCard({
      path: '/talks/future-talk',
      date: '2025-06-04',
      title: 'Future Talk',
      event: 'Frontend Nation',
      location: 'Amsterdam, Netherlands',
      slidesUrl: 'https://example.com/slides',
      videoUrl: 'https://example.com/video',
      repoUrl: 'https://example.com/repo',
    }, '2025-06-01')

    expect(wrapper.text()).toContain('Upcoming')
    expect(wrapper.text()).toContain('Amsterdam, Netherlands')
    expect(wrapper.find('a[href="/talks/future-talk"]').exists()).toBe(true)
    expect(wrapper.find('a[href="https://example.com/slides"]').text()).toContain('Slides')
    expect(wrapper.find('a[href="https://example.com/video"]').text()).toContain('Video')
    expect(wrapper.find('a[href="https://example.com/repo"]').text()).toContain('Repo')
  })

  it('hides the upcoming badge and optional links for past talks without extras', async () => {
    const wrapper = await mountTalkCard({
      path: '/talks/past-talk',
      date: '2024-09-17',
      title: 'Past Talk',
      event: 'PragVue',
    }, '2025-01-01')

    expect(wrapper.text()).not.toContain('Upcoming')
    expect(wrapper.text()).not.toContain('Slides')
    expect(wrapper.text()).not.toContain('Video')
    expect(wrapper.text()).not.toContain('Repo')
    expect(wrapper.find('a[href="/talks/past-talk"]').exists()).toBe(true)
  })
})
