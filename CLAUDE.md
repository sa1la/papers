# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A bilingual (zh-CN + en-US) personal technical blog built on **VitePress 2.0 alpha** with a fully custom Vue 3 theme, TailwindCSS v4, and Pinia state. Migrated from Hugo, hosted at `https://sa1l.world`.

Key facts that don't show up obviously in `package.json`:

- **Vite is overridden** to `rolldown-vite@latest` (see `pnpm.overrides`) — keep an eye on it when debugging build behavior.
- **Markdown processing** uses Shiki with `github-light-high-contrast` (light) / `one-dark-pro` (dark), plus `markdown-it-mathjax3`, `markdown-it-footnote`, and `@shikijs/colorized-brackets`.
- **Search** is local (no Algolia); the custom `_render` prepends the post title to the indexed content so titles match search queries even when not in the body.

## Design Philosophy

The blog follows a **minimalist and elegant aesthetic** with a **black and white color scheme** as the primary palette. Keep the UI clean, uncluttered, and sophisticated—avoid bright colors, heavy shadows, or excessive decorative elements.

### Design System: "Programmer Minimalism"

A calm, notebook-like atmosphere that prioritizes content over chrome.

**Typography**

- **Light weight headings**: Use `font-weight: 300` for titles and atmospheric elements; avoid `700` bold which creates a "command" feeling
- **Monospace for atmosphere**: `var(--vp-font-family-mono)` for section titles and decorative elements; creates a technical journal aesthetic
- **Lowercase transformation**: `text-transform: lowercase` for functional labels (e.g., "categories" not "Category")—reads like natural language, not UI controls
- **Letter spacing**: Use `letter-spacing: 0.05em` with monospace for breathing room

**Color Hierarchy (subtle to strong)**

- `--vp-c-text-3`: Atmospheric elements (decorative lines, icons, secondary indicators)
- `--vp-c-text-2`: Body text, interactive elements at rest
- `--vp-c-text-1`: Hover states, active selections, emphasis

**Decorative Elements**

- **Hairline borders**: `1px` lines at `0.4-0.5` opacity—suggested presence, not solid boundaries
- **Symmetrical lines**: Frame indicators with lines on both sides (e.g., `— icon name —`) like book section dividers
- **Gradual dividers**: Linear gradients fading to transparent at edges

**Icons (Lucide)**

- `stroke-width: 1.5` for delicacy
- Small scale: `0.875-1.25rem`
- Color: match `text-3`, blend into atmosphere

**Spacing & Breathing Room**

- Generous vertical padding (`2rem+` for section titles)
- Use transparency transitions instead of solid lines between sections
- Content density: airy, scannable lists with clear hover feedback

**Micro-interactions**

- Underlines that expand on hover (width transitions)
- Subtle opacity shifts (0.5 → 0.8) rather than color changes
- Spotlight effect: dim siblings when hovering list items

## Common Commands

```bash
# Development server (port 5173) — drafts and future-dated posts visible here
pnpm dev

# Production build — drafts and future posts are filtered out
pnpm build
pnpm preview

# Tests (vitest) and lint
pnpm test
pnpm lint
pnpm lint:fix

# Create posts (see "Authoring Workflow" below for path conventions)
pnpm new <category>/<slug>                  # Chinese, published
pnpm new drafts/<category>/<slug>           # Chinese, draft
pnpm new en/<category>/<slug>               # English, published

# Publish a Chinese draft → posts/<category>/<slug>.md
pnpm pub <category>/<slug>
pnpm pub <category>/<slug> --date 2026-12-25   # schedule for a future date
```

## Architecture

### Content Layout

```
posts/                      # Chinese content (root locale)
├── <category>/             # Published — visible in dev and prod
│   └── *.md
└── drafts/<category>/      # Drafts — visible in dev only

en/posts/                   # English content (en-US locale)
└── <category>/             # Published only — see "i18n Workflow"
    └── *.md
```

`createContentLoader('{posts,en/posts}/**/*.md', …)` in `.vitepress/theme/posts.data.ts` aggregates **both** trees into a single `Post[]` at build time. The locale of each post is inferred from its URL: anything under `/en/posts/` is `en-US`, otherwise `zh-CN`.

### Categories (`config/categories.ts`)

Categories are **predefined and validated**. Posts with an unknown `category` are dropped with a `console.warn` (see `isValidCategory`); they will not break the build but will silently disappear from listings.

| key         | zh-CN name | en-US name |
| ----------- | ---------- | ---------- |
| `algorithm` | 算法       | algorithms |
| `contest`   | 竞赛       | contests   |
| `tips`      | 技巧       | tips       |
| `frontend`  | 前端       | frontend   |
| `backend`   | 后端       | backend    |
| `math`      | 数学       | math       |
| `notes`     | 笔记       | notes      |
| `essay`     | 随笔       | essays     |

> `history` is **temporarily disabled** in `categories.ts` (commented out) to avoid an empty navigation entry. Uncomment it when the first history article ships. The `posts/history/` directory exists but is empty — leave it alone until then.

### Frontmatter Format

```yaml
---
date: YYYY-MM-DD HH:mm:ss Z
title: Article Title
category: frontend # must match a key in config/categories.ts
tags: [tag1, tag2]
series: vitepress-blog # optional, groups posts into a series
translationKey: my-post # optional, links bilingual pairs (see i18n)
draft: true # optional, only for posts under posts/drafts/
outline: deep # show nested headers in the right rail
---

Excerpt here (shown in listings).

---

Body starts after the second `---`.
```

### Authoring Workflow

`scripts/newPost.cjs` accepts four path shapes; everything else is rejected:

| Command                           | Output file                    | Notes                                         |
| --------------------------------- | ------------------------------ | --------------------------------------------- |
| `pnpm new frontend/foo`           | `posts/frontend/foo.md`        | Chinese, published                            |
| `pnpm new drafts/frontend/foo`    | `posts/drafts/frontend/foo.md` | Chinese, draft (`draft: true` in frontmatter) |
| `pnpm new en/frontend/foo`        | `en/posts/frontend/foo.md`     | English, published                            |
| `pnpm new en/drafts/frontend/foo` | **Rejected with exit 1**       | English drafts are not supported              |

`scripts/publishPost.cjs` (`pnpm pub`) only handles Chinese drafts: it strips `draft: true`, optionally rewrites the date, moves the file from `posts/drafts/<category>/` to `posts/<category>/`, and cleans up empty draft directories. There is no equivalent for English because there is no English draft state.

### i18n Workflow

VitePress i18n is configured in `.vitepress/config.ts`: zh-CN at `/`, en-US at `/en/`. Navigation labels and footer messages are localized per locale.

**Cross-language linking** is built on `posts.data.ts`'s `alternateUrls` map:

1. Each post can declare a `translationKey` in its frontmatter — this is the **preferred** way to pair zh and en versions.
2. If `translationKey` is missing, the loader falls back to a path-based key (e.g. `path:math/binomial-coefficient`) that strips the `/posts/` or `/en/posts/` prefix. So as long as the slug + category match across locales, the pairing still works.
3. The `LanguageSwitcher` component reads `alternateUrls` to render the cross-language link.

**English drafts are not supported by design.** The reasoning: English versions are typically **translations of finalized Chinese posts**, so they don't need an iterative draft state. Translate from a published Chinese post and ship the English version directly. `newPost.cjs` enforces this by rejecting `en/drafts/...` paths with an explicit error message — fail fast over silent misplacement.

## Custom Theme (`.vitepress/theme/`)

The theme extends VitePress's `DefaultTheme` and replaces the layout entirely.

**Layouts and pages**

- `ThemeLayout.vue` — root layout wrapping every page
- `Home.vue` — homepage
- `Category.vue` — `/category` listing
- `Tags.vue` — tag cloud
- `Favorites.vue` — `/favorites` page
- `About.vue` — about page

**Reusable components**

- `Hero.vue`, `Title.vue`, `PostHeader.vue`, `PostFooter.vue`, `PostInfo.vue` — post chrome
- `LanguageSwitcher.vue` — uses `alternateUrls` from `posts.data.ts`
- `Comments.vue` — Giscus integration (`@giscus/vue`)
- `HtmlDemo.vue`, `VueDemo.vue` — see "Demo System"

**State**

- `store.ts` — small Pinia store with `selectedCat` and `selectedTag` for filter state across components.

### Reading Time (`utils/index.ts`)

`getReadingTime` is **pre-computed** at build time inside `posts.data.ts` and cached on each `Post`. It separates fenced code blocks from prose and uses different rates:

- Chinese prose: 400 chars/min
- English prose: 230 words/min
- Code (Chinese chars + word tokens combined): 200 units/min

Call sites should read `post.readingTime` directly — do not recompute.

## Build-Time Filtering

Two layers ensure drafts and scheduled posts stay out of production:

1. **Glob filter** (`.vitepress/config/buildFilter.ts`): scans `posts/` recursively, parses frontmatter, and adds matches to `srcExclude` in production. Drops everything under `posts/drafts/**/*.md` plus any post with a future `date`.
2. **Loader filter** (`posts.data.ts`): `transform()` re-checks `frontmatter.draft` and future `date` and drops them from the `data` array.

Both layers run only when `NODE_ENV === 'production'`. In dev (`pnpm dev`), drafts and future-dated posts are visible.

`srcExclude` also drops `readme.md`, `CLAUDE.md`, and `docs/**/*` in both dev and prod.

## Demo System

Two ways to embed live demos in articles. Static fenced code blocks (with line numbers, colored brackets, copy button) work everywhere by default.

### `<HtmlDemo>` — vanilla HTML/CSS/JS in an iframe

Directory layout:

```
posts/<category>/
├── <slug>.md
└── <slug>/                # Demo directory shares the post slug
    └── <demo-name>/
        ├── index.html     # Required entry
        ├── style.css      # Optional
        ├── script.js      # Optional
        └── output.json    # Auto-generated by htmlDemoPlugin
```

Usage:

```markdown
<HtmlDemo name="demo1" height="220px" />
```

**Theme integration.** The default option is to inherit the blog's theme variables:

```html
<link rel="stylesheet" href="/demo-base.css" />
<link rel="stylesheet" href="./style.css" />
<script src="/demo-theme.js"></script>
```

`demo-base.css` provides the reset, theme variables (dark/light via `data-theme`), and base layout. `demo-theme.js` initializes the theme from a `?theme=` query parameter and listens for `postMessage` updates from the parent.

For visually unique demos that need custom styling, omit `demo-theme.js` and write your own CSS — the iframe is fully isolated.

### `<VueDemo>` — Vue SFC demos

Same idea, but the demo is a Vue single-file component co-located with the post (handled by `vueDemoPlugin`). Use this when the demo benefits from Vue's reactivity rather than vanilla JS.

### Importing code from a file

```markdown
<<< ./path/to/file.go
```

Useful for keeping demo source files type-checked or formatted by their native tooling.

## Things to Watch Out For

- **Adding a new category** is a two-step change: (1) add an entry to `categories.ts` with `i18n` for both locales, (2) the `CategoryKey` type narrows automatically. Posts using an undefined category will warn-and-disappear, not error.
- **`alternateUrls` only works after the loader has built the map.** If you need cross-language data outside `posts.data.ts`, read it from the imported `data`, do not try to derive it ad hoc.
- **Setting a future `date` is the scheduling mechanism.** No separate "scheduled" state exists — the build filter checks `date > now` at build time.

## Claude Code Skills

This project includes a local skill at `.claude/skills/blog-manager/` that wraps the authoring workflow in natural language ("新建一篇关于 xxx 的文章", "发布我的 xxx 草稿", "下线那篇 xxx 文章", "校对文章"). The skill calls the same `pnpm new` / `pnpm pub` scripts described above; there is no parallel implementation.

For prose-quality review across projects, use the global `plain-language-checker` skill instead of duplicating it here.
