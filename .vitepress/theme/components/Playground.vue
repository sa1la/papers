<script setup lang="ts">
import type { FileEntry, GoOutput, JsOutput } from '../../types/codeDemo.js'
import { useRoute } from 'vitepress'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { getErrorMessage } from '../utils/error'

// Component-specific log entry that accepts unknown args from JSON parsing
type ComponentLogEntry
  = | { type: 'log' | 'warn' | 'error', args: unknown[] }
    | { type: 'bench', label: string, ms: number, min: number, max: number, n: number }

const props = withDefaults(defineProps<{
  type: 'html' | 'js' | 'go'
  name: string
  height?: string
}>(), {
  height: '400px',
})

const route = useRoute()

const basePath = computed(() => {
  const p = route.path.replace(/\.html$/, '').replace(/^\/posts\//, '')
  return `/playground/${p}/${props.name}`
})

const iframeSrc = computed(() => `${basePath.value}/index.html`)

const files = ref<FileEntry[]>([])
// For html type: tab 0 is the demo iframe, tabs 1+ are source files.
// For js/go: tabs map directly to files[].
const activeTab = ref(0)

// go
const goStdout = ref('')
const goStderr = ref('')
const goExitCode = ref(0)
const goExecutedAt = ref('')

// load error (output.json fetch failed)
const loadError = ref('')

// js output (pre-executed at build time, like Go)
const jsLogs = ref<ComponentLogEntry[]>([])
const jsError = ref('')
const jsExecutedAt = ref('')

function formatArg(v: unknown): string {
  if (typeof v === 'object' && v !== null) {
    try {
      return JSON.stringify(v)
    }
    catch {
      return String(v)
    }
  }
  return String(v)
}

// ── copy code ─────────────────────────────────────────────────────────────
const copiedIndex = ref<number | null>(null)
const copyErrorIndex = ref<number | null>(null)
let copyTimeoutId: ReturnType<typeof setTimeout> | null = null

// ── cleanup on unmount ────────────────────────────────────────────────────
onUnmounted(() => {
  // Clear copy timeout (safe to call with null/undefined)
  clearTimeout(copyTimeoutId!)
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
    console.error('[Playground] failed to copy:', err)
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
  try {
    const res = await fetch(`${basePath.value}/output.json`)
    if (!res.ok)
      throw new Error(`output.json not found (HTTP ${res.status}) — path: ${basePath.value}`)

    if (props.type === 'html') {
      const data: JsOutput = await res.json()
      files.value = data.files
    }
    else if (props.type === 'go') {
      const data: GoOutput = await res.json()
      files.value = data.files
      goStdout.value = data.stdout
      goStderr.value = data.stderr
      goExitCode.value = data.exitCode
      goExecutedAt.value = data.executedAt
    }
    else if (props.type === 'js') {
      const data: JsOutput = await res.json()
      files.value = data.files
      jsLogs.value = data.logs ?? []
      jsError.value = data.error ?? ''
      jsExecutedAt.value = data.executedAt ?? ''
    }
  }
  catch (e) {
    loadError.value = getErrorMessage(e)
    console.warn('[Playground] failed to load output.json:', e)
  }
})
</script>

<template>
  <div class="pg-wrap">
    <!-- ── HTML iframe ──────────────────────────────────────────────────────── -->
    <template v-if="type === 'html'">
      <!-- tabs: demo + source files -->
      <div class="pg-tabs">
        <button
          class="pg-tab"
          :class="{ 'pg-tab--active': activeTab === 0 }"
          @click="activeTab = 0"
        >
          demo
        </button>
        <button
          v-for="(f, i) in files"
          :key="f.name"
          class="pg-tab"
          :class="{ 'pg-tab--active': activeTab === i + 1 }"
          @click="activeTab = i + 1"
        >
          {{ f.name }}
        </button>
      </div>

      <!-- demo iframe -->
      <iframe
        v-show="activeTab === 0"
        :src="iframeSrc"
        :style="{ height }"
        class="pg-iframe"
        sandbox="allow-scripts allow-same-origin"
        loading="lazy"
      />

      <!-- source code panels -->
      <div v-if="activeTab > 0 && files[activeTab - 1]" class="pg-code-wrapper">
        <div
          class="pg-code-block"
          v-html="files[activeTab - 1].highlightedHtml"
        />
        <button
          class="pg-copy-btn"
          :class="{
            'pg-copy-btn--copied': copiedIndex === activeTab - 1,
            'pg-copy-btn--error': copyErrorIndex === activeTab - 1,
          }"
          :title="copiedIndex === activeTab - 1 ? 'copied!' : copyErrorIndex === activeTab - 1 ? 'copy failed' : 'copy code'"
          @click="copyCode(activeTab - 1)"
        />
      </div>
      <div v-else-if="activeTab > 0" class="pg-loading">
        loading…
      </div>

      <!-- load error -->
      <div v-if="loadError" class="pg-load-error">
        ✖ {{ loadError }}
      </div>
    </template>

    <!-- ── JS / Go: code + output ─────────────────────────────────────────── -->
    <template v-else>
      <!-- load error -->
      <div v-if="loadError" class="pg-load-error">
        ✖ {{ loadError }}
      </div>

      <!-- file tabs (only when >1 file) -->
      <div v-if="files.length > 1" class="pg-tabs">
        <button
          v-for="(f, i) in files"
          :key="f.name"
          class="pg-tab"
          :class="{ 'pg-tab--active': activeTab === i }"
          @click="activeTab = i"
        >
          {{ f.name }}
        </button>
      </div>

      <!-- code — rendered without vp-doc to avoid margin/overflow conflicts -->
      <div v-if="files[activeTab]" class="pg-code-wrapper">
        <div
          class="pg-code-block"
          v-html="files[activeTab].highlightedHtml"
        />
        <button
          class="pg-copy-btn"
          :class="{
            'pg-copy-btn--copied': copiedIndex === activeTab,
            'pg-copy-btn--error': copyErrorIndex === activeTab,
          }"
          :title="copiedIndex === activeTab ? 'copied!' : copyErrorIndex === activeTab ? 'copy failed' : 'copy code'"
          @click="copyCode(activeTab)"
        />
      </div>
      <div v-else class="pg-loading">
        loading…
      </div>

      <!-- ── JS output (pre-executed at build time) ─────────────────────────── -->
      <template v-if="type === 'js'">
        <div class="pg-output-bar">
          <span class="pg-output-label">output</span>
          <span v-if="jsExecutedAt" class="pg-exec-meta">
            {{ new Date(jsExecutedAt).toLocaleDateString('zh-CN') }}
          </span>
        </div>
        <div class="pg-output">
          <div v-if="jsError" class="pg-log pg-log--error">
            {{ jsError }}
          </div>
          <template v-for="(entry, i) in jsLogs" :key="i">
            <div v-if="entry.type === 'bench'" class="pg-bench">
              <span class="pg-bench-label">{{ entry.label }}</span>
              <span class="pg-bench-time">{{ entry.ms.toFixed(2) }}ms (min: {{ entry.min.toFixed(2) }}ms, max: {{ entry.max.toFixed(2) }}ms) × {{ entry.n }}</span>
            </div>
            <div v-else class="pg-log" :class="`pg-log--${entry.type}`">
              {{ entry.args.map(formatArg).join(' ') }}
            </div>
          </template>
          <div v-if="jsLogs.length === 0 && !jsError" class="pg-empty">
            — no output —
          </div>
        </div>
      </template>

      <!-- ── Go output ──────────────────────────────────────────────────────── -->
      <template v-if="type === 'go'">
        <div class="pg-output-bar">
          <span class="pg-output-label">output</span>
          <span v-if="goExecutedAt" class="pg-exec-meta">
            exit {{ goExitCode }} · {{ new Date(goExecutedAt).toLocaleDateString('zh-CN') }}
          </span>
        </div>
        <div class="pg-output">
          <pre v-if="goStdout" class="pg-stdout">{{ goStdout }}</pre>
          <pre v-if="goStderr" class="pg-stderr">{{ goStderr }}</pre>
          <div v-if="!goStdout && !goStderr" class="pg-empty">
            — no output —
          </div>
        </div>
      </template>
    </template>
  </div>
</template>

<style scoped>
/* outer wrapper — no extra visual frame, let the code block speak */
.pg-wrap {
  margin: 1rem 0;
  font-family: var(--vp-font-family-mono);
  font-size: var(--vp-code-font-size);
}

/* ── HTML iframe ─────────────────────────────────────────────────────────── */
.pg-iframe {
  width: 100%;
  border: none;
  display: block;
  border-radius: 0 0 8px 8px;
  background: #fff;
}

/* ── file tabs ───────────────────────────────────────────────────────────── */
.pg-tabs {
  display: flex;
  background-color: var(--vp-code-tab-bg);
  box-shadow: inset 0 -1px var(--vp-code-tab-divider);
  border-radius: 8px 8px 0 0;
  overflow: hidden;
}

.pg-tab {
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

.pg-tab:hover {
  color: var(--vp-code-tab-hover-text-color);
}

.pg-tab--active {
  color: var(--vp-code-tab-active-text-color);
  position: relative;
}

.pg-tab--active::after {
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
.pg-code-wrapper {
  position: relative;
}

.pg-copy-btn {
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

.pg-code-wrapper:hover > .pg-copy-btn,
.pg-copy-btn:focus {
  opacity: 1;
}

.pg-copy-btn:hover,
.pg-copy-btn--copied {
  border-color: var(--vp-code-copy-code-hover-border-color);
  background-color: var(--vp-code-copy-code-hover-bg);
}

.pg-copy-btn--copied {
  border-radius: 0 4px 4px 0;
  background-image: var(--vp-icon-copied);
}

.pg-copy-btn--copied::before {
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

.pg-copy-btn--error {
  border-color: var(--vp-c-danger-2, #b06060);
  background-color: var(--vp-c-danger-soft, #f5e0e0);
}

.pg-copy-btn--error::before {
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

.pg-loading {
  padding: 1rem;
  color: var(--vp-c-text-3);
  background: var(--vp-code-block-bg);
  border-radius: 8px;
  text-align: center;
}

.pg-load-error {
  padding: 0.75rem 1rem;
  color: var(--vp-c-danger-2, #b06060);
  background: var(--vp-code-block-bg);
  border-radius: 8px;
  font-size: 0.8125rem;
  white-space: pre-wrap;
  word-break: break-all;
}

/* ── output bar ──────────────────────────────────────────────────────────── */
.pg-output-bar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0 16px;
  height: 40px;
  background-color: var(--vp-code-block-bg);
  border-top: 1px solid var(--vp-code-block-divider-color);
}

.pg-output-label {
  color: var(--vp-code-lang-color);
  font-size: 0.75rem;
  letter-spacing: 0.05em;
}

.pg-exec-meta {
  margin-left: auto;
  color: var(--vp-code-line-number-color);
  font-size: 0.75rem;
}

/* ── output area ─────────────────────────────────────────────────────────── */
.pg-output {
  padding: 20px 24px;
  background: var(--vp-code-block-bg);
  border-radius: 0 0 8px 8px;
  min-height: 2.5rem;
  overflow-y: auto;
  line-height: var(--vp-code-line-height);
}

.pg-log {
  white-space: pre-wrap;
  word-break: break-all;
  color: var(--vp-code-block-color);
}

.pg-log--warn {
  color: var(--vp-c-warning-2, #b8a060);
}

.pg-log--warn::before {
  content: '⚠ ';
}

.pg-log--error {
  color: var(--vp-c-danger-2, #b06060);
}

.pg-log--error::before {
  content: '✖ ';
}

/* bench table row */
.pg-bench {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 1rem;
  padding: 0.1rem 0;
  color: var(--vp-code-block-color);
}

.pg-bench-label {
  color: var(--vp-c-text-1);
}

.pg-bench-time {
  text-align: right;
  color: var(--vp-code-line-number-color);
  white-space: nowrap;
}

.pg-empty {
  color: var(--vp-code-line-number-color);
  font-size: 0.8rem;
  text-align: center;
  padding: 0.25rem 0;
}

.pg-stdout {
  margin: 0;
  white-space: pre-wrap;
  word-break: break-all;
  color: var(--vp-code-block-color);
  font-family: var(--vp-font-family-mono);
  font-size: var(--vp-code-font-size);
}

.pg-stderr {
  margin: 0;
  white-space: pre-wrap;
  word-break: break-all;
  color: var(--vp-c-danger-2, #b06060);
  font-family: var(--vp-font-family-mono);
  font-size: var(--vp-code-font-size);
}
</style>

<!-- global styles for v-html rendered content (scoped :deep() doesn't work with v-html) -->
<style>
.pg-code-block div[class*='language-'] {
  position: relative;
  margin: 0;
  background-color: var(--vp-code-block-bg);
  border-radius: 8px 8px 0 0;
  overflow-x: auto;
  overflow-y: hidden;
  transition: background-color 0.5s;
}

/* 有 tabs 时：顶部无圆角连接 tab 栏，底部圆角保留（HTML 类型独立代码块） */
.pg-tabs ~ .pg-code-wrapper .pg-code-block div[class*='language-'] {
  border-radius: 0 0 8px 8px;
}

/* JS/Go 类型（有 output-bar）：代码块底部也无圆角，连接 output */
.pg-wrap:has(.pg-output-bar) .pg-code-block div[class*='language-'] {
  border-radius: 8px 8px 0 0;
}

/* JS/Go 且有 tabs：顶部和底部都无圆角 */
.pg-wrap:has(.pg-output-bar) .pg-tabs ~ .pg-code-wrapper .pg-code-block div[class*='language-'] {
  border-radius: 0;
}

.pg-code-block div[class*='language-'].line-numbers-mode {
  padding-left: 44px;
}

.pg-code-block .line-numbers-wrapper {
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

.pg-code-block [class*='language-'] pre {
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

.pg-code-block [class*='language-'] code {
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

.pg-code-block [class*='language-'] > span.lang {
  position: absolute;
  top: 2px;
  right: 8px;
  z-index: 2;
  font-size: 12px;
  font-weight: 500;
  color: var(--vp-code-lang-color);
  transition: color 0.4s, opacity 0.25s;
}

.pg-code-wrapper:hover .pg-code-block [class*='language-'] > span.lang {
  opacity: 0;
}
</style>
