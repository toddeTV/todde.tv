import { readdirSync } from 'node:fs'
import { resolve } from 'node:path'

import { beforeAll, describe, expect, it } from 'vite-plus/test'

import { ensureStaticSiteBuild, hasGeneratedRoute } from '../utils/static-site-build'

function listContentSlugs(directoryName: string): string[] {
  return readdirSync(resolve(process.cwd(), 'content', directoryName))
    .filter(fileName => fileName.endsWith('.md'))
    .map(fileName => fileName.slice(0, -3))
    .sort()
}

const projectSlugs = listContentSlugs('projects')
const talkSlugs = listContentSlugs('talks')

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
    expect(projectSlugs.length).toBeGreaterThan(0)

    for (const projectSlug of projectSlugs) {
      expect(hasGeneratedRoute(`/projects/${projectSlug}`)).toBe(true)
    }
  })

  it('prerenders every talk detail route from content', () => {
    expect(talkSlugs.length).toBeGreaterThan(0)

    for (const talkSlug of talkSlugs) {
      expect(hasGeneratedRoute(`/talks/${talkSlug}`)).toBe(true)
    }
  })
})
