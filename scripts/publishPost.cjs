const fs = require('node:fs')
const path = require('node:path')
const process = require('node:process')
const dayjs = require('dayjs')

function parseArgs() {
  const args = process.argv.slice(2)
  let filePath = ''
  let publishDate = dayjs().format('YYYY-MM-DD HH:mm:ss Z')

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--date' || args[i] === '-d') {
      const dateStr = args[i + 1]
      if (dateStr) {
        const parsed = dayjs(dateStr)
        if (parsed.isValid()) {
          publishDate = parsed.format('YYYY-MM-DD HH:mm:ss Z')
        }
        else {
          console.error(`❌ Invalid date: ${dateStr}`)
          process.exit(1)
        }
        i++
      }
    }
    else if (!filePath) {
      filePath = args[i]
    }
  }

  return { filePath, publishDate }
}

function updateFrontmatter(content, publishDate) {
  // Remove draft: true line
  let updated = content.replace(/\ndraft:\s*true\s*\n/, '\n')

  // Update date
  updated = updated.replace(
    /date:\s*[^\n]+/,
    `date: ${publishDate}`,
  )

  return updated
}

async function publish(filePath, publishDate) {
  const draftPath = `./posts/drafts/${filePath}.md`

  // Check if draft exists
  if (!fs.existsSync(draftPath)) {
    console.error(`❌ Draft not found: ${draftPath}`)
    // eslint-disable-next-line no-console
    console.log('Make sure the file exists in posts/drafts/')
    process.exit(1)
  }

  // Read draft content
  const content = fs.readFileSync(draftPath, 'utf-8')

  // Extract category
  const categoryMatch = content.match(/category:\s*"?([^"\n]+)"?/)
  const category = categoryMatch ? categoryMatch[1].trim() : 'thoughts'

  // Update content
  const updatedContent = updateFrontmatter(content, publishDate)

  // Target path
  const targetDir = `./posts/${category}`
  const targetPath = path.join(targetDir, path.basename(draftPath))

  // Ensure target directory exists
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true })
  }

  // Write to target location
  fs.writeFileSync(targetPath, updatedContent, 'utf-8')

  // Delete draft
  fs.unlinkSync(draftPath)

  // Clean up empty draft subdirectories
  const draftDir = path.dirname(draftPath)
  if (fs.existsSync(draftDir)) {
    const files = fs.readdirSync(draftDir)
    if (files.length === 0 || (files.length === 1 && files[0] === '.gitkeep')) {
      fs.rmSync(draftDir, { recursive: true, force: true })
    }
  }

  // eslint-disable-next-line no-console
  console.log(`✅ Published: ${targetPath}`)
  // eslint-disable-next-line no-console
  console.log(`📅 Date: ${publishDate}`)

  const isFuture = dayjs(publishDate).isAfter(dayjs())
  if (isFuture) {
    // eslint-disable-next-line no-console
    console.log('⏰ This post is scheduled for future publication')
  }
}

const { filePath, publishDate } = parseArgs()

if (!filePath) {
  // eslint-disable-next-line no-console
  console.log('Usage: pnpm publish <draft-path>')
  // eslint-disable-next-line no-console
  console.log('       pnpm publish <draft-path> --date 2024-12-25')
  // eslint-disable-next-line no-console
  console.log('')
  // eslint-disable-next-line no-console
  console.log('Examples:')
  // eslint-disable-next-line no-console
  console.log('  pnpm publish tech/my-post')
  // eslint-disable-next-line no-console
  console.log('  pnpm publish tech/my-post -d 2024-03-15')
  process.exit(1)
}

publish(filePath, publishDate)
