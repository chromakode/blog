import { getCollection } from 'astro:content'

export async function getPosts() {
  return (await getCollection('blog')).sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
  )
}

export function postURL(slug: string) {
  return `/post/${slug}`
}
