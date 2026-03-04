/**
 * @file Defines the `@nuxt/content` configuration for the application.
 * Contains mainly the schema for content in the `/content/` folder.
 */

import { defineContentConfig, defineCollection } from '@nuxt/content'
import { asSeoCollection } from '@nuxtjs/seo/content'
import { z } from 'zod'

export default defineContentConfig({
  collections: {
    content: defineCollection(
      asSeoCollection({
        type: 'page',
        source: {
          include: '**',
          exclude: [
            'socials/**',
          ],
        },
      }),
    ),

    socials: defineCollection({
      type: 'data',
      source: 'socials/*.yml',
      schema: z.object({
        /** Display name of the social platform (e.g. "GitHub"). */
        name: z.string(),
        /** Full profile URL. */
        url: z.url(),
        /** Iconify icon identifier (e.g. "simple-icons:github"). */
        icon: z.string(),
        /** Controls display order (ascending). */
        sortOrder: z.number().default(99),
      }),
    }),
  },
})
