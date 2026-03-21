import { describe, expect, it } from 'vitest'

import {
  createLatestRequestGuard,
  parseDemoMessage,
} from '../.vitepress/theme/components/vueDemoState.js'

describe('parseDemoMessage', () => {
  it('accepts request-theme from the current iframe and origin', () => {
    const iframeWindow = {}
    const result = parseDemoMessage({
      source: iframeWindow,
      origin: 'https://example.com',
      data: { type: 'request-theme' },
    }, iframeWindow, 'https://example.com')

    expect(result).toEqual({ type: 'request-theme' })
  })

  it('rejects messages from a different origin', () => {
    const iframeWindow = {}
    const result = parseDemoMessage({
      source: iframeWindow,
      origin: 'https://evil.example',
      data: { type: 'request-theme' },
    }, iframeWindow, 'https://example.com')

    expect(result).toBeNull()
  })

  it('accepts positive demo height and rejects invalid payloads', () => {
    const iframeWindow = {}

    expect(parseDemoMessage({
      source: iframeWindow,
      origin: 'https://example.com',
      data: { type: 'demo-height', height: 320 },
    }, iframeWindow, 'https://example.com')).toEqual({ type: 'demo-height', height: 320 })

    expect(parseDemoMessage({
      source: iframeWindow,
      origin: 'https://example.com',
      data: { type: 'demo-height', height: 0 },
    }, iframeWindow, 'https://example.com')).toBeNull()
  })
})

describe('createLatestRequestGuard', () => {
  it('marks only the latest request as current', () => {
    const guard = createLatestRequestGuard()
    const first = guard.next()
    const second = guard.next()

    expect(guard.isCurrent(first)).toBe(false)
    expect(guard.isCurrent(second)).toBe(true)

    guard.invalidate()
    expect(guard.isCurrent(second)).toBe(false)
  })
})
