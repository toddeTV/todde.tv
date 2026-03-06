/**
 * @file Defines the `@nuxt/content` configuration for the application.
 * Contains mainly the schema for content in the `/content/` folder.
 */

import { defineContentConfig, defineCollection } from '@nuxt/content'
import { asSeoCollection } from '@nuxtjs/seo/content'
import { z } from 'zod'

const testimonialSchema = z.object({
  /** The testimonial text. */
  quote: z.string(),
  /** Name of the person who gave the testimonial. */
  author: z.string(),
  /** Role or affiliation of the author (e.g. "Project Lead / Company"). */
  role: z.string(),
})

export default defineContentConfig({
  collections: {
    content: defineCollection(
      asSeoCollection({
        type: 'page',
        source: {
          include: 'pages/**',
          prefix: '/',
        },
      }),
    ),

    socials: defineCollection({
      type: 'data',
      source: 'socials/*.yml',
      schema: z.object({
        /** Whether the social platform is active. */
        active: z.boolean().default(false),
        /** Whether the social is featured (e.g. shown in the footer). */
        featured: z.boolean().default(false),
        /** Controls display order (ascending). */
        sortOrder: z.number().default(99),
        /** Display name of the social platform (e.g. "GitHub"). */
        name: z.string(),
        /** Iconify icon identifier (e.g. "simple-icons:github"). */
        icon: z.string(),
        /** Full profile URL. */
        url: z.url(),
        /** Handle or username on the platform (e.g. "@toddeTV"). */
        handle: z.string(),
      }),
    }),

    talks: defineCollection({
      type: 'page',
      source: 'talks/**',
      schema: z.object({
        /** Date of the talk in ISO 8601 format (e.g. "2024-11-12"). */
        date: z.string(),
        /** Name of the event or conference (e.g. "NuxtNation 2024"). */
        event: z.string(),
        /** Location of the event (e.g. "Online" or city name). */
        location: z.string(),
        /** URL to the published slides. */
        slidesUrl: z.string().optional(),
        /** URL to the recorded video. */
        videoUrl: z.string().optional(),
        /** URL to the companion source code repository. */
        repoUrl: z.string().optional(),
        /** Audience or organizer testimonials for this talk. */
        testimonials: z.array(testimonialSchema).optional(),
      }),
    }),
  },
})
