import process from 'node:process'
import { transformerColorizedBrackets } from '@shikijs/colorized-brackets'
import tailwindcss from '@tailwindcss/vite'
import mdFootnote from 'markdown-it-footnote'
import { defineConfig } from 'vitepress'
import { getExcludedFiles } from './config/buildFilter'
import { htmlDemoPlugin } from './plugins/htmlDemoPlugin'
import { vueDemoPlugin } from './plugins/vueDemoPlugin'

const isDev = process.env.NODE_ENV !== 'production'
const navItems = {
  zh: [
    { text: '首页', link: '/' },
    { text: '分类', link: '/category' },
    { text: '标签', link: '/tags' },
    { text: '收藏', link: '/favorites' },
  ],
  en: [
    { text: 'home', link: '/en/' },
    { text: 'categories', link: '/en/category' },
    { text: 'tags', link: '/en/tags' },
    { text: 'favorites', link: '/en/favorites' },
  ],
}

// https://vitepress.dev/reference/default-theme-config
// https://vitepress.dev/reference/site-config
export default defineConfig({
  vite: {
    plugins: [
      tailwindcss(),
      htmlDemoPlugin(),
      vueDemoPlugin(),
    ],
  },
  head: [
    ['link', { rel: 'icon', href: `/favicon.jpg` }],
    ['script', { defer: '', src: 'https://umami.sa1l.world/script.js', 'data-website-id': '226fc954-5a85-45bc-9f41-975997af76f4' }],
  ],
  base: '/',
  lang: 'zh-cn',
  title: 'Sa1L',
  description: '冲吧，向那太阳，向那片海',
  locales: {
    root: {
      label: '中文',
      lang: 'zh-CN',
      themeConfig: {
        nav: navItems.zh,
        outline: { label: '页内导航' },
        footer: {
          message: '冲吧，向那太阳，向那片海',
        },
      },
    },
    en: {
      label: 'English',
      lang: 'en-US',
      link: '/en/',
      description: 'Toward the sun, toward the sea.',
      themeConfig: {
        nav: navItems.en,
        outline: { label: 'On This Page' },
        footer: {
          message: 'Toward the sun, toward the sea.',
        },
      },
    },
  },
  lastUpdated: true,
  cacheDir: './node_modules/vitepress_cache',
  appearance: 'dark',
  cleanUrls: true,
  ignoreDeadLinks: true,
  themeConfig: {
    nav: navItems.zh,
    logo: '/avatar.jpg',
    outline: { label: '页内导航' },
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
