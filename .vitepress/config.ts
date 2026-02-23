import process from 'node:process'
import { transformerColorizedBrackets } from '@shikijs/colorized-brackets'
import tailwindcss from '@tailwindcss/vite'
import mdFootnote from 'markdown-it-footnote'
import { defineConfig } from 'vitepress'
import { getExcludedFiles } from './config/buildFilter'

const isDev = process.env.NODE_ENV !== 'production'

// https://vitepress.dev/reference/default-theme-config
// https://vitepress.dev/reference/site-config
export default defineConfig({
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  head: [['link', { rel: 'icon', href: `/favicon.jpg` }]],
  base: '/',
  lang: 'zh-cn',
  title: 'Sa1L',
  description: '冲吧，向那太阳，向那片海',
  lastUpdated: true,
  cacheDir: './node_modules/vitepress_cache',
  appearance: 'dark',
  cleanUrls: true,
  themeConfig: {
    nav: [
      { text: 'home', link: '/' },
      { text: 'categories', link: '/category' },
      { text: 'tags', link: '/tags' },
    ],
    logo: '/avatar.jpg',
    outline: { label: 'Navigate' },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/sa1la' },
    ],
    search: {
      provider: 'local',
      options: {
        detailedView: true,
        _render: (src, env, md) => {
          const html = md.render(src, env)
          if (env.frontmatter?.search === false)
            return ''
          return env.frontmatter?.title
            ? md.render(`# ${env.frontmatter?.title}`) + html
            : html
        },
      },
    },
    aside: true,
    footer: {
      message: `冲吧，向那太阳，向那片海`,
    },
  },
  srcExclude: isDev
    ? ['readme.md', 'CLAUDE.md', 'docs/**/*']
    : ['readme.md', 'CLAUDE.md', 'docs/**/*', ...getExcludedFiles()],
  // https://vitepress.dev/guide/markdown#advanced-configuration
  markdown: {
    math: true, // math equations
    lineNumbers: true, // line numbers for code block
    config: (md) => {
      md.use(mdFootnote)
    },
    image: {
      // 默认禁用；设置为 true 可为所有图片启用懒加载。
      lazyLoading: true,
    },
    theme: {
      light: 'github-light-high-contrast',
      dark: 'one-dark-pro',
    },
    codeTransformers: [
      transformerColorizedBrackets(),
    ],
  },
  sitemap: {
    hostname: 'https://sa1l.world',
  },
})
