/**
 * Demo Theme Switcher
 */
(function () {
  window.addEventListener('message', (e) => {
    if (e.data?.type === 'theme') {
      document.documentElement.setAttribute('data-theme', e.data.isDark ? 'dark' : 'light')
    }
  })
  if (window.parent !== window) {
    window.parent.postMessage({ type: 'demo-ready' }, '*')
  }
})()
