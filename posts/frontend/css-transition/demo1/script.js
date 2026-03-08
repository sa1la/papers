// 随机着色效果
const colors = ['#e8c88a', '#8ab4e8', '#a8e89a', '#e89ab4', '#c8a8e8']
document.querySelectorAll('.card').forEach((card, i) => {
  card.addEventListener('mouseenter', () => {
    card.querySelector('.dot').style.background = colors[i % colors.length]
  })
  card.addEventListener('mouseleave', () => {
    card.querySelector('.dot').style.background = ''
  })
})
