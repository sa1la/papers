<script setup lang='ts'>
import dayjs from 'dayjs'
import { ArrowLeft, ArrowRight, Tag } from 'lucide-vue-next'
import { useData, withBase } from 'vitepress'
import { computed, onMounted, ref } from 'vue'
import { data as posts } from '../posts.data'
import { useBlogStore } from '../store'

const blogStore = useBlogStore()
const tagsURL = withBase('/tags')
const { frontmatter, page } = useData()
const mounted = ref(false)

// Format last updated time
const lastUpdated = computed(() => {
  const timestamp = page.value.lastUpdated
  if (!timestamp)
    return null
  return dayjs(timestamp).format('YYYY-MM-DD HH:mm:ss')
})

interface NavPost {
  url: string
  title: string
  date: string
  category: string
}

const prevPost = computed<NavPost | null>(() => {
  const index = posts.findIndex(post => post.title === frontmatter.value.title)
  if (index > 0) {
    const post = posts[index - 1]
    return {
      url: withBase(post.url),
      title: post.title,
      date: post.date.string,
      category: post.category,
    }
  }
  return null
})

const nextPost = computed<NavPost | null>(() => {
  const index = posts.findIndex(post => post.title === frontmatter.value.title)
  if (index >= 0 && index < posts.length - 1) {
    const post = posts[index + 1]
    return {
      url: withBase(post.url),
      title: post.title,
      date: post.date.string,
      category: post.category,
    }
  }
  return null
})

function selectTag(tag: string) {
  blogStore.selectedTag = tag
}

onMounted(() => {
  mounted.value = true
})
</script>

<template>
  <div class="post-footer">
    <!-- Last Updated -->
    <div v-if="lastUpdated" class="last-updated-section">
      <span class="update-label">updated:</span>
      <time class="update-time">{{ lastUpdated }}</time>
    </div>

    <!-- Tags Section -->
    <div v-if="frontmatter.tags?.length" class="tags-section">
      <div class="section-header">
        <div class="section-line" />
        <Tag class="section-icon" />
        <span class="section-label">tags</span>
        <div class="section-line" />
      </div>
      <div class="tags-list">
        <a
          v-for="tag in frontmatter.tags"
          :key="tag"
          :href="tagsURL"
          class="tag-item"
          @click="selectTag(tag)"
        >
          <span class="tag-symbol">#</span>
          <span class="tag-name">{{ tag.toLowerCase() }}</span>
        </a>
      </div>
    </div>

    <!-- Navigation Section -->
    <div class="nav-section" :class="{ 'nav-section--visible': mounted }">
      <!-- Previous Post -->
      <a
        v-if="prevPost"
        :href="prevPost.url"
        class="nav-link nav-prev"
      >
        <div class="nav-direction">
          <ArrowLeft class="nav-arrow" />
          <span>previous</span>
        </div>
        <div class="nav-content">
          <span class="nav-category">{{ prevPost.category.toLowerCase() }}</span>
          <h4 class="nav-title">{{ prevPost.title }}</h4>
          <span class="nav-date">{{ prevPost.date }}</span>
        </div>
      </a>
      <div v-else class="nav-link nav-empty">
        <span class="nav-empty-text">—</span>
      </div>

      <!-- Next Post -->
      <a
        v-if="nextPost"
        :href="nextPost.url"
        class="nav-link nav-next"
      >
        <div class="nav-direction">
          <span>next</span>
          <ArrowRight class="nav-arrow" />
        </div>
        <div class="nav-content">
          <span class="nav-category">{{ nextPost.category.toLowerCase() }}</span>
          <h4 class="nav-title">{{ nextPost.title }}</h4>
          <span class="nav-date">{{ nextPost.date }}</span>
        </div>
      </a>
      <div v-else class="nav-link nav-empty">
        <span class="nav-empty-text">—</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.post-footer {
  margin-top: 4rem;
  padding-top: 2rem;
}

/* Last Updated Section */
.last-updated-section {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--vp-c-divider);
  font-size: 0.75rem;
  font-weight: 300;
  color: var(--vp-c-text-3);
  font-family: var(--vp-font-family-mono);
  text-transform: lowercase;
  letter-spacing: 0.05em;
}

.update-label {
  opacity: 0.6;
}

.update-time {
  opacity: 0.9;
}

/* Tags Section */
.tags-section {
  margin-bottom: 3rem;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.section-line {
  flex: 1;
  max-width: 60px;
  height: 1px;
  background: linear-gradient(to right, transparent, var(--vp-c-divider), transparent);
}

.section-icon {
  width: 0.875rem;
  height: 0.875rem;
  color: var(--vp-c-text-3);
  stroke-width: 1.5;
}

.section-label {
  font-size: 0.8125rem;
  font-weight: 300;
  color: var(--vp-c-text-3);
  font-family: var(--vp-font-family-mono);
  text-transform: lowercase;
  letter-spacing: 0.05em;
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.25rem 1.5rem;
  padding: 0.5rem 0;
}

.tag-item {
  display: inline-flex;
  align-items: baseline;
  gap: 0.25rem;
  padding: 0.375rem 0;
  font-weight: 400;
  color: var(--vp-c-text-2);
  text-decoration: none;
  transition: color 0.2s ease;
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

.tag-symbol {
  opacity: 0.4;
  font-weight: 400;
}

.tag-item:hover .tag-symbol {
  opacity: 0.7;
}

.tag-name {
  font-weight: 500;
  letter-spacing: -0.01em;
}

/* Navigation Section */
.nav-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1px;
  background: var(--vp-c-divider);
  border: 1px solid var(--vp-c-divider);
  opacity: 0;
  transform: translateY(12px);
  transition: opacity 0.4s ease 0.1s, transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) 0.1s;
}

.nav-section--visible {
  opacity: 1;
  transform: translateY(0);
}

.nav-link {
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  background: var(--vp-c-bg);
  text-decoration: none;
  transition: background-color 0.25s ease;
}

.nav-link:hover {
  background: var(--vp-c-bg-soft);
}

.nav-prev {
  text-align: left;
}

.nav-next {
  text-align: right;
}

.nav-direction {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.75rem;
  font-weight: 300;
  color: var(--vp-c-text-3);
  font-family: var(--vp-font-family-mono);
  text-transform: lowercase;
  letter-spacing: 0.05em;
  margin-bottom: 1rem;
}

.nav-prev .nav-direction {
  justify-content: flex-start;
}

.nav-next .nav-direction {
  justify-content: flex-end;
}

.nav-arrow {
  width: 0.75rem;
  height: 0.75rem;
  stroke-width: 1.5;
}

.nav-content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.nav-category {
  font-size: 0.6875rem;
  font-weight: 300;
  color: var(--vp-c-text-3);
  font-family: var(--vp-font-family-mono);
  text-transform: lowercase;
  letter-spacing: 0.05em;
}

.nav-title {
  font-size: 0.9375rem;
  font-weight: 400;
  color: var(--vp-c-text-1);
  line-height: 1.5;
  margin: 0;
  transition: color 0.2s ease;
}

.nav-link:hover .nav-title {
  color: var(--vp-c-text-1);
}

.nav-date {
  font-size: 0.75rem;
  font-weight: 300;
  color: var(--vp-c-text-3);
  font-family: var(--vp-font-family-mono);
  letter-spacing: 0.02em;
}

.nav-empty {
  align-items: center;
  justify-content: center;
  min-height: 120px;
}

.nav-empty-text {
  font-size: 1rem;
  color: var(--vp-c-text-3);
  opacity: 0.3;
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .nav-section {
    transition: none;
    opacity: 1;
    transform: none;
  }

  .tag-item::after {
    transition: none;
  }
}

/* Mobile Responsive */
@media (max-width: 640px) {
  .post-footer {
    margin-top: 3rem;
  }

  .tags-list {
    gap: 0.25rem 1rem;
  }

  .nav-section {
    grid-template-columns: 1fr;
  }

  .nav-link {
    padding: 1.25rem;
  }

  .nav-next {
    text-align: left;
  }

  .nav-next .nav-direction {
    justify-content: flex-start;
  }

  .nav-title {
    font-size: 0.875rem;
  }
}

/* Focus indicators */
.nav-link:focus-visible,
.tag-item:focus-visible {
  outline: 2px solid var(--vp-c-brand);
  outline-offset: 2px;
}

.tag-item:focus-visible::after {
  width: 100%;
}
</style>
