---
title: "CSS提升"
date: 2023-09-09T17:06:37+08:00
outline: "deep"
tags: ["frontend"]
category: frontend
draft: false
---

工作以来，我对 css 的掌握一直停留在对常见布局设计的实现上。我在空白页面上描绘样式比较熟悉，但对已有和非常见样式的开发上就有些费劲。因此想对一些复杂场景的样式上做些整理，并学习些新的技巧。

---

#### 输入框根据内容自适应

```css
textarea, select, input {
  field-sizing: content;
}
```

> This will work for any font, any font size, any language and any writing mode. What used to be high effort will now be low effort.

#### 可以通过今年新增的元素内部滚动条滚动事件控制元素内容展示，详细见[页面](https://chrome.dev/css-wrapped-2024/#scroll-snap-events)

```js
scroller.addEventListener('scrollsnapchanging', (event) => {
  // eslint-disable-next-line no-console
  console.log(event.snapTargetBlock)
  // eslint-disable-next-line no-console
  console.log(event.snapTargetInline)
})
```

#### 可以用新增的light-dark()来对某个属性进行亮色和暗色的适配

```css
:root {
  color-scheme: light dark;
  --primary-color: light-dark(#333, #fafafa);
  --primary-background: light-dark(#e4e4e4, #121212);
  --highlight-color: light-dark(hotpink, lime);
}
```

#### [@property](https://developer.mozilla.org/en-US/docs/Web/CSS/@property)

可以用来做样式属性的公共值

```css
@property --rotation {
  syntax: "<angle>";
  inherits: false;
  initial-value: 45deg;
}
```

#### @starting-style

用来对新增的元素初始样式

```css
div {
  transition: background-color 0.5s;
  background-color: transparent;

  @starting-style {
    background-color: yellow;
  }
}
```

#### 设置宽高比例（Aspect Ratio）

通过 aspect-ratio 属性，可以根据指定的宽度自动调整高度（反之亦然）。

```css
.box {
  width: 90%;
  aspect-ratio: 16/9;
}
```

适合用在视频播放器或图片容器中，确保它们以正确的比例呈现。

#### 另一种居中对齐

```css
.box {
  display: grid;
  place-items: center;
}
```

#### 限制文本宽度（Limit Text Width）

通过限制每行文本的最大字符数，提升可读性：

```css
p {
  max-width: 100ch;
}
```

“ch” 单位表示一个字符的宽度，非常适合用于段落样式。

#### ::target-text 用于文本高亮显示

```css
 ::target-text {
   background-color: yellow;
 }
```

#### transition

可以用来给一些样式添加过渡效果。常见的transition属性包括：

- color: 颜色变化
- background-color: 背景色变化
- border-color: 边框颜色变化
- text-decoration-color: 文本装饰颜色变化
- fill: SVG填充颜色变化
- stroke: SVG描边颜色变化
- opacity: 透明度变化
- box-shadow: 阴影变化
- transform: 变形效果
- filter: 滤镜效果
- backdrop-filter: 背景滤镜效果

示例:

```css
.button {
  background-color: blue;
  transition: background-color 0.3s ease;
}

.button:hover {
  background-color: red;
}
```

### **字体调整和文字样式**

#### 用于响应式排版的视口单位

使用视口单位（vw、vh、vmin、vmax）调整字体大小。例如：

```css
h1 {
  font-size: 5vw; /* 字体大小随视口宽度变化 */
}
```

#### vw 可变字体大小

根据视口宽度调整字体大小，特别适合响应式设计：

```css
p {
  font-size: clamp(1rem, 2.5vw, 1.5rem);
}
```

#### 响应式文本的 Clamp() 函数

使用 `clamp()` 设置字体大小的范围，确保最小和最大限制：

```css
.responsive-text {
  font-size: clamp(16px, 4vw, 24px);
}
```

#### 通过字体显示交换实现高效字体加载

使用 `font-display: swap` 提高字体加载性能，避免FOIT（不可见文本闪烁）：

```css
@font-face {
  font-family: 'CustomFont';
  src: url('font.woff2') format('woff2');
  font-display: swap;
}
```

#### 具有字体变化设置的可变字体样式

使用 `font-variation-settings` 微调字体样式：

```css
.variable-font {
  font-variation-settings: 'wght' 400, 'wdth' 100;
}
```

#### 连字符让文本更流畅

使用 `hyphens: auto` 自动连字符，特别适合多语言网站：

```css
p {
  hyphens: auto;
  text-align: justify;
}
```

#### 文字描边效果

使用 `-webkit-text-stroke` 为文本添加描边：

```css
.outlined-text {
  -webkit-text-stroke: 2px black;
  color: white;
}
```

#### ch 单位用于一致的尺寸

使用 `ch` 单位设置字体大小，基于"0"字符的宽度：

```css
.monospace {
  width: 80ch; /* 限制每行80个字符 */
}
```

#### ::marker伪元素

使用 `::marker` 设置列表项标记的样式：

```css
li::marker {
  color: red;
  font-size: 1.2em;
}
```

#### 可变字体的 font-variation-settings

使用 `font-variation-settings` 微调可变字体：

```css
.dynamic-font {
  font-variation-settings: 'wght' 700, 'slnt' -10;
}
```

#### 小型大写字母的字体变体

使用 `font-variant: small-caps` 设置小型大写字母：

```css
.small-caps {
  font-variant: small-caps;
}
```

#### 最佳字体渲染的文本渲染

使用 `text-rendering: optimizeLegibility` 优化字体渲染：

```css
body {
  text-rendering: optimizeLegibility;
}
```

#### 首字母大写字母

使用 `::first-letter` 设置首字母样式：

```css
p::first-letter {
  font-size: 2em;
  color: red;
}
```

#### 字体变体数字

使用 `font-variant-numeric` 控制数字排版：

```css
.numbers {
  font-variant-numeric: oldstyle-nums;
}
```

#### 字体光学尺寸

使用 `font-optical-sizing` 调整字体光学尺寸：

```css
.optical-sizing {
  font-optical-sizing: auto;
}
```

#### 文本装饰厚度

使用 `text-decoration-thickness` 控制文本装饰的粗细：

```css
.underline {
  text-decoration: underline;
  text-decoration-thickness: 2px;
}
```

#### 文本下划线偏移

使用 `text-underline-offset` 调整下划线位置：

```css
.custom-underline {
  text-underline-offset: 0.3em;
}
```

#### 字体功能设置

使用 `font-feature-settings` 启用 OpenType 功能：

```css
.ligatures {
  font-feature-settings: "liga" 1, "dlig" 1;
}
```

#### 文本装饰-跳过墨迹

使用 `text-decoration-skip-ink` 控制下划线是否跳过字符：

```css
.skip-ink {
  text-decoration-skip-ink: auto;
}
```

#### 文本下划线位置

使用 `text-underline-position` 调整下划线位置：

```css
.under-position {
  text-underline-position: under;
}
```

#### 文字装饰风格

使用 `text-decoration-style` 设置文本装饰的线条样式：

```css
.dashed-underline {
  text-decoration-style: dashed;
}
```

#### 字间距

使用 `word-spacing` 调整字间距：

```css
.spaced-text {
  word-spacing: 0.5em;
}
```

---

### **滚动条相关**

#### 网站平滑滚动

使用 `scroll-behavior: smooth` 实现平滑滚动：

```css
html {
  scroll-behavior: smooth;
}
```

#### 自定义滚动捕捉点

使用 `scroll-snap-type` 和 `scroll-snap-align` 设置滚动捕捉点：

```css
.container {
  scroll-snap-type: y mandatory;
}
.section {
  scroll-snap-align: start;
}
```

#### scroll-padding实现平滑滚动

使用 `scroll-padding` 调整滚动填充：

```css
html {
  scroll-padding-top: 100px;
}
```

#### scroll-snap-align

使用 `scroll-snap-align` 控制滚动捕捉点的对齐方式：

```css
.snap-item {
  scroll-snap-align: center;
}
```

#### overscroll-behavior

使用 `overscroll-behavior` 控制滚动过度行为：

```css
.modal {
  overscroll-behavior: contain;
}
```

#### 滚动填充块

使用 `scroll-padding-block` 设置滚动填充：

```css
.scroll-container {
  scroll-padding-block: 50px;
}
```

#### 内联滚动填充

使用 `scroll-padding-inline` 设置内联滚动填充：

```css
.horizontal-scroll {
  scroll-padding-inline: 20px;
}
```

---

### **布局**

#### 简化布局的网格

使用 CSS 网格布局：

```css
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}
```

#### 使用 Flexbox 垂直居中

使用 Flexbox 实现水平和垂直居中：

```css
.center {
  display: flex;
  justify-content: center;
  align-items: center;
}
```

#### 纵横比框

使用 `padding-bottom` 保持元素的宽高比：

```css
.aspect-ratio-box {
  height: 0;
  padding-bottom: 56.25%; /* 16:9 */
}
```

#### 纵横比属性

使用 `aspect-ratio` 设置宽高比：

```css
.modern-aspect-ratio {
  aspect-ratio: 16 / 9;
}
```

#### 使用 Flexbox 的粘性页脚

使用 Flexbox 创建粘性页脚：

```css
body {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
.content {
  flex: 1;
}
```

#### 用于文本换行的 CSS 形状

使用 `shape-outside` 实现文本环绕：

```css
.circle {
  float: left;
  shape-outside: circle(50%);
}
```

#### 垂直布局的写作模式

使用 `writing-mode` 创建垂直布局：

```css
.vertical-text {
  writing-mode: vertical-rl;
}
```

#### column-span

使用 `column-span` 跨越多列布局：

```css
.span-all {
  column-span: all;
}
```

#### contain

使用 `contain` 优化布局性能：

```css
.isolated {
  contain: layout paint;
}
```

#### 内容可见性

使用 `content-visibility` 控制屏幕外内容的渲染：

```css
.lazy-render {
  content-visibility: auto;
}
```

---

### **背景和图像**

#### 图像控制的Object-fit属性

使用 `object-fit` 控制图像大小：

```css
.cover-image {
  object-fit: cover;
}
```

#### 彩色元素的圆锥渐变

使用 `conic-gradient` 创建渐变背景：

```css
.conic-bg {
  background: conic-gradient(red, yellow, lime, aqua, blue, magenta, red);
}
```

#### 多个背景图像

使用多个背景图像：

```css
.multi-bg {
  background-image: url('bg1.png'), url('bg2.png');
  background-position: left top, right bottom;
}
```

#### 平滑渐变过渡

对渐变背景应用平滑过渡：

```css
.gradient-transition {
  background: linear-gradient(45deg, red, blue);
  transition: background 0.3s ease;
}
```

#### CSS 屏蔽

使用 `mask` 对图像应用遮罩：

```css
.masked {
  mask-image: url('mask.png');
}
```

#### 混合模式

使用 `mix-blend-mode` 创建色彩效果：

```css
.blend {
  mix-blend-mode: multiply;
}
```

#### 用于创意叠加的混合混合模式

使用 `mix-blend-mode` 创建叠加效果：

```css
.overlay {
  mix-blend-mode: overlay;
}
```

#### 模糊背景的背景滤镜

使用 `backdrop-filter` 创建模糊背景：

```css
.blur-bg {
  backdrop-filter: blur(10px);
}
```

#### 用于透明颜色的 HSLA

使用 `hsla` 设置透明背景：

```css
.transparent {
  background-color: hsla(0, 100%, 50%, 0.5);
}
```

#### 图像渲染

使用 `image-rendering` 优化图像显示：

```css
.pixelated {
  image-rendering: pixelated;
}
```

#### 图像导向

使用 `image-orientation` 控制图像方向：

```css
.rotate-image {
  image-orientation: from-image;
}
```

---

### **交互和动画**

#### :focus-in 伪类

使用 `:focus-within` 设置焦点样式：

```css
.form-container:focus-within {
  border-color: blue;
}
```

#### 键盘导航的焦点样式

使用 `:focus` 改进焦点样式：

```css
a:focus {
  outline: 2px solid blue;
}
```

#### 交互式高亮效果

使用 CSS 变量创建交互式高亮效果：

```css
:root {
  --highlight: yellow;
}
.highlight:hover {
  background-color: var(--highlight);
}
```

#### :focus-visible 用于特定焦点样式

使用 `:focus-visible` 设置焦点样式：

```css
button:focus-visible {
  outline: 2px solid red;
}
```

#### overscroll-behavior 滚动超调

使用 `overscroll-behavior` 控制滚动行为：

```css
.scroll-container {
  overscroll-behavior: none;
}
```

---

### **表单和输入**

#### 占位符文本样式

使用 `::placeholder` 设置占位符样式：

```css
input::placeholder {
  color: #999;
  font-style: italic;
}
```

#### 自定义单选按钮和复选框

使用 `appearance` 自定义表单控件：

```css
input[type="checkbox"] {
  appearance: none;
  /* 自定义样式 */
}
```

#### 调整文本区域的属性大小

使用 `resize` 控制文本区域大小调整：

```css
textarea {
  resize: vertical;
}
```

---

### **其他**

#### :not () 伪类

使用 `:not()` 排除特定元素：

```css
p:not(.special) {
  color: gray;
}
```

#### :empty 表示空元素

使用 `:empty` 隐藏空元素：

```css
div:empty {
  display: none;
}
```

#### 自定义选择的突出显示颜色

使用 `::selection` 自定义文本选择样式：

```css
::selection {
  background: yellow;
  color: black;
}
```

#### 自定义下划线

使用 `border-bottom` 自定义下划线：

```css
.custom-underline {
  border-bottom: 2px dashed red;
}
```

#### 隐藏的辅助文本

使用 `.sr-only` 隐藏元素但保持可访问性：

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}
```

#### 选择偶数和奇数元素

使用 `:nth-child` 设置交替样式：

```css
li:nth-child(odd) {
  background: #f0f0f0;
}
```

#### CSS计数器

使用 `counter-reset` 和 `counter-increment` 创建自动编号：

```css
ol {
  counter-reset: section;
}
li::before {
  counter-increment: section;
  content: counters(section, ".") " ";
}
```

#### CSS :is () 选择器

使用 `:is()` 简化选择器：

```css
:is(h1, h2, h3) {
  color: blue;
}
```

#### CSS变量的计算

使用 CSS 变量进行计算：

```css
:root {
  --base-size: 16px;
}
.text {
  font-size: calc(var(--base-size) * 1.5);
}
```

#### 内容的 attr() 函数

使用 `attr()` 显示属性值：

```css
.tooltip::after {
  content: attr(data-tooltip);
}
```

#### 用于文本换行的 shape-outside

使用 `shape-outside` 实现文本环绕：

```css
.circle {
  float: left;
  shape-outside: circle(50%);
}
```

#### 背景的 element() 函数

使用 `element()` 动态引用元素作为背景：

```css
.mirror {
  background: element(#source);
}
```

#### 文字渐变

使用 `background-clip` 和 `text-fill-color` 创建文字渐变：

```css
.gradient-text {
  background: linear-gradient(45deg, red, blue);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

#### 长单词的断字属性

使用 `word-break` 控制长单词换行：

```css
.break-word {
  word-break: break-all;
}
```

#### 设计破损图像的样式

使用 `:broken` 设置破损图像样式：

```css
img:broken {
  border: 2px dashed red;
}
```

#### CSS 形状

使用 `shape-outside` 创建形状：

```css
.triangle {
  float: left;
  shape-outside: polygon(0 0, 100% 0, 50% 100%);
}
```

#### 子串匹配的属性选择器

使用 `[attr*="value"]` 进行子字符串匹配：

```css
a[href*="example"] {
  color: red;
}
```

#### CSS环境变量

使用 `env()` 访问环境变量：

```css
.safe-area {
  padding-top: env(safe-area-inset-top);
}
```

#### CSS属性计数器

使用 `:nth-child` 计算属性值出现次数：

```css
[data-count]::after {
  content: attr(data-count);
}
```

#### 自定义光标样式

使用 `cursor` 更改光标样式：

```css
.pointer {
  cursor: pointer;
}
```

#### 垂直文本的文本方向

使用 `text-orientation` 旋转文本：

```css
.vertical {
  writing-mode: vertical-rl;
  text-orientation: upright;
}
```

#### 背景分割的 box-decoration-break

使用 `box-decoration-break` 控制背景分割：

```css
.box {
  box-decoration-break: clone;
}
```

#### ::cue 用于设置 HTML5 标题样式

使用 `::cue` 设置标题样式：

```css
video::cue {
  background: rgba(0, 0, 0, 0.5);
  color: white;
}
```

#### 用于截断多行文本的line-clamp

使用 `line-clamp` 限制文本行数：

```css
.truncate {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
```

#### 字体字距调整

使用 `font-kerning` 调整字符间距：

```css
.kerning {
  font-kerning: normal; /* 可选值：normal | none | auto */
}
```

#### 形状边缘

使用 `shape-margin` 设置形状边距：

```css
.shape {
  shape-margin: 1em; /* 设置形状与周围内容的间距 */
}
```

#### 滚动边距

使用 `scroll-margin` 设置滚动边距：

```css
.scroll {
  scroll-margin: 20px; /* 滚动到元素时保留的边距 */
}
```

#### 选项卡大小

使用 `tab-size` 设置制表符宽度：

```css
pre {
  tab-size: 4; /* 设置制表符宽度为4个空格 */
}
```

#### 文本最后对齐

使用 `text-align-last` 设置最后一行文本对齐：

```css
p {
  text-align-last: justify; /* 可选值：auto | left | right | center | justify */
}
```

#### 文本对齐

使用 `text-justify` 控制文本对齐行为：

```css
.justify {
  text-justify: inter-word; /* 可选值：auto | inter-word | inter-character | none */
}
```

#### 列填充

使用 `column-fill` 控制列内容分布：

```css
.columns {
  column-fill: balance; /* 可选值：auto | balance | balance-all */
}
```

#### 轮廓偏移

使用 `outline-offset` 调整轮廓位置：

```css
button {
  outline-offset: 2px; /* 设置轮廓与元素边缘的偏移量 */
}
```

#### 换行

使用 `line-break` 控制换行行为：

```css
.break {
  line-break: strict; /* 可选值：auto | loose | normal | strict | anywhere */
}
```

#### 盒子装饰打破

使用 `box-decoration-break` 控制边框和填充渲染：

```css
.box {
  box-decoration-break: clone; /* 可选值：slice | clone */
}
```

#### 首字母

使用 `::first-letter` 设置首字母样式：

```css
p::first-letter {
  font-size: 2em;
  color: red;
}
```

#### 文本导向

使用 `text-orientation` 控制文本方向：

```css
.vertical {
  text-orientation: upright; /* 可选值：mixed | upright | sideways */
}
```
