import type { Post } from '../posts.data'
import dayjs from 'dayjs'

interface Data { [key: string]: Post[] }

export function initArchives(posts: Post[]): Data {
  const data: Data = {}
  for (let i = 0; i < posts.length; i++) {
    const post = posts[i]
    const year = post.date.string.slice(0, 4)
    if (!data[year]) {
      data[year] = []
    }
    data[year].push(post)
  }

  return data
}

export function initCategory(posts: Post[]): Data {
  const data: Data = {}
  for (let i = 0; i < posts.length; i++) {
    const post = posts[i]
    const category = post.category
    if (!data[category]) {
      data[category] = []
    }
    data[category].push(post)
  }

  return data
}

export function initTags(posts: Post[]): Data {
  const data: Data = {}
  for (let i = 0; i < posts.length; i++) {
    const post = posts[i]
    const tags = post.tags
    if (Array.isArray(tags)) {
      tags.forEach((tag) => {
        if (!data[tag]) {
          data[tag] = []
        }
        data[tag].push(post)
      })
    }
  }

  return data
}

export function beautifyDate(date: string | undefined, pattern: string) {
  return dayjs(date).format(pattern)
}

// Category color mapping for minimal design
const categoryColorMap: Record<string, string> = {
  Thoughts: 'blue',
  thoughts: 'blue',
  Algorithm: 'violet',
  algorithm: 'violet',
  Note: 'amber',
  note: 'amber',
  Article: 'emerald',
  article: 'emerald',
  Frontend: 'pink',
  frontend: 'pink',
  Golang: 'cyan',
  golang: 'cyan',
  Math: 'orange',
  math: 'orange',
  Reading: 'indigo',
  reading: 'indigo',
}

export function getCategoryColor(category: string): string {
  return categoryColorMap[category] || 'gray'
}

export function getCategoryColorClass(category: string): string {
  const color = getCategoryColor(category)
  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    violet: 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20',
    amber: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    pink: 'bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20',
    cyan: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20',
    orange: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20',
    indigo: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
    gray: 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20',
  }
  return colorClasses[color] || colorClasses.gray
}

export function truncateText(text: string | undefined, length: number): string {
  if (!text)
    return ''
  if (text.length <= length)
    return text
  return `${text.slice(0, length).trim()}...`
}

/**
 * 统计混合中英文内容的阅读单元。
 *
 * - 中文：按单个汉字计数
 * - 英文：按由 [A-Za-z0-9_] 组成的单词计数
 * - 代码块：单独统计，便于在阅读时间阶段使用不同权重
 */
function countReadingUnits(content: string): {
  textChinese: number
  textWords: number
  codeChinese: number
  codeWords: number
} {
  // Match fenced code blocks
  const codeBlockRegex = /```[\s\S]*?```/g
  const codeBlocks: string[] = []
  const textContent = content.replace(codeBlockRegex, (match) => {
    codeBlocks.push(match)
    return ' '
  })

  // Count Chinese characters (扩展到常用 CJK 统一表意符号区间)
  const chineseRegex = /[\u4E00-\u9FFF]/g
  const wordRegex = /\w+/g

  const textChinese = (textContent.match(chineseRegex) || []).length
  const codeChinese = codeBlocks.reduce(
    (sum, code) => sum + (code.match(chineseRegex) || []).length,
    0,
  )

  // Count English words (alphanumeric sequences, 不包含标点)
  const textWords = (textContent.match(wordRegex) || []).length
  const codeWords = codeBlocks.reduce(
    (sum, code) => sum + (code.match(wordRegex) || []).length,
    0,
  )

  return {
    textChinese,
    textWords,
    codeChinese,
    codeWords,
  }
}

/**
 * Calculate estimated reading time for technical blog posts.
 * Optimized for mixed Chinese/English content with code blocks.
 */
export function getReadingTime(content: string | undefined): number {
  if (!content)
    return 1

  const {
    textChinese,
    textWords,
    codeChinese,
    codeWords,
  } = countReadingUnits(content)

  // 阅读速度（单位/分钟）：
  // - 中文正文：≈ 400 字/分钟（技术类偏保守）
  // - 英文正文：≈ 230 词/分钟（常见技术阅读速度）
  // - 代码：仍按 200 单位/分钟处理，维持原本「代码略慢于正文」的预期
  const CHINESE_CHARS_PER_MIN = 400
  const ENGLISH_WORDS_PER_MIN = 230
  const CODE_UNITS_PER_MIN = 200

  const textMinutes = textChinese / CHINESE_CHARS_PER_MIN + textWords / ENGLISH_WORDS_PER_MIN

  const codeUnits = codeChinese + codeWords
  const codeMinutes = codeUnits / CODE_UNITS_PER_MIN

  return Math.max(1, Math.ceil(textMinutes + codeMinutes))
}

export interface SeriesInfo {
  name: string
  posts: Post[]
  category: string
}

export type SeriesMap = Record<string, SeriesInfo>

export function initSeries(posts: Post[]): SeriesMap {
  const data: SeriesMap = {}

  for (const post of posts) {
    if (!post.series)
      continue

    const seriesName = post.series
    if (!data[seriesName]) {
      data[seriesName] = {
        name: seriesName,
        posts: [],
        category: post.category,
      }
    }
    data[seriesName].posts.push(post)
  }

  // 对每个系列的文章按日期排序
  for (const series of Object.values(data)) {
    series.posts.sort((a, b) => b.date.time - a.date.time)
  }

  return data
}

export function getSeriesByCategory(seriesMap: SeriesMap, category: string): SeriesInfo[] {
  return Object.values(seriesMap)
    .filter(series => series.category === category)
    .sort((a, b) => b.posts.length - a.posts.length)
}
