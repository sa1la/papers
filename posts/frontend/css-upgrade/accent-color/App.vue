<script setup>
import { computed, ref } from 'vue'

const colors = [
  { value: '#6366f1', label: '靛蓝' },
  { value: '#ff6b6b', label: '珊瑚' },
  { value: '#4ecdc4', label: '青绿' },
  { value: '#ffe66d', label: '明黄' },
  { value: '#a8e6cf', label: '薄荷' },
  { value: '#ff8b94', label: '粉红' },
]

const activeColor = ref('#6366f1')
const rangeValue = ref(50)

const accentColorStyle = computed(() => ({
  '--accent-color': activeColor.value,
  'accentColor': activeColor.value,
}))
</script>

<template>
  <div class="container" :style="accentColorStyle">
    <div class="demo-section">
      <h3>选择主题色</h3>
      <div class="color-picker">
        <button
          v-for="color in colors"
          :key="color.value"
          class="color-btn"
          :class="{ active: activeColor === color.value }"
          :style="{ background: color.value }"
          :aria-label="color.label"
          @click="activeColor = color.value"
        />
      </div>
    </div>

    <div class="forms-wrapper">
      <div class="form-section">
        <h4>复选框 & 单选框</h4>
        <label class="form-item">
          <input type="checkbox" checked>
          <span>选项一</span>
        </label>
        <label class="form-item">
          <input type="checkbox">
          <span>选项二</span>
        </label>
        <label class="form-item">
          <input type="radio" name="radio-group" checked>
          <span>单选 A</span>
        </label>
        <label class="form-item">
          <input type="radio" name="radio-group">
          <span>单选 B</span>
        </label>
      </div>

      <div class="form-section">
        <h4>范围滑块 & 进度条</h4>
        <div class="form-item">
          <label>音量: <span>{{ rangeValue }}</span>%</label>
          <input v-model.number="rangeValue" type="range" min="0" max="100">
        </div>
        <div class="form-item">
          <label>下载进度:</label>
          <progress value="70" max="100">
            70%
          </progress>
        </div>
        <div class="form-item">
          <label>缓冲:</label>
          <progress value="30" max="100">
            30%
          </progress>
        </div>
      </div>
    </div>

    <div class="code-hint">
      <code>:root { accent-color: {{ activeColor }}; }</code>
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

/* 表单布局 */
.forms-wrapper {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.form-section {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: 12px;
  padding: 1.25rem;
}

.form-section h4 {
  color: var(--text-color);
  font-size: 0.9375rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.form-item {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  margin-bottom: 0.75rem;
  color: var(--text-color);
  font-size: 0.875rem;
  cursor: pointer;
}

.form-item:last-child {
  margin-bottom: 0;
}

.form-item input[type="checkbox"],
.form-item input[type="radio"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.form-item input[type="range"] {
  width: 100%;
  height: 6px;
  margin-top: 0.5rem;
}

progress {
  width: 100%;
  height: 12px;
  border-radius: 6px;
  overflow: hidden;
}

/* 进度条样式 */
progress::-webkit-progress-bar {
  background: var(--card-border);
  border-radius: 6px;
}

progress::-webkit-progress-value {
  background: var(--accent-color);
  border-radius: 6px;
  transition: width 0.3s;
}

progress::-moz-progress-bar {
  background: var(--accent-color);
  border-radius: 6px;
}

/* 暗色模式下的复选框和单选框 */
@media (prefers-color-scheme: dark) {
  input[type="checkbox"],
  input[type="radio"] {
    accent-color: var(--accent-color);
  }
}
</style>
