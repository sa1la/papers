<script setup>
import { computed, ref } from 'vue'

const containerWidth = ref(300)

const containerStyle = computed(() => ({
  width: `${containerWidth.value}px`,
}))
</script>

<template>
  <div class="container">
    <p class="hint">
      拖动下方滑块调整容器宽度，观察卡片布局变化
    </p>

    <div class="resize-wrapper">
      <div class="card-container" :style="containerStyle">
        <div class="card">
          <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Crect width='80' height='80' fill='%238ab4e8' rx='8'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='white' font-size='32'%3E📷%3C/text%3E%3C/svg%3E" alt="placeholder">
          <div class="card-content">
            <h3>卡片标题</h3>
            <p>容器查询让组件根据所在容器尺寸自适应，而非视口宽度。</p>
          </div>
        </div>
      </div>
    </div>

    <div class="width-control">
      <label>容器宽度: <span>{{ containerWidth }}</span>px</label>
      <input v-model.number="containerWidth" type="range" min="200" max="600">
    </div>

    <div class="code-hint">
      <code>@container (min-width: 400px) { .card { flex-direction: row; } }</code>
    </div>
  </div>
</template>

<style scoped>
.hint {
  text-align: center;
  color: var(--text-muted);
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
}

.resize-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
}

/* 定义容器 */
.card-container {
  container-type: inline-size;
  container-name: card;
  width: 300px;
  resize: horizontal;
  overflow: hidden;
  border: 2px dashed var(--accent);
  border-radius: 12px;
  padding: 1rem;
  transition: width 0.2s ease;
}

/* 卡片默认样式（小容器） */
.card {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: 12px;
  padding: 1.25rem;
}

.card img {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  flex-shrink: 0;
}

.card-content h3 {
  color: var(--text-color);
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.card-content p {
  color: var(--text-muted);
  font-size: 0.875rem;
  line-height: 1.6;
}

/* 容器查询：中等尺寸 */
@container card (min-width: 350px) {
  .card {
    flex-direction: row;
    align-items: flex-start;
  }

  .card img {
    width: 70px;
    height: 70px;
  }

  .card-content h3 {
    font-size: 1.1rem;
  }
}

/* 容器查询：大尺寸 */
@container card (min-width: 450px) {
  .card {
    gap: 1.25rem;
    padding: 1.5rem;
  }

  .card img {
    width: 80px;
    height: 80px;
  }

  .card-content h3 {
    font-size: 1.25rem;
  }

  .card-content p {
    font-size: 0.9375rem;
  }
}

/* 宽度控制 */
.width-control {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: 12px;
  padding: 1rem 1.25rem;
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
</style>
