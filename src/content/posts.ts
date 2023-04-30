import { getCollection } from 'astro:content'

export async function getPosts() {
  return (await getCollection('blog')).sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
  )
}

export async function getFeaturedPosts() {
  return (await getPosts())
    .slice(1)
    .filter((p) => p.data.feature && p.data.image && p.data.description)
}

export function postURL(slug: string) {
  return `/post/${slug}`
}
