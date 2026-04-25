<script setup lang="ts">
import type { BlogLocale } from '../../../config/categories'
import Giscus from '@giscus/vue'
import { useData } from 'vitepress'
import { computed } from 'vue'
import { useBlogLocale } from '../i18n'

const giscusLangMap: Record<BlogLocale, string> = {
  'zh-CN': 'zh-CN',
  'en-US': 'en',
}

const { isDark } = useData()
const locale = useBlogLocale()

const theme = computed(() => isDark.value ? 'transparent_dark' : 'light')
const lang = computed(() => giscusLangMap[locale.value] ?? 'en')
</script>

<template>
  <div class="comments-wrapper">
    <div class="comments-header">
      <div class="comments-line" />
      <span class="comments-label">comments</span>
      <div class="comments-line" />
    </div>
    <div class="comments-card">
      <Giscus
        repo="sa1la/papers"
        repo-id="R_kgDORW5WcA"
        category="Announcements"
        category-id="DIC_kwDORW5WcM4C7p8j"
        mapping="pathname"
        strict="0"
        reactions-enabled="1"
        emit-metadata="0"
        input-position="bottom"
        :theme="theme"
        :lang="lang"
        loading="lazy"
      />
    </div>
  </div>
</template>

<style scoped>
.comments-wrapper {
  margin-top: 4rem;
}

.comments-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-bottom: 2.5rem;
}

.comments-line {
  flex: 1;
  max-width: 80px;
  height: 1px;
  background: linear-gradient(to right, transparent, var(--vp-c-divider), transparent);
}

.comments-label {
  font-size: 0.8125rem;
  font-weight: 300;
  color: var(--vp-c-text-3);
  font-family: var(--vp-font-family-mono);
  text-transform: lowercase;
  letter-spacing: 0.05em;
}

.comments-card {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 1.5rem 1.25rem;
  transition: border-color 0.25s ease;
}

.comments-card:hover {
	border-color: color-mix(in srgb, var(--vp-c-text-3) 40%, transparent);
}

:deep(.giscus),
:deep(.giscus-frame) {
  width: 100%;
}
</style>
