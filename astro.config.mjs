import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

import compress from "astro-compress";

// https://astro.build/config
export default defineConfig({
  site: 'https://chromakode.com',
  integrations: [mdx(), sitemap(), compress()],
  markdown: {
    shikiConfig: {
      theme: 'github-light'
    }
  }
});