import { readdirSync } from 'node:fs'
import { resolve } from 'node:path'

function listContentSlugs(directoryName: string): string[] {
  return readdirSync(resolve(process.cwd(), 'content', directoryName))
    .filter(fileName => fileName.endsWith('.md'))
    .map(fileName => fileName.slice(0, -3))
    .sort()
}

export function listProjectRoutePaths(): string[] {
  return listContentSlugs('projects').map(projectSlug => `/projects/${projectSlug}`)
}

export function listTalkRoutePaths(): string[] {
  return listContentSlugs('talks').map(talkSlug => `/talks/${talkSlug}`)
}

export function listIndexableRoutePaths(): string[] {
  return [
    '/',
    '/g',
    '/legal-notice',
    '/privacy-policy',
    '/projects',
    '/talks',
    ...listProjectRoutePaths(),
    ...listTalkRoutePaths(),
  ]
}
