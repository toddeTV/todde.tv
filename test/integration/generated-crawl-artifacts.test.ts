import { beforeAll, describe, expect, it } from 'vite-plus/test'

import { listIndexableRoutePaths } from '../utils/content-routes'
import { ensureStaticSiteBuild, readGeneratedOutput } from '../utils/static-site-build'

const blockedAiCrawlerAgents = [
  'GPTBot',
  'CCBot',
  'Google-Extended',
  'ClaudeBot',
  'anthropic-ai',
  'Bytespider',
  'Applebot-Extended',
  'meta-externalagent',
  'cohere-ai',
  'Omgilibot',
  'FacebookBot',
  'Claude-Web',
]

function extractSitemapLocations(sitemapXml: string): string[] {
  return Array.from(sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g), match => match[1])
}

describe('generated crawl artifacts', () => {
  beforeAll(() => {
    ensureStaticSiteBuild()
  }, 600_000)

  it('blocks the expected AI crawlers in robots.txt and exposes crawl directives', () => {
    const robotsText = readGeneratedOutput('robots.txt')

    for (const blockedAiCrawlerAgent of blockedAiCrawlerAgents) {
      expect(robotsText).toContain(`User-agent: ${blockedAiCrawlerAgent}`)
    }

    expect(robotsText).toContain('User-agent: *')
    expect(robotsText).toContain('Allow: /')
    expect(robotsText).toContain('Content-Usage: bots=y, search=y, ai-output=y, train-ai=n')
    expect(robotsText).toContain('Content-Signal: search=yes, ai-input=yes, ai-train=no')
    expect(robotsText).toContain('Sitemap: https://todde.tv/sitemap.xml')
  })

  it('lists every public indexable route in sitemap.xml and excludes the vCard route', () => {
    const sitemapXml = readGeneratedOutput('sitemap.xml')
    const sitemapLocations = extractSitemapLocations(sitemapXml)
    const expectedLocations = listIndexableRoutePaths().map(routePath => `https://todde.tv${routePath}`)

    expect(sitemapLocations).toEqual(expectedLocations)
    expect(sitemapLocations).not.toContain('https://todde.tv/vcard')
  })
})
