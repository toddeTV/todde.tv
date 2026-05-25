import { beforeAll, describe, expect, it } from 'vite-plus/test'

import { renderProjectMetadataRedirectsFile } from '#shared/utils/project-metadata'
import {
  ensureStaticSiteBuild,
  hasGeneratedOutput,
  hasGeneratedRoute,
  readGeneratedOutput,
} from '../utils/static-site-build'

describe('static site integration output', () => {
  beforeAll(() => {
    ensureStaticSiteBuild()
  }, 600_000)

  it('writes the Cloudflare redirects artifact to the generated output', () => {
    expect(hasGeneratedOutput('_redirects')).toBe(true)
    expect(readGeneratedOutput('_redirects')).toBe(renderProjectMetadataRedirectsFile())
  })

  it('prerenders critical routes and machine-readable endpoints', () => {
    expect(hasGeneratedRoute('/legal-notice')).toBe(true)
    expect(hasGeneratedRoute('/privacy-policy')).toBe(true)
    expect(hasGeneratedRoute('/g')).toBe(true)
    expect(hasGeneratedOutput('humans.txt')).toBe(true)
    expect(hasGeneratedOutput('.well-known/security.txt')).toBe(true)
  })

  it('hydrates humans.txt with project, author, repository, and release metadata', () => {
    const humansText = readGeneratedOutput('humans.txt')

    expect(humansText).toContain('Name: todde.tv')
    expect(humansText).toContain('URL: https://todde.tv')
    expect(humansText).toContain('Name: Thorsten Seyschab')
    expect(humansText).toContain('Contact: hello@todde.tv')
    expect(humansText).toContain('Repository: https://github.com/toddeTV/todde.tv')
    expect(humansText).toContain('License: https://github.com/toddeTV/todde.tv/blob/main/LICENSE.md')
    expect(humansText).toMatch(/Version: \d{4}\.\d{2}\.\d{2}\+[a-z0-9]+/)
  })

  it('renders security.txt as a valid machine-readable text output', () => {
    const securityText = readGeneratedOutput('.well-known/security.txt')

    expect(securityText).toContain('Contact: mailto:hello@todde.tv')
    expect(securityText).toContain('Canonical: https://todde.tv/.well-known/security.txt')
    expect(securityText).toContain('Preferred-Languages: en, de')
    expect(securityText).toMatch(/Expires: \d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/)
  })
})
