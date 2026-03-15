<script setup lang="ts">
import type { HtmlDemoFile } from '../../types/htmlDemo.js'
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
  // Use window.location.origin for security instead of '*'
  iframe.contentWindow.postMessage(
    { type: 'theme', isDark: isDark.value },
    window.location.origin,
  )
}

// iframe is ready - no need to send initial theme anymore
// (initial theme is passed via URL parameter)
function onIframeLoad() {
  // Reserved for future use (e.g., tracking iframe load state)
}

// send theme when it changes
watch(isDark, () => {
  sendThemeToIframe()
})

// listen for theme requests from iframe (e.g., after localStorage theme change)
function handleDemoMessage(e: MessageEvent) {
  // Security: verify message is from the iframe
  const iframe = iframeRef.value
  if (e.source !== iframe?.contentWindow)
    return

  if (e.data?.type === 'request-theme') {
    sendThemeToIframe()
  }
}

const basePath = computed(() => {
  // Remove .html suffix and /posts/ prefix, then remove trailing slash
  const p = route.path.replace(REGEX_HTML_EXT, '').replace(REGEX_POSTS_PREFIX, '').replace(REGEX_TRAILING_SLASH, '')
  return `/demos/${p}/${props.name}`
})

// SSR 阶段保持空字符串，防止与客户端首帧计算不同导致 hydration mismatch。
// 实际 iframe 地址在 onMounted 时根据当前 isDark 设置，这样初始化就能跟随页面主题。
const iframeSrc = ref('')

const files = ref<HtmlDemoFile[]>([])
// Tab 0 is the demo iframe, tabs 1+ are source files.
const activeTab = ref(0)

// load error (output.json fetch failed)
const loadError = ref('')

// ── copy code ─────────────────────────────────────────────────────────────
const copiedIndex = ref<number | null>(null)
const copyErrorIndex = ref<number | null>(null)
let copyTimeoutId: ReturnType<typeof setTimeout> | null = null

// ── cleanup on unmount ────────────────────────────────────────────────────
onUnmounted(() => {
  // Clear copy timeout (safe to call with null/undefined)
  clearTimeout(copyTimeoutId!)
  // Remove message listener
  window.removeEventListener('message', handleDemoMessage)
})

async function copyCode(index: number) {
  const file = files.value[index]
  if (!file?.source)
    return

  // Clear any existing timeout to prevent state conflicts
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
    console.error('[HtmlDemo] failed to copy:', err)
    copyErrorIndex.value = index
    copiedIndex.value = null
    // Clear error state after 3 seconds
    copyTimeoutId = setTimeout(() => {
      copyErrorIndex.value = null
      copyTimeoutId = null
    }, 3000)
  }
}

onMounted(async () => {
  window.addEventListener('message', handleDemoMessage)

  // 根据当前主题设置初始 iframe 地址（只在客户端执行）
  const initialTheme = isDark.value ? 'dark' : 'light'
  iframeSrc.value = `${basePath.value}/index.html?theme=${initialTheme}`
  try {
    const res = await fetch(`${basePath.value}/output.json`)
    if (!res.ok)
      throw new Error(`output.json not found (HTTP ${res.status}) — path: ${basePath.value}`)

    const data = await res.json()
    files.value = data.files
  }
  catch (e) {
    loadError.value = getErrorMessage(e)
    console.warn('[HtmlDemo] failed to load output.json:', e)
  }
})
</script>

<template>
  <div class="hd-wrap">
    <!-- tabs: demo + source files -->
    <div class="hd-tabs">
      <button
        class="hd-tab"
        :class="{ 'hd-tab--active': activeTab === 0 }"
        @click="activeTab = 0"
      >
        demo
      </button>
      <button
        v-for="(f, i) in files"
        :key="f.name"
        class="hd-tab"
        :class="{ 'hd-tab--active': activeTab === i + 1 }"
        @click="activeTab = i + 1"
      >
        {{ f.name }}
      </button>
    </div>

    <!-- demo iframe -->
    <iframe
      v-if="iframeSrc"
      v-show="activeTab === 0"
      ref="iframeRef"
      :src="iframeSrc"
      :style="{ height }"
      class="hd-iframe"
      sandbox="allow-scripts allow-same-origin"
      loading="lazy"
      @load="onIframeLoad"
    />

    <!-- source code panels -->
    <div v-if="activeTab > 0 && files[activeTab - 1]" class="hd-code-wrapper">
      <div
        class="hd-code-block"
        v-html="files[activeTab - 1].highlightedHtml"
      />
      <button
        class="hd-copy-btn"
        :class="{
          'hd-copy-btn--copied': copiedIndex === activeTab - 1,
          'hd-copy-btn--error': copyErrorIndex === activeTab - 1,
        }"
        :title="copiedIndex === activeTab - 1 ? 'copied!' : copyErrorIndex === activeTab - 1 ? 'copy failed' : 'copy code'"
        @click="copyCode(activeTab - 1)"
      />
    </div>
    <div v-else-if="activeTab > 0" class="hd-loading">
      loading…
    </div>

    <!-- load error -->
    <div v-if="loadError" class="hd-load-error">
      ✖ {{ loadError }}
    </div>
  </div>
</template>

<style scoped>
/* outer wrapper — no extra visual frame, let the code block speak */
.hd-wrap {
  margin: 1rem 0;
  font-family: var(--vp-font-family-mono);
  font-size: var(--vp-code-font-size);
}

/* ── HTML iframe ─────────────────────────────────────────────────────────── */
.hd-iframe {
  width: 100%;
  border: none;
  display: block;
  border-radius: 0 0 8px 8px;
  background: var(--vp-c-bg);
  color-scheme: light dark;
}

/* ── file tabs ───────────────────────────────────────────────────────────── */
.hd-tabs {
  display: flex;
  background-color: var(--vp-code-tab-bg);
  box-shadow: inset 0 -1px var(--vp-code-tab-divider);
  border-radius: 8px 8px 0 0;
  overflow: hidden;
}

.hd-tab {
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

.hd-tab:hover {
  color: var(--vp-code-tab-hover-text-color);
}

.hd-tab--active {
  color: var(--vp-code-tab-active-text-color);
  position: relative;
}

.hd-tab--active::after {
  position: absolute;
  right: 8px;
  bottom: -1px;
  left: 8px;
  height: 2px;
  border-radius: 2px;
  background-color: var(--vp-code-tab-active-bar-color);
  content: '';
}

/* ── code block ─────────────────────────────────────────────────────────── */
.hd-code-wrapper {
  position: relative;
}

.hd-copy-btn {
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

.hd-code-wrapper:hover > .hd-copy-btn,
.hd-copy-btn:focus {
  opacity: 1;
}

.hd-copy-btn:hover,
.hd-copy-btn--copied {
  border-color: var(--vp-code-copy-code-hover-border-color);
  background-color: var(--vp-code-copy-code-hover-bg);
}

.hd-copy-btn--copied {
  border-radius: 0 4px 4px 0;
  background-image: var(--vp-icon-copied);
}

.hd-copy-btn--copied::before {
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

.hd-copy-btn--error {
  border-color: var(--vp-c-danger-2, #b06060);
  background-color: var(--vp-c-danger-soft, #f5e0e0);
}

.hd-copy-btn--error::before {
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

.hd-loading {
  padding: 1rem;
  color: var(--vp-c-text-3);
  background: var(--vp-code-block-bg);
  border-radius: 8px;
  text-align: center;
}

.hd-load-error {
  padding: 0.75rem 1rem;
  color: var(--vp-c-danger-2, #b06060);
  background: var(--vp-code-block-bg);
  border-radius: 8px;
  font-size: 0.8125rem;
  white-space: pre-wrap;
  word-break: break-all;
}
</style>

<!-- global styles for v-html rendered content (scoped :deep() doesn't work with v-html) -->
<style>
.hd-code-block div[class*='language-'] {
  position: relative;
  margin: 0;
  background-color: var(--vp-code-block-bg);
  border-radius: 0 0 8px 8px;
  overflow-x: auto;
  overflow-y: hidden;
  transition: background-color 0.5s;
}

.hd-code-block div[class*='language-'].line-numbers-mode {
  padding-left: 44px;
}

.hd-code-block .line-numbers-wrapper {
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

.hd-code-block [class*='language-'] pre {
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

.hd-code-block [class*='language-'] code {
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

.hd-code-block [class*='language-'] > span.lang {
  position: absolute;
  top: 2px;
  right: 8px;
  z-index: 2;
  font-size: 12px;
  font-weight: 500;
  color: var(--vp-code-lang-color);
  transition: color 0.4s, opacity 0.25s;
}

.hd-code-wrapper:hover .hd-code-block [class*='language-'] > span.lang {
  opacity: 0;
}
</style>
