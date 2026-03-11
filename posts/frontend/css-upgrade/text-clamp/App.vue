<script setup>
import { computed, ref } from 'vue'

const mode = ref('single')

const modeLabel = computed(() => {
  switch (mode.value) {
    case 'single':
      return '单行截断'
    case 'webkit':
      return '多行截断（-webkit-line-clamp）'
    case 'standard':
      return '多行截断（标准 line-clamp）'
    default:
      return ''
  }
})
</script>

<template>
  <div class="clamp-root">
    <section class="panel">
      <h2>文本截断对比</h2>
      <p>
        同一段长文本在不同截断方式下的表现：
        <code>.truncate</code>
       、
        <code>-webkit-line-clamp</code>
        和
        <code>line-clamp</code>
       。
      </p>

      <div class="modes">
        <button
          type="button"
          class="mode"
          :class="{ 'mode--active': mode === 'single' }"
          @click="mode = 'single'"
        >
          单行
        </button>
        <button
          type="button"
          class="mode"
          :class="{ 'mode--active': mode === 'webkit' }"
          @click="mode = 'webkit'"
        >
          多行（-webkit）
        </button>
        <button
          type="button"
          class="mode"
          :class="{ 'mode--active': mode === 'standard' }"
          @click="mode = 'standard'"
        >
          多行（标准）
        </button>
      </div>

      <p class="hint">
        当前模式：
        <span class="tag">{{ modeLabel }}</span>
        。尝试缩放窗口宽度，留意文本换行与省略号的位置变化。
      </p>
    </section>

    <section class="list-shell">
      <div class="list">
        <article
          v-for="index in 3"
          :key="index"
          class="item"
        >
          <header class="item-header">
            <span class="badge">case {{ index }}</span>
            <span class="meta">line {{ mode === 'single' ? '1' : '3' }}</span>
          </header>
          <p
            class="item-text"
            :class="{
              'is-single': mode === 'single',
              'is-webkit': mode === 'webkit',
              'is-standard': mode === 'standard',
            }"
          >
            某些产品描述、通知文案或者用户评论会非常长，如果不做限制，会在卡片里占据过多空间，影响整体排版和可读性。合理地使用 line-clamp
            可以在保证信息量的前提下，防止列表高度失控，同时通过 hover 或进入详情页展示完整内容。
          </p>
        </article>
      </div>
    </section>
  </div>
</template>

<style scoped>
.clamp-root {
  display: grid;
  grid-template-columns: minmax(0, 1.35fr) minmax(0, 1.65fr);
  gap: 1.5rem;
  align-items: stretch;
}

@media (max-width: 800px) {
  .clamp-root {
    grid-template-columns: minmax(0, 1fr);
  }
}

.panel {
  border-radius: 16px;
  border: 1px solid rgba(120, 120, 120, 0.3);
  padding: 1.25rem 1.4rem;
  background: rgba(255, 255, 255, 0.02);
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
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

.panel code {
  font-family: var(--vp-font-family-mono);
  font-size: 0.8rem;
}

.modes {
  display: inline-flex;
  gap: 0.35rem;
  flex-wrap: wrap;
  margin-top: 0.15rem;
}

.mode {
  padding: 0.25rem 0.7rem;
  border-radius: 999px;
  border: 1px solid rgba(120, 120, 120, 0.6);
  background: transparent;
  font-size: 0.8rem;
  font-family: var(--vp-font-family-mono);
  text-transform: lowercase;
  letter-spacing: 0.08em;
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: background-color 0.16s ease, border-color 0.16s ease, color 0.16s ease, transform 0.1s ease;
}

.mode--active {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(220, 220, 220, 0.9);
  color: var(--vp-c-text-1);
  transform: translateY(-1px);
}

.hint {
  margin-top: 0.3rem;
  padding: 0.6rem 0.75rem;
  border-radius: 10px;
  border: 1px dashed rgba(120, 120, 120, 0.4);
  background: rgba(255, 255, 255, 0.01);
}

.tag {
  font-family: var(--vp-font-family-mono);
  font-size: 0.8rem;
  text-transform: lowercase;
  letter-spacing: 0.08em;
  padding: 0.16rem 0.5rem;
  border-radius: 999px;
  border: 1px solid rgba(120, 120, 120, 0.5);
}

.list-shell {
  border-radius: 16px;
  border: 1px solid rgba(120, 120, 120, 0.3);
  padding: 1.1rem 1.2rem;
  background:
    radial-gradient(circle at top, rgba(255, 255, 255, 0.05), transparent 55%),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.02), rgba(0, 0, 0, 0.05));
}

.list {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.item {
  padding: 0.6rem 0.7rem;
  border-radius: 12px;
  border: 1px solid rgba(120, 120, 120, 0.5);
  background: rgba(10, 10, 10, 0.9);
}

.item-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.35rem;
}

.badge {
  font-family: var(--vp-font-family-mono);
  font-size: 0.75rem;
  text-transform: lowercase;
  letter-spacing: 0.08em;
  color: rgba(230, 230, 230, 0.9);
}

.meta {
  font-size: 0.75rem;
  color: rgba(200, 200, 200, 0.7);
}

.item-text {
  margin: 0;
  font-size: 0.86rem;
  line-height: 1.7;
  color: rgba(235, 235, 235, 0.92);
}

/* 单行截断 */
.is-single {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* WebKit 多行截断 */
.is-webkit {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 标准 line-clamp（新特性） */
.is-standard {
  display: block;
  line-clamp: 3;
  overflow: hidden;
}
</style>

