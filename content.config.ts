/**
 * @file Defines the `@nuxt/content` configuration for the application.
 * Contains mainly the schema for content in the `/content/` folder.
 */

import { defineContentConfig, defineCollection } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    content: defineCollection({
      type: 'page',
      source: '**',
    }),
  },
})
