import { getImage } from 'astro:assets'
import { getCollection, type CollectionEntry } from 'astro:content'

export async function getPosts({
  includeDrafts,
}: { includeDrafts?: boolean } = {}) {
  return (await getCollection('blog'))
    .filter((p) => includeDrafts || !p.data.draft)
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
}

export async function getFeaturedPosts() {
  return (await getPosts())
    .slice(1)
    .filter((p) => p.data.feature && p.data.image && p.data.description)
}

export async function getPostImage(post: CollectionEntry<'blog'>) {
  const src = post.data.contentImage ?? post.data.image
  if (!src) {
    return null
  }
  return await getImage({ src: src, height: 800, format: 'webp' })
}

export function postURL(slug: string) {
  return `/post/${slug}`
}
