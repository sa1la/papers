<script setup lang="ts">
import { Bookmark as BookmarkIcon } from 'lucide-vue-next'
import { computed } from 'vue'
import { bookmarks } from '../favorites'
import Title from './Title.vue'

// 为每个 bookmark 添加唯一 id
interface BookmarkWithId {
  id: string
  title: string
  url: string
  description: string
  date: string
}

const bookmarksWithId = computed<BookmarkWithId[]>(() =>
  bookmarks.map((b, index) => ({
    ...b,
    id: `${b.date}-${index}`,
  })),
)

// 按年月分组
const groupedBookmarks = computed(() => {
  const groups: Record<string, BookmarkWithId[]> = {}

  for (const bookmark of bookmarksWithId.value) {
    const date = new Date(bookmark.date)
    const key = `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}`

    if (!groups[key]) {
      groups[key] = []
    }
    groups[key].push(bookmark)
  }

  // 按时间倒序排序月份
  return Object.entries(groups)
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([month, items]) => ({
      month,
      items: items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    }))
})

// 检查是否为外部链接
function isExternal(url: string): boolean {
  return url.startsWith('http://') || url.startsWith('https://')
}

// 获取链接目标属性
function getLinkProps(url: string) {
  if (isExternal(url)) {
    return {
      target: '_blank',
      rel: 'noopener noreferrer',
    }
  }
  return {}
}
</script>

<template>
  <div class="paper-container">
    <Title text="favorites" :icon="BookmarkIcon" />

    <div class="timeline">
      <div v-for="group in groupedBookmarks" :key="group.month" class="month-group">
        <!-- Month Header -->
        <div class="month-header">
          <span class="month-label">{{ group.month }}</span>
        </div>

        <!-- Bookmarks List -->
        <ul class="bookmarks-list">
          <li
            v-for="bookmark in group.items"
            :key="bookmark.id"
            class="bookmark-item"
          >
            <a
              :href="bookmark.url"
              class="bookmark-link"
              v-bind="getLinkProps(bookmark.url)"
            >
              <div class="bookmark-content">
                <div class="bookmark-title-row">
                  <span class="bookmark-title">{{ bookmark.title }}</span>
                  <svg
                    v-if="isExternal(bookmark.url)"
                    class="external-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.5"
                  >
                    <path d="M7 17L17 7M17 7H7M17 7V17" />
                  </svg>
                </div>
                <p v-if="bookmark.description" class="bookmark-description">
                  {{ bookmark.description }}
                </p>
              </div>
            </a>
          </li>
        </ul>
      </div>
    </div>

    <!-- Empty State -->
    <p v-if="groupedBookmarks.length === 0" class="empty-state">
      暂无收藏～
    </p>
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

.timeline {
  max-width: 800px;
  margin: 2rem auto 0;
  animation: fadeInUp 0.5s ease forwards;
}

.month-group {
  margin-bottom: 2.5rem;
}

.month-group:last-child {
  margin-bottom: 0;
}

/* Month header with symmetric lines */
.month-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.month-header::before,
.month-header::after {
  content: '';
  flex: 1;
  max-width: 60px;
  height: 1px;
  background: linear-gradient(to right, transparent, var(--vp-c-divider), transparent);
}

.month-label {
  font-size: 0.875rem;
  font-weight: 300;
  font-family: var(--vp-font-family-mono);
  color: var(--vp-c-text-3);
  letter-spacing: 0.1em;
  text-transform: lowercase;
}

/* Bookmarks list */
.bookmarks-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
}

.bookmark-item {
  position: relative;
  margin: 0;
  padding: 0;
  transition: opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1),
              filter 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Subtle bottom border */
.bookmark-item::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0.5rem;
  right: 0.5rem;
  height: 1px;
  background-color: var(--vp-c-divider);
  opacity: 0.5;
}

.bookmark-item:last-child::after {
  display: none;
}

/* Spotlight effect - dims all items except hovered */
.bookmarks-list:has(.bookmark-item:hover) .bookmark-item:not(:hover) {
  opacity: 0.4;
}

.bookmark-link {
  display: block;
  padding: 1rem 0.5rem;
  text-decoration: none;
  color: inherit;
  transition: background-color 0.2s ease;
  border-radius: 0.25rem;
}

.bookmark-link:hover {
  background-color: var(--vp-c-bg-soft);
}

.bookmark-content {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.bookmark-title-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.bookmark-title {
  font-size: 1rem;
  font-weight: 400;
  color: var(--vp-c-text-2);
  line-height: 1.5;
  transition: color 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.bookmark-item:hover .bookmark-title {
  color: var(--vp-c-text-1);
}

.external-icon {
  width: 0.875rem;
  height: 0.875rem;
  color: var(--vp-c-text-3);
  flex-shrink: 0;
  transition: color 0.25s ease;
}

.bookmark-item:hover .external-icon {
  color: var(--vp-c-text-2);
}

.bookmark-description {
  margin: 0;
  font-size: 0.8125rem;
  font-weight: 300;
  color: var(--vp-c-text-3);
  line-height: 1.6;
  letter-spacing: 0.02em;
}

/* Empty state */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: var(--vp-c-text-3);
  font-size: 0.875rem;
  font-weight: 300;
  font-family: var(--vp-font-family-mono);
}

/* Mobile adjustments */
@media (max-width: 640px) {
  .timeline {
    margin-top: 1.5rem;
  }

  .month-group {
    margin-bottom: 2rem;
  }

  .month-header::before,
  .month-header::after {
    max-width: 40px;
  }

  .month-label {
    font-size: 0.8125rem;
  }

  .bookmark-link {
    padding: 0.875rem 0.375rem;
  }

  .bookmark-title {
    font-size: 0.9375rem;
  }

  .bookmark-description {
    font-size: 0.75rem;
  }

  .external-icon {
    width: 0.75rem;
    height: 0.75rem;
  }

  /* Disable spotlight effect on mobile */
  .bookmarks-list:has(.bookmark-item:hover) .bookmark-item:not(:hover) {
    opacity: 1;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .timeline,
  .bookmark-item,
  .bookmark-title,
  .external-icon {
    animation: none;
    opacity: 1;
    transform: none;
  }

  .bookmarks-list:has(.bookmark-item:hover) .bookmark-item:not(:hover) {
    opacity: 1;
  }
}

/* Focus indicators */
.bookmark-link:focus-visible {
  outline: 2px solid var(--vp-c-brand);
  outline-offset: 2px;
}
</style>
