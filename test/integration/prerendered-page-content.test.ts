import { beforeAll, describe, expect, it } from 'vite-plus/test'

import { ensureStaticSiteBuild, readGeneratedRoute } from '../utils/static-site-build'

describe('prerendered page content', () => {
  beforeAll(() => {
    ensureStaticSiteBuild()
  }, 600_000)

  it('renders the home page content sections', () => {
    const homeHtml = readGeneratedRoute('/')

    expect(homeHtml).toContain('Thorsten Seyschab')
    expect(homeHtml).toContain('About Me')
    expect(homeHtml).toContain('What I Work With')
    expect(homeHtml).toContain('Connect')
    expect(homeHtml).toContain('Recent Talks')
    expect(homeHtml).toContain('Recent Projects')
  })

  it('renders representative project detail content', () => {
    const projectHtml = readGeneratedRoute('/projects/stage-flow-tools')

    expect(projectHtml).toContain('stage-flow-tools')
    expect(projectHtml).toContain('Real-time quiz and interaction platform for live presentations.')
    expect(projectHtml).toContain('Nuxt')
    expect(projectHtml).toContain('TypeScript')
    expect(projectHtml).toContain('View on GitHub')
  })

  it('renders representative talk detail content', () => {
    const talkHtml = readGeneratedRoute('/talks/2024-11-12-nuxtnation')

    expect(talkHtml).toContain('Playing with Nuxt in 3D')
    expect(talkHtml).toContain('NuxtNation 2024')
    expect(talkHtml).toContain('Online')
    expect(talkHtml).toContain('View Slides')
    expect(talkHtml).toContain('Watch Video')
    expect(talkHtml).toContain('Source Code')
  })

  it('renders the swag landing page content', () => {
    const swagHtml = readGeneratedRoute('/g')

    expect(swagHtml).toContain('You found the secret swag stash!')
    expect(swagHtml).toContain('3D-printed magnets or keychains')
    expect(swagHtml).toContain('Disclaimer')
    expect(swagHtml).toContain('Haftungshinweis')
    expect(swagHtml).toContain('contact me')
  })

  it('renders the legal notice content', () => {
    const legalNoticeHtml = readGeneratedRoute('/legal-notice')

    expect(legalNoticeHtml).toContain('Legal Notice')
    expect(legalNoticeHtml).toContain('Information Pursuant to § 5 DDG')
    expect(legalNoticeHtml).toContain('VAT Identification Number')
    expect(legalNoticeHtml).toContain('Dispute Resolution')
    expect(legalNoticeHtml).toContain('Copyright')
  })

  it('renders the privacy policy content', () => {
    const privacyPolicyHtml = readGeneratedRoute('/privacy-policy')

    expect(privacyPolicyHtml).toContain('Privacy Policy')
    expect(privacyPolicyHtml).toContain('Overview of Data Processing')
    expect(privacyPolicyHtml).toContain('Cloudflare Web Analytics')
    expect(privacyPolicyHtml).toContain('Contact via Email')
    expect(privacyPolicyHtml).toContain('Right to Lodge a Complaint')
  })
})
