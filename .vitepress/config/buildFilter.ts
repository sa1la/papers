import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(__dirname, '../..')
const postsDir = path.resolve(projectRoot, 'posts')
const draftsDir = path.resolve(projectRoot, 'posts/drafts')

interface Frontmatter {
  draft?: boolean
  date?: string
}

// Static regex patterns to avoid re-compilation on every call
const REGEX_BACKSLASH = /\\/g
const REGEX_FRONTMATTER = /^---[^\S\r\n]*\r?\n([\s\S]*?)\r?\n---/
const REGEX_DRAFT = /^draft:\s*(true|false)\s*$/i
const REGEX_DATE = /^date:\s*(\S.*)$/

/**
 * Normalize path to use forward slashes for glob compatibility
 */
function normalizePath(filePath: string): string {
  return filePath.replace(REGEX_BACKSLASH, '/')
}

/**
 * Simple frontmatter parser (no external deps)
 */
function parseFrontmatter(content: string): Frontmatter {
  const data: Frontmatter = {}
  const match = content.match(REGEX_FRONTMATTER)
  if (!match)
    return data

  const yaml = match[1]
  const lines = yaml.split('\n')

  for (const line of lines) {
    const draftMatch = line.match(REGEX_DRAFT)
    if (draftMatch) {
      const value = draftMatch[1].trim().toLowerCase()
      data.draft = value === 'true'
    }

    const dateMatch = line.match(REGEX_DATE)
    if (dateMatch) {
      data.date = dateMatch[1].trim()
    }
  }

  return data
}

/**
 * Get list of files to exclude from production build
 * - Draft posts (draft: true)
 * - Future dated posts (date > now)
 */
export function getExcludedFiles(): string[] {
  const excluded: string[] = ['posts/drafts/**/*.md']
  const now = Date.now()

  function scanDir(dir: string) {
    // Skip drafts directory entirely
    if (dir === draftsDir || dir.startsWith(draftsDir + path.sep)) {
      return
    }

    const items = fs.readdirSync(dir)

    for (const item of items) {
      const fullPath = path.join(dir, item)
      const stat = fs.statSync(fullPath)

      if (stat.isDirectory()) {
        scanDir(fullPath)
      }
      else if (item.endsWith('.md')) {
        const content = fs.readFileSync(fullPath, 'utf-8')
        const frontmatter = parseFrontmatter(content)

        // Exclude drafts
        if (frontmatter.draft) {
          excluded.push(normalizePath(path.relative(projectRoot, fullPath)))
          continue
        }

        // Exclude future posts
        if (frontmatter.date) {
          const pubTime = new Date(frontmatter.date).getTime()
          if (!Number.isNaN(pubTime) && pubTime > now) {
            excluded.push(normalizePath(path.relative(projectRoot, fullPath)))
          }
        }
      }
    }
  }

  if (fs.existsSync(postsDir)) {
    scanDir(postsDir)
  }

  return excluded
}
