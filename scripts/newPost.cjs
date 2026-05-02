/* eslint-disable no-console */
const fs = require('node:fs')
const process = require('node:process')
const { default: to } = require('await-to-js')
const dayjs = require('dayjs')

const capitalizeFirstLetter = str => str.charAt(0).toUpperCase() + str.slice(1)
const formatTitle = name => capitalizeFirstLetter(name.replaceAll('-', ' '))
const getFilename = path => path.split('/').at(-1)

function isEnPath(filePath) {
  return filePath.startsWith('en/')
}

function getCategoryFromPath(filePath) {
  const parts = filePath.split('/')
  // en/<category>/<slug>
  if (parts[0] === 'en' && parts.length >= 3) {
    return parts[1]
  }
  // drafts/<category>/<slug>
  if (parts[0] === 'drafts' && parts.length >= 2) {
    return parts[1]
  }
  // <category>/<slug>
  return parts[0] || 'thoughts'
}

function isDraft(filePath) {
  return filePath.startsWith('drafts/')
}

function resolveTargetPath(filePath) {
  // 英文落到 VitePress i18n 期望的 en/posts/ 目录；中文沿用 posts/。
  return isEnPath(filePath)
    ? `./en/posts/${filePath.slice(3)}.md`
    : `./posts/${filePath}.md`
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

  const fullPath = resolveTargetPath(filePath)
  const dir = require('node:path').dirname(fullPath)

  // Ensure directory exists
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }

  fs.writeFileSync(fullPath, markdown, 'utf-8')

  console.log(`Created: ${fullPath}`)
  if (draft) {
    console.log('This is a draft post (visible in dev only)')
  }
}

async function createNewPost(filePath) {
  const [err] = await to(writeFile(filePath))
  if (err) {
    console.error(`[ERROR]: Failed to create new post - ${err}`)
    return
  }

  console.log('[INFO]: New post is created successfully')
}

function main() {
  const args = process.argv.slice(2)

  if (!args.length) {
    console.error('[ERROR]: No file path provided')
    console.log('Usage: pnpm new <category>/<filename>')
    console.log('       pnpm new drafts/<category>/<filename>')
    console.log('       pnpm new en/<category>/<filename>')
    process.exit(1)
  }

  const filePath = args[0]

  // 英文版按约定直接发布，不走草稿流程；显式拒绝避免文件落到非预期位置。
  if (filePath.startsWith('en/drafts/')) {
    console.error('[ERROR]: English drafts are not supported. Create the published version directly:')
    console.error(`         pnpm new ${filePath.replace('en/drafts/', 'en/')}`)
    process.exit(1)
  }

  createNewPost(filePath)
}

main()
