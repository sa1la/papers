---
title: "CSS提升"
date: 2024-09-09T17:06:37+08:00
outline: "deep"
tags: ["frontend"]
category: frontend
draft: false
---

工作以来，我对 CSS 的掌握一直停留在对常见布局设计的实现上。在空白页面上描绘样式比较熟悉，但对已有和非常见样式的开发上就有些费劲。因此想对一些复杂场景的样式上做些整理，并学习些新的技巧。

这篇文章分为五个部分，从最新的 2024 特性到实战技巧，帮助你系统提升 CSS 能力。

## Part 1: 2024 现代 CSS 新特性

浏览器能力持续增强，以下新特性可以在特定场景下替代 JavaScript 方案。

### field-sizing：让表单元素自适应内容

使用 `field-sizing: content` 让 `<input>` 和 `<textarea>` 根据内容自动调整尺寸，无需 JavaScript。

```css
textarea, select, input {
  field-sizing: content;
}
```

> 适用于任何字体、字号、语言和书写模式。过去需要复杂计算的工作，现在一行代码搞定。

**浏览器支持**：Chrome 123+, Edge 123+, Safari（部分新版本），Firefox 暂不支持

**实战场景**：搜索框自动扩展、评论输入框随内容增高。

<VueDemo name="field-sizing" height="360px" />

### light-dark()：一行代码适配亮暗双主题

使用 `light-dark(light-color, dark-color)` 函数定义颜色变量，浏览器会自动根据系统主题或 `color-scheme` 设置选择对应的颜色值。

不再需要维护两套 CSS 变量，也不用写复杂的媒体查询。

```css
:root {
  color-scheme: light dark;
  --primary-color: light-dark(#333, #fafafa);
  --primary-background: light-dark(#e4e4e4, #121212);
  --highlight-color: light-dark(hotpink, lime);
}
```

**浏览器支持**：Chrome 123+, Edge 123+, Firefox 120+, Safari 17.5+

**降级方案**：使用 `@supports` 检测或先定义一套默认颜色再覆盖。

<VueDemo name="light-dark" height="520px" />

### @property：让 CSS 变量支持动画过渡

`@property` 允许你定义带有类型约束的 CSS 变量（如角度、百分比、颜色），这让原本无法过渡的属性（如渐变角度）也能实现平滑动画。

```css
@property --rotation {
  syntax: "<angle>";
  inherits: false;
  initial-value: 45deg;
}

.animated-gradient {
  background: linear-gradient(var(--rotation), red, blue);
  transition: --rotation 0.5s;
}

.animated-gradient:hover {
  --rotation: 180deg;
}
```

**浏览器支持**：Chrome 85+, Edge 85+, Firefox 128+, Safari 16.5+

**实战场景**：渐变旋转动画、动态边框效果、复杂交互状态。

更多用法参考 [MDN 文档](https://developer.mozilla.org/en-US/docs/Web/CSS/@property)。

<VueDemo name="at-property" height="460px" />

### @starting-style：新元素的入场动画起点

为新创建或新显示的元素定义动画初始状态，解决过去"元素一出现就已经是最终样式，看不到过渡效果"的问题。常用于弹窗、下拉菜单、消息提示等场景。

```css
.popup {
  opacity: 1;
  transform: scale(1);
  transition: opacity 0.3s, transform 0.3s;

  @starting-style {
    opacity: 0;
    transform: scale(0.8);
  }
}
```

**浏览器支持**：Chrome 117+, Edge 117+, Firefox 129+, Safari 17.5+

**实战场景**：Dialog 弹窗入场、Toast 消息滑入、下拉菜单展开。

<VueDemo name="starting-style" height="450px" />

### Scroll Snap 事件：监听滚动吸附状态

新增的 `scrollsnapchanging` 和 `scrollsnapchange` 事件让你可以实时感知滚动吸附的进度和最终落点，非常适合实现轮播图指示器或阅读进度提示。

```js
scroller.addEventListener('scrollsnapchanging', (event) => {
  console.log(event.snapTargetBlock)
  console.log(event.snapTargetInline)
})
```

**浏览器支持**：Chrome 129+, Edge 129+, Firefox 136+, Safari 暂未支持

**实战场景**：轮播图指示器同步、阅读进度条、图片画廊计数器。

更多细节参考 [Chrome Dev 的文档](https://chrome.dev/css-wrapped-2024/#scroll-snap-events)。

<VueDemo name="scroll-snap-events" height="420px" />

### accent-color：表单控件主题色

一行代码统一表单控件的品牌色：

```css
:root {
  accent-color: #ff6b6b; /* 影响 checkbox、radio、range、progress 等 */
}

/* 配合 color-scheme 使用 */
.form-dark {
  color-scheme: dark;
  accent-color: #4ecdc4;
}
```

**浏览器支持**：Chrome 93+, Edge 93+, Firefox 92+, Safari 15+

**实战场景**：快速统一表单品牌色、深色模式适配。

<VueDemo name="accent-color" height="420px" />

### color-mix()：颜色混合

在 CSS 中直接混合颜色，无需预处理器或手动计算：

```css
/* 基础混合 */
.mixed {
  color: color-mix(in srgb, blue 50%, white);
}

/* 创建色阶 */
:root {
  --primary: #6366f1;
  --primary-light: color-mix(in srgb, var(--primary) 70%, white);
  --primary-dark: color-mix(in srgb, var(--primary) 70%, black);
  --primary-muted: color-mix(in srgb, var(--primary) 50%, transparent);
}
```

**浏览器支持**：Chrome 111+, Edge 111+, Firefox 128+, Safari 16.2+

**实战场景**：动态生成色阶、主题色透明度变体、无需 CSS 变量预定义所有色调。

<VueDemo name="color-mix" height="460px" />

## Part 2: 布局进阶

现代 CSS 布局已从"hack 时代"进入"声明式时代"。

### CSS 嵌套：原生嵌套语法

CSS 现在支持原生的嵌套语法，无需预处理器：

```css
.card {
  background: white;

  /* 嵌套选择器 */
  & h2 {
    font-size: 1.5rem;
  }

  /* & 表示父选择器（类似 Sass） */
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  /* 嵌套媒体查询 */
  @media (min-width: 768px) {
    display: flex;
    gap: 1rem;
  }

  /* 组合选择器 */
  &.featured {
    border: 2px solid gold;
  }
}
```

**浏览器支持**：Chrome 112+, Edge 112+, Firefox 117+, Safari 16.5+

**注意事项**：

- 嵌套选择器必须以 `&`、`.`、`#`、`[`、`*`、`:`、`::` 开头，或以标签名开头（标签名需要 `&` 前缀，如 `& article`）
- 嵌套层级不宜过深，建议不超过 3 层

**实战场景**：组件级样式组织、减少选择器重复、原生 CSS 项目。

### CSS Grid：弹性网格布局

使用 `auto-fit` 和 `minmax()` 创建响应式网格，无需媒体查询。

```css
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}
```

**实战场景**：商品列表、图片画廊、卡片布局。

### 容器查询：比媒体查询更灵活的响应式

容器查询根据**容器尺寸**而非视口尺寸调整样式，更适合组件化开发。

```css
/* 定义容器 */
.card-container {
  container-type: inline-size;
  container-name: card; /* 可选：命名容器 */
}

/* 基于容器尺寸的查询 */
@container (min-width: 400px) {
  .card {
    display: flex;
    flex-direction: row;
  }
  .card img {
    width: 40%;
  }
}

@container (max-width: 399px) {
  .card {
    display: flex;
    flex-direction: column;
  }
}

/* 命名容器查询 */
@container card (min-width: 600px) {
  .card {
    font-size: 1.2rem;
  }
}
```

**浏览器支持**：Chrome 105+, Edge 105+, Firefox 110+, Safari 16+

**实战场景**：可复用组件（卡片在不同侧边栏/主内容区自动适配）、仪表板小部件。

<VueDemo name="container-queries" height="420px" />

### Flexbox：垂直居中的最佳实践

```css
/* 方法1：经典居中 */
.center {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 方法2：Grid 居中（更简洁） */
.center-grid {
  display: grid;
  place-items: center;
}
```

### 宽高比控制：aspect-ratio

```css
.video-container {
  width: 100%;
  aspect-ratio: 16 / 9;
}

/* 兼容性方案（旧浏览器） */
.legacy-aspect {
  position: relative;
  padding-bottom: 56.25%; /* 16:9 */
  height: 0;
}
.legacy-aspect > * {
  position: absolute;
  inset: 0;
}
```

**浏览器支持**：所有现代浏览器均支持 `aspect-ratio`。旧项目可使用 `padding-bottom` hack。

**实战场景**：视频播放器、图片容器、响应式头像。

### 滚动控制：Scroll Snap 完整指南

创建流畅的滚动吸附体验：

```css
.scroll-container {
  scroll-snap-type: y mandatory; /* 或 x mandatory/proximity */
  overflow-y: scroll;
  height: 100vh;
}

.scroll-item {
  scroll-snap-align: start; /* start | center | end */
  scroll-margin: 20px;      /* 滚动到元素时的边距 */
}

/* 考虑固定导航栏 */
html {
  scroll-padding-top: 80px;
  scroll-behavior: smooth;
}
```

**实战场景**：全屏滚动页面、图片轮播、步骤向导。

### 性能优化：contain 与 content-visibility

```css
/* 隔离布局计算，防止频繁重排 */
.widget {
  contain: layout paint;
}

/* 延迟渲染屏幕外内容，提升首屏性能 */
.long-list-item {
  content-visibility: auto;
  contain-intrinsic-size: auto 500px; /* 预估高度防止布局抖动，auto让浏览器记住实际高度 */
}
```

**浏览器支持**：`contain` 支持良好；`content-visibility` 需 Chrome 85+。

**实战场景**：长列表虚拟化替代方案、复杂组件隔离。

### 粘性页脚

**Flexbox 方案**：

```css
body {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

main {
  flex: 1; /* 主内容区域占满剩余空间 */
}
```

**Grid 方案（更现代）**：

```css
body {
  display: grid;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
}
```

### 级联层：@layer 管理样式优先级

`@layer` 允许你定义样式层的优先级顺序，解决特异性战争问题：

```css
/* 定义层的优先级顺序（越靠后优先级越高） */
@layer reset, base, components, utilities;

/* 在指定层中编写样式 */
@layer reset {
  * { margin: 0; padding: 0; }
}

@layer base {
  body { font-family: system-ui; }
}

@layer components {
  .btn { padding: 0.5rem 1rem; }
  .btn-primary { background: blue; }
}

@layer utilities {
  .hidden { display: none !important; }
}

/* 未指定层的样式优先级最高 */
.page-specific { background: white; }

/* 也可以内联定义层 */
@layer utilities {
  .text-center { text-align: center; }
}
```

**浏览器支持**：Chrome 99+, Edge 99+, Firefox 97+, Safari 15.4+

**实战场景**：

- 管理第三方库样式（将 Bootstrap 放在低优先级层）
- 组织设计系统（reset → base → components → utilities）
- 解决 `!important` 滥用问题

**优先级规则**：层优先级 > 特异性 > 源代码顺序

<VueDemo name="cascade-layers" height="480px" />

### 文本环绕：shape-outside

```css
.float-image {
  float: left;
  shape-outside: circle(50%);        /* 圆形环绕 */
  /* shape-outside: polygon(0 0, 100% 0, 50% 100%); */ /* 三角形 */
  shape-margin: 1em;                 /* 与文字的间距 */
  border-radius: 50%;
  width: 150px;
  height: 150px;
}
```

**浏览器支持**：所有现代浏览器。

**实战场景**：杂志风格排版、不规则图片环绕。

<VueDemo name="shape-outside" height="460px" />

### 滚动行为控制

```css
/* 防止滚动链（如弹窗内部滚动不触发页面滚动） */
.modal {
  overscroll-behavior: contain;
}

/* 完全禁止滚动回弹效果 */
.no-overscroll {
  overscroll-behavior: none;
}
```

### 逻辑属性：国际化布局

逻辑属性用抽象的 `inline`（行内方向）和 `block`（块级方向）替代物理方向，自动适配不同书写模式：

```css
/* 物理属性（ltr/rtl 需要分别处理） */
.sidebar {
  margin-left: 1rem;
  border-right: 1px solid gray;
}

/* 逻辑属性（自动适配书写方向） */
.sidebar {
  margin-inline-start: 1rem;  /* 行内起始边 */
  border-inline-end: 1px solid gray;  /* 行内结束边 */
}

/* 常用逻辑属性对照表 */
/* margin-left/right → margin-inline-start/end */
/* padding-top/bottom → padding-block-start/end */
/* border-left → border-inline-start */
/* width/height → inline-size/block-size */

/* 简写形式 */
.inset {
  inset-inline: 1rem;   /* 行内方向左右（或上下在垂直书写模式） */
  inset-block: 2rem;    /* 块级方向上下（或左右） */
}

/* 完整简写 */
.logical-box {
  padding-inline: 1rem 2rem;  /* 起始 结束 */
  padding-block: 0.5rem;      /* 起始和结束相同 */
  border-inline-width: 1px;
  margin-inline-start: auto;  /* 实现 flex/grid 中的右对齐（无论书写方向） */
}
```

**浏览器支持**：所有现代浏览器

**实战场景**：

- 多语言网站（阿拉伯语、希伯来语 RTL 布局）
- 垂直书写模式（日语传统排版）
- 编写可复用的国际化组件

## Part 3: 文字排版精修

### 响应式字体：clamp() 与视口单位

使用 `clamp()` 设置字体大小的最小值、推荐值和最大值：

```css
.responsive-text {
  font-size: clamp(1rem, 2.5vw, 1.5rem);
  /* 最小 1rem，推荐 2.5vw，最大 1.5rem */
}
```

**实战场景**：标题自适应、大段落阅读优化。

<VueDemo name="clamp-typography" height="400px" />

### 可变字体：font-variation-settings

使用可变字体（Variable Fonts）可以仅加载一个字体文件，通过轴参数微调样式：

```css
.variable-font {
  font-variation-settings: 'wght' 400, 'wdth' 100, 'slnt' -10;
  /* wght: 字重, wdth: 字宽, slnt: 倾斜 */
  transition: font-variation-settings 0.3s;
}

.variable-font:hover {
  font-variation-settings: 'wght' 700;
}
```

**浏览器支持**：所有现代浏览器，需配合可变字体文件。

### 排版细节精修

```css
/* 限制行宽提升可读性（每行45-75字符最佳） */
.readable {
  max-width: 65ch;
}

/* 自动连字符（需设置 lang 属性） */
.hyphenated {
  hyphens: auto;
  text-align: justify;
}

/* 小型大写字母 */
.small-caps {
  font-variant: small-caps;
}

/* 数字排版样式 */
.tabular-nums {
  font-variant-numeric: tabular-nums; /* 等宽数字，适合表格 */
}
.oldstyle-nums {
  font-variant-numeric: oldstyle-nums; /* 旧式数字（高低错落） */
}

/* 文本渲染优化 */
body {
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* 自定义列表标记 */
li::marker {
  color: var(--accent-color);
  font-size: 1.2em;
}

/* 首字下沉 */
.drop-cap::first-letter {
  float: left;
  font-size: 3em;
  line-height: 0.8;
  margin-right: 0.1em;
}

/* 下划线微调 */
.underline {
  text-decoration: underline;
  text-decoration-thickness: 2px;
  text-underline-offset: 0.3em;
  text-decoration-skip-ink: auto; /* 跳过字符笔画 */
}
```

### 文字描边效果

```css
.outlined-text {
  -webkit-text-stroke: 2px black;
  color: transparent; /* 或保留填充色 */
}
```

### 文字渐变

```css
.gradient-text {
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text; /* 标准属性 */
}
```

### OpenType 特性

```css
.ligatures {
  font-feature-settings: "liga" 1, "dlig" 1; /* 标准 / 自由连字 */
}

/* 或使用属性简写 */
.ligatures-modern {
  font-variant-ligatures: common-ligatures discretionary-ligatures;
}
```

### 字体加载优化

```css
@font-face {
  font-family: 'CustomFont';
  src: url('font.woff2') format('woff2');
  font-display: swap; /* 避免 FOIT，先显示后备字体 */
  /* font-optical-sizing 默认为 auto，可变字体会根据字号自动调整光学尺寸 */
}

/* 如需关闭光学尺寸调整（特殊情况） */
.no-optical-sizing {
  font-optical-sizing: none;
}
```

### 垂直文本

```css
.vertical-text {
  writing-mode: vertical-rl;
  text-orientation: upright; /* 或 mixed */
}
```

## Part 4: 视觉与交互

### 背景和渐变

```css
/* 圆锥渐变 */
.conic-bg {
  background: conic-gradient(from 0deg, red, yellow, lime, blue, red);
}

/* 多个背景叠加 */
.multi-bg {
  background:
    url('pattern.png') repeat,
    linear-gradient(to bottom, rgba(0, 0, 0, 0.5), transparent),
    url('photo.jpg') center/cover;
}

/* 使用 CSS 变量的渐变过渡（配合 @property） */
@property --gradient-start {
  syntax: "<color>";
  inherits: false;
  initial-value: red;
}

.animated-gradient {
  background: linear-gradient(var(--gradient-start), blue);
  transition: --gradient-start 0.3s;
}
.animated-gradient:hover {
  --gradient-start: orange;
}
```

### 混合模式与遮罩

```css
/* 颜色混合 */
.blend-multiply {
  mix-blend-mode: multiply; /* 正片叠底 */
}
.blend-overlay {
  mix-blend-mode: overlay;
}

/* 图像遮罩 */
.masked-image {
  mask-image: url('mask.svg');
  mask-size: cover;
  -webkit-mask-image: url('mask.svg'); /* Safari */
}

/* 毛玻璃效果 */
.glass {
  backdrop-filter: blur(10px) saturate(180%);
  background-color: rgba(255, 255, 255, 0.7);
}
```

### Popover API

原生弹层 API，配合 `@starting-style` 实现完美动画：

```html
<!-- 触发按钮 -->
<button popovertarget="my-popover">打开</button>

<!-- 弹层元素 -->
<div id="my-popover" popover>内容</div>
```

```css
@starting-style {
  [popover] {
    opacity: 0;
    transform: scale(0.95);
  }
}

[popover] {
  /* 默认居中，可通过锚点定位调整 */
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  transition: opacity 0.2s, transform 0.2s;
}

/* 打开状态用 :popover-open 区分，便于与初始/关闭状态做动画 */
[popover]:popover-open {
  opacity: 1;
  transform: scale(1);
}

/* ::backdrop 控制遮罩层 */
[popover]::backdrop {
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(2px);
}
```

> 实际项目中边框与遮罩建议用主题变量（如 `var(--card-border)`）以适配亮/暗色。

**浏览器支持**：Chrome 114+, Edge 114+, Firefox 125+, Safari 17+

**特性**：

- `popover="auto"`：自动关闭其他 popover，点击外部关闭
- `popover="manual"`：完全手动控制，适合复杂交互
- 触发按钮可加 `popovertargetaction="hide"` 或 `"toggle"` 控制关闭/切换（如「知道了」「取消」按钮）
- 打开状态样式用 `[popover]:popover-open` 选择器，便于与关闭/初始状态区分做动画
- 自动处理焦点管理、ESC 键关闭、可访问性

<VueDemo name="popover-api" height="520px" />

### 焦点状态管理

```css
/* 仅键盘导航时显示焦点样式 */
button:focus-visible {
  outline: 2px solid blue;
  outline-offset: 2px;
}

/* 表单容器焦点状态 */
.form-group:focus-within {
  border-color: blue;
  box-shadow: 0 0 0 3px rgba(0, 0, 255, 0.1);
}

/* 自定义选择文本颜色 */
::selection {
  background: #ff6b6b;
  color: white;
}
```

<VueDemo name="focus-states" height="360px" />

### 图像处理

```css
/* 保持比例填充 */
.cover-image {
  object-fit: cover;
  object-position: center;
}

/* 像素风格（适合小图标放大） */
.pixelated {
  image-rendering: pixelated;
}

/* 多列布局中的跨列标题 */
.span-all {
  column-span: all;
}
```

## Part 5: 实用工具类

### 选择器技巧

```css
/* 简化多元素选择 */
:is(h1, h2, h3) {
  color: blue;
}

/* :has() - 父选择器（选择包含特定子元素的父元素） */
.card:has(img) {
  /* 只选中包含图片的卡片 */
}

.form-group:has(:focus) {
  /* 包含聚焦元素的表单组 */
}

/* 排除特定元素 */
button:not(:disabled) {
  cursor: pointer;
}

/* 更复杂的排除 */
article :not(h2, h3, p) {
  /* 选中 article 内除了 h2, h3, p 的所有元素 */
}

/* 空元素处理 */
div:empty {
  display: none;
}

/* 子串匹配属性选择器 */
a[href*="example"] { }
a[href^="https"] { }
a[href$=".pdf"] { }
```

### 辅助功能

```css
/* 屏幕阅读器专用文本 */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* 可见时占据空间但不可见 */
.invisible {
  visibility: hidden;
}
```

### 文本截断

```css
/* 单行截断 */
.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 多行截断 */
.line-clamp {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 标准属性（Chrome 132+, Firefox 138+） */
.line-clamp-standard {
  display: block; /* 或 -webkit-box（兼容旧版） */
  line-clamp: 3;
}
```

<VueDemo name="text-clamp" height="420px" />

### CSS 计数器

```css
/* 自动编号 */
ol {
  counter-reset: section;
}

li::before {
  counter-increment: section;
  content: counter(section) ". ";
}

/* 嵌套列表编号（如 1.1, 1.2, 2.1） */
.nested-list {
  counter-reset: item;
}

.nested-list li {
  counter-increment: item;
}

.nested-list li::before {
  content: counters(item, ".") " "; /* 使用 counters() 连接嵌套层级 */
  font-weight: bold;
}

/* 使用属性值作为内容 */
.tooltip::after {
  content: attr(data-tooltip);
}
```

<VueDemo name="css-counters" height="480px" />

### CSS 变量计算

```css
:root {
  --base-size: 16px;
  --spacing-unit: 0.5rem;
}

.component {
  font-size: calc(var(--base-size) * 1.5);
  padding: calc(var(--spacing-unit) * 4);
}

/* 使用 min/max/clamp */
.responsive-width {
  width: min(100% - 2rem, 1200px);
  margin-inline: auto;
}
```

### 斑马纹效果

```css
li:nth-child(odd) {
  background: #f5f5f5;
}

/* 或使用更精确的选择 */
tr:nth-child(2n+1) {
  background: hsl(0 0% 96%);
}
```

### 安全区域（移动端刘海屏）

```css
.safe-area {
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
}
```

## 附录：浏览器支持速查表

### 2024 新特性

| 特性                 | Chrome | Edge | Firefox | Safari |
| -------------------- | ------ | ---- | ------- | ------ |
| `field-sizing`       | 123+   | 123+ | ❌      | 部分版本 |
| `light-dark()`       | 123+   | 123+ | 120+    | 17.5+  |
| `@property`          | 85+    | 85+  | 128+    | 16.5+  |
| `@starting-style`    | 117+   | 117+ | 129+    | 17.5+  |
| `scrollsnapchanging` | 129+   | 129+ | 136+    | ❌     |

### 常用特性

| 特性                      | 支持情况                                | 备注                  |
| ------------------------- | --------------------------------------- | --------------------- |
| **CSS Nesting**           | Chrome 112+, Firefox 117+, Safari 16.5+ | -                     |
| **Cascade Layers**        | Chrome 99+, Firefox 97+, Safari 15.4+   | `@layer`              |
| **Popover API**           | Chrome 114+, Firefox 125+, Safari 17+   | -                     |
| `:has()`                  | Chrome 105+, Firefox 121+, Safari 15.4+ | -                     |
| `@container`              | Chrome 105+, Firefox 110+, Safari 16+   | -                     |
| `accent-color`            | Chrome 93+, Firefox 92+, Safari 15+     | -                     |
| `color-mix()`             | Chrome 111+, Firefox 128+, Safari 16.2+ | -                     |
| **Logical Properties**    | 全支持                                  | `inline/block`        |
| `aspect-ratio`            | 全支持                                  | -                     |
| `content-visibility`      | Chrome 85+                              | Firefox 暂不支持      |
| `clamp()`                 | 全支持                                  | -                     |
| `min/max()`               | 全支持                                  | -                     |
| `backdrop-filter`         | 全支持                                  | Firefox 103+ 默认开启 |
| `mask`                    | 需前缀                                  | Safari 用 `-webkit-`  |
| `shape-outside`           | 全支持                                  | -                     |
| `font-variation-settings` | 全支持                                  | 需可变字体            |
| `text-stroke`             | 需前缀                                  | 用 `-webkit-`         |
| `line-clamp`              | 标准属性：Chrome 132+, Firefox 138+     | 旧版用 `-webkit-`     |

### 检测支持情况

```css
/* 特性检测 */
@supports (field-sizing: content) {
  /* 支持时的样式 */
}

@supports not (field-sizing: content) {
  /* 不支持时的回退 */
}

/* JavaScript 检测 */
if (CSS.supports('field-sizing', 'content')) {
  // 支持
}
```
