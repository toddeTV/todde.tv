import { describe, expect, it } from 'vite-plus/test'
import {
  dedupeUrls,
  isMailtoUrl,
  isPhoneUrl,
  isProfileUrl,
  prepareProjectMetadata,
  removeMailtoPrefix,
} from '#shared/utils/project-metadata'

describe('project metadata url helpers', () => {
  it('classifies mailto, phone, and profile urls', () => {
    expect(isMailtoUrl('mailto:hello@todde.tv')).toBe(true)
    expect(isMailtoUrl('https://todde.tv')).toBe(false)
    expect(isPhoneUrl('tel:+4917691404834')).toBe(true)
    expect(isPhoneUrl('mailto:hello@todde.tv')).toBe(false)
    expect(isProfileUrl('https://github.com/toddeTV')).toBe(true)
    expect(isProfileUrl('tel:+4917691404834')).toBe(false)
  })

  it('removes only the mailto prefix', () => {
    expect(removeMailtoPrefix('mailto:hello@todde.tv')).toBe('hello@todde.tv')
    expect(removeMailtoPrefix('https://todde.tv')).toBe('https://todde.tv')
  })

  it('deduplicates urls and keeps first-seen order', () => {
    expect(dedupeUrls([
      'https://todde.tv',
      'https://github.com/toddeTV',
      'https://todde.tv',
      'https://x.com/toddeTV',
      'https://github.com/toddeTV',
    ])).toEqual([
      'https://todde.tv',
      'https://github.com/toddeTV',
      'https://x.com/toddeTV',
    ])
  })
})

describe('prepareProjectMetadata', () => {
  it('derives author contact and sameAs from socials content', () => {
    const projectMetadata = prepareProjectMetadata([
      {
        featured: true,
        handle: 'hello@todde.tv',
        icon: 'ph:envelope-simple',
        name: 'Email',
        sortOrder: 1,
        url: 'mailto:hello@todde.tv',
      },
      {
        featured: false,
        handle: '+49 176 91404834',
        icon: 'ph:phone',
        name: 'Phone',
        sortOrder: 2,
        url: 'tel:+4917691404834',
      },
      {
        featured: true,
        handle: '@toddeTV',
        icon: 'ph:github-logo',
        name: 'GitHub',
        sortOrder: 4,
        url: 'https://github.com/toddeTV',
      },
      {
        featured: true,
        handle: '@toddeTV',
        icon: 'ph:x-logo',
        name: 'X',
        sortOrder: 5,
        url: 'https://x.com/toddeTV',
      },
    ])

    expect(projectMetadata.author.contact).toBe('hello@todde.tv')
    expect(projectMetadata.author.sameAs).toEqual([
      'https://github.com/toddeTV',
      'https://x.com/toddeTV',
    ])
    expect(projectMetadata.featuredSocials).toHaveLength(3)
    expect(projectMetadata.primaryPhoneSocial?.url).toBe('tel:+4917691404834')
  })

  it('returns empty derived author fields when socials do not provide them', () => {
    const projectMetadata = prepareProjectMetadata([])

    expect(projectMetadata.author.contact).toBe('')
    expect(projectMetadata.author.sameAs).toEqual([])
  })

  it('filters inactive socials, sorts active entries, and deduplicates featured profiles', () => {
    const projectMetadata = prepareProjectMetadata([
      {
        active: false,
        featured: true,
        handle: '@old-handle',
        icon: 'ph:x-logo',
        name: 'Inactive X',
        sortOrder: 0,
        url: 'https://x.com/old-handle',
      },
      {
        featured: true,
        handle: '@toddeTV',
        icon: 'ph:github-logo',
        name: 'GitHub',
        sortOrder: 30,
        url: 'https://github.com/toddeTV',
      },
      {
        featured: true,
        handle: '+49 176 91404834',
        icon: 'ph:phone',
        name: 'Phone',
        sortOrder: 20,
        url: 'tel:+4917691404834',
      },
      {
        featured: true,
        handle: '@toddeTV',
        icon: 'ph:link',
        name: 'Homepage',
        sortOrder: 10,
        url: 'https://todde.tv',
      },
      {
        featured: true,
        handle: 'hello@todde.tv',
        icon: 'ph:envelope-simple',
        name: 'Email',
        sortOrder: 5,
        url: 'mailto:hello@todde.tv',
      },
      {
        featured: true,
        handle: '@toddeTV',
        icon: 'ph:globe',
        name: 'Homepage duplicate',
        sortOrder: 40,
        url: 'https://todde.tv',
      },
    ])

    expect(projectMetadata.socials.map(social => social.name)).toEqual([
      'Email',
      'Homepage',
      'Phone',
      'GitHub',
      'Homepage duplicate',
    ])
    expect(projectMetadata.featuredSocials.map(social => social.name)).toEqual([
      'Email',
      'Homepage',
      'Phone',
      'GitHub',
      'Homepage duplicate',
    ])
    expect(projectMetadata.author.sameAs).toEqual([
      'https://todde.tv',
      'https://github.com/toddeTV',
    ])
    expect(projectMetadata.primaryEmailSocial?.url).toBe('mailto:hello@todde.tv')
    expect(projectMetadata.primaryPhoneSocial?.url).toBe('tel:+4917691404834')
  })
})
