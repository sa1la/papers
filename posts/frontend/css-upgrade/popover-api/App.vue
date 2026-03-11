<script setup>
import { ref } from 'vue'

// Only manual popover needs programmatic control via ref
const manualPopoverRef = ref(null)

function showManualPopover() {
  manualPopoverRef.value?.showPopover()
}

function hideManualPopover() {
  manualPopoverRef.value?.hidePopover()
}
</script>

<template>
  <div class="container">
    <div class="demo-grid">
      <!-- 自动 Popover -->
      <div class="demo-item">
        <h4>自动模式 (auto)</h4>
        <p class="desc">
          点击外部自动关闭，支持 ESC 键
        </p>
        <button
          class="trigger-btn"
          popovertarget="popover-auto"
        >
          打开弹层
        </button>
        <div
          id="popover-auto"
          popover="auto"
          class="popover-card"
        >
          <h5>自动模式弹层</h5>
          <p>点击页面其他区域，我会自动关闭哦！</p>
          <button
            class="close-btn"
            popovertarget="popover-auto"
            popovertargetaction="hide"
          >
            知道了
          </button>
        </div>
      </div>

      <!-- 手动 Popover -->
      <div class="demo-item">
        <h4>手动模式 (manual)</h4>
        <p class="desc">
          需要显式控制关闭，适合复杂交互
        </p>
        <button
          class="trigger-btn"
          @click="showManualPopover"
        >
          打开弹层
        </button>
        <div
          id="popover-manual"
          ref="manualPopoverRef"
          popover="manual"
          class="popover-card"
        >
          <h5>手动模式弹层</h5>
          <p>我不会自动关闭，需要点击按钮才能关闭。</p>
          <button class="close-btn" @click="hideManualPopover">
            关闭
          </button>
        </div>
      </div>
    </div>

    <!-- 带遮罩的弹层 -->
    <div class="demo-section">
      <h3>带遮罩 + 入场动画</h3>
      <button
        class="trigger-btn large"
        popovertarget="popover-backdrop"
      >
        打开带遮罩弹层
      </button>
      <div
        id="popover-backdrop"
        popover="auto"
        class="popover-modal"
      >
        <h3>模态弹层</h3>
        <p>使用 ::backdrop 伪元素实现遮罩效果，配合 @starting-style 实现平滑入场动画。</p>
        <div class="actions">
          <button
            class="secondary"
            popovertarget="popover-backdrop"
            popovertargetaction="hide"
          >
            取消
          </button>
          <button
            class="primary"
            popovertarget="popover-backdrop"
            popovertargetaction="hide"
          >
            确认
          </button>
        </div>
      </div>
    </div>

    <div class="code-hint">
      <code>[popover]::backdrop { background: rgba(0,0,0,0.5); }</code>
    </div>
  </div>
</template>

<style scoped>
.demo-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.demo-item {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: 12px;
  padding: 1.25rem;
  text-align: center;
}

.demo-item h4 {
  color: var(--text-color);
  font-size: 0.9375rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.demo-item .desc {
  color: var(--text-muted);
  font-size: 0.75rem;
  margin-bottom: 1rem;
}

/* 触发按钮 */
.trigger-btn {
  background: var(--accent);
  color: white;
  border: none;
  padding: 0.625rem 1.25rem;
  border-radius: 8px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: opacity 0.2s;
}

.trigger-btn:hover {
  opacity: 0.9;
}

.trigger-btn.large {
  padding: 0.75rem 1.5rem;
  font-size: 0.9375rem;
}

/* Popover 基础样式 */
[popover] {
  /* 居中定位：top layer 内用 fixed 相对视口居中 */
  position: fixed;
  left: 50%;
  top: 50%;
  margin: 0;

  /* 入场动画初始状态（居中 + 缩放 + 上移） */
  opacity: 0;
  transform: translate(-50%, -50%) scale(0.95) translateY(-10px);
  transition: opacity 0.25s ease, transform 0.25s ease, overlay 0.25s ease allow-discrete, display 0.25s ease allow-discrete;

  /* 最终状态：更实的背景和边框，与页面背景区分开 */
  padding: 1.5rem;
  border: 1px solid var(--card-border);
  border-radius: 16px;
  background: var(--card-bg);
  backdrop-filter: blur(20px);
  color: var(--text-color);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

/* 弹层表面：更实的背景和阴影，与页面背景区分开（支持 data-theme 与系统主题） */
[data-theme="light"] [popover] {
  background: #ffffff;
  border-color: rgba(0, 0, 0, 0.14);
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.18), 0 0 0 1px rgba(0, 0, 0, 0.06);
}

[data-theme="dark"] [popover] {
  background: #1c1c1c;
  border-color: rgba(255, 255, 255, 0.18);
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.08);
}

@media (prefers-color-scheme: light) {
  [popover] {
    background: #ffffff;
    border-color: rgba(0, 0, 0, 0.14);
    box-shadow: 0 24px 48px rgba(0, 0, 0, 0.18), 0 0 0 1px rgba(0, 0, 0, 0.06);
  }
}

@media (prefers-color-scheme: dark) {
  [popover] {
    background: #1c1c1c;
    border-color: rgba(255, 255, 255, 0.18);
    box-shadow: 0 24px 48px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.08);
  }
}

/* 入场动画起点 - 新元素创建时的初始状态 */
@starting-style {
  [popover] {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.95) translateY(-10px);
  }
}

/* 弹层打开状态 */
[popover]:popover-open {
  opacity: 1;
  transform: translate(-50%, -50%) scale(1) translateY(0);
}

@starting-style {
  [popover]:popover-open {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.95) translateY(-10px);
  }
}

/* 简单卡片弹层 */
.popover-card {
  min-width: 200px;
  max-width: 260px;
}

.popover-card h5 {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--text-color);
}

.popover-card p {
  font-size: 0.8125rem;
  color: var(--text-muted);
  margin-bottom: 1rem;
  line-height: 1.5;
}

.close-btn {
  background: var(--accent);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.2s;
}

.close-btn:hover {
  opacity: 0.9;
}

/* 模态弹层 */
.popover-modal {
  min-width: 280px;
  max-width: 360px;
  text-align: center;
}

.popover-modal h3 {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
}

.popover-modal p {
  font-size: 0.875rem;
  color: var(--text-muted);
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.actions {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
}

.actions button {
  padding: 0.625rem 1.25rem;
  border-radius: 8px;
  font-size: 0.875rem;
  cursor: pointer;
  border: none;
}

.actions .secondary {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  color: var(--text-color);
}

.actions .primary {
  background: var(--accent);
  color: white;
}

/* 遮罩层 */
[popover]::backdrop {
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  opacity: 0;
  transition: opacity 0.25s ease;
}

[popover]:popover-open::backdrop {
  opacity: 1;
}

@starting-style {
  [popover]:popover-open::backdrop {
    opacity: 0;
  }
}

/* 演示区域 */
.demo-section {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
}

.demo-section h3 {
  color: var(--text-color);
  font-size: 0.9375rem;
  font-weight: 600;
  margin-bottom: 1rem;
}
</style>
