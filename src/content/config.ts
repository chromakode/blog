import { z, defineCollection } from 'astro:content'

const blogCollection = defineCollection({
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string().optional(),
      pubDate: z.string().transform((val) => new Date(val)),
      image: image().optional(),
      imageAlt: z.string().optional(),
      contentTitle: z.string().optional().nullable(),
      contentImage: image().optional().nullable(),
      feature: z.boolean().optional(),
    }),
})

export const collections = {
  blog: blogCollection,
}
