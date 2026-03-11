<script setup>
// shape-outside 演示 - 纯 CSS 展示
</script>

<template>
  <div class="container">
    <div class="demo-section">
      <h3>圆形环绕</h3>
      <div class="shape-demo circle-demo">
        <div class="float-shape circle" />
        <p>
          CSS 的 shape-outside 属性允许你控制文本如何环绕浮动元素。通过设置形状，可以创建杂志风格的精美排版效果。这个圆形示例展示了最基本的 shape-outside 用法。
        </p>
        <p>
          过去要实现这种效果需要复杂的图片遮罩或者 SVG 方案，现在只需一行 CSS 代码即可。shape-outside 支持多种形状：circle()、ellipse()、polygon() 和 url() 引用图片。
        </p>
      </div>
    </div>

    <div class="demo-section">
      <h3>多边形环绕</h3>
      <div class="shape-demo polygon-demo">
        <div class="float-shape triangle" />
        <p>
          使用 polygon() 函数可以创建任意多边形形状。这个三角形示例使用三个坐标点定义形状边界。
        </p>
        <p>
          polygon() 接受一系列坐标对，格式为 "x y, x y, x y"。坐标值可以是百分比或具体长度。配合 shape-margin 属性可以控制文本与形状之间的间距。
        </p>
      </div>
    </div>

    <div class="code-hint">
      <code>shape-outside: circle(50%); shape-margin: 1em;</code>
    </div>
  </div>
</template>

<style scoped>
.shape-demo {
  overflow: hidden;
  /* 收窄行宽，让文本更明显地绕过形状 */
  max-width: 520px;
}

.shape-demo p {
  color: var(--text-color);
  font-size: 0.875rem;
  line-height: 1.8;
  margin-bottom: 1rem;
}

.shape-demo p:last-child {
  margin-bottom: 0;
}

/* 浮动形状基础样式 */
.float-shape {
  float: left;
  margin-right: 1.5rem;
  margin-bottom: 1rem;
  width: 140px;
  height: 140px;
}

/* 圆形 */
.float-shape.circle {
  background: linear-gradient(135deg, var(--accent), var(--accent-4));
  border-radius: 50%;
  shape-outside: circle(50%);
  shape-margin: 1rem;
}

/* 三角形多边形 */
.float-shape.triangle {
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, var(--accent-2), var(--accent-3));
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
  shape-outside: polygon(50% 0%, 0% 100%, 100% 100%);
  shape-margin: 0.75rem;
}

/* 演示区域 */
.circle-demo,
.polygon-demo {
  padding: 1rem;
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: 12px;
}

/* 响应式调整 */
@media (max-width: 400px) {
  .float-shape {
    width: 80px;
    height: 80px;
  }

  .float-shape.triangle {
    width: 70px;
    height: 70px;
  }

  .shape-demo p {
    font-size: 0.8125rem;
  }
}
</style>
