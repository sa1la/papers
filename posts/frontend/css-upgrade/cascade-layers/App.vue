<script setup>
// 级联层演示 - 纯 CSS 展示，无需 JS 逻辑
</script>

<template>
  <div class="container">
    <div class="demo-section">
      <h3>@layer 优先级演示</h3>
      <p class="desc">
        同一类名写在不同层里时，靠后的层会覆盖前面的层；未分层样式优先级最高
      </p>
      <section class="buttons-group">
        <h4 class="group-title">
          分层按钮（不同层，不同外观）
        </h4>
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
            无层（未使用 @layer，优先级最高）
          </button>
        </div>
      </section>

      <section class="buttons-group">
        <h4 class="group-title">
          同一类名，不同层覆盖
        </h4>
        <div class="buttons">
          <button class="layered-btn">
            .layered-btn（最终来自 components 层）
          </button>
        </div>
        <p class="hint">
          同一个选择器在多个层中出现时：reset → base → components → utilities，靠后的层会覆盖前面的层
        </p>
      </section>
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

.buttons-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.group-title {
  font-size: 0.75rem;
  font-weight: 400;
  text-transform: lowercase;
  letter-spacing: 0.08em;
  color: var(--text-muted);
}

.hint {
  margin-top: 0.25rem;
  font-size: 0.75rem;
  color: var(--text-muted);
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

  /* 同一类名在更高层覆盖前一层 */
  .layered-btn {
    background: var(--accent-3);
    color: #0d0d0d;
    border-color: var(--accent-3);
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
  font-weight: 500;
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
