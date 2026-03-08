const itemList = document.getElementById('item-list')
const addBtns = document.querySelectorAll('.add-btn')
const clearBtn = document.querySelector('.clear-btn')
let itemCounter = 0

const typeNames = {
  fade: '淡入元素',
  slide: '滑入元素',
  scale: '缩放元素',
  rotate: '旋转元素',
}

addBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    const type = btn.dataset.type
    addItem(type)
  })
})

clearBtn.addEventListener('click', () => {
  itemList.innerHTML = ''
  itemCounter = 0
})

function addItem(type) {
  itemCounter++
  const item = document.createElement('div')
  item.className = `item ${type}`

  const nameSpan = document.createElement('span')
  nameSpan.textContent = typeNames[type]

  const numSpan = document.createElement('span')
  numSpan.className = 'item-number'
  numSpan.textContent = `#${itemCounter}`

  item.appendChild(nameSpan)
  item.appendChild(numSpan)
  itemList.appendChild(item)

  // 滚动到底部
  itemList.scrollTop = itemList.scrollHeight
}
