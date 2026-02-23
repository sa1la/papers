import antfu from '@antfu/eslint-config'

export default antfu(
  {
    typescript: true,
    javascript: true,
    vue: true,
    markdown: true,
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
)
