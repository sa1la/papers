---
date: 2025-02-24 15:06:44 +08:00
title: rust-wasm-前端集成指南
category: frontend
tags: ["frontend", "rust"]
outline: deep
draft: false
---

前端开发中，有时会遇到需要处理高计算量任务的场景。例如，最近我在项目中需要实现文件解压缩功能，通过使用zstd（用C++编写并打包为wasm），成功在浏览器中完成了解压操作。这种方式不仅显著提升了性能，还扩展了前端在浏览器中的能力。

## 背景知识

### 什么是WebAssembly（Wasm）？

WebAssembly（简称Wasm）是一种二进制指令格式，设计用于在现代Web浏览器中高效运行。它的主要特点包括：

- 高性能：Wasm接近原生性能，适合高计算量任务。
- 跨平台：Wasm是跨平台的，可以在任何支持Wasm的环境中运行。
- 语言无关：支持多种编程语言（如C、C++、Rust等）编译为Wasm。
- 安全性：Wasm运行在沙盒环境中，确保了代码的安全性。

Wasm的主要目标是补充JavaScript，处理一些JavaScript难以高效完成的任务，比如图像处理、视频解码、文件压缩/解压缩、游戏引擎等。

### 为什么选择Rust编写WebAssembly？

Rust是一种系统级编程语言，因其性能和安全性而备受欢迎。Rust与Wasm的结合有以下优势：

- 高性能：
  - Rust编译生成的Wasm代码非常高效，接近原生性能。
  - Rust的内存管理模型（无垃圾回收）使其在Wasm中运行时更加轻量。
- 内存安全：
  - Rust通过编译时的所有权检查，避免了常见的内存错误（如空指针、数据竞争）。
  - 这使得Rust生成的Wasm代码更加可靠。
- 生态支持：
  - Rust有强大的工具链支持Wasm开发，比如wasm-pack、wasm-bindgen等。
  - 这些工具简化了Rust与Wasm的集成，方便开发者快速上手。
- 类型安全：
  - Rust的强类型系统可以帮助开发者在编译时发现潜在的错误，减少运行时问题。
- 与JavaScript的无缝交互：
  - Rust通过wasm-bindgen可以轻松与JavaScript交互，支持导入和导出函数、共享数据等。
- 社区支持：
  - Rust社区对Wasm的支持非常活跃，提供了丰富的文档和示例，降低了学习成本。

## 开始使用

安装`wasm-pack`

```bash
cargo install wasm-pack
```

新建一个rust-wasm项目

```bash
wasm-pack new hello-wasm
```

新建的项目会创建一个默认的函数`greet`,为了验证可以直接执行

```bash
wasm-pack build --target web
```

会生成一个`pkg`文件夹，作为打包产物。`pkg` 文件夹可以直接集成到前端项目中使用，也可以推送到 `registry` 进行分发。

接下来，我们在本地项目中进行验证：

1. 找到一个可以试验的前端项目。
2. 将刚打包生成的 `pkg` 文件夹放入前端项目中。
3. 执行以下命令安装模块：

```bash
pnpm i ./pkg
```

就能被引入项目中。在代码里使用：

```typescript
import init, { greet } from 'hello_wasm'
// ... existing code ...
// 在生命周期初始化hook init() 后再调用
greet()
// ... existing code ...
```
