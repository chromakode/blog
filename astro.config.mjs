import { defineConfig } from 'astro/config'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import compress from 'astro-compress'
import preact from '@astrojs/preact'

// https://astro.build/config
export default defineConfig({
  experimental: {
    assets: true,
  },
  image: {
    service: 'astro/assets/services/sharp',
  },
  site: 'https://chromakode.com',
  integrations: [mdx(), sitemap(), compress(), preact()],
  markdown: {
    shikiConfig: {
      theme: 'github-light',
    },
  },
})
