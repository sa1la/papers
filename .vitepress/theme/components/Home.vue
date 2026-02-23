<script setup lang='ts'>
import { data as posts } from '../posts.data'
import { initArchives } from '../utils'
import Hero from './Hero.vue'

const archives = initArchives(posts)
const years = Object.keys(archives).sort().reverse()
</script>

<template>
  <div class="home-container">
    <Hero />

    <div class="paper-container">
      <!-- Posts List by Year -->
      <div class="posts-archive">
        <ul class="posts-list">
          <template v-for="year in years" :key="year">
            <li
              v-for="(post, postIndex) in archives[year]"
              :key="post.url"
              class="post-item"
              :class="{ 'post-item--year': postIndex === 0, 'post-item--sub': postIndex > 0 }"
            >
              <a :href="post.url" class="post-link">
                <!-- Year shown only on first post of each year -->
                <span v-if="postIndex === 0" class="post-year">{{ year }}</span>
                <span v-else class="post-year-spacer" />
                <span class="post-title">{{ post.title }}</span>
                <span v-if="post.draft" class="post-draft">draft</span>
                <span class="post-date">{{ post.date.dayMonth }}</span>
              </a>
            </li>
          </template>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-container {
  padding-bottom: 3rem;
}

.posts-archive {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 1rem;
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

/* Pseudo-element for bottom border with indentation */
.post-item::after {
  content: '';
  position: absolute;
  bottom: 0;
  height: 1px;
  background-color: var(--vp-c-divider);
}

/* Year row: full-width border */
.post-item--year::after {
  left: 0;
  right: 0;
}

/* Sub row: indented border starting from title position */
.post-item--sub::after {
  left: 5rem; /* 0.5rem padding + 3.5rem year width + 1rem gap */
  right: 0;
}

/* Last item of each year group: no border */
.post-item--sub:has(+ .post-item--year)::after,
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

.post-year {
  flex-shrink: 0;
  width: 3.5rem;
  font-size: 1rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.post-year-spacer {
  flex-shrink: 0;
  width: 3.5rem;
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
  min-width: 3rem;
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
  .posts-archive {
    padding: 0 0.75rem;
  }

  .post-link {
    padding: 0.625rem 0.375rem;
    gap: 0.75rem;
  }

  .post-year {
    width: 2.75rem;
    font-size: 0.875rem;
  }

  .post-year-spacer {
    width: 2.75rem;
  }

  .post-date {
    font-size: 0.75rem;
    min-width: 2.5rem;
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
}

/* Reduced motion support for accessibility */
@media (prefers-reduced-motion: reduce) {
  .post-item,
  .post-title {
    transition: none;
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
