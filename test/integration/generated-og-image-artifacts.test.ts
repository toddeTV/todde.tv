import { beforeAll, describe, expect, it } from 'vite-plus/test'

import { extractMetaContent } from '../utils/html-head'
import {
  ensureStaticSiteBuild,
  hasGeneratedOutput,
  readGeneratedRoute,
} from '../utils/static-site-build'

function assertGeneratedOgImage(routePath: string): void {
  const routeHtml = readGeneratedRoute(routePath)
  const ogImageUrl = extractMetaContent(routeHtml, 'property', 'og:image')

  expect(ogImageUrl).toBeTruthy()
  expect(ogImageUrl).toMatch(/^https:\/\/todde\.tv\/_og\/s\/.+\.png$/)

  const ogImagePath = new URL(ogImageUrl as string).pathname.slice(1)

  expect(hasGeneratedOutput(ogImagePath)).toBe(true)
}

describe('generated OG image artifacts', () => {
  beforeAll(() => {
    ensureStaticSiteBuild()
  }, 600_000)

  it('generates an OG image for the home page', () => {
    assertGeneratedOgImage('/')
  })

  it('generates an OG image for a project detail page', () => {
    assertGeneratedOgImage('/projects/stage-flow-tools')
  })

  it('generates an OG image for a talk detail page', () => {
    assertGeneratedOgImage('/talks/2024-11-12-nuxtnation')
  })

  it('generates an OG image for the vCard page', () => {
    assertGeneratedOgImage('/vcard')
  })
})
