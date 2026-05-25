import { describe, expect, it } from 'vite-plus/test'

import {
  buildProjectMetadataRedirectRouteRules,
  getProjectMetadataRedirectEntries,
  getProjectMetadataRedirectGroups,
  renderProjectMetadataRedirectsFile,
} from '../../project-metadata.config'

describe('project metadata redirects', () => {
  it('keeps redirect groups in declaration order', () => {
    const groups = getProjectMetadataRedirectGroups()

    expect(groups).toHaveLength(3)
    expect(groups[0]?.comment).toBe('Legal Notice alternative paths')
    expect(groups[1]?.comment).toBe('Privacy Policy alternative paths')
    expect(groups[2]?.comment).toBe('Machine-readable metadata alias')
  })

  it('flattens redirect entries in declaration order', () => {
    const entries = getProjectMetadataRedirectEntries()

    expect(entries.map(entry => entry.from)).toEqual([
      '/imprint',
      '/impressum',
      '/legal',
      '/privacy',
      '/datenschutz',
      '/security.txt',
    ])
  })

  it('reuses redirect metadata when building route rules', () => {
    const routeRules = buildProjectMetadataRedirectRouteRules()

    expect(routeRules['/imprint']).toEqual({
      redirect: {
        to: '/legal-notice',
        statusCode: 301,
      },
    })
    expect(routeRules['/security.txt']).toEqual({
      redirect: {
        to: '/.well-known/security.txt',
        statusCode: 301,
      },
    })
  })

  it('renders the Cloudflare redirects artifact', () => {
    const redirectsFile = renderProjectMetadataRedirectsFile()

    expect(redirectsFile).toMatch(/^# Cloudflare Pages edge-level redirects\./)
    expect(redirectsFile).toContain('# Legal Notice alternative paths')
    expect(redirectsFile).toContain('/privacy /privacy-policy 301')
    expect(redirectsFile).toContain('/security.txt /.well-known/security.txt 301')
  })
})
