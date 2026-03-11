<script setup>
import { ref } from 'vue'

const autoInput = ref('')
const autoTextarea = ref('')

function handleInput(e) {
  const target = e.target
  target.style.borderColor = 'var(--accent)'
  setTimeout(() => {
    target.style.borderColor = ''
  }, 300)
}
</script>

<template>
  <div class="container">
    <div class="demo-section">
      <h3>传统固定尺寸</h3>
      <input
        type="text"
        class="fixed-input"
        placeholder="输入内容看看..."
        value="这是一段比较长的文本内容，会被截断"
      >
      <textarea class="fixed-textarea" rows="3" placeholder="输入多行内容...">
这是一个传统的 textarea，高度固定为3行。当你输入更多内容时，会出现滚动条而不是自动扩展高度。</textarea>
    </div>

    <div class="demo-section">
      <h3>field-sizing: content 自适应</h3>
      <input
        v-model="autoInput"
        type="text"
        class="auto-input"
        placeholder="输入内容，宽度会自适应..."
        @input="handleInput"
      >
      <textarea
        v-model="autoTextarea"
        class="auto-textarea"
        placeholder="输入多行内容，高度会自动扩展..."
        @input="handleInput"
      />
    </div>

    <div class="hint">
      <span class="dot" />
      在自适应输入框中输入内容，观察尺寸变化
    </div>
  </div>
</template>

<style scoped>
/* Use --accent instead of --accent-color for consistency */
:root {
  --input-bg: rgba(255, 255, 255, 0.05);
  --input-border: rgba(255, 255, 255, 0.2);
  --input-focus: var(--accent);
}

:root[data-theme="light"] {
  --input-bg: rgba(0, 0, 0, 0.03);
  --input-border: rgba(0, 0, 0, 0.2);
  --input-focus: var(--accent);
}

.demo-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

input,
textarea {
  padding: 0.75rem 1rem;
  border: 1px solid var(--input-border);
  border-radius: 8px;
  background: var(--input-bg);
  color: var(--text-color);
  font-size: 0.9rem;
  transition: border-color 0.2s, box-shadow 0.2s;
}

input:focus,
textarea:focus {
  outline: none;
  border-color: var(--input-focus);
  box-shadow: 0 0 0 2px var(--input-focus) / 20%;
}

input::placeholder,
textarea::placeholder {
  color: var(--text-muted);
}

/* 传统固定尺寸 */
.fixed-input {
  width: 200px;
}

.fixed-textarea {
  width: 100%;
  min-height: 80px;
  resize: none;
}

/* field-sizing: content 自适应 */
.auto-input {
  field-sizing: content;
  width: auto;              /* 根据内容决定宽度 */
  align-self: flex-start;   /* 防止在 flex 容器中 stretch 占满 */
  min-width: 150px;
  max-width: 100%;
}

.auto-textarea {
  field-sizing: content;
  width: 100%;
  min-height: 80px;
  resize: none;
}

.hint {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-muted);
  font-size: 0.8rem;
  padding: 0.5rem 0;
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>
