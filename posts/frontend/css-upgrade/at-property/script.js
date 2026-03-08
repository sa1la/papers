// 渐变滑块控制
const slider = document.getElementById('gradient-slider')
const value = document.getElementById('gradient-value')
const progressBox = document.getElementById('progress-box')

slider.addEventListener('input', () => {
  const angle = slider.value
  value.textContent = `${angle}°`
  progressBox.style.setProperty('--progress', `${(angle / 360) * 100}%`)
})
