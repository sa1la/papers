import type { BlogLocale } from '../../config/categories'
import type { Post } from './posts.data'
import { useData } from 'vitepress'
import { computed } from 'vue'

export interface ThemeText {
  heroSubtitle: string
  posts: string
  categories: string
  tags: string
  favorites: string
  draft: string
  minRead: string
  updated: string
  previous: string
  next: string
  emptyPosts: string
  language: string
  chinese: string
  english: string
  translationMissing: string
  noPostsInCategory: string
  noPostsWithTag: string
  noFavorites: string
}

const DEFAULT_BLOG_LOCALE: BlogLocale = 'zh-CN'
const ENGLISH_BLOG_LOCALE: BlogLocale = 'en-US'
const ENGLISH_BLOG_PREFIX = '/en'

const themeTextMap: Record<BlogLocale, ThemeText> = {
  [DEFAULT_BLOG_LOCALE]: {
    heroSubtitle: '冲吧，向那太阳，向那片海',
    posts: '文章',
    categories: '分类',
    tags: '标签',
    favorites: '收藏',
    draft: '草稿',
    minRead: '分钟阅读',
    updated: '更新于',
    previous: '上一篇',
    next: '下一篇',
    emptyPosts: '还没有这个语言的文章。',
    language: '语言',
    chinese: '中文',
    english: 'English',
    translationMissing: '暂无译文',
    noPostsInCategory: '该分类下暂无文章',
    noPostsWithTag: '该标签下暂无文章',
    noFavorites: '暂无收藏',
  },
  [ENGLISH_BLOG_LOCALE]: {
    heroSubtitle: 'Toward the sun, toward the sea.',
    posts: 'posts',
    categories: 'categories',
    tags: 'tags',
    favorites: 'favorites',
    draft: 'draft',
    minRead: 'min read',
    updated: 'updated',
    previous: 'previous',
    next: 'next',
    emptyPosts: 'No posts in this language yet.',
    language: 'language',
    chinese: '中文',
    english: 'English',
    translationMissing: 'Translation unavailable',
    noPostsInCategory: 'No posts in this category yet.',
    noPostsWithTag: 'No posts with this tag yet.',
    noFavorites: 'No favorites yet.',
  },
}

export function normalizeBlogLocale(lang?: string): BlogLocale {
  return lang?.toLowerCase().startsWith('en') ? ENGLISH_BLOG_LOCALE : DEFAULT_BLOG_LOCALE
}

export function useBlogLocale() {
  const { lang } = useData()
  return computed(() => normalizeBlogLocale(lang.value))
}

export function useThemeText() {
  const locale = useBlogLocale()
  return computed(() => themeTextMap[locale.value])
}

export function getLocalePath(path: string, locale: BlogLocale): string {
  if (locale !== ENGLISH_BLOG_LOCALE)
    return path

  return path === '/' ? `${ENGLISH_BLOG_PREFIX}/` : `${ENGLISH_BLOG_PREFIX}${path}`
}

export function filterPostsByLocale(posts: Post[], locale: BlogLocale): Post[] {
  return posts.filter(post => post.locale === locale)
}
