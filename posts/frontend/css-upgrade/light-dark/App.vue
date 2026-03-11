<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'

const currentMode = ref('auto')
const isManualOverride = ref(false)

const buttonText = computed(() => {
  if (isManualOverride.value)
    return currentMode.value === 'dark' ? '已切换：暗色' : '已切换：亮色'
  return '自动跟随系统'
})

function getSystemTheme() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function applyTheme(mode) {
  currentMode.value = mode
  const root = document.documentElement
  if (mode === 'auto') {
    const systemTheme = getSystemTheme()
    root.style.colorScheme = systemTheme
    root.setAttribute('data-theme', systemTheme)
  }
  else {
    root.style.colorScheme = mode
    root.setAttribute('data-theme', mode)
  }
}

function cycleTheme() {
  if (isManualOverride.value) {
    // Manual mode: toggle between light/dark, then back to auto
    const nextMode = currentMode.value === 'dark' ? 'light' : 'auto'
    isManualOverride.value = nextMode !== 'auto'
    applyTheme(nextMode)
  }
  else {
    // Auto mode: switch to manual dark
    isManualOverride.value = true
    applyTheme('dark')
  }
}

// 监听系统主题变化
const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

function handleThemeChange() {
  if (!isManualOverride.value) {
    const theme = getSystemTheme()
    document.documentElement.style.colorScheme = theme
    document.documentElement.setAttribute('data-theme', theme)
  }
}

onMounted(() => {
  mediaQuery.addEventListener('change', handleThemeChange)

  // 初始化 - 从 URL 参数读取主题
  const params = new URLSearchParams(location.search)
  const urlTheme = params.get('theme')
  if (urlTheme === 'dark' || urlTheme === 'light') {
    isManualOverride.value = true
    currentMode.value = urlTheme
    document.documentElement.style.colorScheme = urlTheme
    document.documentElement.setAttribute('data-theme', urlTheme)
  }
  else {
    applyTheme('auto')
  }
})

onUnmounted(() => {
  mediaQuery.removeEventListener('change', handleThemeChange)
})
</script>

<template>
  <div class="container">
    <div class="card">
      <div class="icon">
        🎨
      </div>
      <h2>light-dark() 演示</h2>
      <p>这个卡片使用 light-dark() 函数定义颜色变量。默认自动跟随系统主题，也可以点击按钮手动指定主题或恢复自动。</p>
      <button class="action-btn" @click="cycleTheme">
        {{ buttonText }}
      </button>
    </div>

    <div class="color-palette">
      <h3>自动适配的颜色变量</h3>
      <div class="colors">
        <div class="color-item">
          <div class="swatch bg-primary" />
          <span>背景色</span>
        </div>
        <div class="color-item">
          <div class="swatch text-primary" />
          <span>文字色</span>
        </div>
        <div class="color-item">
          <div class="swatch accent" />
          <span>强调色</span>
        </div>
        <div class="color-item">
          <div class="swatch border" />
          <span>边框色</span>
        </div>
      </div>
    </div>

    <div class="code-block">
      <code>
        :root {<br>
        &nbsp;&nbsp;color-scheme: light dark;<br>
        &nbsp;&nbsp;--bg: light-dark(#fff, #0d0d0d);<br>
        &nbsp;&nbsp;--text: light-dark(#333, #fafafa);<br>
        }
      </code>
    </div>
  </div>
</template>

<style>
/* 关键：在全局启用 light-dark() 支持，设置为 both 让函数可以工作
 * 然后通过 JS 动态切换为 light 或 dark 来强制特定主题 */
html {
  color-scheme: light dark;
}
</style>

<style scoped>
.container {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
}

/* 使用 light-dark() 定义变量
 * 自动根据系统主题选择对应颜色，无需 JavaScript */
.card {
  background: light-dark(#ffffff, rgba(255, 255, 255, 0.03));
  border: 1px solid light-dark(rgba(0, 0, 0, 0.12), rgba(255, 255, 255, 0.12));
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: light-dark(
    0 4px 20px rgba(0, 0, 0, 0.1),
    0 4px 20px rgba(0, 0, 0, 0.4)
  );
  text-align: center;
  transition: all 0.3s;
}

.icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.card h2 {
  color: light-dark(#1a1a1a, rgba(255, 255, 255, 0.9));
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
}

.card p {
  color: light-dark(#666666, rgba(255, 255, 255, 0.6));
  font-size: 0.9rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.action-btn {
  background: light-dark(#1a73e8, #8ab4e8);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: transform 0.2s, opacity 0.2s;
}

.action-btn:hover {
  transform: translateY(-2px);
  opacity: 0.9;
}

.color-palette {
  background: light-dark(#ffffff, rgba(255, 255, 255, 0.03));
  border: 1px solid light-dark(rgba(0, 0, 0, 0.12), rgba(255, 255, 255, 0.12));
  border-radius: 12px;
  padding: 1rem;
}

.color-palette h3 {
  color: light-dark(#1a1a1a, rgba(255, 255, 255, 0.9));
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 1rem;
  letter-spacing: 0.02em;
}

.colors {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}

.color-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.swatch {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  border: 1px solid light-dark(rgba(0, 0, 0, 0.12), rgba(255, 255, 255, 0.12));
  transition: transform 0.2s;
}

.swatch:hover {
  transform: scale(1.1);
}

.bg-primary {
  background: light-dark(#ffffff, rgba(255, 255, 255, 0.03));
}

.text-primary {
  background: light-dark(#1a1a1a, rgba(255, 255, 255, 0.9));
}

.accent {
  background: light-dark(#1a73e8, #8ab4e8);
}

.border {
  background: light-dark(rgba(0, 0, 0, 0.12), rgba(255, 255, 255, 0.12));
}

.color-item span {
  color: light-dark(#666666, rgba(255, 255, 255, 0.6));
  font-size: 0.75rem;
}

.code-block {
  background: light-dark(#ffffff, rgba(255, 255, 255, 0.03));
  border: 1px solid light-dark(rgba(0, 0, 0, 0.12), rgba(255, 255, 255, 0.12));
  border-radius: 12px;
  padding: 0.875rem 1rem;
  overflow-x: auto;
}

.code-block code {
  color: light-dark(#666666, rgba(255, 255, 255, 0.6));
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 0.8rem;
  line-height: 1.6;
}
</style>
