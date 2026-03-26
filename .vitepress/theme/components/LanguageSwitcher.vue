<script setup lang='ts'>
import { Languages } from 'lucide-vue-next'
import { useRoute, withBase } from 'vitepress'
import { computed } from 'vue'
import { getLocalePath, useBlogLocale, useThemeText } from '../i18n'
import { data as posts } from '../posts.data'

const props = withDefaults(defineProps<{
  compact?: boolean
}>(), {
  compact: false,
})

const route = useRoute()
const locale = useBlogLocale()
const themeText = useThemeText()

const currentPost = computed(() => posts.find(post => post.url === route.path) || null)
const zhUrl = computed(() => currentPost.value?.alternateUrls['zh-CN'] || null)
const enUrl = computed(() => currentPost.value?.alternateUrls['en-US'] || null)

const zhHref = computed(() => withBase(zhUrl.value || getLocalePath('/', 'zh-CN')))
const enHref = computed(() => withBase(enUrl.value || getLocalePath('/', 'en-US')))
const targetLocale = computed(() => locale.value === 'zh-CN' ? 'en-US' : 'zh-CN')
const compactHref = computed(() => locale.value === 'zh-CN' ? enHref.value : zhHref.value)
const compactLabel = computed(() => targetLocale.value === 'zh-CN'
  ? `${themeText.value.language}: ${themeText.value.chinese}`
  : `${themeText.value.language}: ${themeText.value.english}`)
const compactBadgeText = computed(() => targetLocale.value === 'zh-CN' ? '中' : 'EN')
</script>

<template>
  <div class="language-switcher" :class="{ 'language-switcher--compact': props.compact }">
    <a
      v-if="props.compact"
      :href="compactHref"
      class="language-toggle"
      :aria-label="compactLabel"
      :title="compactLabel"
    >
      <span class="language-badge-text">{{ compactBadgeText }}</span>
    </a>

    <span
      v-else
      class="language-icon-wrap"
      :title="themeText.language"
      aria-hidden="true"
    >
      <Languages class="language-icon" />
    </span>

    <template v-if="!props.compact">
      <a
        :href="zhHref"
        class="language-link"
        :class="{ active: locale === 'zh-CN', disabled: !zhUrl }"
        :aria-disabled="!zhUrl"
        :title="zhUrl ? themeText.chinese : themeText.translationMissing"
      >
        {{ themeText.chinese }}
      </a>

      <a
        :href="enHref"
        class="language-link"
        :class="{ active: locale === 'en-US', disabled: !enUrl }"
        :aria-disabled="!enUrl"
        :title="enUrl ? themeText.english : themeText.translationMissing"
      >
        {{ themeText.english }}
      </a>
    </template>
  </div>
</template>

<style scoped>
.language-switcher {
  display: inline-flex;
  align-items: center;
  gap: 0.125rem;
  margin-top: 0.625rem;
  padding: 0.125rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 999px;
  background: var(--vp-c-bg-soft);
}

.language-switcher--compact {
  margin-top: 0;
  padding: 0;
  border: 0;
  background: transparent;
}

.language-toggle {
  display: inline-flex;
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
  text-decoration: none;
  cursor: pointer;
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
              background-color 0.2s ease,
              border-color 0.2s ease,
              color 0.2s ease;
}

.language-toggle:hover {
  background: var(--vp-c-bg-alt);
  border-color: var(--vp-c-brand);
  color: var(--vp-c-brand);
  transform: scale(1.05);
}

.language-toggle:active {
  transform: scale(0.95);
}

.language-toggle:focus-visible {
  outline: 2px solid var(--vp-c-brand);
  outline-offset: 2px;
}

.language-badge-text {
  font-size: 0.75rem;
  line-height: 1;
  font-weight: 600;
  font-family: var(--vp-font-family-mono);
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.language-icon-wrap {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.1rem;
  height: 1.1rem;
  color: var(--vp-c-text-3);
  opacity: 0.8;
}

.language-icon {
  width: 0.7rem;
  height: 0.7rem;
  stroke-width: 1.8;
}

.language-link {
  min-width: 3.75rem;
  padding: 0.18rem 0.42rem;
  border-radius: 999px;
  color: var(--vp-c-text-2);
  text-decoration: none;
  font-size: 0.625rem;
  font-family: var(--vp-font-family-mono);
  text-align: center;
  transition: background-color 0.2s ease, color 0.2s ease, opacity 0.2s ease;
}

.language-switcher--compact .language-link {
  min-width: 2.75rem;
  padding: 0.4rem 0.55rem;
  font-size: 0.6875rem;
}

.language-link:hover {
  background: var(--vp-c-bg-alt);
  color: var(--vp-c-text-1);
}

.language-link.active {
  background: var(--vp-c-text-1);
  color: var(--vp-c-bg);
}

.language-link.disabled {
  opacity: 0.45;
}

@media (max-width: 640px) {
  .language-toggle {
    width: 1.75rem;
    height: 1.75rem;
  }

  .language-badge-text {
    font-size: 0.6875rem;
  }

  .language-icon-wrap {
    width: 1rem;
    height: 1rem;
  }

  .language-icon {
    width: 0.65rem;
    height: 0.65rem;
  }

  .language-link {
    min-width: 3.5rem;
  }

  .language-switcher--compact .language-link {
    min-width: 2.5rem;
    padding: 0.35rem 0.45rem;
  }
}
</style>
