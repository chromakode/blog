import type { AstroGlobalPartial } from 'astro'
import rss from '@astrojs/rss'
import { SITE_TITLE, SITE_DESCRIPTION } from '../config'
import { getPosts, postURL } from 'src/content/posts'

export async function get(context: AstroGlobalPartial) {
  const posts = await getPosts()
  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site!.toString(),
    items: posts.map((post) => ({ ...post.data, link: postURL(post.slug) })),
  })
}
