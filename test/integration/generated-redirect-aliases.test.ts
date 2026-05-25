import { beforeAll, describe, expect, it } from 'vite-plus/test'

import { getProjectMetadataRedirectEntries } from '#shared/utils/project-metadata'
import {
  ensureStaticSiteBuild,
  hasGeneratedOutput,
  hasGeneratedRoute,
  readGeneratedOutput,
} from '../utils/static-site-build'

function hasGeneratedRedirectTarget(targetPath: string): boolean {
  if (targetPath.endsWith('.txt')) {
    return hasGeneratedOutput(targetPath.slice(1))
  }

  return hasGeneratedRoute(targetPath)
}

describe('generated redirect aliases', () => {
  beforeAll(() => {
    ensureStaticSiteBuild()
  }, 600_000)

  it('renders every project-metadata redirect entry into the generated redirects artifact', () => {
    const redirectEntries = getProjectMetadataRedirectEntries()
    const redirectsText = readGeneratedOutput('_redirects')
    const renderedRedirectLines = redirectsText
      .split('\n')
      .filter(line => line && !line.startsWith('#'))

    expect(renderedRedirectLines).toHaveLength(redirectEntries.length)

    for (const redirectEntry of redirectEntries) {
      expect(renderedRedirectLines).toContain(
        `${redirectEntry.from} ${redirectEntry.to} ${redirectEntry.statusCode}`,
      )
    }
  })

  it('points every configured redirect entry to an existing generated target', () => {
    const redirectEntries = getProjectMetadataRedirectEntries()

    for (const redirectEntry of redirectEntries) {
      expect(hasGeneratedRedirectTarget(redirectEntry.to)).toBe(true)
    }
  })
})
