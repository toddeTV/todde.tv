import { afterEach, describe, expect, it, vi } from 'vite-plus/test'

import { resolveBuildReleaseMetadata } from './build-release-metadata'

afterEach(() => {
  vi.useRealTimers()
})

describe('resolveBuildReleaseMetadata', () => {
  it('prefers explicit build metadata env values in declared order', () => {
    const metadata = resolveBuildReleaseMetadata({
      BUILD_RELEASE_DATE: '2026-04-15',
      BUILD_RELEASE_COMMIT_SHORT: 'ABCDEF123456',
      GITHUB_SHA: '1234567890abcdef',
    }, () => '7654321')

    expect(metadata).toEqual({
      buildDateIso: '2026-04-15',
      commitShort: 'abcdef1',
      releaseLabel: '2026.04.15+abcdef1',
    })
  })

  it('normalizes datetime env values and falls back to git resolver for commit', () => {
    const metadata = resolveBuildReleaseMetadata({
      NUXT_BUILD_RELEASE_DATE: '2026-04-15T19:20:21.000Z',
    }, () => 'Feature abcdef1234567890')

    expect(metadata).toEqual({
      buildDateIso: '2026-04-15',
      commitShort: 'abcdef1',
      releaseLabel: '2026.04.15+abcdef1',
    })
  })

  it('falls back to current UTC date when build date is invalid', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-05-23T08:00:00.000Z'))

    const metadata = resolveBuildReleaseMetadata({
      BUILD_RELEASE_DATE: '2026-02-30',
    }, () => 'abcdef1')

    expect(metadata).toEqual({
      buildDateIso: '2026-05-23',
      commitShort: 'abcdef1',
      releaseLabel: '2026.05.23+abcdef1',
    })
  })

  it('uses unknown when no valid commit can be resolved', () => {
    const metadata = resolveBuildReleaseMetadata({
      BUILD_RELEASE_DATE: '2026-04-15',
      GITHUB_SHA: 'not-a-sha',
    }, () => undefined)

    expect(metadata).toEqual({
      buildDateIso: '2026-04-15',
      commitShort: 'unknown',
      releaseLabel: '2026.04.15+unknown',
    })
  })
})
