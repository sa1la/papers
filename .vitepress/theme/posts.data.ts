import type { ContentData } from 'vitepress'
import type { CategoryKey } from '../../config/categories'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { createContentLoader } from 'vitepress'
import { isValidCategory } from '../../config/categories'
import { beautifyDate, getReadingTime } from './utils'

export interface Post {
  title: string
  url: string
  excerpt: string | undefined
  category: CategoryKey
  series?: string
  tags: string[]
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

function extractMarkdownSource(item: ContentData): string {
  const anyItem = item as any

  // 1. 优先使用 ContentData 自带的 src/raw 字段
  let rawSource: string | undefined
  if (typeof anyItem.src === 'string')
    rawSource = anyItem.src
  else if (typeof anyItem.raw === 'string')
    rawSource = anyItem.raw

  // 2. 退回到通过文件路径直接读取 markdown 内容
  if (!rawSource) {
    const filePath: string | undefined = anyItem.filePath || anyItem.filepath
    if (filePath) {
      const absPath = path.isAbsolute(filePath)
        ? filePath
        : path.resolve(process.cwd(), filePath)
      if (fs.existsSync(absPath))
        rawSource = fs.readFileSync(absPath, 'utf-8')
    }
  }

  if (!rawSource)
    return ''

  // 去掉 frontmatter，保留正文内容
  return rawSource.replace(/^---[\s\S]*?---/, '').trim()
}

export default createContentLoader('posts/**/*.md', {
  excerpt: true,
  includeSrc: true, // 必须开启才能拿到原始 Markdown，用于预计算阅读时长
  transform(raw: ContentData[]): Post[] {
    const now = Date.now()

    return raw
      .filter(({ frontmatter }) => {
        if (!frontmatter.title)
          return false
        if (!isDev && frontmatter.draft)
          return false
        if (!isDev && frontmatter.date) {
          const pubTime = +frontmatter.date
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
        }

        // 使用原始 Markdown（去掉 frontmatter）预计算阅读时间
        const source = extractMarkdownSource(item)
        const readingTime = getReadingTime(source)

        return {
          title: frontmatter.title,
          url,
          excerpt,
          category: isValidCategory(category) ? category : 'thoughts',
          series: frontmatter.series,
          tags: frontmatter.tags || [],
          date: formatDate(frontmatter.date),
          draft: frontmatter.draft,
          readingTime,
        }
      })
      .sort((a, b) => b.date.time - a.date.time)
  },
})

function formatDate(raw: string | undefined): Post['date'] {
  const cur = raw
  return {
    time: cur ? +cur : Date.now(),
    string: beautifyDate(cur, 'YYYY-MM-DD'),
    dayMonth: beautifyDate(cur, 'DD/MM'),
  }
}
