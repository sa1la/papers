<script setup lang='ts'>
import type { CategoryKey } from '../../../config/categories'
import {
  BookOpen,
  Calculator,
  LayoutGrid,
  LayoutTemplate,
  Lightbulb,
  PenTool,
  Server,
  Sigma,
  Trophy,
} from 'lucide-vue-next'
import { computed } from 'vue'
import { categories, getCategoryConfig } from '../../../config/categories'
import { data as posts } from '../posts.data'
import { useBlogStore } from '../store'
import { initCategory } from '../utils'
import Title from './Title.vue'

// Icon component for title
const CategoryIcon = LayoutGrid

// Icon mapping for categories
const iconMap: Record<string, any> = {
  'calculator': Calculator,
  'trophy': Trophy,
  'lightbulb': Lightbulb,
  'layout': LayoutTemplate,
  'server': Server,
  'sigma': Sigma,
  'book-open': BookOpen,
  'pen-tool': PenTool,
}

function getIconComponent(iconName: string) {
  return iconMap[iconName] || LayoutGrid
}

const blogStore = useBlogStore()
const category = initCategory(posts)

// 只显示有文章的预定义分类，按文章数量排序
const catList = computed(() => {
  const postCounts: Record<string, number> = {}

  // 统计每个预定义分类的文章数
  for (const post of posts) {
    const cat = post.category
    if (cat in categories) {
      postCounts[cat] = (postCounts[cat] || 0) + 1
    }
  }

  // 只返回有文章的预定义分类
  return Object.entries(categories)
    .filter(([key]) => postCounts[key] > 0)
    .map(([key, config]) => ({
      key: key as CategoryKey,
      name: config.name,
      icon: config.icon,
      description: config.description,
      count: postCounts[key] || 0,
    }))
    .sort((a, b) => b.count - a.count)
})

function catSwitcher(key: CategoryKey) {
  blogStore.updateSelectedCat(key)
}

// 使用预定义分类名称或回退到原始值
function getCategoryDisplayName(key: string): string {
  return getCategoryConfig(key)?.name || key
}
</script>

<template>
  <div class="paper-container">
    <Title text="categories" :icon="CategoryIcon" />

    <!-- Category Grid -->
    <div class="category-grid">
      <button
        v-for="cat of catList"
        :key="cat.key"
        type="button"
        class="category-card"
        :class="{ active: blogStore.selectedCat === cat.key }"
        @click="catSwitcher(cat.key)"
      >
        <component :is="getIconComponent(cat.icon)" class="card-icon" />
        <span class="card-name">{{ cat.name }}</span>
        <span class="card-count">{{ cat.count }}</span>
      </button>
    </div>

    <hr class="section-divider">

    <!-- Selected Category Title -->
    <div v-show="blogStore.selectedCat" class="selected-header">
      <div class="selected-badge">
        <component :is="getIconComponent(getCategoryConfig(blogStore.selectedCat)?.icon || 'layout')" class="badge-icon" />
        <span>{{ getCategoryDisplayName(blogStore.selectedCat) }}</span>
      </div>
      <p class="selected-description">{{ getCategoryConfig(blogStore.selectedCat)?.description }}</p>
    </div>

    <!-- Posts List - Same style as Home.vue -->
    <div v-show="blogStore.selectedCat" class="posts-archive">
      <ul v-if="category[blogStore.selectedCat]?.length" class="posts-list">
        <li
          v-for="post in category[blogStore.selectedCat]"
          :key="post.url"
          class="post-item"
        >
          <a :href="post.url" class="post-link">
            <span class="post-title">{{ post.title }}</span>
            <span v-if="post.draft" class="post-draft">draft</span>
            <span class="post-date">{{ post.date.string }}</span>
          </a>
        </li>
      </ul>
      <p v-else class="empty-state">
        该分类下暂无文章
      </p>
    </div>
  </div>
</template>

<style scoped>
/* Fade in animation */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Category Grid - Elegant Card Layout */
.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 1rem;
  padding: 2rem 0;
  max-width: 900px;
  margin: 0 auto;
  animation: fadeInUp 0.4s ease forwards;
}

.category-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1.75rem 1rem;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.category-card:hover {
  border-color: var(--vp-c-text-3);
  transform: translateY(-2px);
}

.category-card.active {
  border-color: var(--vp-c-text-1);
  background: var(--vp-c-bg-soft);
}

.card-icon {
  width: 1.75rem;
  height: 1.75rem;
  color: var(--vp-c-text-3);
  stroke-width: 1.5;
  transition: color 0.25s ease;
}

.category-card:hover .card-icon,
.category-card.active .card-icon {
  color: var(--vp-c-text-1);
}

.card-name {
  font-size: 1rem;
  font-weight: 400;
  color: var(--vp-c-text-2);
  letter-spacing: 0.02em;
  transition: color 0.2s ease;
}

.category-card:hover .card-name,
.category-card.active .card-name {
  color: var(--vp-c-text-1);
}

.category-card.active .card-name {
  font-weight: 500;
}

.card-count {
  font-size: 0.8125rem;
  font-family: var(--vp-font-family-mono);
  color: var(--vp-c-text-3);
  transition: color 0.2s ease;
}

.category-card:hover .card-count,
.category-card.active .card-count {
  color: var(--vp-c-text-2);
}

.section-divider {
  margin: 1.5rem auto;
  max-width: 200px;
  border: 0;
  height: 1px;
  background: linear-gradient(to right, transparent, var(--vp-c-divider), transparent);
}

.selected-header {
  margin-bottom: 1.5rem;
  max-width: 1100px;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
}

.selected-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0;
  font-size: 0.875rem;
  font-weight: 300;
  color: var(--vp-c-text-3);
  background: transparent;
  font-family: var(--vp-font-family-mono);
  text-transform: lowercase;
  letter-spacing: 0.05em;
}

.selected-badge::before {
  content: '';
  width: 1rem;
  height: 1px;
  background: var(--vp-c-text-3);
  opacity: 0.4;
}

.selected-badge::after {
  content: '';
  width: 1rem;
  height: 1px;
  background: var(--vp-c-text-3);
  opacity: 0.4;
}

.badge-icon {
  width: 0.875rem;
  height: 0.875rem;
  color: var(--vp-c-text-3);
  stroke-width: 1.5;
}

.selected-description {
  margin: 0.75rem 0 0;
  font-size: 0.8125rem;
  font-weight: 300;
  color: var(--vp-c-text-3);
  font-family: var(--vp-font-family-mono);
  text-transform: lowercase;
  letter-spacing: 0.05em;
  opacity: 0.8;
}

/* Posts list styles - same as Home.vue */
.posts-archive {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 1rem;
  animation: fadeInUp 0.4s ease 0.1s forwards;
  opacity: 0;
}

.posts-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
}

.post-item {
  position: relative;
  margin: 0;
  padding: 0;
  transition: opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1),
              filter 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Pseudo-element for bottom border */
.post-item::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 1px;
  background-color: var(--vp-c-divider);
}

.post-item:last-child::after {
  display: none;
}

/* Hover spotlight effect - dims all items except hovered */
.posts-list:has(.post-item:hover) .post-item:not(:hover) {
  opacity: 0.5;
}

.post-item:hover {
  /* Background highlight removed - only text highlights */
}

.post-link {
  display: flex;
  align-items: center;
  padding: 0.75rem 0.5rem;
  text-decoration: none;
  color: inherit;
  gap: 1rem;
}

.post-title {
  flex: 1;
  font-size: 1.0625rem;
  font-weight: 400;
  color: var(--vp-c-text-2);
  line-height: 1.5;
  transition: color 0.25s cubic-bezier(0.4, 0, 0.2, 1),
              font-weight 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  position: relative;
}

.post-item:hover .post-title {
  color: var(--vp-c-text-1);
  font-weight: 500;
}

.post-date {
  flex-shrink: 0;
  font-size: 0.875rem;
  font-family: var(--vp-font-family-mono);
  color: var(--vp-c-text-3);
  min-width: 6rem;
  text-align: right;
}

.post-draft {
  flex-shrink: 0;
  font-size: 0.75rem;
  font-family: var(--vp-font-family-mono);
  font-weight: 300;
  color: var(--vp-c-text-3);
  text-transform: lowercase;
  letter-spacing: 0.05em;
  padding: 0.125rem 0.375rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 0.25rem;
  opacity: 0.7;
  transition: opacity 0.25s ease, border-color 0.25s ease;
}

.post-item:hover .post-draft {
  opacity: 1;
  border-color: var(--vp-c-text-3);
}

@media (max-width: 640px) {
  .category-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
    padding: 1.5rem 0;
  }

  .category-card {
    padding: 1.25rem 0.75rem;
    gap: 0.5rem;
  }

  .card-icon {
    width: 1.5rem;
    height: 1.5rem;
  }

  .card-name {
    font-size: 0.9375rem;
  }

  .card-count {
    font-size: 0.75rem;
  }

  .posts-archive {
    padding: 0 0.75rem;
  }

  .post-link {
    padding: 0.625rem 0.375rem;
    gap: 0.75rem;
  }

  .post-date {
    font-size: 0.75rem;
    min-width: 5rem;
  }

  .post-draft {
    font-size: 0.6875rem;
    padding: 0.0625rem 0.25rem;
  }

  .post-title {
    font-size: 0.9375rem;
  }

  /* Disable spotlight effect on mobile for better performance */
  .posts-list:has(.post-item:hover) .post-item:not(:hover) {
    opacity: 1;
  }

  .empty-state {
    text-align: center;
    padding: 2rem 1rem;
    color: var(--vp-c-text-2);
    font-size: 0.875rem;
  }
}

/* Reduced motion support for accessibility */
@media (prefers-reduced-motion: reduce) {
  .category-grid,
  .category-card,
  .posts-archive,
  .post-item,
  .post-title {
    animation: none;
    opacity: 1;
    transform: none;
  }

  .posts-list:has(.post-item:hover) .post-item:not(:hover) {
    opacity: 1;
  }
}

/* Focus indicators for keyboard navigation */
.post-link:focus-visible {
  outline: 2px solid var(--vp-c-brand);
  outline-offset: 2px;
  border-radius: 4px;
}
</style>
