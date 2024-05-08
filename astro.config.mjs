import { defineConfig } from 'astro/config'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import preact from '@astrojs/preact'
import prefetch from '@astrojs/prefetch'

// https://astro.build/config
export default defineConfig({
  site: 'https://chromakode.com',
  integrations: [mdx(), sitemap(), preact({ compat: true }), prefetch()],
  markdown: {
    shikiConfig: {
      theme: 'github-light',
    },
  },
})
