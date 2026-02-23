const fs = require('node:fs')
const process = require('node:process')
const { default: to } = require('await-to-js')
const dayjs = require('dayjs')

const capitalizeFirstLetter = str => str.charAt(0).toUpperCase() + str.slice(1)
const formatTitle = name => capitalizeFirstLetter(name.replaceAll('-', ' '))
const getFilename = path => path.split('/').at(-1)

function getCategoryFromPath(filePath) {
  const parts = filePath.split('/')
  // If it's drafts/category/name format, return category
  if (parts[0] === 'drafts' && parts.length >= 2) {
    return parts[1]
  }
  // Otherwise return the first level directory
  return parts[0] || 'thoughts'
}

function isDraft(filePath) {
  return filePath.startsWith('drafts/')
}

async function writeFile(filePath) {
  const filename = getFilename(filePath)
  const title = formatTitle(filename)
  const category = getCategoryFromPath(filePath)
  const draft = isDraft(filePath)

  const draftLine = draft ? '\ndraft: true' : ''

  const markdown = `---
date: ${dayjs(Date.now()).format('YYYY-MM-DD HH:mm:ss Z')}
title: ${title}
category: "${category}"
tags: []${draftLine}
outline: "deep"
---
write excerpt here

---`

  const fullPath = `./posts/${filePath}.md`
  const dir = require('node:path').dirname(fullPath)

  // Ensure directory exists
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }

  fs.writeFileSync(fullPath, markdown, 'utf-8')

  // eslint-disable-next-line no-console
  console.log(`Created: ${fullPath}`)
  if (draft) {
    // eslint-disable-next-line no-console
    console.log('This is a draft post (visible in dev only)')
  }
}

async function createNewPost(filePath) {
  const [err] = await to(writeFile(filePath))
  if (err) {
    console.error(`[ERROR]: Failed to create new post - ${err}`)
    return
  }
  // eslint-disable-next-line no-console
  console.log('[INFO]: New post is created successfully')
}

function main() {
  const args = process.argv.slice(2)

  if (!args.length) {
    console.error('[ERROR]: No file path provided')
    console.log('Usage: pnpm new <category>/<filename>')
    console.log('       pnpm new drafts/<category>/<filename>')
    process.exit(1)
  }
  createNewPost(args[0])
}

main()
