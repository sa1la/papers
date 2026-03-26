export type BlogLocale = 'zh-CN' | 'en-US'

export interface CategoryLocaleConfig {
  name: string
  description: string
}

export interface CategoryConfig {
  icon: string
  i18n: Record<BlogLocale, CategoryLocaleConfig>
}

export const categories: Record<string, CategoryConfig> = {
  algorithm: {
    icon: 'calculator',
    i18n: {
      'zh-CN': {
        name: '算法',
        description: '数据结构与算法',
      },
      'en-US': {
        name: 'algorithms',
        description: 'data structures & algorithms',
      },
    },
  },
  contest: {
    icon: 'trophy',
    i18n: {
      'zh-CN': {
        name: '竞赛',
        description: '算法竞赛题解与记录',
      },
      'en-US': {
        name: 'contests',
        description: 'competitive programming solutions',
      },
    },
  },
  craft: {
    icon: 'lightbulb',
    i18n: {
      'zh-CN': {
        name: '技法',
        description: '编程经验、技巧与方法',
      },
      'en-US': {
        name: 'craft',
        description: 'programming tips & techniques',
      },
    },
  },
  frontend: {
    icon: 'layout',
    i18n: {
      'zh-CN': {
        name: '前端',
        description: '前端开发与工程实践',
      },
      'en-US': {
        name: 'frontend',
        description: 'frontend development',
      },
    },
  },
  backend: {
    icon: 'server',
    i18n: {
      'zh-CN': {
        name: '后端',
        description: '后端与服务端开发',
      },
      'en-US': {
        name: 'backend',
        description: 'backend & server development',
      },
    },
  },
  math: {
    icon: 'sigma',
    i18n: {
      'zh-CN': {
        name: '数学',
        description: '数学问题与公式探索',
      },
      'en-US': {
        name: 'math',
        description: 'mathematics explorations',
      },
    },
  },
  notes: {
    icon: 'book-open',
    i18n: {
      'zh-CN': {
        name: '笔记',
        description: '阅读笔记与摘录',
      },
      'en-US': {
        name: 'notes',
        description: 'reading notes & excerpts',
      },
    },
  },
  essay: {
    icon: 'pen-tool',
    i18n: {
      'zh-CN': {
        name: '随笔',
        description: '个人思考与生活记录',
      },
      'en-US': {
        name: 'essays',
        description: 'personal reflections',
      },
    },
  },
  history: {
    icon: 'landmark',
    i18n: {
      'zh-CN': {
        name: '历史',
        description: '历史主题的整理、探索与叙述',
      },
      'en-US': {
        name: 'history',
        description: 'historical explorations & narratives',
      },
    },
  },
} as const

export type CategoryKey = keyof typeof categories

export function isValidCategory(category: string): category is CategoryKey {
  return category in categories
}

export function getCategoryConfig(key: string): CategoryConfig | undefined {
  return isValidCategory(key) ? categories[key] : undefined
}

export function getCategoryLocaleConfig(key: string, locale: BlogLocale): CategoryLocaleConfig | undefined {
  return getCategoryConfig(key)?.i18n[locale]
}
