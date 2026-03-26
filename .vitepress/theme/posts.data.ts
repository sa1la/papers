import type { ContentData } from 'vitepress'
import type { BlogLocale, CategoryKey } from '../../config/categories'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import dayjs from 'dayjs'
import { createContentLoader } from 'vitepress'
import { isValidCategory } from '../../config/categories'
import { beautifyDate, getReadingTime } from './utils'
import { collectDemoSources } from './utils/htmlDemo'

export interface Post {
  title: string
  url: string
  excerpt: string | undefined
  locale: BlogLocale
  category: CategoryKey
  series?: string
  tags: string[]
  translationKey?: string
  alternateUrls: Partial<Record<BlogLocale, string>>
  date: {
    time: number
    string: string
    dayMonth: string
  }
  draft?: boolean
  /**
   * 预计算的阅读耗时（分钟）
   */
  readingTime: number
}

declare const data: Post[]
export { data }

const isDev = process.env.NODE_ENV !== 'production'

// Static regex patterns to avoid re-compilation
const REGEX_FRONMATTER = /^---[\s\S]*?---/
const REGEX_LEADING_SLASH = /^\//
const REGEX_HTML_EXT = /\.html$/
const REGEX_EN_POST_PATH = /^\/en\/posts\//
const REGEX_LOCALE_POST_PREFIX = /^\/(?:en\/)?posts\//

interface ExtractOptions {
  item: ContentData
  filePath?: string
}

interface RawPost {
  title: string
  url: string
  excerpt: string | undefined
  locale: BlogLocale
  category: CategoryKey
  series?: string
  tags: string[]
  translationKey?: string
  date: Post['date']
  draft?: boolean
  readingTime: number
  alternateGroupKey: string
}

function extractMarkdownSource(options: ExtractOptions): { source: string, demoSource: string } {
  const { item, filePath } = options
  const anyItem = item as any

  // 1. 优先使用 ContentData 自带的 src/raw 字段
  let rawSource: string | undefined
  if (typeof anyItem.src === 'string')
    rawSource = anyItem.src
  else if (typeof anyItem.raw === 'string')
    rawSource = anyItem.raw

  // 2. 退回到通过文件路径直接读取 markdown 内容
  if (!rawSource) {
    const itemFilePath: string | undefined = anyItem.filePath || anyItem.filepath
    if (itemFilePath) {
      const absPath = path.isAbsolute(itemFilePath)
        ? itemFilePath
        : path.resolve(process.cwd(), itemFilePath)
      if (fs.existsSync(absPath))
        rawSource = fs.readFileSync(absPath, 'utf-8')
    }
  }

  // 新增：提取 demo 源代码
  let demoSource = ''
  if (filePath && rawSource) {
    demoSource = collectDemoSources(filePath, rawSource)
  }

  const source = rawSource
    ? rawSource.replace(REGEX_FRONMATTER, '').trim()
    : ''

  return { source, demoSource }
}

export default createContentLoader('{posts,en/posts}/**/*.md', {
  excerpt: true,
  includeSrc: true, // 必须开启才能拿到原始 Markdown，用于预计算阅读时长
  transform(raw: ContentData[]): Post[] {
    const now = Date.now()

    const rawPosts = raw
      .filter(({ frontmatter }) => {
        if (!frontmatter.title)
          return false
        if (!isDev && frontmatter.draft)
          return false
        if (!isDev && frontmatter.date) {
          const pubTime = dayjs(frontmatter.date).valueOf()
          if (pubTime > now)
            return false
        }
        return true
      })
      .map((item) => {
        const { url, frontmatter, excerpt } = item
        const category = frontmatter.category
        if (!isValidCategory(category)) {
          console.warn(`[posts.data.ts] Invalid category "${category}" in ${url}`)
          return null
        }

        // 获取文件路径 - VitePress ContentData has 'url' which maps to the file path
        // URL format: /posts/algorithm/union-find (cleanUrls is enabled)
        // We need to convert URL back to file path
        let filePath: string | undefined
        if (url) {
          const cleanUrl = url.replace(REGEX_LEADING_SLASH, '').replace(REGEX_HTML_EXT, '')
          // URL already starts with 'posts/', so just append .md
          filePath = path.join(process.cwd(), `${cleanUrl}.md`)
        }

        // 使用原始 Markdown（去掉 frontmatter）预计算阅读时间
        const { source, demoSource } = extractMarkdownSource({ item, filePath })

        // 合并正文和 demo 代码计算阅读时间
        const combinedSource = `${source}\n\n${demoSource}`
        const readingTime = getReadingTime(combinedSource)
        const locale = getPostLocale(url)

        return {
          title: frontmatter.title,
          url,
          excerpt,
          locale,
          category,
          series: frontmatter.series,
          tags: frontmatter.tags || [],
          translationKey: typeof frontmatter.translationKey === 'string' ? frontmatter.translationKey : undefined,
          date: formatDate(frontmatter.date),
          draft: frontmatter.draft,
          readingTime,
          alternateGroupKey: getAlternateGroupKey({
            url,
            translationKey: typeof frontmatter.translationKey === 'string' ? frontmatter.translationKey : undefined,
          }),
        } satisfies RawPost
      })
      .filter((post): post is RawPost => post !== null)
      .sort((a, b) => b.date.time - a.date.time)

    const alternateUrlsMap = buildAlternateUrls(rawPosts)

    return rawPosts.map(post => ({
      ...post,
      alternateUrls: alternateUrlsMap.get(post.alternateGroupKey) || {},
    }))
  },
})

function formatDate(raw: string | undefined): Post['date'] {
  const cur = raw
  return {
    time: cur ? dayjs(cur).valueOf() : Date.now(),
    string: beautifyDate(cur, 'YYYY-MM-DD'),
    dayMonth: beautifyDate(cur, 'DD/MM'),
  }
}

function getPostLocale(url: string): BlogLocale {
  return REGEX_EN_POST_PATH.test(url) ? 'en-US' : 'zh-CN'
}

function buildAlternateUrls(posts: RawPost[]): Map<string, Partial<Record<BlogLocale, string>>> {
  const alternateUrlsMap = new Map<string, Partial<Record<BlogLocale, string>>>()

  for (const post of posts) {
    const current = alternateUrlsMap.get(post.alternateGroupKey) || {}
    current[post.locale] = post.url
    alternateUrlsMap.set(post.alternateGroupKey, current)
  }

  return alternateUrlsMap
}

function getAlternateGroupKey(options: { url: string, translationKey?: string }): string {
  if (options.translationKey)
    return `translationKey:${options.translationKey}`

  // Fallback: use the locale-agnostic content path, e.g. "math/binomial-coefficient".
  return `path:${options.url.replace(REGEX_LOCALE_POST_PREFIX, '').replace(REGEX_HTML_EXT, '')}`
}
