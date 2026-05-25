import { beforeAll, describe, expect, it } from 'vite-plus/test'

import { extractCanonicalHref, extractMetaContent, extractTitle } from '../utils/html-head'
import { ensureStaticSiteBuild, readGeneratedRoute } from '../utils/static-site-build'

describe('prerendered SEO metadata', () => {
  beforeAll(() => {
    ensureStaticSiteBuild()
  }, 600_000)

  it('renders the expected metadata on the home page', () => {
    const homeHtml = readGeneratedRoute('/')
    const homeDescription
      = [
        'IT consultant, senior full-stack developer, and conference speaker.',
        'Specializing in Vue.js, Nuxt, 3D on the web, and full-stack development.',
      ].join(' ')

    expect(extractTitle(homeHtml)).toBe('Thorsten Seyschab - @toddeTV')
    expect(extractMetaContent(homeHtml, 'name', 'description')).toBe(homeDescription)
    expect(extractCanonicalHref(homeHtml)).toBe('https://todde.tv/')
    expect(extractMetaContent(homeHtml, 'property', 'og:title')).toBe('Thorsten Seyschab - @toddeTV')
    expect(extractMetaContent(homeHtml, 'property', 'og:description')).toBe(homeDescription)
    expect(extractMetaContent(homeHtml, 'name', 'robots')).toBe(
      'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    )
  })

  it('renders the expected metadata on a project detail page', () => {
    const projectHtml = readGeneratedRoute('/projects/stage-flow-tools')
    const projectDescription
      = [
        'Real-time quiz and interaction platform for live presentations.',
        'Admin-controlled quizzes, emoji reactions, and live voting results for engaging talks.',
      ].join(' ')

    expect(extractTitle(projectHtml)).toBe('stage-flow-tools | Thorsten Seyschab')
    expect(extractMetaContent(projectHtml, 'name', 'description')).toBe(projectDescription)
    expect(extractCanonicalHref(projectHtml)).toBe('https://todde.tv/projects/stage-flow-tools')
    expect(extractMetaContent(projectHtml, 'property', 'og:title')).toBe('stage-flow-tools | Thorsten Seyschab')
    expect(extractMetaContent(projectHtml, 'property', 'og:description')).toBe(projectDescription)
  })

  it('renders the expected metadata on a talk detail page', () => {
    const talkHtml = readGeneratedRoute('/talks/2024-11-12-nuxtnation')
    const talkDescription
      = [
        'Demonstrating how to integrate 3D experiences into Nuxt applications using TresJS,',
        'covering setup, rendering, and interactive scenes.',
      ].join(' ')

    expect(extractTitle(talkHtml)).toBe('Playing with Nuxt in 3D | Thorsten Seyschab')
    expect(extractMetaContent(talkHtml, 'name', 'description')).toBe(talkDescription)
    expect(extractCanonicalHref(talkHtml)).toBe('https://todde.tv/talks/2024-11-12-nuxtnation')
    expect(extractMetaContent(talkHtml, 'property', 'og:title')).toBe('Playing with Nuxt in 3D | Thorsten Seyschab')
    expect(extractMetaContent(talkHtml, 'property', 'og:description')).toBe(talkDescription)
  })

  it('renders the expected metadata on the legal notice page', () => {
    const legalNoticeHtml = readGeneratedRoute('/legal-notice')

    expect(extractTitle(legalNoticeHtml)).toBe('Legal Notice | Thorsten Seyschab')
    expect(extractMetaContent(legalNoticeHtml, 'name', 'description')).toBe(
      'Legal notice (Impressum) for todde.tv pursuant to § 5 DDG.',
    )
    expect(extractCanonicalHref(legalNoticeHtml)).toBe('https://todde.tv/legal-notice')
    expect(extractMetaContent(legalNoticeHtml, 'property', 'og:title')).toBe('Legal Notice | Thorsten Seyschab')
    expect(extractMetaContent(legalNoticeHtml, 'property', 'og:description')).toBe(
      'Legal notice (Impressum) for todde.tv pursuant to § 5 DDG.',
    )
  })
})
