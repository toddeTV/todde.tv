import { beforeAll, describe, expect, it } from 'vite-plus/test'

import { ensureStaticSiteBuild, readGeneratedRoute } from '../utils/static-site-build'

type StructuredDataNode = {
  '@id'?: string
  '@type'?: string
  'about'?: { '@id'?: string }
  'description'?: string
  'email'?: string
  'image'?: { '@id'?: string }
  'isPartOf'?: { '@id'?: string }
  'name'?: string
  'potentialAction'?: Array<{ '@type'?: string, 'target'?: string[] }>
  'publisher'?: { '@id'?: string }
  'sameAs'?: string[]
  'url'?: string
}

type StructuredDataGraph = {
  '@context': string
  '@graph': StructuredDataNode[]
}

function readStructuredDataGraph(routePath: string): StructuredDataGraph {
  const html = readGeneratedRoute(routePath)
  const graphMatch
    = html.match(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/i)

  if (!graphMatch?.[1]) {
    throw new Error(`Missing structured data graph for route: ${routePath}`)
  }

  return JSON.parse(graphMatch[1]) as StructuredDataGraph
}

function findStructuredDataNode(
  graph: StructuredDataGraph,
  nodeType: string,
  nodeId?: string,
): StructuredDataNode | undefined {
  return graph['@graph'].find(node => node['@type'] === nodeType && (!nodeId || node['@id'] === nodeId))
}

describe('prerendered structured data', () => {
  beforeAll(() => {
    ensureStaticSiteBuild()
  }, 600_000)

  it('renders the shared website, identity, and image nodes on the home page', () => {
    const graph = readStructuredDataGraph('/')
    const homePageUrl = 'https://todde.tv/'
    const websiteNode = findStructuredDataNode(graph, 'WebSite', 'https://todde.tv/#website')
    const webpageNode = findStructuredDataNode(graph, 'WebPage', 'https://todde.tv/#webpage')
    const personNode = findStructuredDataNode(graph, 'Person', 'https://todde.tv/#identity')
    const imageNode = findStructuredDataNode(graph, 'ImageObject', 'https://todde.tv/#/schema/image/1')

    expect(graph['@context']).toBe('https://schema.org')
    expect(websiteNode).toMatchObject({
      '@type': 'WebSite',
      'name': 'Thorsten Seyschab',
      'url': homePageUrl,
      'publisher': { '@id': 'https://todde.tv/#identity' },
    })
    expect(webpageNode).toMatchObject({
      '@type': 'WebPage',
      'name': 'Thorsten Seyschab - @toddeTV',
      'url': homePageUrl,
      'about': { '@id': 'https://todde.tv/#identity' },
      'isPartOf': { '@id': 'https://todde.tv/#website' },
    })
    expect(webpageNode?.potentialAction).toEqual([
      {
        '@type': 'ReadAction',
        'target': [homePageUrl],
      },
    ])
    expect(personNode).toMatchObject({
      '@type': 'Person',
      'email': 'hello@todde.tv',
      'name': 'Thorsten Seyschab',
      'url': 'https://todde.tv',
      'image': { '@id': 'https://todde.tv/#/schema/image/1' },
    })
    expect(personNode?.sameAs).toEqual([
      'https://www.linkedin.com/in/toddetv/',
      'https://github.com/toddeTV',
      'https://x.com/toddeTV',
    ])
    expect(imageNode).toMatchObject({
      '@type': 'ImageObject',
      'contentUrl': 'https://todde.tv/avatar-thorsten-seyschab.jpg',
      'url': 'https://todde.tv/avatar-thorsten-seyschab.jpg',
    })
  })

  it('renders route-specific structured data on a project detail page', () => {
    const graph = readStructuredDataGraph('/projects/stage-flow-tools')
    const projectDescription
      = [
        'Real-time quiz and interaction platform for live presentations.',
        'Admin-controlled quizzes, emoji reactions, and live voting results for engaging talks.',
      ].join(' ')
    const webpageNode = findStructuredDataNode(
      graph,
      'WebPage',
      'https://todde.tv/projects/stage-flow-tools#webpage',
    )

    expect(webpageNode).toMatchObject({
      '@type': 'WebPage',
      'name': 'stage-flow-tools',
      'url': 'https://todde.tv/projects/stage-flow-tools',
      'description': projectDescription,
      'about': { '@id': 'https://todde.tv/#identity' },
      'isPartOf': { '@id': 'https://todde.tv/#website' },
    })
    expect(webpageNode?.potentialAction).toEqual([
      {
        '@type': 'ReadAction',
        'target': ['https://todde.tv/projects/stage-flow-tools'],
      },
    ])
  })

  it('renders route-specific structured data on a talk detail page', () => {
    const graph = readStructuredDataGraph('/talks/2024-11-12-nuxtnation')
    const talkDescription
      = [
        'Demonstrating how to integrate 3D experiences into Nuxt applications using TresJS,',
        'covering setup, rendering, and interactive scenes.',
      ].join(' ')
    const webpageNode = findStructuredDataNode(
      graph,
      'WebPage',
      'https://todde.tv/talks/2024-11-12-nuxtnation#webpage',
    )

    expect(webpageNode).toMatchObject({
      '@type': 'WebPage',
      'name': 'Playing with Nuxt in 3D',
      'url': 'https://todde.tv/talks/2024-11-12-nuxtnation',
      'description': talkDescription,
      'about': { '@id': 'https://todde.tv/#identity' },
      'isPartOf': { '@id': 'https://todde.tv/#website' },
    })
    expect(webpageNode?.potentialAction).toEqual([
      {
        '@type': 'ReadAction',
        'target': ['https://todde.tv/talks/2024-11-12-nuxtnation'],
      },
    ])
  })
})
