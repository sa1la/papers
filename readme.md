## sa1l`s blog

Minimal black & white personal blog built with VitePress 2.0, migrated from Hugo.
The design is quiet, restrained, and content‑first.

### design philosophy

- **programmer minimalism**: content first, UI second
- **black & white**: calm, notebook‑like reading experience
- **lightweight typography**: light headings with generous whitespace
- **monospace for atmosphere**: use monospace mainly to create a technical‑journal feeling, not to shout “this is a UI control”

### stack

- **Framework**: [VitePress](https://vitepress.dev/) 2.0 (alpha)
- **UI**: Vue 3 + Pinia + TailwindCSS v4
- **Styling**: custom theme + Tailwind v4 utilities
- **Code highlight**: Shiki (`github-light-high-contrast` / `one-dark-pro`)

### features

- **content**
  - markdown with math (MathJax), footnotes, and code blocks with line numbers
  - categories, tags, optional series
  - draft workflow + scheduled publishing
- **ux**
  - responsive layout
  - local search with custom rendering
  - clean urls + auto‑generated sitemap

### content & categories

Posts live under `posts/` and are organized by category. Allowed `category` values in frontmatter:

- **algorithm** – data structures and algorithms
- **contest** – algorithm contest solutions
- **tips** – coding tips and experience
- **frontend** – frontend development and engineering practice
- **backend** – backend and server development
- **math** – math notes
- **notes** – reading notes and excerpts
- **essay** – personal thoughts and essays

example frontmatter:

```yaml
---
date: 2024-01-01 12:00:00 +08:00
title: Article Title
category: frontend # must be one of the predefined categories
tags: [tag1, tag2]
series: vitepress-blog # optional
outline: deep # optional: show nested headers in sidebar
draft: true # optional: exclude from listing / production
---
```

### draft & publishing workflow

- **Draft location**: `posts/drafts/<category>/`
  - Drafts are visible in **development** (`pnpm dev`)
  - Drafts are **excluded from production builds**
- **Create a draft or post**

```bash
pnpm new <category>/<filename>
# e.g. pnpm new algorithm/kmp-algorithm

# create draft
pnpm new drafts/<category>/<filename>
```

- **Publish a draft**

```bash
# publish with current date
pnpm pub <category>/<filename>

# publish with specific (or future) date
pnpm pub <category>/<filename> --date 2024-12-25
```

Posts with future dates are visible during development but excluded from production until the date passes.

### demo system (`HtmlDemo`, `VueDemo`)

For interactive demos there are **two main components**, with different directory layouts and build flows:

- `HtmlDemo`: based on **standalone demo directories next to each article**, mirrored as‑is to `public/demos`, supporting multiple files (`index.html`, `style.css`, `script.js`, etc.)
- `VueDemo`: based on a **single `App.vue` per demo directory**, compiled by `vueDemoPlugin` into `demo.js` / `demo.css` / `index.html` and `output.json`

#### `HtmlDemo` (organized by article)

HTML demos live next to the article that uses them, with an article‑name directory that contains one or more demo directories:

```text
posts/<category>/
├── <post-name>.md          # article
└── <post-name>/            # demos directory (for this article)
    └── <demo-name>/        # individual HTML demo
        ├── index.html      # required (entry)
        ├── style.css       # optional
        ├── script.js       # optional
        └── output.json     # auto-generated (code tabs)
```

Usage in Markdown:

```md
<HtmlDemo name="demo1" height="220px" />
```

Build pipeline:

- `htmlDemoPlugin` scans `posts/` for directories that **contain an `index.html`**, and generates an `output.json` file for each demo
- it then mirrors the whole `posts/` directory (excluding `.md` files) into `public/demos/`
- at runtime, `HtmlDemo` uses the current route and `name` to compute `/demos/<post-path>/<name>/`, and loads:
  - `/demos/.../index.html?theme=<dark|light>` into an iframe
  - `/demos/.../output.json` to render the code tabs

Styling has two modes:

1. **use shared blog theme (recommended)**

```html
<!doctype html>
<html>
  <head>
    <link rel="stylesheet" href="/demo-base.css" />
    <link rel="stylesheet" href="./style.css" />
    <script src="/demo-theme.js"></script>
  </head>
  <body>
    <!-- demo content -->
  </body>
</html>
```

- `demo-base.css` provides reset + dark/light theme variables + base layout
- `demo-theme.js`:
  - reads the initial theme from the `?theme=dark|light` URL parameter
  - supports `postMessage` messages `{ type: 'request-theme' }` / `{ type: 'theme', isDark }` for dynamic theme sync

2. **fully custom styles (special cases)**

```html
<!doctype html>
<html>
  <head>
    <!-- no demo-theme.js: you own the entire look -->
    <style>
      body {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      }
    </style>
  </head>
  <body>
    <!-- demo content -->
  </body>
</html>
```

Best for one‑off visual experiments that should not follow the blog theme at all.

#### `VueDemo` (organized by demo directory)

`VueDemo` uses demo directories that **only contain an `App.vue`**. You do not hand‑write `index.html` / `demo.js` / `demo.css` – they are generated by `vueDemoPlugin`.

Directory structure (using the `css-upgrade` article as an example):

```text
posts/frontend/
├── css-upgrade.md
└── css-upgrade/
    ├── field-sizing/          # a Vue demo
    │   └── App.vue            # source (the only file you write)
    ├── scroll-snap-events/
    │   └── App.vue
    └── ...                    # other Vue demos
```

Usage in Markdown:

```md
<VueDemo name="field-sizing" />
<VueDemo name="scroll-snap-events" height="400px" />
```

Build pipeline:

- `vueDemoPlugin` looks under `posts/` for directories that **contain an `App.vue`** and treats each as a Vue demo directory
- each demo directory is compiled to a matching location under `public/demos/`, for example:

```text
posts/frontend/css-upgrade/scroll-snap-events/   # source
→ public/demos/frontend/css-upgrade/scroll-snap-events/
    ├── index.html   # mount point + includes demo.css / demo.js
    ├── demo.js      # compiled from App.vue + createApp mount
    ├── demo.css     # from the <style> section
    └── output.json  # highlighted source for App.vue only
```

Runtime behavior:

- `VueDemo` computes `/demos/.../<name>/` from the current route + `name`, same as `HtmlDemo`
- the iframe loads `/demos/.../<name>/index.html?theme=<dark|light>`
- theme is synced with `demo-theme.js` via `postMessage`, and demos can send `{ type: 'demo-height', height }` to report their height so `VueDemo` can auto‑adjust the panel (unless `height` is explicitly passed)

**when to use what**

- use `HtmlDemo` for “pure HTML/CSS/JS” components, visual experiments, multi‑file demos, or when you need full control over `index.html`
- use `VueDemo` when you primarily care about interactive logic, state, and reusing Vue ecosystem features (`ref`, `computed`, component composition, etc.)

### local development

```bash
# install dependencies
pnpm install

# development server (http://localhost:5173)
pnpm dev

# production build
pnpm build

# preview production build
pnpm preview

# lint
pnpm lint
pnpm lint:fix
```

### project structure

```text
├── .vitepress/            # VitePress config & custom theme
│   ├── theme/             # Vue 3 components, layout, store
│   └── config.ts          # VitePress site config
├── posts/                 # Blog content
│   ├── algorithm/
│   ├── contest/
│   ├── tips/
│   ├── frontend/
│   ├── backend/
│   ├── math/
│   ├── notes/
│   ├── essay/
│   └── drafts/            # drafts, dev only
├── public/                # static assets (avatar, demo-base.css, etc.)
├── config/                # category and other configs
└── package.json
```

### license

MIT
