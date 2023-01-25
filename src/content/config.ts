import { z, defineCollection } from 'astro:content'

const blogCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    pubDate: z.string().transform((val) => new Date(val)),
    image: z.string().optional(),
  }),
})

export const collections = {
  blog: blogCollection,
}
