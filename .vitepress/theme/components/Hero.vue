<script setup lang='ts'>
import { useData } from 'vitepress'
import { computed, onMounted, ref } from 'vue'
import { data as posts } from '../posts.data'
import { initCategory, initTags } from '../utils'

const categories = initCategory(posts)
const tags = initTags(posts)
const { isDark } = useData()

const stats = computed(() => ({
  posts: posts.length,
  categories: Object.keys(categories).length,
  tags: Object.keys(tags).length,
}))

const mounted = ref(false)

// 主题切换函数 - 使用 VitePress 的 API
function toggleTheme() {
  isDark.value = !isDark.value
}

onMounted(() => {
  mounted.value = true
})
</script>

<template>
  <div class="hero-section">
    <div class="hero-content">
      <div class="hero-header">
        <h1 class="hero-title" :class="{ 'hero-title--visible': mounted }">
          Sa1L
        </h1>
        <button
          class="theme-toggle"
          :class="{ 'theme-toggle--mounted': mounted }"
          aria-label="切换主题"
          @click="toggleTheme"
        >
          <transition name="theme-icon" mode="out-in">
            <svg v-if="isDark" key="dark" class="theme-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
            <svg v-else key="light" class="theme-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          </transition>
        </button>
      </div>
      <p class="hero-subtitle" :class="{ 'hero-subtitle--visible': mounted }">
        冲吧，向那太阳，向那片海
      </p>
      <nav class="hero-nav" :class="{ 'hero-nav--visible': mounted }">
        <a href="/" class="stat-link">
          <span class="stat-num">{{ stats.posts }}</span>
          <span class="stat-label">posts</span>
        </a>
        <span class="stat-separator">·</span>
        <a href="/category" class="stat-link">
          <span class="stat-num">{{ stats.categories }}</span>
          <span class="stat-label">categories</span>
        </a>
        <span class="stat-separator">·</span>
        <a href="/tags" class="stat-link">
          <span class="stat-num">{{ stats.tags }}</span>
          <span class="stat-label">tags</span>
        </a>
        <span class="stat-separator">·</span>
        <a href="https://github.com/sa1la" target="_blank" class="stat-link stat-link--external" rel="noopener noreferrer">
          <span class="stat-label">github</span>
          <svg class="external-icon" viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
        </a>
      </nav>
    </div>
  </div>
</template>

<style scoped>
.hero-section {
  padding: 2rem 1rem 1.5rem;
  margin-bottom: 1rem;
}

.hero-content {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 0.5rem;
}

/* Hero header with title and theme toggle */
.hero-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.375rem;
}

/* Stats navigation */
.hero-nav {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8125rem;
  opacity: 0;
  transform: translateY(12px);
  transition: opacity 0.5s ease 0.2s, transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s;
}

.hero-nav--visible {
  opacity: 1;
  transform: translateY(0);
}

.stat-link {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  color: var(--vp-c-text-2);
  text-decoration: none;
  padding: 0.25rem 0;
  position: relative;
  transition: color 0.2s ease;
}

.stat-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 1px;
  background: var(--vp-c-text-2);
  transition: width 0.25s ease;
}

.stat-link:hover {
  color: var(--vp-c-text-1);
}

.stat-link:hover::after {
  width: 100%;
}

.stat-num {
  font-family: var(--vp-font-family-mono);
  font-weight: 500;
  transition: color 0.2s ease;
}

.stat-label {
  font-family: var(--vp-font-family-mono);
  text-transform: lowercase;
  letter-spacing: 0.05em;
}

.stat-separator {
  color: var(--vp-c-text-3);
  opacity: 0.4;
}

.external-icon {
  opacity: 0.6;
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.stat-link--external:hover .external-icon {
  opacity: 1;
  transform: translate(1px, -1px);
}

/* Theme Toggle Button */
.theme-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  padding: 0;
  margin: 0;
  border: 1px solid var(--vp-c-divider);
  border-radius: 0.5rem;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  cursor: pointer;
  opacity: 0;
  transform: scale(0.9) translateY(-8px);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  transition-property: opacity, transform, background-color, border-color, color;
}

.theme-toggle--mounted {
  opacity: 1;
  transform: scale(1) translateY(0);
}

.theme-toggle:hover {
  background: var(--vp-c-bg-alt);
  border-color: var(--vp-c-brand);
  color: var(--vp-c-brand);
  transform: scale(1.05);
}

.theme-toggle:active {
  transform: scale(0.95);
}

.theme-toggle:focus-visible {
  outline: 2px solid var(--vp-c-brand);
  outline-offset: 2px;
}

.theme-icon {
  width: 1rem;
  height: 1rem;
}

/* Theme Icon Transition */
.theme-icon-enter-active,
.theme-icon-leave-active {
  transition: all 0.2s ease;
}

.theme-icon-enter-from {
  opacity: 0;
  transform: rotate(-90deg) scale(0.5);
}

.theme-icon-leave-to {
  opacity: 0;
  transform: rotate(90deg) scale(0.5);
}

/* Hero Title with Animation */
.hero-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin: 0 0 0.375rem;
  letter-spacing: -0.01em;
  opacity: 0;
  transform: translateY(12px);
  transition: opacity 0.5s ease, transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.hero-title--visible {
  opacity: 1;
  transform: translateY(0);
}

/* Hero Subtitle with Animation */
.hero-subtitle {
  font-size: 0.9375rem;
  color: var(--vp-c-text-2);
  margin: 0 0 0.75rem;
  font-weight: 400;
  opacity: 0;
  transform: translateY(12px);
  transition: opacity 0.5s ease 0.1s, transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.1s;
}

.hero-subtitle--visible {
  opacity: 1;
  transform: translateY(0);
}

/* Mobile Responsive */
@media (max-width: 640px) {
  .hero-section {
    padding: 1.5rem 0.75rem 1rem;
  }

  .hero-content {
    padding: 0 0.375rem;
  }

  .hero-title {
    font-size: 1.25rem;
  }

  .hero-subtitle {
    font-size: 0.875rem;
  }

  .hero-nav {
    font-size: 0.75rem;
  }

  .theme-toggle {
    width: 1.75rem;
    height: 1.75rem;
  }

  .theme-icon {
    width: 0.875rem;
    height: 0.875rem;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .hero-title,
  .hero-subtitle,
  .hero-nav,
  .theme-toggle {
    transition: none;
    opacity: 1;
    transform: none;
  }
}
</style>
