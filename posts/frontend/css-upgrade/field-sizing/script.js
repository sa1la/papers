// 添加一些示例交互
document.querySelectorAll('.auto-input, .auto-textarea').forEach((input) => {
  // 输入时添加微妙的反馈
  input.addEventListener('input', () => {
    input.style.borderColor = 'var(--accent-color)'
    setTimeout(() => {
      input.style.borderColor = ''
    }, 300)
  })
})
