// @vitest-environment happy-dom

import { afterEach, describe, expect, it, vi } from 'vite-plus/test'
import { nextTick, ref } from 'vue'
import { mount } from '@vue/test-utils'

async function mountSiteHeader(initialPath = '/') {
  const route = { path: initialPath }
  const routeWatchCallbacks: Array<() => void> = []

  vi.stubGlobal('ref', ref)
  vi.stubGlobal('useRoute', () => route)
  vi.stubGlobal('watch', vi.fn((_source, callback: () => void) => {
    routeWatchCallbacks.push(callback)
  }))

  const { default: SiteHeader } = await import('./SiteHeader.vue')
  const wrapper = mount(SiteHeader, {
    global: {
      stubs: {
        AppContainer: {
          template: '<div><slot /></div>',
        },
        Icon: {
          template: '<span />',
        },
        NuxtLink: {
          props: ['to'],
          template: '<a :href="to"><slot /></a>',
        },
        Transition: {
          template: '<div><slot /></div>',
        },
      },
    },
  })

  return {
    route,
    triggerRouteWatch: () => {
      for (const callback of routeWatchCallbacks) callback()
    },
    wrapper,
  }
}

afterEach(() => {
  vi.resetModules()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe('SiteHeader', () => {
  it('marks nested project routes as active in desktop navigation', async () => {
    const { wrapper } = await mountSiteHeader('/projects/example')

    const projectsLink = wrapper.get('nav[aria-label="Main navigation"] a[href="/projects"]')
    const talksLink = wrapper.get('nav[aria-label="Main navigation"] a[href="/talks"]')

    expect(projectsLink.classes()).toContain('text-text!')
    expect(talksLink.classes()).not.toContain('text-text!')
  })

  it('closes the mobile navigation when the route changes', async () => {
    const { route, triggerRouteWatch, wrapper } = await mountSiteHeader('/talks')

    await wrapper.get('button[aria-label="Toggle navigation"]').trigger('click')
    expect(wrapper.find('nav[aria-label="Mobile navigation"]').exists()).toBe(true)

    route.path = '/projects'
    triggerRouteWatch()
    await nextTick()

    expect(wrapper.find('nav[aria-label="Mobile navigation"]').exists()).toBe(false)
  })
})
