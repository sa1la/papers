# Sa1L`s Blog

A minimal, elegant personal blog built with VitePress 2.0, migrated from Hugo.

## Stack

- **Framework**: [VitePress](https://vitepress.dev/) 2.0 (alpha)
- **UI**: Vue 3 + Pinia + TailwindCSS v4
- **Design**: Black & white minimalist aesthetic

## Features

- ✍️ Markdown with math equations (MathJax), footnotes, code highlighting
- 🏷️ Categories and tags system
- 📝 Draft workflow (`posts/drafts/` → publish with CLI)
- 📱 Responsive design
- 🔍 Full-text search
- 🗺️ Auto-generated sitemap

## Project Structure

```
├── .vitepress/          # Theme and config
│   ├── theme/           # Custom Vue components
│   └── config.ts        # VitePress config
├── posts/               # Blog content
│   ├── algorithm/       # Algorithms & data structures
│   ├── front-end/       # Frontend development
│   ├── coding-exp/      # Programming tips
│   ├── essay/           # Personal essays
│   └── drafts/          # Draft posts (dev only)
└── config/              # Category definitions
```

## Commands

```bash
# Development
pnpm dev

# Build
pnpm build

# Create new post
pnpm new <category>/<filename>

# Publish draft
pnpm pub <draft-path>
```

## Post Frontmatter

```yaml
---
date: 2024-01-01 12:00:00 +08:00
title: Article Title
category: tech
tags: [tag1, tag2]
---
```

## License

MIT
