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

// Vue runtime import path for browser
const VUE_RUNTIME_PATH = '/vue-runtime.esm-browser.js'

// Static regex patterns
const TABINDEX_REGEX = / tabindex="0"/g
const STYLE_ATTR_REGEX = /(<pre[^>]*) style="([^"]*)"/
const VUE_RUNTIME_IMPORT_REGEX = /import\s+\{([^}]+)\}\s+from\s+['"][^'"]*(?:vue|vue-runtime)[^'"]*['"]\s*;?\n?/g

// Vue demo marker file
const VUE_DEMO_ENTRY = 'App.vue'

// Cache for Vue compiler module
let vueCompilerCache: typeof import('vue/compiler-sfc') | null = null

/**
 * Get cached Vue compiler, loading it only once
 */
async function getVueCompiler(): Promise<typeof import('vue/compiler-sfc')> {
  if (!vueCompilerCache) {
    vueCompilerCache = await import('vue/compiler-sfc')
  }
  return vueCompilerCache
}

/**
 * Check if a directory is a Vue demo directory (contains App.vue)
 */
export function isVueDemoDir(dir: string): boolean {
  return fs.existsSync(path.join(dir, VUE_DEMO_ENTRY))
}

/**
 * Recursively find all Vue demo directories
 */
function getAllVueDemoDirs(base: string): string[] {
  const result: string[] = []
  if (!fs.existsSync(base))
    return result

  function walk(dir: string) {
    if (isVueDemoDir(dir)) {
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

/**
 * Parse Vue SFC file
 */
async function parseVueFile(filePath: string) {
  const { parse } = await getVueCompiler()
  const content = readFileSafe(filePath)
  const { descriptor } = parse(content, { filename: 'App.vue' })
  return { descriptor, source: content }
}

/**
 * Compile Vue SFC to JavaScript using compileScript with inlineTemplate
 */
async function compileVueSfc(descriptor: any): Promise<string> {
  const { compileScript } = await getVueCompiler()

  // Use compileScript with inlineTemplate to compile both script and template
  const compiled = compileScript(descriptor, {
    id: 'app',
    genDefaultAs: '_sfc_main',
    inlineTemplate: true, // This inlines the template compilation into the script
  })

  let code = compiled.content

  // Collect all imports from vue (both 'vue' and the runtime path)
  const vueImports = new Set<string>(['createApp'])

  const matches = [...code.matchAll(VUE_RUNTIME_IMPORT_REGEX)]
  for (const match of matches) {
    match[1].split(',').forEach((name: string) => {
      vueImports.add(name.trim())
    })
  }

  // Remove all vue-related import statements
  code = code.replace(VUE_RUNTIME_IMPORT_REGEX, '')

  // Add consolidated import at the top
  const importList = [...vueImports].join(', ')
  const consolidatedImport = `import { ${importList} } from '${VUE_RUNTIME_PATH}'\n`

  return consolidatedImport + code
}

/**
 * Compile Vue SFC to standalone JS/CSS/HTML files
 */
async function compileVueDemo(demoDir: string): Promise<{ js: string, css: string, html: string, source: string }> {
  const appVuePath = path.join(demoDir, 'App.vue')
  const { descriptor, source } = await parseVueFile(appVuePath)

  if (!descriptor.template) {
    throw new Error('App.vue must have a <template> block')
  }

  // Compile Vue SFC (script + template together)
  const compiledCode = await compileVueSfc(descriptor)

  // Generate JS file - the compiled code already includes all imports and render function
  const js = `${compiledCode}

createApp(_sfc_main).mount('#app')
`

  // Extract and combine styles
  let css = ''
  if (descriptor.styles && descriptor.styles.length > 0) {
    css = descriptor.styles.map(style => style.content.trim()).join('\n\n')
  }

  // Generate HTML file (CSP friendly - no inline scripts)
  const html = `<!DOCTYPE html>
<html lang="zh">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="/demo-base.css">
  <link rel="stylesheet" href="./demo.css">
  <script src="/demo-theme.js"><\/script>
</head>
<body>
  <div id="app"></div>
  <script type="module" src="./demo.js"><\/script>
</body>
</html>
`

  return { js, css, html, source }
}

/**
 * Highlight code using Shiki
 */
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

  // Clean up Shiki output
  const cleanedPre = preHtml
    .replace(TABINDEX_REGEX, '')
    .replace(STYLE_ATTR_REGEX, (_, tag, styleVal) => {
      const filtered = styleVal
        .split(';')
        .map((s: string) => s.trim())
        .filter((s: string) => s && !s.startsWith('--shiki-light-bg') && !s.startsWith('--shiki-dark-bg'))
        .join('; ')
      return filtered ? `${tag} style="${filtered}"` : tag
    })

  const lineCount = code.split('\n').length
  const lineNumbers = Array.from({ length: lineCount }, (_, i) => `<span class="line-number">${i + 1}</span><br>`).join('')

  return `<div class="language-${lang} vp-adaptive-theme line-numbers-mode"><div class="line-numbers-wrapper" aria-hidden="true">${lineNumbers}</div>${cleanedPre}<span class="lang">${lang}</span></div>`
}

/**
 * Process a single Vue demo directory
 */
async function processVueDemo(
  demoDir: string,
  highlighter: Awaited<ReturnType<typeof createHighlighter>>,
) {
  // Compile Vue SFC
  const { js, css, html, source } = await compileVueDemo(demoDir)

  // Highlight source code
  const highlightedHtml = await highlightCode(source, 'vue', highlighter)

  // Create output
  const output = {
    files: [
      {
        name: 'App.vue',
        source,
        highlightedHtml,
      },
    ],
  }

  // Determine output directory
  const relPath = path.relative(POSTS_SRC, demoDir)
  const outDir = path.join(DEMO_PUBLIC, relPath)

  // Ensure output directory exists
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true })
  }

  // Write compiled files
  writeFileSafe(path.join(outDir, 'demo.js'), js)
  writeFileSafe(path.join(outDir, 'demo.css'), css)
  writeFileSafe(path.join(outDir, 'index.html'), html)
  writeFileSafe(path.join(outDir, 'output.json'), JSON.stringify(output, null, 2))

  return relPath
}

/**
 * Check if output.json belongs to a Vue demo (has App.vue file)
 */
function isVueDemoOutput(outputPath: string): boolean {
  try {
    const content = fs.readFileSync(outputPath, 'utf-8')
    const data = JSON.parse(content)
    return Array.isArray(data.files) && data.files.some((f: any) => f.name === VUE_DEMO_ENTRY)
  }
  catch {
    return false
  }
}

/**
 * Clean up stale compiled demos that no longer have source files
 */
function cleanupStaleDemos() {
  if (!fs.existsSync(DEMO_PUBLIC))
    return

  const validDemoDirs = new Set(getAllVueDemoDirs(POSTS_SRC).map(dir =>
    path.relative(POSTS_SRC, dir),
  ))

  function walkAndClean(dir: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true })
    for (const entry of entries) {
      if (!entry.isDirectory())
        continue

      const fullPath = path.join(dir, entry.name)
      const relPath = path.relative(DEMO_PUBLIC, fullPath)
      const outputPath = path.join(fullPath, 'output.json')

      // Check if this is a Vue demo directory (output.json with App.vue file)
      const isVueDemo = fs.existsSync(outputPath) && isVueDemoOutput(outputPath)

      if (isVueDemo) {
        if (!validDemoDirs.has(relPath)) {
          fs.rmSync(fullPath, { recursive: true, force: true })
          console.warn(`[vue-demo] cleaned stale: ${relPath}`)
        }
        continue
      }

      // Recurse into non-demo directories
      walkAndClean(fullPath)

      // Remove empty directories
      const remaining = fs.readdirSync(fullPath)
      if (remaining.length === 0) {
        fs.rmdirSync(fullPath)
      }
    }
  }

  walkAndClean(DEMO_PUBLIC)
}

/**
 * Process all Vue demos
 */
async function processAll(highlighter: Awaited<ReturnType<typeof createHighlighter>>) {
  if (!fs.existsSync(POSTS_SRC))
    return

  // Clean up stale demos before compiling
  cleanupStaleDemos()

  const demoDirs = getAllVueDemoDirs(POSTS_SRC)

  if (demoDirs.length === 0)
    return

  // Process demos concurrently for better performance
  const results = await Promise.allSettled(
    demoDirs.map(async (demoDir) => {
      try {
        const rel = await processVueDemo(demoDir, highlighter)
        console.warn(`[vue-demo] compiled: ${rel}`)
        return { success: true, rel }
      }
      catch (e) {
        const errorMessage = getErrorMessage(e)
        console.error(`[vue-demo] failed to process ${demoDir}: ${errorMessage}`)
        if (process.env.NODE_ENV === 'production') {
          throw new Error(`Vue demo processing failed for ${demoDir}: ${errorMessage}`)
        }
        return { success: false, demoDir, error: errorMessage }
      }
    }),
  )

  // Log summary if there were failures
  const failures = results.filter(r => r.status === 'rejected' || (r.status === 'fulfilled' && !r.value.success))
  if (failures.length > 0) {
    console.error(`[vue-demo] ${failures.length}/${demoDirs.length} demos failed to compile`)
  }
}

/**
 * VitePress plugin for Vue demos
 */
export function vueDemoPlugin() {
  let devHighlighter: Awaited<ReturnType<typeof createHighlighter>> | null = null

  async function getDevHighlighter() {
    if (!devHighlighter) {
      devHighlighter = await createHighlighter({
        themes: [LIGHT_THEME, DARK_THEME],
        langs: ['vue'],
      })
    }
    return devHighlighter
  }

  return {
    name: 'vitepress-vue-demo',

    config() {
      return {
        server: {
          watch: {
            ignored: [
              `${DEMO_PUBLIC}/**`,
            ],
          },
        },
      }
    },

    async buildStart() {
      const highlighter = await createHighlighter({
        themes: [LIGHT_THEME, DARK_THEME],
        langs: ['vue'],
      })

      try {
        await processAll(highlighter)
      }
      finally {
        highlighter.dispose()
      }
    },

    configureServer(server: any) {
      const { watcher } = server

      if (fs.existsSync(POSTS_SRC)) {
        watcher.add(path.join(POSTS_SRC, '**/*.vue'))
      }

      // Initial compilation on server start (async, don't block)
      getDevHighlighter().then(async (highlighter) => {
        try {
          await processAll(highlighter)
        }
        catch (e) {
          const errorMessage = getErrorMessage(e)
          console.error(`[vue-demo] initial compilation failed: ${errorMessage}`)
        }
      })

      const changeHandler = async (filePath: string) => {
        if (!filePath.endsWith('.vue'))
          return
        if (!filePath.startsWith(POSTS_SRC))
          return

        const demoDir = path.dirname(filePath)
        if (!isVueDemoDir(demoDir))
          return

        try {
          const highlighter = await getDevHighlighter()
          const rel = await processVueDemo(demoDir, highlighter)
          console.warn(`[vue-demo] updated: ${rel}`)
        }
        catch (e) {
          const errorMessage = getErrorMessage(e)
          console.error(`[vue-demo] error processing ${demoDir}: ${errorMessage}`)
          server.ws.send({
            type: 'error',
            err: {
              message: `Vue demo processing failed: ${errorMessage}`,
              stack: e instanceof Error ? e.stack : '',
            },
          })
        }
      }

      watcher.on('change', changeHandler)

      server.watcher.on('close', () => {
        watcher.off('change', changeHandler)
        devHighlighter?.dispose()
        devHighlighter = null
      })
    },
  }
}
