// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import tailwind from '@astrojs/tailwind';

import react from '@astrojs/react';
import rehypePrettyCode from 'rehype-pretty-code';

const prettyCodeOptions = {
  theme: 'github-dark',
  keepBackground: true,
  /** @param {any} node */
  onVisitLine(node) {
    if (node.children.length === 0) {
      node.children = [{ type: 'text', value: ' ' }];
    }
  },
};

// https://astro.build/config
export default defineConfig({
  markdown: {
    syntaxHighlight: false,
    rehypePlugins: [[rehypePrettyCode, prettyCodeOptions]],
  },
  integrations: [
    mdx({
      syntaxHighlight: false,
      rehypePlugins: [[rehypePrettyCode, prettyCodeOptions]],
    }),
    tailwind(),
    react()
  ],
});