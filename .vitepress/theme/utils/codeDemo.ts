import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'

export interface CodeDemoRef {
  type: 'html' | 'js' | 'go'
  name: string
}

/**
 * 从 Markdown 内容中提取所有 CodeDemo 引用
 * 匹配格式: <CodeDemo type="xxx" name="yyy" />
 */
export function extractCodeDemos(content: string): CodeDemoRef[] {
  const demos: CodeDemoRef[] = []
  // 匹配 <CodeDemo type="xxx" name="yyy" ... />
  const regex = /<CodeDemo\s+type=["'](html|js|go)["']\s+name=["']([^"']+)["'][^>]*>/g

  let match
  while ((match = regex.exec(content)) !== null) {
    demos.push({
      type: match[1] as CodeDemoRef['type'],
      name: match[2],
    })
  }

  return demos
}

/**
 * 根据文章文件路径和 CodeDemo 引用，计算 demo 目录路径
 * @param postFilePath 文章绝对路径，如 /project/posts/algorithm/union-find.md
 * @param demo CodeDemo 引用
 * @returns demo 目录绝对路径，如 /project/demos/algorithm/union-find/basic
 */
export function getDemoPath(postFilePath: string, demo: CodeDemoRef): string | null {
  // 从文章路径提取相对路径
  // posts/algorithm/union-find.md -> algorithm/union-find
  const postsMatch = postFilePath.match(/posts[/\\](.+?)\.md$/)
  if (!postsMatch)
    return null

  const relativePath = postsMatch[1] // algorithm/union-find
  const demoDir = path.join(process.cwd(), 'demos', relativePath, demo.name)

  return demoDir
}

/**
 * 从 demo 目录读取所有源代码文件内容
 * 1. 从 output.json 获取文件清单 (files[].name)
 * 2. 直接读取对应的源代码文件（而非使用 output.json 中的 source 字段）
 * 3. 拼接所有源代码返回
 */
export function loadDemoSource(demoPath: string): string {
  const outputPath = path.join(demoPath, 'output.json')

  if (!fs.existsSync(outputPath))
    return ''

  try {
    const content = fs.readFileSync(outputPath, 'utf-8')
    const data = JSON.parse(content) as { files?: Array<{ name?: string }> }

    if (!Array.isArray(data.files))
      return ''

    const sources: string[] = []
    for (const file of data.files) {
      const fileName = file.name
      if (!fileName)
        continue

      // 直接读取源代码文件，而非使用 output.json 中的 source 字段
      const sourcePath = path.join(demoPath, fileName)
      if (fs.existsSync(sourcePath)) {
        const source = fs.readFileSync(sourcePath, 'utf-8')
        if (source)
          sources.push(source)
      }
    }

    return sources.join('\n\n')
  }
  catch {
    return ''
  }
}

/**
 * 收集文章中所有 CodeDemo 的源代码
 * @param postFilePath 文章文件路径
 * @param markdownContent Markdown 内容
 * @returns 所有 demo 源代码拼接
 */
export function collectDemoSources(postFilePath: string, markdownContent: string): string {
  const demos = extractCodeDemos(markdownContent)
  if (demos.length === 0)
    return ''

  const sources: string[] = []
  for (const demo of demos) {
    const demoPath = getDemoPath(postFilePath, demo)
    if (demoPath) {
      const source = loadDemoSource(demoPath)
      if (source)
        sources.push(source)
    }
  }

  return sources.join('\n\n')
}
