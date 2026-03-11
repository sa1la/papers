<script setup>
import { computed, ref } from 'vue'

const viewportWidth = ref(600)

const previewStyle = computed(() => ({
  // 用 CSS 变量传递“模拟视口宽度”，避免容器实际宽度超过可视区域导致被裁剪
  '--sim-width': `${viewportWidth.value}px`,
  // 把“模拟视口宽度”的 1% 作为模拟 vw 使用
  '--sim-vw': `${viewportWidth.value / 100}px`,
}))
</script>

<template>
  <div class="container">
    <div class="demo-section">
      <h3>拖动滑块调整视口宽度</h3>
      <div class="width-control">
        <label>模拟视口: <span>{{ viewportWidth }}</span>px</label>
        <input v-model.number="viewportWidth" type="range" min="320" max="1200">
      </div>
    </div>

    <div class="preview-wrapper" :style="previewStyle">
      <div class="preview-content">
        <h1 class="responsive-h1">
          响应式标题 clamp()
        </h1>
        <p class="responsive-text">
          这段文字使用 clamp(1rem, 2.5vw, 1.5rem) 设置字体大小。最小 1rem，推荐 2.5vw，最大 1.5rem。
        </p>
        <p class="fixed-text">
          ↕ 上方文字会随宽度平滑变化，此段文字大小固定为 0.875rem
        </p>
      </div>
    </div>

    <div class="code-hint">
      <code>font-size: clamp(1.5rem, 4vw + 1rem, 3rem);</code>
    </div>
  </div>
</template>

<style scoped>
.width-control {
  margin-bottom: 0.5rem;
}

.width-control label {
  display: block;
  color: var(--text-color);
  font-size: 0.875rem;
  margin-bottom: 0.75rem;
  font-family: monospace;
}

.width-control input[type="range"] {
  width: 100%;
  height: 6px;
  background: var(--card-border);
  border-radius: 3px;
  outline: none;
  -webkit-appearance: none;
}

.width-control input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 18px;
  height: 18px;
  background: var(--accent);
  border-radius: 50%;
  cursor: pointer;
}

.width-control input[type="range"]::-moz-range-thumb {
  width: 18px;
  height: 18px;
  background: var(--accent);
  border-radius: 50%;
  cursor: pointer;
  border: none;
}

/* 预览区域 */
.preview-wrapper {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: 12px;
  padding: 2rem;
  /* 实际容器宽度不会超过可视区域，防止在滑块最大值时左右被裁剪 */
  width: min(100%, var(--sim-width, 600px));
  margin: 0 auto;
  transition: width 0.2s ease;
  overflow: hidden;
}

.preview-content {
  text-align: center;
}

/* 响应式标题
 * 使用“模拟 vw”：--sim-vw 由滑块控制，相当于视口宽度的 1%
 */
.responsive-h1 {
  /* 最小 1.5rem，推荐 4vw + 1rem，最大 3rem */
  font-size: clamp(1.5rem, calc(var(--sim-vw, 1vw) * 4 + 1rem), 3rem);
  color: var(--text-color);
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 1rem;
}

/* 响应式正文：同样用“模拟 vw” 驱动字号变化 */
.responsive-text {
  /* 最小 1rem，推荐 2.5vw，最大 1.5rem */
  font-size: clamp(1rem, calc(var(--sim-vw, 1vw) * 2.5), 1.5rem);
  color: var(--text-color);
  line-height: 1.7;
}

/* 固定大小对比 */
.fixed-text {
  font-size: 0.875rem;
  line-height: 1.6;
  margin-top: 1rem;
  color: var(--text-muted);
}
</style>
