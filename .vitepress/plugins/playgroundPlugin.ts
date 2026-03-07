import type { Buffer } from 'node:buffer'
import type { BundledLanguage, BundledTheme } from 'shiki'
import { execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { transformerColorizedBrackets } from '@shikijs/colorized-brackets'
import { createHighlighter } from 'shiki'
import { getErrorMessage, readFileSafe, writeFileSafe } from './utils/fs.js'

const PLAYGROUND_SRC = path.resolve(process.cwd(), 'playground')
const PLAYGROUND_PUBLIC = path.resolve(process.cwd(), 'public/playground')

const LIGHT_THEME: BundledTheme = 'github-light-high-contrast'
const DARK_THEME: BundledTheme = 'one-dark-pro'

type DemoType = 'html' | 'go' | 'js'

// Entry files that unambiguously identify a demo directory (priority order)
const DEMO_ENTRY_FILES: { file: string | ((entries: string[]) => boolean), type: DemoType }[] = [
  { file: 'index.html', type: 'html' },
  { file: entries => entries.some(f => f.endsWith('.go')), type: 'go' },
  { file: 'main.js', type: 'js' },
]

function detectDemoType(demoDir: string): DemoType | null {
  const entries = fs.readdirSync(demoDir)
  for (const { file, type } of DEMO_ENTRY_FILES) {
    const found = typeof file === 'function' ? file(entries) : entries.includes(file)
    if (found)
      return type
  }
  return null
}

/**
 * Recursively find all directories that look like demo directories.
 * A directory is considered a demo dir if it contains one of the known entry
 * files rather than using the fragile "has any file" heuristic.
 */
function getAllDemoDirs(base: string): string[] {
  const result: string[] = []
  if (!fs.existsSync(base))
    return result

  function walk(dir: string) {
    const type = detectDemoType(dir)
    if (type !== null) {
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
    .replace(/ tabindex="0"/g, '')
    .replace(/(<pre[^>]*) style="([^"]*)"/, (_, tag, styleVal) => {
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

async function processGoDemo(
  demoDir: string,
  highlighter: Awaited<ReturnType<typeof createHighlighter>>,
) {
  const entries = fs.readdirSync(demoDir).filter(f => f.endsWith('.go'))
  const files: Array<{ name: string, highlightedHtml: string, source: string }> = await Promise.all(
    entries.map(async (name) => {
      const filePath = path.join(demoDir, name)
      let src: string
      try {
        src = fs.readFileSync(filePath, 'utf-8')
      }
      catch (e) {
        throw new Error(`Failed to read ${filePath}: ${e instanceof Error ? e.message : String(e)}`)
      }
      const highlightedHtml = await highlightCode(src, 'go', highlighter)
      return { name, highlightedHtml, source: src }
    }),
  )

  let stdout = ''
  let stderr = ''
  let exitCode = 0
  try {
    stdout = execSync('go run .', { cwd: demoDir, timeout: 30000 }).toString()
  }
  catch (e: unknown) {
    const err = e as { stdout?: Buffer, stderr?: Buffer, status?: number }
    stdout = err.stdout?.toString() ?? ''
    stderr = err.stderr?.toString() ?? ''
    exitCode = err.status ?? 1
  }

  const output = {
    stdout,
    stderr,
    exitCode,
    executedAt: new Date().toISOString(),
    files,
  }

  const outputPath = path.join(demoDir, 'output.json')
  try {
    fs.writeFileSync(outputPath, JSON.stringify(output, null, 2))
  }
  catch (e) {
    throw new Error(`Failed to write ${outputPath}: ${e instanceof Error ? e.message : String(e)}`)
  }
}

function cleanJsSourceForDisplay(src: string): string {
  // Remove content between playground:hide markers
  return src.replace(/\/\/ --- playground:hide:start ---[\s\S]*?\/\/ --- playground:hide:end ---\n?/g, '')
}

async function processJsDemo(
  demoDir: string,
  highlighter: Awaited<ReturnType<typeof createHighlighter>>,
) {
  const mainPath = path.join(demoDir, 'main.js')
  const rawSrc = readFileSafe(mainPath)
  const displaySrc = cleanJsSourceForDisplay(rawSrc)
  const highlightedHtml = await highlightCode(displaySrc, 'javascript', highlighter)

  const output = {
    files: [{ name: 'main.js', highlightedHtml, source: displaySrc }],
  }

  const outputPath = path.join(demoDir, 'output.json')
  writeFileSafe(outputPath, JSON.stringify(output, null, 2))
}

function copyDir(src: string, dest: string) {
  if (!fs.existsSync(dest))
    fs.mkdirSync(dest, { recursive: true })

  const entries = fs.readdirSync(src, { withFileTypes: true })
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name)
    const destPath = path.join(dest, entry.name)
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath)
    }
    else {
      fs.copyFileSync(srcPath, destPath)
    }
  }
}

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
    langs: ['go', 'javascript', 'html', 'css'],
  })
}

async function processAll() {
  if (!fs.existsSync(PLAYGROUND_SRC))
    return

  const highlighter = await createSharedHighlighter()

  const demoDirs = getAllDemoDirs(PLAYGROUND_SRC)

  for (const demoDir of demoDirs) {
    const type = detectDemoType(demoDir)
    if (!type)
      continue

    try {
      if (type === 'go') {
        await processGoDemo(demoDir, highlighter)
      }
      else if (type === 'js') {
        await processJsDemo(demoDir, highlighter)
      }
      else if (type === 'html') {
        await processHtmlDemo(demoDir, highlighter)
      }
    }
    catch (e) {
      const errorMessage = getErrorMessage(e)
      console.error(`[playground] failed to process ${demoDir}: ${errorMessage}`)
      // In production, fail the build to prevent deploying broken demos
      if (process.env.NODE_ENV === 'production') {
        throw new Error(`Playground processing failed for ${demoDir}: ${errorMessage}`)
      }
    }
  }

  highlighter.dispose()

  // sync to public/playground/
  copyDir(PLAYGROUND_SRC, PLAYGROUND_PUBLIC)
}

export function playgroundPlugin() {
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
    name: 'vitepress-playground',

    // Exclude public/playground/ from Vite's file watcher so that copyDir
    // writing files there does not trigger an infinite HMR reload loop.
    config() {
      return {
        server: {
          watch: {
            ignored: [
              `${PLAYGROUND_PUBLIC}/**`,
              `${PLAYGROUND_SRC}/**/output.json`,
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

      if (fs.existsSync(PLAYGROUND_SRC)) {
        watcher.add(path.join(PLAYGROUND_SRC, '**'))
      }

      watcher.on('change', async (filePath: string) => {
        if (!filePath.startsWith(PLAYGROUND_SRC))
          return
        if (path.basename(filePath) === 'output.json')
          return

        const demoDir = path.dirname(filePath)
        const type = detectDemoType(demoDir)
        if (!type)
          return

        try {
          const highlighter = await getDevHighlighter()

          if (type === 'go') {
            await processGoDemo(demoDir, highlighter)
          }
          else if (type === 'js') {
            await processJsDemo(demoDir, highlighter)
          }
          else if (type === 'html') {
            await processHtmlDemo(demoDir, highlighter)
          }

          // sync changed demo to public
          const rel = path.relative(PLAYGROUND_SRC, demoDir)
          copyDir(demoDir, path.join(PLAYGROUND_PUBLIC, rel))

          console.warn(`[playground] updated: ${rel}`)
        }
        catch (e) {
          const errorMessage = getErrorMessage(e)
          console.error(`[playground] error processing ${demoDir}: ${errorMessage}`)
          // Send error to Vite's HMR overlay in dev mode
          server.ws.send({
            type: 'error',
            err: {
              message: `Playground processing failed: ${errorMessage}`,
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
