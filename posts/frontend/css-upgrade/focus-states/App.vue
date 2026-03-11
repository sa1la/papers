<script setup>
import { ref } from 'vue'

const useKeyboard = ref(false)

function handleKeydown(event) {
  if (event.key === 'Tab') {
    useKeyboard.value = true
  }
}

function handleMouseDown() {
  useKeyboard.value = false
}
</script>

<template>
  <div
    class="focus-demo-root"
    :class="{ 'focus-demo-root--kbd': useKeyboard }"
    @keydown="handleKeydown"
    @mousedown="handleMouseDown"
  >
    <section class="panel">
      <h2>焦点状态管理</h2>
      <p>
        这个表单演示了
        <code>:focus-visible</code>
        和
        <code>:focus-within</code>
        的区别：
      </p>
      <ul>
        <li><span class="mono">:focus-visible</span>：仅在键盘导航时显示高亮焦点。</li>
        <li><span class="mono">.field-group:focus-within</span>：只要组内有元素获得焦点，整个区域一起高亮。</li>
      </ul>
      <p class="hint">
        尝试用鼠标点击输入框，再用
        <kbd>Tab</kbd>
        在字段间移动，对比视觉差异。
      </p>
    </section>

    <section class="form-shell" aria-label="示例表单">
      <form class="form">
        <div class="field-group">
          <label for="email">邮箱</label>
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
          >
        </div>

        <div class="field-group">
          <label for="password">密码</label>
          <input
            id="password"
            type="password"
            placeholder="至少 8 位字符"
          >
          <p class="field-hint">
            聚焦任意输入框时，整个分组都会因为
            <code>:focus-within</code>
            被高亮。
          </p>
        </div>

        <div class="actions">
          <button
            type="submit"
            class="primary-btn"
          >
            提交
          </button>
          <button
            type="button"
            class="ghost-btn"
          >
            取消
          </button>
        </div>
      </form>
    </section>
  </div>
</template>

<style scoped>
.focus-demo-root {
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(0, 1.6fr);
  gap: 1.5rem;
  align-items: stretch;
}

@media (max-width: 800px) {
  .focus-demo-root {
    grid-template-columns: minmax(0, 1fr);
  }
}

/* 浅色主题：面板与表单容器 */
.panel {
  border-radius: 16px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  padding: 1.25rem 1.4rem;
  background: rgba(0, 0, 0, 0.02);
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

/* 深色主题：iframe 用 data-theme，页面用 .dark */
.dark .panel,
[data-theme="dark"] .panel {
  border-color: rgba(120, 120, 120, 0.3);
  background: rgba(255, 255, 255, 0.02);
}

.panel h2 {
  font-weight: 300;
  font-size: 1.05rem;
  letter-spacing: 0.04em;
  text-transform: lowercase;
  color: var(--vp-c-text-1);
}

.panel p {
  font-size: 0.86rem;
  line-height: 1.7;
  color: var(--vp-c-text-2);
}

.panel ul {
  margin: 0.2rem 0 0;
  padding-left: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.panel li {
  font-size: 0.82rem;
  color: var(--vp-c-text-2);
}

.mono {
  font-family: var(--vp-font-family-mono);
  font-size: 0.8rem;
}

.panel code {
  font-family: var(--vp-font-family-mono);
  font-size: 0.8rem;
}

.hint {
  margin-top: 0.35rem;
  padding: 0.6rem 0.75rem;
  border-radius: 10px;
  border: 1px dashed rgba(0, 0, 0, 0.2);
  background: rgba(0, 0, 0, 0.02);
}

.dark .hint,
[data-theme="dark"] .hint {
  border-color: rgba(120, 120, 120, 0.4);
  background: rgba(255, 255, 255, 0.01);
}

kbd {
  font-family: var(--vp-font-family-mono);
  font-size: 0.75rem;
  padding: 0.12rem 0.4rem;
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.25);
}

.dark kbd,
[data-theme="dark"] kbd {
  border-color: rgba(120, 120, 120, 0.6);
}

.form-shell {
  border-radius: 16px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  padding: 1.2rem 1.3rem;
  background:
    radial-gradient(circle at top, rgba(0, 0, 0, 0.02), transparent 55%),
    linear-gradient(to bottom, rgba(0, 0, 0, 0.02), rgba(0, 0, 0, 0.04));
}

.dark .form-shell,
[data-theme="dark"] .form-shell {
  border-color: rgba(120, 120, 120, 0.3);
  background:
    radial-gradient(circle at top, rgba(255, 255, 255, 0.05), transparent 55%),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.02), rgba(0, 0, 0, 0.05));
}

.form {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}

/* 浅色主题：输入分组 */
.field-group {
  position: relative;
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  padding: 0.55rem 0.75rem 0.6rem;
  background: rgba(0, 0, 0, 0.04);
  transition:
    border-color 0.18s ease,
    box-shadow 0.18s ease,
    background-color 0.18s ease;
}

.field-group label {
  display: block;
  font-size: 0.78rem;
  text-transform: lowercase;
  letter-spacing: 0.08em;
  color: rgba(0, 0, 0, 0.7);
  margin-bottom: 0.3rem;
}

.field-group input {
  width: 100%;
  border: none;
  outline: none;
  background: transparent;
  color: rgba(0, 0, 0, 0.9);
  font-size: 0.86rem;
  padding: 0.15rem 0;
}

.field-group input::placeholder {
  color: rgba(0, 0, 0, 0.4);
}

.field-hint {
  margin: 0.4rem 0 0;
  font-size: 0.74rem;
  color: rgba(0, 0, 0, 0.55);
}

.field-group:focus-within {
  border-color: rgba(0, 0, 0, 0.25);
  box-shadow:
    0 0 0 1px rgba(0, 0, 0, 0.06),
    0 0 0 6px rgba(0, 0, 0, 0.04);
  background: rgba(0, 0, 0, 0.06);
}

/* 深色主题：输入分组 */
.dark .field-group,
[data-theme="dark"] .field-group {
  border-color: rgba(120, 120, 120, 0.5);
  background: rgba(10, 10, 10, 0.65);
}

.dark .field-group label,
[data-theme="dark"] .field-group label {
  color: rgba(240, 240, 240, 0.85);
}

.dark .field-group input,
[data-theme="dark"] .field-group input {
  color: rgba(240, 240, 240, 0.95);
}

.dark .field-group input::placeholder,
[data-theme="dark"] .field-group input::placeholder {
  color: rgba(200, 200, 200, 0.5);
}

.dark .field-hint,
[data-theme="dark"] .field-hint {
  color: rgba(220, 220, 220, 0.7);
}

.dark .field-group:focus-within,
[data-theme="dark"] .field-group:focus-within {
  border-color: rgba(180, 180, 180, 0.95);
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.09),
    0 0 0 6px rgba(255, 255, 255, 0.05);
  background: rgba(15, 15, 15, 0.95);
}

/* 仅在键盘导航时展示 :focus-visible 样式 */
.focus-demo-root--kbd input:focus-visible,
.focus-demo-root--kbd button:focus-visible {
  outline: 2px solid rgba(0, 0, 0, 0.5);
  outline-offset: 2px;
}

.dark .focus-demo-root--kbd input:focus-visible,
.dark .focus-demo-root--kbd button:focus-visible,
[data-theme="dark"] .focus-demo-root--kbd input:focus-visible,
[data-theme="dark"] .focus-demo-root--kbd button:focus-visible {
  outline-color: rgba(255, 255, 255, 0.85);
}

.actions {
  display: flex;
  gap: 0.6rem;
  margin-top: 0.3rem;
}

.primary-btn,
.ghost-btn {
  flex: 0 0 auto;
  padding: 0.45rem 1.1rem;
  border-radius: 999px;
  font-size: 0.8rem;
  font-family: var(--vp-font-family-mono);
  text-transform: lowercase;
  letter-spacing: 0.08em;
  cursor: pointer;
  transition: background-color 0.18s ease, border-color 0.18s ease, transform 0.12s ease;
}

/* 浅色主题：按钮 */
.primary-btn {
  border: 1px solid rgba(0, 0, 0, 0.15);
  background: rgba(0, 0, 0, 0.08);
  color: rgba(0, 0, 0, 0.9);
}

.primary-btn:hover {
  background: rgba(0, 0, 0, 0.12);
  transform: translateY(-1px);
}

.ghost-btn {
  border: 1px solid rgba(0, 0, 0, 0.2);
  background: transparent;
  color: rgba(0, 0, 0, 0.7);
}

.ghost-btn:hover {
  background: rgba(0, 0, 0, 0.05);
}

/* 深色主题：按钮 */
.dark .primary-btn,
[data-theme="dark"] .primary-btn {
  border-color: rgba(245, 245, 245, 0.9);
  background: rgba(245, 245, 245, 0.9);
  color: #111;
}

.dark .primary-btn:hover,
[data-theme="dark"] .primary-btn:hover {
  background: #fff;
}

.dark .ghost-btn,
[data-theme="dark"] .ghost-btn {
  border-color: rgba(180, 180, 180, 0.7);
  color: rgba(230, 230, 230, 0.95);
}

.dark .ghost-btn:hover,
[data-theme="dark"] .ghost-btn:hover {
  background: rgba(255, 255, 255, 0.05);
}
</style>
