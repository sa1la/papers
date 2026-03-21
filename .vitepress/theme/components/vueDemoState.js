export function parseDemoMessage(event, iframeWindow, expectedOrigin) {
  if (!iframeWindow || event.source !== iframeWindow)
    return null

  if (event.origin !== expectedOrigin)
    return null

  const data = event.data
  if (!data || typeof data !== 'object')
    return null

  if (data.type === 'request-theme')
    return { type: 'request-theme' }

  if (data.type === 'demo-height' && typeof data.height === 'number' && data.height > 0)
    return { type: 'demo-height', height: data.height }

  return null
}

export function createLatestRequestGuard() {
  let currentRequestId = 0

  return {
    next() {
      currentRequestId += 1
      return currentRequestId
    },
    isCurrent(requestId) {
      return requestId === currentRequestId
    },
    invalidate() {
      currentRequestId += 1
    },
  }
}
