<script setup lang='ts'>
import { Tag } from 'lucide-vue-next'
import { computed } from 'vue'
import { data as posts } from '../posts.data'
import { useBlogStore } from '../store'
import { initTags } from '../utils'
import Title from './Title.vue'

// Icon component for title
const TagIcon = Tag

const blogStore = useBlogStore()
const tags = initTags(posts)

const maxCount = computed(() => {
  const counts = Object.values(tags).map(posts => posts.length)
  return Math.max(...counts, 1)
})

const tagList = computed(() => {
  return Object.keys(tags)
    .map(key => ({
      tagName: key,
      count: tags[key].length,
    }))
    .sort((a, b) => b.count - a.count)
})

function getFontSize(count: number): string {
  const minSize = 0.8125
  const maxSize = 1.25
  const ratio = count / maxCount.value
  const size = minSize + (maxSize - minSize) * Math.sqrt(ratio)
  return `${size}rem`
}

function tagSwitcher(tag: string) {
  blogStore.updateSelectedTag(tag)
}
</script>

<template>
  <div class="paper-container">
    <Title text="tags" :icon="TagIcon" />

    <!-- Tag List -->
    <div class="tag-list">
      <button
        v-for="tag of tagList"
        :key="tag.tagName"
        type="button"
        class="tag-item"
        :class="{ active: blogStore.selectedTag === tag.tagName }"
        @click="tagSwitcher(tag.tagName)"
      >
        <span class="tag-symbol">#</span>
        <span class="tag-name" :style="{ fontSize: getFontSize(tag.count) }">{{ tag.tagName }}</span>
        <span class="tag-separator" />
        <span class="tag-count">{{ tag.count }}</span>
      </button>
    </div>

    <hr class="section-divider">

    <!-- Selected Tag Title -->
    <div v-show="blogStore.selectedTag" class="selected-header">
      <div class="selected-badge">
        <Tag class="badge-icon" />
        <span>{{ blogStore.selectedTag.toLowerCase() }}</span>
      </div>
    </div>

    <!-- Posts List - Same style as Home.vue -->
    <div v-show="blogStore.selectedTag" class="posts-archive">
      <ul v-if="tags[blogStore.selectedTag]?.length" class="posts-list">
        <li
          v-for="post in tags[blogStore.selectedTag]"
          :key="post.url"
          class="post-item"
        >
          <a :href="post.url" class="post-link">
            <span class="post-title">{{ post.title }}</span>
            <span class="post-date">{{ post.date.string }}</span>
          </a>
        </li>
      </ul>
      <p v-else class="empty-state">
        该标签下暂无文章
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

.tag-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.25rem 1.5rem;
  padding: 1.5rem 0;
  max-width: 1100px;
  margin: 0 auto;
  animation: fadeInUp 0.4s ease forwards;
}

.tag-item {
  display: inline-flex;
  align-items: baseline;
  gap: 0.25rem;
  padding: 0.375rem 0;
  margin: 0;
  font-weight: 400;
  color: var(--vp-c-text-2);
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}

.tag-item::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 1px;
  background: var(--vp-c-text-1);
  transition: width 0.25s ease;
}

.tag-item:hover {
  color: var(--vp-c-text-1);
}

.tag-item:hover::after {
  width: 100%;
}

.tag-item.active {
  color: var(--vp-c-text-1);
}

.tag-item.active::after {
  width: 100%;
}

.tag-symbol {
  opacity: 0.4;
  font-weight: 400;
  margin-right: 0.125rem;
}

.tag-item:hover .tag-symbol,
.tag-item.active .tag-symbol {
  opacity: 0.7;
}

.tag-name {
  font-weight: 500;
  letter-spacing: -0.01em;
}

.tag-separator {
  display: none;
}

.tag-count {
  font-size: 0.75em;
  font-family: var(--vp-font-family-mono);
  color: var(--vp-c-text-3);
  opacity: 0.7;
  margin-left: 0.25rem;
  min-width: 1.25rem;
  text-align: right;
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

@media (max-width: 640px) {
  .tag-list {
    gap: 0.375rem;
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
  .tag-list,
  .tag-item,
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
.tag-item:focus-visible {
  outline: none;
}

.tag-item:focus-visible::after {
  width: 100%;
  background: var(--vp-c-text-1);
}

.post-link:focus-visible {
  outline: 2px solid var(--vp-c-brand);
  outline-offset: 2px;
  border-radius: 4px;
}
</style>
