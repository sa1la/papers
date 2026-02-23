<script setup lang='ts'>
import { useData, useRoute } from 'vitepress'
import { computed, onMounted, ref } from 'vue'
import { data as posts } from '../posts.data'
import { beautifyDate } from '../utils'

const route = useRoute()
const { frontmatter } = useData()
const DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss'
const mounted = ref(false)

const currentPost = computed(() => {
  const normalize = (p: string) => {
    // 去掉查询参数和 hash，并对路径进行解码，避免空格等字符编码差异
    const [pathOnly] = p.split(/[?#]/)
    const decoded = decodeURIComponent(pathOnly)
    return decoded
      .replace(/\/index\.html$/, '')
      .replace(/\/index$/, '')
      .replace(/\.html$/, '')
      .replace(/\/$/, '') || '/'
  }

  const target = normalize(route.path)
  return posts.find(post => normalize(post.url) === target) || null
})

const readingTime = computed(() => currentPost.value?.readingTime ?? null)

onMounted(() => {
  mounted.value = true
})
</script>

<template>
  <div class="post-header">
    <!-- Category -->
    <div class="header-category" :class="{ 'header-category--visible': mounted }">
      <span class="cat-label">— {{ frontmatter.category?.toLowerCase() }}</span>
    </div>

    <!-- Title -->
    <h1 class="post-title" :class="{ 'post-title--visible': mounted }">
      {{ frontmatter.title }}
    </h1>

    <!-- Meta Info -->
    <div class="post-meta" :class="{ 'post-meta--visible': mounted }">
      <span v-if="frontmatter.draft" class="meta-draft">draft</span>
      <span v-if="frontmatter.draft" class="meta-separator">·</span>
      <span class="meta-date">{{ beautifyDate(frontmatter.date, DATE_FORMAT) }}</span>
      <template v-if="readingTime">
        <span class="meta-separator">·</span>
        <span class="meta-reading">{{ readingTime }} min read</span>
      </template>
    </div>
  </div>
</template>

<style scoped>
.post-header {
	text-align: left;
	padding: 2.5rem 0 3rem;
	margin-bottom: 2rem;
	border-bottom: 1px solid var(--vp-c-divider);
}

.header-category {
	margin-bottom: 0.75rem;
	opacity: 0;
	transform: translateY(12px);
	transition: opacity 0.4s ease, transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.header-category--visible {
	opacity: 1;
	transform: translateY(0);
}

.cat-label {
	font-size: 0.8125rem;
	font-weight: 300;
	color: var(--vp-c-text-3);
	font-family: var(--vp-font-family-mono);
	letter-spacing: 0.05em;
	text-transform: lowercase;
}

.post-title {
	font-size: 1.75rem;
	font-weight: 400;
	color: var(--vp-c-text-1);
	line-height: 1.4;
	margin: 0 0 1rem;
	letter-spacing: -0.01em;
	opacity: 0;
	transform: translateY(12px);
	transition: opacity 0.4s ease 0.1s, transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) 0.1s;
}

.post-title--visible {
	opacity: 1;
	transform: translateY(0);
}

.post-meta {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	font-size: 0.8125rem;
	color: var(--vp-c-text-3);
	font-family: var(--vp-font-family-mono);
	opacity: 0;
	transform: translateY(12px);
	transition: opacity 0.4s ease 0.2s, transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s;
}

.post-meta--visible {
	opacity: 1;
	transform: translateY(0);
}

.meta-separator {
	opacity: 0.5;
}

.meta-draft {
	font-size: 0.75rem;
	font-weight: 300;
	color: var(--vp-c-text-3);
	text-transform: lowercase;
	letter-spacing: 0.05em;
	padding: 0.125rem 0.375rem;
	border: 1px solid var(--vp-c-divider);
	border-radius: 0.25rem;
	font-family: var(--vp-font-family-mono);
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
	.header-category,
	.post-title,
	.post-meta {
		transition: none;
		opacity: 1;
		transform: none;
	}
}

@media (max-width: 640px) {
	.post-header {
		padding: 1.5rem 0 2rem;
	}

	.post-title {
		font-size: 1.375rem;
	}

	.post-meta {
		font-size: 0.75rem;
	}

	.meta-draft {
		font-size: 0.6875rem;
		padding: 0.0625rem 0.25rem;
	}
}
</style>
