import { beforeAll, describe, expect, it } from 'vite-plus/test'

import { listProjectRoutePaths, listTalkRoutePaths } from '../utils/content-routes'
import { ensureStaticSiteBuild, hasGeneratedRoute } from '../utils/static-site-build'

const projectRoutePaths = listProjectRoutePaths()
const talkRoutePaths = listTalkRoutePaths()

describe('prerendered route coverage', () => {
  beforeAll(() => {
    ensureStaticSiteBuild()
  }, 600_000)

  it('prerenders the main overview routes', () => {
    expect(hasGeneratedRoute('/')).toBe(true)
    expect(hasGeneratedRoute('/projects')).toBe(true)
    expect(hasGeneratedRoute('/talks')).toBe(true)
  })

  it('prerenders every project detail route from content', () => {
    expect(projectRoutePaths.length).toBeGreaterThan(0)

    for (const projectRoutePath of projectRoutePaths) {
      expect(hasGeneratedRoute(projectRoutePath)).toBe(true)
    }
  })

  it('prerenders every talk detail route from content', () => {
    expect(talkRoutePaths.length).toBeGreaterThan(0)

    for (const talkRoutePath of talkRoutePaths) {
      expect(hasGeneratedRoute(talkRoutePath)).toBe(true)
    }
  })
})
