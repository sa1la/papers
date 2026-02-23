export interface CategoryConfig {
  name: string
  icon: string
  description: string
}

export const categories: Record<string, CategoryConfig> = {
  algorithm: {
    name: 'algorithms',
    icon: 'calculator',
    description: 'data structures & algorithms',
  },
  contest: {
    name: 'contests',
    icon: 'trophy',
    description: 'competitive programming solutions',
  },
  craft: {
    name: 'craft',
    icon: 'lightbulb',
    description: 'programming tips & techniques',
  },
  frontend: {
    name: 'frontend',
    icon: 'layout',
    description: 'frontend development',
  },
  backend: {
    name: 'backend',
    icon: 'server',
    description: 'backend & server development',
  },
  math: {
    name: 'math',
    icon: 'sigma',
    description: 'mathematics explorations',
  },
  notes: {
    name: 'notes',
    icon: 'book-open',
    description: 'reading notes & excerpts',
  },
  essay: {
    name: 'essays',
    icon: 'pen-tool',
    description: 'personal reflections',
  },
} as const

export type CategoryKey = keyof typeof categories

export function isValidCategory(category: string): category is CategoryKey {
  return category in categories
}

export function getCategoryConfig(key: string): CategoryConfig | undefined {
  return categories[key as CategoryKey]
}
