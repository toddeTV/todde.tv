import { describe, expect, it } from 'vite-plus/test'

import {
  buildDefaultVCardSelectionMap,
  partitionVCardSocialEntries,
} from './vcard-selection'

const socials = [
  { id: 'email-1', url: 'mailto:first@example.com' },
  { id: 'social-1', url: 'https://github.com/toddeTV' },
  { id: 'phone-1', url: 'tel:+4912345' },
  { id: 'email-2', url: 'mailto:second@example.com' },
  { id: 'phone-2', url: 'tel:+4967890' },
] as const

describe('partitionVCardSocialEntries', () => {
  it('splits email, phone, and profile entries by url prefix', () => {
    const groups = partitionVCardSocialEntries(socials)

    expect(groups.emailEntries.map(entry => entry.id)).toEqual(['email-1', 'email-2'])
    expect(groups.phoneEntries.map(entry => entry.id)).toEqual(['phone-1', 'phone-2'])
    expect(groups.socialEntries.map(entry => entry.id)).toEqual(['social-1'])
  })

  it('returns empty groups for missing input', () => {
    expect(partitionVCardSocialEntries(null)).toEqual({
      emailEntries: [],
      phoneEntries: [],
      socialEntries: [],
    })
  })
})

describe('buildDefaultVCardSelectionMap', () => {
  it('preselects the first email and first phone entry only', () => {
    expect(buildDefaultVCardSelectionMap(socials)).toEqual({
      'email-1': true,
      'social-1': false,
      'phone-1': true,
      'email-2': false,
      'phone-2': false,
    })
  })

  it('keeps profile-only entries unchecked', () => {
    expect(buildDefaultVCardSelectionMap([
      { id: 'profile-1', url: 'https://example.com/one' },
      { id: 'profile-2', url: 'https://example.com/two' },
    ])).toEqual({
      'profile-1': false,
      'profile-2': false,
    })
  })
})
