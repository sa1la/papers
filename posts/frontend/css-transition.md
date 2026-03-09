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

<HtmlDemo name="demo1" height="220px" />

核心思路：

- `.dot` 的颜色通过 `style.background` 动态赋值，`transition: background 0.4s` 让变化平滑过渡
- `transform: scale(1.2)` 的放大效果由 CSS hover 规则触发，JS 不参与
- 所有颜色值集中在 JS 数组里，方便统一替换主题

### Vue 版本

同样的效果用 Vue 3 实现，利用响应式系统和 `computed` 来管理颜色状态：

<VueDemo name="demo2" height="300px" />

对比原生 JS 版本，Vue 的实现有以下特点：

- 使用 `ref` 和 `computed` 管理状态，`activeIndex` 记录当前 hover 的卡片
- `:style` 绑定动态计算颜色，逻辑更声明式
- `@mouseenter`/`@mouseleave` 事件直接绑定在模板中，无需手动操作 DOM
- 颜色数组和状态管理集中放在 `setup()` 中，组件化后更易复用
