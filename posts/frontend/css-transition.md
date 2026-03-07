---
date: 2026-03-07 12:00:00 +0800
title: CSS 变量与过渡动效
category: frontend
tags: [css, animation, demo]
outline: deep
---

用 CSS 自定义属性（Custom Properties）配合 `transition`，可以用极少的代码实现流畅的交互动效。

### 基础演示

下面的卡片用 CSS transition 控制颜色与缩放的平滑过渡，JS 只负责在 `mouseenter`/`mouseleave` 时动态设置颜色值。

<CodeDemo type="html" name="demo1" height="220px" />

核心思路：

- `.dot` 的颜色通过 `style.background` 动态赋值，`transition: background 0.4s` 让变化平滑过渡
- `transform: scale(1.2)` 的放大效果由 CSS hover 规则触发，JS 不参与
- 所有颜色值集中在 JS 数组里，方便统一替换主题
