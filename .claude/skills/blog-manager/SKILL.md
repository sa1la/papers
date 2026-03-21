---
name: blog-manager
description: Manage blog posts in this VitePress repository. Use when the user wants to create a post or draft, publish a draft, unpublish a post back to drafts, proofread an article, or otherwise operate on content under `posts/`. Triggers include requests such as "新建文章", "写草稿", "发布文章", "下线文章", "挑虫", "校对", "draft", "publish", "unpublish", and "proofread".
---

# Blog Manager

Manage the post lifecycle for this repository's VitePress blog.

## Use Repository Reality, Not Stale Docs

Treat `scripts/newPost.cjs`, `scripts/publishPost.cjs`, and `config/categories.ts` as the source of truth.

Some repo docs are stale and mix `draft` with `drafts`, or mention categories such as `tech`. Do not trust those examples over the scripts.

## Validate Before Acting

Before creating, publishing, or unpublishing a post:

1. Validate the category against `config/categories.ts`.
2. Confirm the target path under `posts/`.
3. If multiple files match the user's description, ask which one to use.

Valid categories in this repo:

- `algorithm`
- `contest`
- `craft`
- `frontend`
- `backend`
- `math`
- `notes`
- `essay`

## Create a Post or Draft

Use the repository script instead of writing files from scratch.

Commands:

```bash
pnpm new <category>/<slug>
pnpm new drafts/<category>/<slug>
```

Rules:

- Use `drafts/<category>/<slug>` for drafts. The script expects `drafts/`, not `draft/`.
- Use kebab-case for the slug.
- Let the script generate the initial frontmatter.
- Edit the generated file only for fields the script does not infer well, such as `tags` or `series`.

The script creates files under:

- `posts/<category>/<slug>.md`
- `posts/drafts/<category>/<slug>.md`

Minimum follow-up checks:

1. Confirm the file exists at the expected path.
2. Confirm `title` and `category` are correct.
3. For drafts, confirm `draft: true` exists.

## Publish a Draft

Use the publish script instead of moving files manually.

Command shape:

```bash
pnpm pub <category>/<slug>
pnpm pub <category>/<slug> --date YYYY-MM-DD
```

Rules:

- Pass the path relative to `posts/drafts/`.
- Do not pass `posts/drafts/...md` to the script unless you have verified the script interface changed.
- The script removes `draft: true`, updates `date`, writes to `posts/<category>/`, and deletes the draft file.

Minimum follow-up checks:

1. Confirm the draft file no longer exists.
2. Confirm the published file exists under `posts/<category>/`.
3. Confirm `date` was updated.
4. Confirm `draft: true` was removed.

## Unpublish a Post

There is no dedicated unpublish script in this repo. Perform the operation carefully.

Steps:

1. Locate the published file under `posts/<category>/<slug>.md`.
2. Ensure `posts/drafts/<category>/` exists.
3. Move the file to `posts/drafts/<category>/<slug>.md`.
4. Preserve existing frontmatter and add or update `draft: true`.
5. Recheck that the published path is gone and the draft path exists.

Do not replace the entire frontmatter block with a minimal one. Keep existing metadata such as `date`, `title`, `category`, `tags`, `series`, and `outline`.

## Proofread an Article

Use this skill for article-focused proofreading inside this blog project, not generic prose review.

Check these areas first:

1. Obvious typos and punctuation consistency.
2. Markdown structure: headings, lists, callouts, code fences.
3. Frontmatter consistency: `title`, `category`, `tags`, `series`, `outline`, `draft`.
4. Blog-specific correctness: excerpt quality, code block language tags, broken relative links, obvious math or formatting issues.

When reporting issues:

1. Prioritize factual errors, broken formatting, and broken links over style tweaks.
2. Give file-relative line references when practical.
3. Separate must-fix issues from optional polish.
4. Ask before applying broad wording changes.

## Output Expectations

For content operations:

- State the target file.
- State the command or file operation you will use.
- State the verification result.

For proofreading:

- Summarize the article quality briefly.
- List concrete issues first.
- Offer direct edits only where the fix is clear.
