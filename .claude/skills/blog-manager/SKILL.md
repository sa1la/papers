---
name: blog-manager
description: Manage VitePress blog posts including creating drafts, publishing, unpublishing, and proofreading. Use this skill when the user mentions "新建文章", "发布文章", "下线文章", "校对文章", "挑虫", "draft", "publish", "unpublish", or "proofread" related to blog content management. Also trigger when user wants to create, manage, or review blog posts in this VitePress project.
---

# Blog Manager

## Overview

This skill helps manage blog posts in a VitePress 2.0 blog. It supports the complete article lifecycle: creating drafts, publishing to production, unpublishing/archiving, and proofreading for typos and improvements.

## Quick Commands Reference

| Command                            | Purpose                     | Example                                                    |
| ---------------------------------- | --------------------------- | ---------------------------------------------------------- |
| `pnpm new <category>/<slug>`       | Create new published post   | `pnpm new tech/my-post`                                    |
| `pnpm new draft/<category>/<slug>` | Create new draft            | `pnpm new draft/tech/my-draft`                             |
| `pnpm pub <path>`                  | Publish draft to production | `pnpm pub posts/drafts/tech/my-draft.md`                   |
| `pnpm pub <path> --date <date>`    | Schedule publish            | `pnpm pub posts/drafts/tech/my-draft.md --date 2024-12-25` |

## Available Categories

The following categories are defined in `config/categories.ts`:

| Key         | Name | Description        |
| ----------- | ---- | ------------------ |
| `algorithm` | 算法 | 数据结构与算法理论 |
| `contest`   | 竞赛 | 算法竞赛题解       |
| `craft`     | 技巧 | 编程技巧与经验     |
| `frontend`  | 前端 | 前端技术与实践     |
| `backend`   | 后端 | 后端开发与服务器   |
| `math`      | 数学 | 数学探索与笔记     |
| `notes`     | 笔记 | 阅读笔记与摘抄     |
| `essay`     | 随笔 | 个人思考与随笔     |

## Core Capabilities

### 1. Creating New Articles

When user wants to create a new article:

1. **Determine if it's a draft or published post**
   - Ask user: "创建为草稿还是直接发布？"
   - Drafts go to `posts/drafts/<category>/`
   - Published posts go to `posts/<category>/`

2. **Get required information**
   - Category (must be one of the valid categories above)
   - Article slug (filename, e.g., "my-article")
   - Title
   - Tags (optional)

3. **Execute creation command**

   ```bash
   # For draft
   pnpm new draft/<category>/<slug>

   # For published post
   pnpm new <category>/<slug>
   ```

4. **Update frontmatter if needed**
   The script creates the file with basic frontmatter. You may need to:
   - Add tags: `tags: [tag1, tag2]`
   - Add series: `series: series-name`
   - Set outline level: `outline: deep`

5. **Post Frontmatter Format**

   ```yaml
   ---
   date: YYYY-MM-DD HH:mm:ss Z
   title: Article Title
   category: category-key
   tags: [tag1, tag2]
   outline: deep
   ---

   Write excerpt here (shown in listing)

   ---

   Main content starts here...
   ```

### 2. Publishing Articles

When user wants to publish a draft:

1. **Identify the draft file**
   - Drafts are in `posts/drafts/<category>/<filename>.md`
   - Use Glob to find drafts if path not specified

2. **Execute publish command**

   ```bash
   # Immediate publish
   pnpm pub posts/drafts/<category>/<filename>.md

   # Scheduled publish
   pnpm pub posts/drafts/<category>/<filename>.md --date YYYY-MM-DD
   ```

3. **Verify the move**
   - Draft is moved to `posts/<category>/`
   - Date is updated in frontmatter

### 3. Unpublishing (Archiving) Articles

When user wants to unpublish/take down an article:

1. **Identify the published file**
   - Published posts are in `posts/<category>/<filename>.md`
   - Find the file using Glob if path not specified

2. **Move to drafts folder**

   ```bash
   mv posts/<category>/<filename>.md posts/drafts/<category>/<filename>.md
   ```

3. **Add draft flag to frontmatter**

   ```yaml
   ---
   draft: true
   ---
   ```

4. **Verify the article is no longer in production**
   - Check that it's excluded from production builds
   - Visible only in development mode

### 4. Proofreading Articles (挑虫)

When user asks to "挑虫" or proofread an article:

1. **Identify the target file**
   - Use Glob to find the article if path not specified
   - Can proofread drafts or published posts

2. **Read the article content**
   - Parse frontmatter
   - Read main content

3. **Check for common issues**

   **Typo Patterns (Chinese)**
   - 常见错别字：的/地/得，在/再，做/作，那/哪
   - 标点符号：中英文混用，缺少空格
   - 格式一致性：标题层级、列表符号

   **Technical Accuracy**
   - Code blocks have correct syntax highlighting
   - Links are valid
   - Math expressions render correctly ($...$ and $$...$$)

   **Content Quality**
   - Title matches content
   - Excerpt accurately summarizes the article
   - Tags are relevant

4. **Provide feedback**
   - List specific issues with line references
   - Suggest fixes
   - Ask if user wants auto-fix or manual review

5. **Optional: Auto-fix minor issues**
   - Fix obvious typos
   - Normalize punctuation spacing
   - Ensure frontmatter consistency

## Workflow Examples

**Example 1: Creating a new draft**

```
User: 新建一篇关于 React 的文章
→ Ask: 创建为草稿还是直接发布？
→ Ask: 选择分类 (frontend/backend/craft/etc.)
→ Ask: 文章标题和文件名
→ Run: pnpm new draft/frontend/react-hooks-guide
→ Update frontmatter with tags if provided
```

**Example 2: Publishing a draft**

```
User: 发布我的 React 草稿
→ Glob: Find posts/drafts/**/*react*.md
→ If multiple: Ask user to specify
→ Run: pnpm pub posts/drafts/frontend/react-hooks-guide.md
→ Confirm: Article is now in posts/frontend/
```

**Example 3: Unpublishing**

```
User: 下线那篇 React 文章
→ Glob: Find posts/frontend/*react*.md
→ If multiple: Ask user to specify
→ Move: posts/frontend/react-hooks-guide.md → posts/drafts/frontend/
→ Add draft: true to frontmatter
→ Confirm: Article is unpublished
```

**Example 4: Proofreading**

```
User: 帮我挑虫
→ Ask: 检查哪篇文章？
→ Read: specified article
→ Analyze: typos, formatting, technical issues
→ Report: List findings with suggestions
→ Ask: 是否需要自动修复？
```

## Important Notes

1. **Draft Visibility**: Drafts are excluded from production builds but visible during `pnpm dev`

2. **Date Handling**: When publishing, the date is automatically set to current time (or specified future date)

3. **Category Validation**: Always validate category against `config/categories.ts` - invalid categories will cause build errors

4. **File Naming**: Use kebab-case for slugs (e.g., "my-article-name" not "myArticleName")

5. **Frontmatter Fields**:
   - `date`: Required, auto-generated by scripts
   - `title`: Required
   - `category`: Required, must be valid category key
   - `tags`: Optional, array of strings
   - `series`: Optional, groups related posts
   - `outline`: Optional, set to `deep` for nested headers in sidebar
   - `draft`: Optional, set to `true` to exclude from production

## Resources

### scripts/

The project has built-in scripts for post management:

- `scripts/newPost.cjs` - Creates new posts (called via `pnpm new`)
- `scripts/publishPost.cjs` - Publishes drafts (called via `pnpm pub`)

These scripts handle frontmatter generation and file operations automatically.
