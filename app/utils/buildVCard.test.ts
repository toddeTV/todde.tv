import { describe, expect, it } from 'vite-plus/test'

import { buildVCard } from './buildVCard'

const projectMetadata = {
  author: {
    lastName: 'Seyschab',
    firstName: 'Thorsten',
    handle: '@toddeTV',
    name: 'Thorsten Seyschab',
    nickname: 'toddeTV',
    role: 'IT consultant, senior full-stack developer, and conference speaker',
  },
  siteUrl: 'https://todde.tv',
} as const

describe('buildVCard', () => {
  it('renders selected fixed fields and contact entries in vCard order', () => {
    const card = buildVCard(
      projectMetadata,
      {
        name: true,
        nickname: true,
        website: true,
        bio: true,
      },
      [
        'hello@todde.tv',
      ],
      [
        '+4917691404834',
      ],
      [
        {
          name: 'GitHub',
          url: 'https://github.com/toddeTV',
        },
      ],
    )

    expect(card).toBe([
      'BEGIN:VCARD',
      'VERSION:3.0',
      'N:Seyschab;Thorsten;;;',
      'FN:Thorsten Seyschab',
      'NICKNAME:toddeTV',
      'URL:https://todde.tv',
      'NOTE:@toddeTV - IT consultant\\, senior full-stack developer\\, and conference speaker',
      'EMAIL:hello@todde.tv',
      'TEL;TYPE=CELL:+4917691404834',
      'X-SOCIALPROFILE;TYPE=GitHub:https://github.com/toddeTV',
      'END:VCARD',
    ].join('\r\n'))
  })

  it('escapes vCard value characters in names, notes, and social type labels', () => {
    const card = buildVCard(
      {
        author: {
          lastName: 'Semi;Colon',
          firstName: 'Comma,Slash\\Line\nBreak',
          handle: '@semi;comma',
          name: 'Semi;Colon, Slash\\Line\nBreak',
          nickname: 'nick;name',
          role: 'Line one\nLine two',
        },
        siteUrl: 'https://todde.tv',
      },
      {
        name: true,
        nickname: true,
        website: false,
        bio: true,
      },
      [],
      [],
      [
        {
          name: 'Mastodon;Profile',
          url: 'https://example.com/@todde',
        },
      ],
    )

    expect(card).toContain('N:Semi\\;Colon;Comma\\,Slash\\\\Line\\nBreak;;;')
    expect(card).toContain('FN:Semi\\;Colon\\, Slash\\\\Line\\nBreak')
    expect(card).toContain('NICKNAME:nick\\;name')
    expect(card).toContain('NOTE:@semi\\;comma - Line one\\nLine two')
    expect(card).toContain('X-SOCIALPROFILE;TYPE=Mastodon\\;Profile:https://example.com/@todde')
  })

  it('omits optional fields that are not selected', () => {
    const card = buildVCard(
      projectMetadata,
      {
        name: false,
        nickname: false,
        website: false,
        bio: false,
      },
      [],
      [],
      [],
    )

    expect(card).toBe([
      'BEGIN:VCARD',
      'VERSION:3.0',
      'END:VCARD',
    ].join('\r\n'))
  })
})
