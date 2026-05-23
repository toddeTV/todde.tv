import { expect, test } from 'vite-plus/test'

import { buildPhoneUri } from './build-phone-uri'

test('builds a tel URI from a spaced international number', () => {
  expect(buildPhoneUri('+49 351 0000000')).toBe('tel:+493510000000')
})

test('keeps an existing tel URI valid', () => {
  expect(buildPhoneUri('tel:+493510000000')).toBe('tel:+493510000000')
})

test('strips common display separators', () => {
  expect(buildPhoneUri('+49 (351) 000-0000')).toBe('tel:+493510000000')
})

test('returns an empty string when input contains no digits', () => {
  expect(buildPhoneUri('contact me maybe')).toBe('')
})
