/**
 * Demo Theme System
 * Reads initial theme from URL parameter, syncs with parent page via postMessage
 */
(function () {
  function setTheme(isDark) {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light')
    document.documentElement.style.colorScheme = isDark ? 'dark' : 'light'
  }

  // Read initial theme from URL parameter
  const params = new URLSearchParams(location.search)
  const urlTheme = params.get('theme')

  // Apply initial theme (URL param > system preference)
  if (urlTheme === 'dark' || urlTheme === 'light') {
    setTheme(urlTheme === 'dark')
  }
  else {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    setTheme(prefersDark)
  }

  // Only set up postMessage sync when embedded in iframe
  if (window.parent === window)
    return

  // Listen for theme updates from parent page
  function handleMessage(e) {
    // Security: verify message is from parent window
    if (e.source !== window.parent)
      return

    // Validate message data structure
    if (e.data?.type === 'theme' && typeof e.data.isDark === 'boolean') {
      setTheme(e.data.isDark)
    }
  }

  window.addEventListener('message', handleMessage)

  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    window.removeEventListener('message', handleMessage)
  }, { once: true })
})()
