<script setup lang="ts">
import type { VueDemoFile } from '../../types/vueDemo.js'
import { useData, useRoute } from 'vitepress'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { getErrorMessage } from '../utils/error'

const props = withDefaults(defineProps<{
  name: string
  height?: string
}>(), {
  height: '400px',
})

// Static regex patterns to avoid re-compilation
const REGEX_HTML_EXT = /\.html$/
const REGEX_POSTS_PREFIX = /^\/posts\//
const REGEX_TRAILING_SLASH = /\/$/

const route = useRoute()
const { isDark } = useData()

// iframe ref for theme sync
const iframeRef = ref<HTMLIFrameElement | null>(null)

// ── theme sync ────────────────────────────────────────────────────────────
function sendThemeToIframe() {
  const iframe = iframeRef.value
  if (!iframe?.contentWindow)
    return
  iframe.contentWindow.postMessage(
    { type: 'theme', isDark: isDark.value },
    window.location.origin,
  )
}

function onIframeLoad() {
  // Reserved for future use
}

watch(isDark, () => {
  sendThemeToIframe()
})

function handleDemoMessage(e: MessageEvent) {
  const iframe = iframeRef.value
  if (e.source !== iframe?.contentWindow)
    return

  if (e.data?.type === 'request-theme') {
    sendThemeToIframe()
  }
}

const basePath = computed(() => {
  const p = route.path.replace(REGEX_HTML_EXT, '').replace(REGEX_POSTS_PREFIX, '').replace(REGEX_TRAILING_SLASH, '')
  return `/demos/${p}/${props.name}`
})

const initialTheme = isDark.value ? 'dark' : 'light'

const iframeSrc = computed(() => {
  return `${basePath.value}/index.html?theme=${initialTheme}`
})

const files = ref<VueDemoFile[]>([])
const activeTab = ref(0)
const loadError = ref('')

// ── copy code ─────────────────────────────────────────────────────────────
const copiedIndex = ref<number | null>(null)
const copyErrorIndex = ref<number | null>(null)
let copyTimeoutId: ReturnType<typeof setTimeout> | null = null

onUnmounted(() => {
  clearTimeout(copyTimeoutId!)
  window.removeEventListener('message', handleDemoMessage)
})

async function copyCode(index: number) {
  const file = files.value[index]
  if (!file?.source)
    return

  if (copyTimeoutId) {
    clearTimeout(copyTimeoutId)
    copyTimeoutId = null
  }

  try {
    await navigator.clipboard.writeText(file.source)
    copiedIndex.value = index
    copyErrorIndex.value = null
    copyTimeoutId = setTimeout(() => {
      copiedIndex.value = null
      copyTimeoutId = null
    }, 2000)
  }
  catch (err) {
    console.error('[VueDemo] failed to copy:', err)
    copyErrorIndex.value = index
    copiedIndex.value = null
    copyTimeoutId = setTimeout(() => {
      copyErrorIndex.value = null
      copyTimeoutId = null
    }, 3000)
  }
}

onMounted(async () => {
  window.addEventListener('message', handleDemoMessage)
  try {
    const res = await fetch(`${basePath.value}/output.json`)
    if (!res.ok)
      throw new Error(`output.json not found (HTTP ${res.status}) — path: ${basePath.value}`)

    const data = await res.json()
    files.value = data.files
  }
  catch (e) {
    loadError.value = getErrorMessage(e)
    console.warn('[VueDemo] failed to load output.json:', e)
  }
})
</script>

<template>
  <div class="vd-wrap">
    <!-- tabs: demo + source files -->
    <div class="vd-tabs">
      <button
        class="vd-tab"
        :class="{ 'vd-tab--active': activeTab === 0 }"
        @click="activeTab = 0"
      >
        demo
      </button>
      <button
        v-for="(f, i) in files"
        :key="f.name"
        class="vd-tab"
        :class="{ 'vd-tab--active': activeTab === i + 1 }"
        @click="activeTab = i + 1"
      >
        {{ f.name }}
      </button>
    </div>

    <!-- demo iframe -->
    <iframe
      v-show="activeTab === 0"
      ref="iframeRef"
      :src="iframeSrc"
      :style="{ height }"
      class="vd-iframe"
      sandbox="allow-scripts allow-same-origin"
      loading="lazy"
      @load="onIframeLoad"
    />

    <!-- source code panels -->
    <div v-if="activeTab > 0 && files[activeTab - 1]" class="vd-code-wrapper">
      <div
        class="vd-code-block"
        v-html="files[activeTab - 1].highlightedHtml"
      />
      <button
        class="vd-copy-btn"
        :class="{
          'vd-copy-btn--copied': copiedIndex === activeTab - 1,
          'vd-copy-btn--error': copyErrorIndex === activeTab - 1,
        }"
        :title="copiedIndex === activeTab - 1 ? 'copied!' : copyErrorIndex === activeTab - 1 ? 'copy failed' : 'copy code'"
        @click="copyCode(activeTab - 1)"
      />
    </div>
    <div v-else-if="activeTab > 0" class="vd-loading">
      loading…
    </div>

    <!-- load error -->
    <div v-if="loadError" class="vd-load-error">
      ✖ {{ loadError }}
    </div>
  </div>
</template>

<style scoped>
.vd-wrap {
  margin: 1rem 0;
  font-family: var(--vp-font-family-mono);
  font-size: var(--vp-code-font-size);
}

.vd-iframe {
  width: 100%;
  border: none;
  display: block;
  border-radius: 0 0 8px 8px;
  background: var(--vp-c-bg);
  color-scheme: light dark;
}

.vd-tabs {
  display: flex;
  background-color: var(--vp-code-tab-bg);
  box-shadow: inset 0 -1px var(--vp-code-tab-divider);
  border-radius: 8px 8px 0 0;
  overflow: hidden;
}

.vd-tab {
  padding: 0 16px;
  line-height: 48px;
  font-family: var(--vp-font-family-mono);
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--vp-code-tab-text-color);
  background: transparent;
  border: none;
  cursor: pointer;
  white-space: nowrap;
  transition: color 0.25s;
}

.vd-tab:hover {
  color: var(--vp-code-tab-hover-text-color);
}

.vd-tab--active {
  color: var(--vp-code-tab-active-text-color);
  position: relative;
}

.vd-tab--active::after {
  position: absolute;
  right: 8px;
  bottom: -1px;
  left: 8px;
  height: 2px;
  border-radius: 2px;
  background-color: var(--vp-code-tab-active-bar-color);
  content: '';
}

.vd-code-wrapper {
  position: relative;
}

.vd-copy-btn {
  direction: ltr;
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 3;
  border: 1px solid var(--vp-code-copy-code-border-color);
  border-radius: 4px;
  width: 40px;
  height: 40px;
  background-color: var(--vp-code-copy-code-bg);
  opacity: 0;
  cursor: pointer;
  background-image: var(--vp-icon-copy);
  background-position: 50%;
  background-size: 20px;
  background-repeat: no-repeat;
  transition:
    border-color 0.25s,
    background-color 0.25s,
    opacity 0.25s;
}

.vd-code-wrapper:hover > .vd-copy-btn,
.vd-copy-btn:focus {
  opacity: 1;
}

.vd-copy-btn:hover,
.vd-copy-btn--copied {
  border-color: var(--vp-code-copy-code-hover-border-color);
  background-color: var(--vp-code-copy-code-hover-bg);
}

.vd-copy-btn--copied {
  border-radius: 0 4px 4px 0;
  background-image: var(--vp-icon-copied);
}

.vd-copy-btn--copied::before {
  position: relative;
  top: -1px;
  transform: translateX(calc(-100% - 1px));
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid var(--vp-code-copy-code-hover-border-color);
  border-right: 0;
  border-radius: 4px 0 0 4px;
  padding: 0 10px;
  width: fit-content;
  height: 40px;
  text-align: center;
  font-size: 12px;
  font-weight: 500;
  color: var(--vp-code-copy-code-active-text-color);
  background-color: var(--vp-code-copy-code-hover-bg);
  white-space: nowrap;
  content: '已复制';
}

.vd-copy-btn--error {
  border-color: var(--vp-c-danger-2, #b06060);
  background-color: var(--vp-c-danger-soft, #f5e0e0);
}

.vd-copy-btn--error::before {
  position: relative;
  top: -1px;
  transform: translateX(calc(-100% - 1px));
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid var(--vp-c-danger-2, #b06060);
  border-right: 0;
  border-radius: 4px 0 0 4px;
  padding: 0 10px;
  width: fit-content;
  height: 40px;
  text-align: center;
  font-size: 12px;
  font-weight: 500;
  color: var(--vp-c-danger-2, #b06060);
  background-color: var(--vp-c-danger-soft, #f5e0e0);
  white-space: nowrap;
  content: '复制失败';
}

.vd-loading {
  padding: 1rem;
  color: var(--vp-c-text-3);
  background: var(--vp-code-block-bg);
  border-radius: 8px;
  text-align: center;
}

.vd-load-error {
  padding: 0.75rem 1rem;
  color: var(--vp-c-danger-2, #b06060);
  background: var(--vp-code-block-bg);
  border-radius: 8px;
  font-size: 0.8125rem;
  white-space: pre-wrap;
  word-break: break-all;
}
</style>

<!-- global styles for v-html rendered content -->
<style>
.vd-code-block div[class*='language-'] {
  position: relative;
  margin: 0;
  background-color: var(--vp-code-block-bg);
  border-radius: 0 0 8px 8px;
  overflow-x: auto;
  overflow-y: hidden;
  transition: background-color 0.5s;
}

.vd-code-block div[class*='language-'].line-numbers-mode {
  padding-left: 44px;
}

.vd-code-block .line-numbers-wrapper {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 3;
  border-right: 1px solid var(--vp-code-block-divider-color);
  padding-top: 20px;
  width: 44px;
  text-align: right;
  padding-right: 8px;
  box-sizing: border-box;
  font-family: var(--vp-font-family-mono);
  line-height: var(--vp-code-line-height);
  font-size: var(--vp-code-font-size);
  color: var(--vp-code-line-number-color);
  transition: border-color 0.5s, color 0.5s;
}

.vd-code-block [class*='language-'] pre {
  position: relative;
  z-index: 1;
  margin: 0;
  padding: 20px 0 36px;
  background: transparent !important;
  overflow-x: auto;
  overflow-y: visible;
  text-align: left;
  outline: none;
}

.vd-code-block [class*='language-'] code {
  display: block;
  padding: 0 24px;
  width: fit-content;
  min-width: 100%;
  line-height: var(--vp-code-line-height);
  font-size: var(--vp-code-font-size);
  color: var(--vp-code-block-color);
  transition: color 0.5s;
  -moz-tab-size: 4;
  -o-tab-size: 4;
  tab-size: 4;
}

.vd-code-block [class*='language-'] > span.lang {
  position: absolute;
  top: 2px;
  right: 8px;
  z-index: 2;
  font-size: 12px;
  font-weight: 500;
  color: var(--vp-code-lang-color);
  transition: color 0.4s, opacity 0.25s;
}

.vd-code-wrapper:hover .vd-code-block [class*='language-'] > span.lang {
  opacity: 0;
}
</style>
