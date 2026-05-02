import type { Post } from '../posts.data'
import dayjs from 'dayjs'

interface Data { [key: string]: Post[] }

// Static regex patterns to avoid re-compilation
const REGEX_CODE_BLOCK = /```[\s\S]*?```/g
const REGEX_CHINESE = /[\u4E00-\u9FFF]/g
const REGEX_WORD = /\w+/g

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
  const codeBlocks: string[] = []
  const textContent = content.replace(REGEX_CODE_BLOCK, (match) => {
    codeBlocks.push(match)
    return ' '
  })

  const textChinese = (textContent.match(REGEX_CHINESE) || []).length
  const codeChinese = codeBlocks.reduce(
    (sum, code) => sum + (code.match(REGEX_CHINESE) || []).length,
    0,
  )

  // Count English words (alphanumeric sequences, 不包含标点)
  const textWords = (textContent.match(REGEX_WORD) || []).length
  const codeWords = codeBlocks.reduce(
    (sum, code) => sum + (code.match(REGEX_WORD) || []).length,
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
