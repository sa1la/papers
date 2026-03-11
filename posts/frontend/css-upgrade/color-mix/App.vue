<script setup>
import { computed, ref } from 'vue'

const colors = [
  { value: '#6366f1', label: '靛蓝' },
  { value: '#ef4444', label: '红色' },
  { value: '#10b981', label: '绿色' },
  { value: '#f59e0b', label: '橙色' },
  { value: '#8b5cf6', label: '紫色' },
]

const activeColor = ref('#6366f1')

const colorStyles = computed(() => ({
  '--primary-color': activeColor.value,
  '--primary-light': `color-mix(in srgb, ${activeColor.value} 70%, white)`,
  '--primary-dark': `color-mix(in srgb, ${activeColor.value} 70%, black)`,
  '--primary-muted': `color-mix(in srgb, ${activeColor.value} 50%, transparent)`,
}))

function setColor(color) {
  activeColor.value = color
}
</script>

<template>
  <div class="container" :style="colorStyles">
    <div class="demo-section">
      <h3>选择基础色</h3>
      <div class="color-picker">
        <button
          v-for="color in colors"
          :key="color.value"
          class="color-btn"
          :class="{ active: activeColor === color.value }"
          :style="{ background: color.value }"
          :aria-label="color.label"
          @click="setColor(color.value)"
        />
      </div>
    </div>

    <div class="swatches-grid">
      <div class="swatch-group">
        <h4>基础色</h4>
        <div class="swatch base" />
        <code>--primary-color</code>
      </div>

      <div class="swatch-group">
        <h4>混合白色 70%</h4>
        <div class="swatch light" />
        <code>color-mix(in srgb, var(--primary-color) 70%, white)</code>
      </div>

      <div class="swatch-group">
        <h4>混合黑色 70%</h4>
        <div class="swatch dark" />
        <code>color-mix(in srgb, var(--primary-color) 70%, black)</code>
      </div>

      <div class="swatch-group">
        <h4>透明度 50%</h4>
        <div class="swatch muted" />
        <code>color-mix(in srgb, var(--primary-color) 50%, transparent)</code>
      </div>
    </div>

    <div class="demo-section gradient-preview">
      <h3>渐变色阶应用</h3>
      <div class="gradient-bar" />
      <p class="hint">
        按钮使用 color-mix 生成的色阶
      </p>
      <div class="button-row">
        <button class="btn-primary">
          主要
        </button>
        <button class="btn-secondary">
          次要
        </button>
        <button class="btn-ghost">
          幽灵
        </button>
      </div>
    </div>

    <div class="code-hint">
      <code>background: color-mix(in srgb, var(--primary) 70%, white);</code>
    </div>
  </div>
</template>

<style scoped>
/* 颜色选择器 */
.color-picker {
  display: flex;
  justify-content: center;
  gap: 0.75rem;
}

.color-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid transparent;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.color-btn:hover {
  transform: scale(1.1);
}

.color-btn.active {
  border-color: var(--text-color);
  box-shadow: 0 0 0 2px var(--bg-color), 0 0 0 4px var(--text-color);
}

/* 色块网格 */
.swatches-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}

.swatch-group {
  text-align: center;
}

.swatch-group h4 {
  color: var(--text-color);
  font-size: 0.8125rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.swatch {
  width: 100%;
  aspect-ratio: 1;
  border-radius: 12px;
  margin-bottom: 0.5rem;
  border: 1px solid var(--card-border);
}

.swatch.base {
  background: var(--primary-color);
}

.swatch.light {
  background: var(--primary-light);
}

.swatch.dark {
  background: var(--primary-dark);
}

.swatch.muted {
  background: var(--primary-muted);
}

.swatch-group code {
  display: block;
  font-size: 0.625rem;
  color: var(--text-muted);
  word-break: break-all;
}

/* 渐变色阶预览 */
.gradient-preview {
  text-align: center;
}

.gradient-bar {
  height: 40px;
  border-radius: 8px;
  margin-bottom: 0.5rem;
  background: linear-gradient(
    to right,
    var(--primary-dark),
    var(--primary-color),
    var(--primary-light)
  );
}

.hint {
  color: var(--text-muted);
  font-size: 0.75rem;
  margin-bottom: 1rem;
}

.button-row {
  display: flex;
  justify-content: center;
  gap: 0.75rem;
}

.btn-primary {
  background: var(--primary-color);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  cursor: pointer;
}

.btn-secondary {
  background: var(--primary-light);
  color: var(--primary-dark);
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  cursor: pointer;
}

.btn-ghost {
  background: transparent;
  color: var(--primary-color);
  border: 1px solid var(--primary-muted);
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  cursor: pointer;
}

/* 移动端适配 */
@media (max-width: 480px) {
  .swatches-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
