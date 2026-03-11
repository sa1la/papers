<script setup>
// 级联层演示 - 纯 CSS 展示，无需 JS 逻辑
</script>

<template>
  <div class="container">
    <div class="demo-section">
      <h3>@layer 优先级演示</h3>
      <p class="desc">
        不同层中的相同样式，层顺序决定优先级
      </p>
      <div class="buttons">
        <button class="btn-base">
          base 层
        </button>
        <button class="btn-components">
          components 层
        </button>
        <button class="btn-utilities">
          utilities 层
        </button>
        <button class="btn-unlayered">
          无层 (最高)
        </button>
      </div>
    </div>

    <div class="demo-section">
      <h3>层顺序控制</h3>
      <div class="layers-order">
        <div class="layer">
          <code>@layer reset</code>
          <span>最低</span>
        </div>
        <div class="arrow">
          ↓
        </div>
        <div class="layer">
          <code>@layer base</code>
        </div>
        <div class="arrow">
          ↓
        </div>
        <div class="layer">
          <code>@layer components</code>
        </div>
        <div class="arrow">
          ↓
        </div>
        <div class="layer">
          <code>@layer utilities</code>
          <span>层内最高</span>
        </div>
        <div class="arrow highlight">
          ↓
        </div>
        <div class="layer unlayered">
          <code>未指定层</code>
          <span>全局最高</span>
        </div>
      </div>
    </div>

    <div class="code-hint">
      <code>@layer reset, base, components, utilities;</code>
    </div>
  </div>
</template>

<style scoped>
.desc {
  color: var(--text-muted);
  font-size: 0.875rem;
  margin-bottom: 1rem;
}

/* 定义层优先级顺序 */
@layer reset, base, components, utilities;

/* reset 层 */
@layer reset {
  button {
    background: transparent;
    border: 1px solid var(--card-border);
    color: var(--text-muted);
    padding: 0.5rem 1rem;
    border-radius: 6px;
    font-size: 0.875rem;
    cursor: pointer;
  }
}

/* base 层 */
@layer base {
  .btn-base {
    background: var(--card-bg);
    color: var(--text-color);
  }
}

/* components 层 */
@layer components {
  .btn-components {
    background: var(--accent);
    color: white;
    border-color: var(--accent);
  }
}

/* utilities 层 */
@layer utilities {
  .btn-utilities {
    background: var(--accent-2);
    color: #0d0d0d;
    border-color: var(--accent-2);
    font-weight: 600;
  }
}

/* 未指定层 - 优先级最高 */
.btn-unlayered {
  background: var(--accent-4);
  color: white;
  border-color: var(--accent-4);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* 按钮布局 */
.buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

/* 层顺序可视化 */
.layers-order {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.layer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: 8px;
  border-left: 3px solid var(--accent);
}

.layer code {
  color: var(--text-color);
  font-size: 0.8125rem;
}

.layer span {
  color: var(--text-muted);
  font-size: 0.75rem;
}

.layer.unlayered {
  border-left-color: var(--accent-4);
  background: rgba(232, 154, 180, 0.1);
}

.layer.unlayered code {
  color: var(--accent-4);
  font-weight: 600;
}

.arrow {
  text-align: center;
  color: var(--text-muted);
  font-size: 0.875rem;
}

.arrow.highlight {
  color: var(--accent-4);
  font-weight: 600;
}
</style>
