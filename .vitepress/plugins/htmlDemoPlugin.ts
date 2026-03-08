import type { BundledLanguage, BundledTheme } from 'shiki'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { transformerColorizedBrackets } from '@shikijs/colorized-brackets'
import { createHighlighter } from 'shiki'
import { getErrorMessage, readFileSafe, writeFileSafe } from './utils/fs.js'

const POSTS_SRC = path.resolve(process.cwd(), 'posts')
const DEMO_PUBLIC = path.resolve(process.cwd(), 'public/demos')

const LIGHT_THEME: BundledTheme = 'github-light-high-contrast'
const DARK_THEME: BundledTheme = 'one-dark-pro'

// Supported extensions for HTML demos
const EXT_TO_LANG: Record<string, BundledLanguage> = {
  '.html': 'html',
  '.css': 'css',
  '.js': 'javascript',
}

// Pre-computed sort order map for O(1) lookup during sorting
const EXT_SORT_ORDER = new Map<string, number>([
  ['.html', 0],
  ['.css', 1],
  ['.js', 2],
])

// Pre-compiled regex for better performance
const TABINDEX_REGEX = / tabindex="0"/g
const STYLE_REGEX = /(<pre[^>]*) style="([^"]*)"/

// File extension constants
const MD_EXTENSION = '.md'

/**
 * Check if a directory is an HTML demo directory
 */
function isHtmlDemoDir(dir: string): boolean {
  return fs.existsSync(path.join(dir, 'index.html'))
}

/**
 * Recursively find all HTML demo directories
 */
function getAllHtmlDemoDirs(base: string): string[] {
  const result: string[] = []
  if (!fs.existsSync(base))
    return result

  function walk(dir: string) {
    if (isHtmlDemoDir(dir)) {
      result.push(dir)
      return
    }
    const entries = fs.readdirSync(dir, { withFileTypes: true })
    for (const entry of entries) {
      if (entry.isDirectory()) {
        walk(path.join(dir, entry.name))
      }
    }
  }

  walk(base)
  return result
}

function buildLineNumbersWrapper(lineCount: number): string {
  const lines = Array.from({ length: lineCount }, (_, i) => `<span class="line-number">${i + 1}</span><br>`).join('')
  return `<div class="line-numbers-wrapper" aria-hidden="true">${lines}</div>`
}

async function highlightCode(
  code: string,
  lang: BundledLanguage,
  highlighter: Awaited<ReturnType<typeof createHighlighter>>,
): Promise<string> {
  const preHtml = highlighter.codeToHtml(code, {
    lang,
    themes: { light: LIGHT_THEME, dark: DARK_THEME },
    defaultColor: false,
    transformers: [
      transformerColorizedBrackets(),
    ],
  })
  // remove tabindex="0" and inline background from Shiki's pre tag
  // tabindex causes browsers to render a scrollbar on focusable overflow elements
  // inline bg-color vars override our transparent background
  const cleanedPre = preHtml
    .replace(TABINDEX_REGEX, '')
    .replace(STYLE_REGEX, (_, tag, styleVal) => {
      // strip only background-related vars, keep others
      const filtered = styleVal
        .split(';')
        .map((s: string) => s.trim())
        .filter((s: string) => s && !s.startsWith('--shiki-light-bg') && !s.startsWith('--shiki-dark-bg'))
        .join('; ')
      return filtered ? `${tag} style="${filtered}"` : tag
    })
  const lineCount = code.split('\n').length
  const lineNumbersHtml = buildLineNumbersWrapper(lineCount)
  return `<div class="language-${lang} vp-adaptive-theme line-numbers-mode">${lineNumbersHtml}${cleanedPre}<span class="lang">${lang}</span></div>`
}

/**
 * Check if a file should be copied (not a markdown file)
 */
function shouldCopyFile(filename: string): boolean {
  return !filename.endsWith(MD_EXTENSION)
}

/**
 * Check if source directory has any files that should be copied
 * (i.e., non-.md files or subdirectories with valid content)
 */
function hasValidContent(src: string): boolean {
  const entries = fs.readdirSync(src, { withFileTypes: true })
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name)
    if (entry.isDirectory()) {
      if (hasValidContent(srcPath)) {
        return true
      }
    }
    else if (shouldCopyFile(entry.name)) {
      return true
    }
  }
  return false
}

/**
 * Copy directory while:
 * 1. Skipping .md files (they don't need to be in public/)
 * 2. Skipping empty directories (those with only .md files or no content)
 * 3. Removing stale files in destination that don't exist in source
 * 4. Removing empty destination directories after cleanup
 */
function copyDir(src: string, dest: string) {
  // Check if source has anything worth copying
  if (!hasValidContent(src)) {
    // If dest exists but source has no valid content, remove dest
    if (fs.existsSync(dest)) {
      fs.rmSync(dest, { recursive: true, force: true })
    }
    return
  }

  // Ensure destination exists
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true })
  }

  // Get source entries
  const srcEntries = fs.readdirSync(src, { withFileTypes: true })
  const srcNames = new Set(srcEntries.map(e => e.name))

  // Remove stale files/directories in destination
  const destEntries = fs.readdirSync(dest, { withFileTypes: true })
  for (const entry of destEntries) {
    if (!srcNames.has(entry.name)) {
      const destPath = path.join(dest, entry.name)
      fs.rmSync(destPath, { recursive: true, force: true })
    }
  }

  // Copy from source to destination
  for (const entry of srcEntries) {
    const srcPath = path.join(src, entry.name)
    const destPath = path.join(dest, entry.name)

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath)
    }
    else if (shouldCopyFile(entry.name)) {
      // Skip .md files - they don't need to be in public/
      fs.copyFileSync(srcPath, destPath)
    }
  }

  // After copying, if destination is empty, remove it
  const remainingFiles = fs.readdirSync(dest)
  if (remainingFiles.length === 0) {
    fs.rmdirSync(dest)
  }
}

async function processHtmlDemo(
  demoDir: string,
  highlighter: Awaited<ReturnType<typeof createHighlighter>>,
) {
  const entries = fs.readdirSync(demoDir).filter(f => EXT_TO_LANG[path.extname(f)])
  // put index.html first, then css, then js (unknown extensions go last)
  entries.sort((a, b) => {
    const ai = EXT_SORT_ORDER.get(path.extname(a)) ?? 99
    const bi = EXT_SORT_ORDER.get(path.extname(b)) ?? 99
    return ai - bi
  })

  const files: Array<{ name: string, highlightedHtml: string, source: string }> = await Promise.all(
    entries.map(async (name) => {
      const filePath = path.join(demoDir, name)
      const src = readFileSafe(filePath)
      const lang = EXT_TO_LANG[path.extname(name)]
      const highlightedHtml = await highlightCode(src, lang, highlighter)
      return { name, highlightedHtml, source: src }
    }),
  )

  const outputPath = path.join(demoDir, 'output.json')
  writeFileSafe(outputPath, JSON.stringify({ files }, null, 2))
}

async function createSharedHighlighter() {
  return createHighlighter({
    themes: [LIGHT_THEME, DARK_THEME],
    langs: ['html', 'css', 'javascript'],
  })
}

async function processAll() {
  if (!fs.existsSync(POSTS_SRC))
    return

  const highlighter = await createSharedHighlighter()

  const demoDirs = getAllHtmlDemoDirs(POSTS_SRC)

  if (demoDirs.length === 0)
    return

  for (const demoDir of demoDirs) {
    try {
      await processHtmlDemo(demoDir, highlighter)
    }
    catch (e) {
      const errorMessage = getErrorMessage(e)
      console.error(`[html-demo] failed to process ${demoDir}: ${errorMessage}`)
      // In production, fail the build to prevent deploying broken demos
      if (process.env.NODE_ENV === 'production') {
        throw new Error(`HTML demo processing failed for ${demoDir}: ${errorMessage}`)
      }
    }
  }

  highlighter.dispose()

  // sync demos from posts/ to public/demos/
  copyDir(POSTS_SRC, DEMO_PUBLIC)
}

export function htmlDemoPlugin() {
  // Highlighter instance shared across all file-change events in dev mode.
  // Initialized lazily on first change and reused to avoid the ~100ms
  // createHighlighter overhead on every save.
  let devHighlighter: Awaited<ReturnType<typeof createHighlighter>> | null = null

  async function getDevHighlighter() {
    if (!devHighlighter) {
      devHighlighter = await createSharedHighlighter()
    }
    return devHighlighter
  }

  return {
    name: 'vitepress-html-demo',

    // Exclude public/demos/ from Vite's file watcher so that copyDir
    // writing files there does not trigger an infinite HMR reload loop.
    config() {
      return {
        server: {
          watch: {
            ignored: [
              `${DEMO_PUBLIC}/**`,
              `${POSTS_SRC}/**/output.json`,
            ],
          },
        },
      }
    },

    async buildStart() {
      await processAll()
    },
    configureServer(server: any) {
      const { watcher } = server

      if (fs.existsSync(POSTS_SRC)) {
        watcher.add(path.join(POSTS_SRC, '**'))
      }

      watcher.on('change', async (filePath: string) => {
        if (!filePath.startsWith(POSTS_SRC))
          return
        if (path.basename(filePath) === 'output.json')
          return

        const demoDir = path.dirname(filePath)
        if (!isHtmlDemoDir(demoDir))
          return

        try {
          const highlighter = await getDevHighlighter()
          await processHtmlDemo(demoDir, highlighter)

          // sync changed demo to public
          const rel = path.relative(POSTS_SRC, demoDir)
          copyDir(demoDir, path.join(DEMO_PUBLIC, rel))

          console.warn(`[html-demo] updated: ${rel}`)
        }
        catch (e) {
          const errorMessage = getErrorMessage(e)
          console.error(`[html-demo] error processing ${demoDir}: ${errorMessage}`)
          // Send error to Vite's HMR overlay in dev mode
          server.ws.send({
            type: 'error',
            err: {
              message: `HTML demo processing failed: ${errorMessage}`,
              stack: e instanceof Error ? e.stack : '',
            },
          })
        }
      })

      server.watcher.on('close', () => {
        devHighlighter?.dispose()
        devHighlighter = null
      })
    },
  }
}
