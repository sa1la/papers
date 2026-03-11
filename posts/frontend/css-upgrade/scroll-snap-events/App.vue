<script setup>
import { onMounted, onUnmounted, ref } from 'vue'

const items = [
  { number: '01', title: '第一章' },
  { number: '02', title: '第二章' },
  { number: '03', title: '第三章' },
  { number: '04', title: '第四章' },
  { number: '05', title: '第五章' },
]

const currentItem = ref('-')
const scrollState = ref('空闲')
const isScrolling = ref(false)
const activeIndex = ref(2)
const scrollerRef = ref(null)

let scrollTimeout = null
let supportsSnapEvents = false

function updateActiveItemByPosition() {
  const scroller = scrollerRef.value
  if (!scroller)
    return

  const children = [...scroller.children]
  if (!children.length)
    return

  const scrollerRect = scroller.getBoundingClientRect()
  const centerX = scrollerRect.left + scrollerRect.width / 2

  let bestIndex = 0
  let bestDistance = Infinity

  children.forEach((el, index) => {
    const rect = el.getBoundingClientRect()
    const itemCenterX = rect.left + rect.width / 2
    const distance = Math.abs(itemCenterX - centerX)
    if (distance < bestDistance) {
      bestDistance = distance
      bestIndex = index
    }
  })

  activeIndex.value = bestIndex
  currentItem.value = items[bestIndex].title
}

function handleSnapChanging(event) {
  const scroller = scrollerRef.value
  if (!scroller)
    return
  const targetIndex = [...scroller.children].indexOf(event.snapTargetInline)
  if (targetIndex !== -1) {
    currentItem.value = items[targetIndex].title
    scrollState.value = '吸附中...'
    isScrolling.value = true
  }
}

function handleSnapChange(event) {
  const scroller = scrollerRef.value
  if (!scroller)
    return
  const targetIndex = [...scroller.children].indexOf(event.snapTargetInline)
  if (targetIndex !== -1) {
    activeIndex.value = targetIndex
    scrollState.value = '已锁定'
    isScrolling.value = false
  }
}

function handleScroll() {
  scrollState.value = '滚动中...'
  isScrolling.value = true

  if (scrollTimeout)
    clearTimeout(scrollTimeout)
  scrollTimeout = setTimeout(() => {
    // 在不支持 Scroll Snap 事件的浏览器中，退化为基于位置的检测
    if (!supportsSnapEvents)
      updateActiveItemByPosition()

    scrollState.value = '已锁定'
    isScrolling.value = false
  }, 150)
}

onMounted(() => {
  const scroller = scrollerRef.value
  if (!scroller)
    return

  // 特性检测：仅在支持 scroll snap 事件的浏览器中注册
  supportsSnapEvents = 'onscrollsnapchange' in scroller || 'onscrollsnapchange' in window

  if (supportsSnapEvents) {
    scroller.addEventListener('scrollsnapchanging', handleSnapChanging)
    scroller.addEventListener('scrollsnapchange', handleSnapChange)
  }
  scroller.addEventListener('scroll', handleScroll)

  // 初始化中间项
  currentItem.value = items[2].title
})

onUnmounted(() => {
  const scroller = scrollerRef.value
  if (scroller) {
    scroller.removeEventListener('scrollsnapchanging', handleSnapChanging)
    scroller.removeEventListener('scrollsnapchange', handleSnapChange)
    scroller.removeEventListener('scroll', handleScroll)
  }
  if (scrollTimeout)
    clearTimeout(scrollTimeout)
})

function scrollToItem(index) {
  const scroller = scrollerRef.value
  if (!scroller)
    return
  const item = scroller.children[index]
  item?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
}
</script>

<template>
  <div class="container">
    <div class="info-panel">
      <div class="info-item">
        <span class="label">当前聚焦</span>
        <span class="value">{{ currentItem }}</span>
      </div>
      <div class="info-item">
        <span class="label">滚动状态</span>
        <span class="value" :class="{ scrolling: isScrolling }">{{ scrollState }}</span>
      </div>
    </div>

    <div class="scroller-wrapper">
      <div ref="scrollerRef" class="scroller">
        <div
          v-for="(item, index) in items"
          :key="index"
          class="snap-item"
          :class="{ active: activeIndex === index }"
          @click="scrollToItem(index)"
        >
          <span class="number">{{ item.number }}</span>
          <span class="title">{{ item.title }}</span>
        </div>
      </div>
    </div>

    <div class="hint">
      <p>← 左右滑动或拖拽查看 →</p>
      <p class="sub">
        监听 scrollsnapchanging 和 scrollsnapchange 事件
      </p>
    </div>
  </div>
</template>

<style scoped>
.container {
  gap: 0.875rem;
}

/* 信息面板 */
.info-panel {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.info-item {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: 10px;
  padding: 0.875rem;
  text-align: center;
}

.label {
  display: block;
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-bottom: 0.5rem;
  letter-spacing: 0.05em;
  text-transform: lowercase;
}

.value {
  display: block;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--accent);
  font-family: monospace;
}

.value.scrolling {
  color: var(--accent-2);
}

/* 滚动容器 */
.scroller-wrapper {
  position: relative;
  max-width: 340px;
  margin-inline: auto;
}

.scroller {
  display: flex;
  gap: 0.875rem;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  padding: 0.75rem;
  margin: -0.75rem;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.scroller::-webkit-scrollbar {
  display: none;
}

.snap-item {
  flex: 0 0 200px;
  height: 160px;
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: 16px;
  scroll-snap-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  transition: all 0.3s;
  cursor: grab;
}

.snap-item:active {
  cursor: grabbing;
}

.snap-item.active {
  border-color: var(--accent);
  background: rgba(138, 180, 232, 0.08);
  transform: scale(1.05);
}

.number {
  font-size: 2.5rem;
  font-weight: 300;
  color: var(--text-color);
  font-family: monospace;
  opacity: 0.5;
  transition: opacity 0.3s;
}

.snap-item.active .number {
  opacity: 1;
  color: var(--accent);
}

.title {
  font-size: 0.9rem;
  color: var(--text-muted);
  letter-spacing: 0.02em;
}

.snap-item.active .title {
  color: var(--text-color);
}

/* 提示 */
.hint {
  text-align: center;
}

.hint p {
  color: var(--text-color);
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.hint .sub {
  color: var(--text-muted);
  font-size: 0.75rem;
}
</style>
