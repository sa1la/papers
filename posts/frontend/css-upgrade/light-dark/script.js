// 主题管理
// 三态循环：auto → light → dark → auto
const root = document.documentElement
const btn = document.querySelector('.action-btn')
let currentMode = 'auto' // 'auto' | 'light' | 'dark'

// 获取系统主题
function getSystemTheme() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

// 应用主题
function applyTheme(mode) {
  currentMode = mode
  if (mode === 'auto') {
    root.style.colorScheme = getSystemTheme()
    btn.textContent = '自动跟随系统'
  }
  else {
    root.style.colorScheme = mode
    btn.textContent = mode === 'dark' ? '已切换：暗色' : '已切换：亮色'
  }
}

// 初始化
applyTheme('auto')

// 监听系统主题变化（仅在 auto 模式下响应）
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  if (currentMode === 'auto') {
    root.style.colorScheme = e.matches ? 'dark' : 'light'
  }
})

// 点击按钮循环切换：auto → light → dark → auto
btn.addEventListener('click', () => {
  const nextMode = currentMode === 'auto' ? 'light' : currentMode === 'light' ? 'dark' : 'auto'
  applyTheme(nextMode)
})
