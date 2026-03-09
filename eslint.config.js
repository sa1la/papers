import antfu from '@antfu/eslint-config'

export default antfu(
  {
    typescript: true,
    javascript: true,
    vue: true,
    markdown: false,
    formatters: {
      css: false,
      markdown: true,
      html: true,
    },
    rules: {
      'style/no-tabs': 'off',
      'no-console': 'warn',
    },
  },
  {
    files: ['demos/**/*'],
    rules: {
      'no-console': 'off',
    },
  },
  {
    ignores: ['public/vue-runtime.esm-browser.js'],
  },
)
