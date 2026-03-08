const scroller = document.getElementById('scroller')
const currentItem = document.getElementById('current-item')
const scrollState = document.getElementById('scroll-state')
const items = scroller.querySelectorAll('.snap-item')

let scrollTimeout

// 更新活动项
function updateActiveItem(index) {
  items.forEach((item, i) => {
    item.classList.toggle('active', i === index)
  })
}

// 初始化第一项为活动状态
updateActiveItem(2) // 中间项
scroller.scrollTo({
  left: items[2].offsetLeft - scroller.clientWidth / 2 + items[2].clientWidth / 2,
  behavior: 'instant',
})

// scrollsnapchanging 事件 - 即将吸附时触发
scroller.addEventListener('scrollsnapchanging', (event) => {
  const targetIndex = [...items].indexOf(event.snapTargetInline)
  if (targetIndex !== -1) {
    currentItem.textContent = items[targetIndex].querySelector('.title').textContent
    scrollState.textContent = '吸附中...'
    scrollState.classList.add('scrolling')
  }
})

// scrollsnapchange 事件 - 完成吸附后触发
scroller.addEventListener('scrollsnapchange', (event) => {
  const targetIndex = [...items].indexOf(event.snapTargetInline)
  if (targetIndex !== -1) {
    updateActiveItem(targetIndex)
    scrollState.textContent = '已锁定'
    scrollState.classList.remove('scrolling')
  }
})

// 监听滚动状态
scroller.addEventListener('scroll', () => {
  scrollState.textContent = '滚动中...'
  scrollState.classList.add('scrolling')

  clearTimeout(scrollTimeout)
  scrollTimeout = setTimeout(() => {
    if (scrollState.textContent === '滚动中...') {
      scrollState.textContent = '空闲'
      scrollState.classList.remove('scrolling')
    }
  }, 150)
})

// 点击直接滚动到项目
items.forEach((item) => {
  item.addEventListener('click', () => {
    item.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
  })
})
