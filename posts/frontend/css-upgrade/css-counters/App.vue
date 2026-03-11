<script setup>
// CSS 计数器演示 - 纯 CSS 展示
</script>

<template>
  <div class="container">
    <div class="demo-section">
      <h3>嵌套列表自动编号（1.1, 1.2, 2.1）</h3>

      <ol class="nested-counter">
        <li>
          第一章：CSS 基础
          <ol>
            <li>选择器语法</li>
            <li>盒模型</li>
            <li>定位与浮动</li>
          </ol>
        </li>
        <li>
          第二章：布局技术
          <ol>
            <li>Flexbox 弹性布局</li>
            <li>Grid 网格布局</li>
            <li>响应式设计</li>
          </ol>
        </li>
        <li>
          第三章：动画与交互
          <ol>
            <li>过渡动画</li>
            <li>关键帧动画</li>
          </ol>
        </li>
      </ol>
    </div>

    <div class="demo-section">
      <h3>章节标题自动编号</h3>

      <div class="chapter-demo">
        <h2>引言</h2>
        <p>这是文章的引言部分...</p>

        <h2>背景介绍</h2>
        <p>介绍相关的历史背景...</p>

        <h2>核心概念</h2>
        <p>详细阐述核心概念...</p>

        <h2>实践应用</h2>
        <p>展示实际应用案例...</p>

        <h2>总结</h2>
        <p>总结全文要点...</p>
      </div>
    </div>

    <div class="code-hint">
      <code>content: counters(item, ".") " ";</code>
    </div>
  </div>
</template>

<style scoped>
/* 嵌套列表自动编号 */
.nested-counter {
  counter-reset: section;
  list-style: none;
  padding-left: 0;
}

.nested-counter > li {
  counter-increment: section;
  margin-bottom: 0.75rem;
}

.nested-counter > li::before {
  content: counter(section) ". ";
  font-weight: 600;
  color: var(--accent);
}

/* 子列表 */
.nested-counter ol {
  counter-reset: subsection;
  list-style: none;
  padding-left: 1.5rem;
  margin-top: 0.5rem;
}

.nested-counter ol li {
  counter-increment: subsection;
  margin-bottom: 0.375rem;
  color: var(--text-muted);
  font-size: 0.875rem;
}

.nested-counter ol li::before {
  content: counters(section, ".") "." counter(subsection) " ";
  font-weight: 500;
  color: var(--text-color);
}

/* 章节标题编号 */
.chapter-demo {
  counter-reset: chapter;
}

.chapter-demo h2 {
  counter-increment: chapter;
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-color);
  margin-top: 1rem;
  margin-bottom: 0.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--card-border);
}

.chapter-demo h2:first-child {
  margin-top: 0;
}

.chapter-demo h2::before {
  content: "第 " counter(chapter) " 章：";
  color: var(--accent);
}

.chapter-demo p {
  color: var(--text-muted);
  font-size: 0.875rem;
  line-height: 1.6;
  margin-bottom: 1rem;
}

/* 列表项悬停效果 */
.nested-counter li {
  transition: color 0.2s;
}

.nested-counter li:hover {
  color: var(--text-color);
}
</style>
