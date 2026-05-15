<script setup lang="ts">
import type { Bookmark } from '../favorites'
import { Bookmark as BookmarkIcon } from 'lucide-vue-next'
import { computed } from 'vue'
import { bookmarks } from '../favorites'
import { useBlogLocale, useThemeText } from '../i18n'
import { groupBookmarksByMonth } from '../utils'
import Title from './Title.vue'

const themeText = useThemeText()
const locale = useBlogLocale()

function getDescription(bookmark: Bookmark): string {
  if (locale.value === 'en-US' && bookmark.descriptionEn) {
    return bookmark.descriptionEn
  }
  return bookmark.description
}

const quotes = computed(() =>
  bookmarks.filter(b => (b.type ?? 'article') === 'quote'),
)

const articles = computed(() =>
  bookmarks.filter(b => (b.type ?? 'article') === 'article'),
)

const groupedQuotes = computed(() => groupBookmarksByMonth(quotes.value))
const groupedArticles = computed(() => groupBookmarksByMonth(articles.value))

const hasAnyContent = computed(() =>
  groupedQuotes.value.length > 0 || groupedArticles.value.length > 0,
)

const quoteMark = computed(() => locale.value === 'en-US' ? '"' : '「')

// 检查是否为外部链接
function isExternal(url: string | undefined): boolean {
  return !!url && (url.startsWith('http://') || url.startsWith('https://'))
}

// 获取链接目标属性
function getLinkProps(url: string | undefined) {
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
    <Title :text="themeText.favorites" :icon="BookmarkIcon" />

    <div v-if="hasAnyContent" class="timeline">
      <!-- Quotes Section -->
      <div class="section">
        <div class="section-header">
          <span class="section-label">{{ themeText.quotes }}</span>
        </div>
        <template v-if="groupedQuotes.length > 0">
          <ul class="bookmarks-list quote-list">
            <li
              v-for="group in groupedQuotes"
              :key="group.month"
              class="month-group"
            >
              <div class="month-header">
                <span class="month-label">{{ group.month }}</span>
              </div>
              <ul class="bookmarks-list">
                <li
                  v-for="bookmark in group.items"
                  :key="bookmark.id"
                  class="bookmark-item quote-item"
                >
                  <div class="quote-content">
                    <div class="quote-body">
                      <span class="quote-mark">{{ quoteMark }}</span>
                      <span class="quote-text">{{ getDescription(bookmark) }}</span>
                    </div>
                    <span class="quote-attribution">—— {{ bookmark.title }}</span>
                  </div>
                </li>
              </ul>
            </li>
          </ul>
        </template>
        <p v-else class="empty-state section-empty">
          {{ themeText.noQuotes }}
        </p>
      </div>

      <!-- Articles Section -->
      <div class="section">
        <div class="section-header">
          <span class="section-label">{{ themeText.articles }}</span>
        </div>
        <template v-if="groupedArticles.length > 0">
          <ul class="bookmarks-list">
            <li
              v-for="group in groupedArticles"
              :key="group.month"
              class="month-group"
            >
              <div class="month-header">
                <span class="month-label">{{ group.month }}</span>
              </div>
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
                        {{ getDescription(bookmark) }}
                      </p>
                    </div>
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </template>
        <p v-else class="empty-state section-empty">
          {{ themeText.noArticles }}
        </p>
      </div>
    </div>

    <!-- Page-level Empty State -->
    <p v-else class="empty-state">
      {{ themeText.noFavorites }}
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
  margin-bottom: 1.75rem;
}

.month-group:last-child {
  margin-bottom: 0;
}

/* Month header */
.month-header {
  text-align: center;
  margin-bottom: 1rem;
}

.month-label {
  font-size: 0.875rem;
  font-weight: 300;
  font-family: var(--vp-font-family-mono);
  color: var(--vp-c-text-3);
  letter-spacing: 0.05em;
  text-transform: lowercase;
  opacity: 0.7;
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
  padding: 0.75rem 0.5rem;
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
  font-size: 1.0625rem;
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
  font-size: 0.875rem;
  font-weight: 400;
  color: var(--vp-c-text-3);
  line-height: 1.6;
  letter-spacing: 0.02em;
}

/* Section header */
.section-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  margin-top: 2rem;
}

.section:first-child .section-header {
  margin-top: 0;
}

.section-header::before,
.section-header::after {
  content: '';
  flex: 1;
  max-width: 80px;
  height: 1px;
  background: linear-gradient(to right, transparent, var(--vp-c-divider), transparent);
}

.section-label {
  font-size: 1rem;
  font-weight: 300;
  font-family: var(--vp-font-family-mono);
  color: var(--vp-c-text-2);
  letter-spacing: 0.1em;
  text-transform: lowercase;
}

/* Quote styles */
.quote-content {
  padding: 0.875rem 0.75rem;
}

.quote-body {
  display: flex;
  gap: 0.375rem;
  align-items: flex-start;
}

.quote-mark {
  font-size: 1.375rem;
  line-height: 1.4;
  color: var(--vp-c-text-3);
  font-family: var(--vp-font-family-mono);
  flex-shrink: 0;
  transition: color 0.25s ease;
}

.quote-item:hover .quote-mark {
  color: var(--vp-c-text-2);
}

.quote-text {
  font-size: 1rem;
  font-weight: 400;
  font-style: italic;
  color: var(--vp-c-text-2);
  line-height: 1.7;
  letter-spacing: 0.01em;
}

.quote-attribution {
  display: block;
  margin-top: 0.5rem;
  font-size: 0.8125rem;
  font-weight: 300;
  color: var(--vp-c-text-3);
  letter-spacing: 0.02em;
  text-align: right;
}

/* Empty state */
.section-empty {
  padding: 2rem 1rem;
  font-size: 0.9375rem;
}

/* Empty state */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: var(--vp-c-text-3);
  font-size: 0.9375rem;
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
    padding: 0.625rem 0.375rem;
  }

  .bookmark-title {
    font-size: 1rem;
  }

  .bookmark-description {
    font-size: 0.8125rem;
  }

  .external-icon {
    width: 0.75rem;
    height: 0.75rem;
  }

  /* Disable spotlight effect on mobile */
  .bookmarks-list:has(.bookmark-item:hover) .bookmark-item:not(:hover) {
    opacity: 1;
  }

  .quote-content {
    padding: 0.75rem 0.5rem;
  }

  .quote-text {
    font-size: 0.9375rem;
  }

  .quote-mark {
    font-size: 1.125rem;
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
