<script setup>
import { ref } from 'vue'

const items = ref([])
let itemCounter = 0

const typeNames = {
  fade: '淡入元素',
  slide: '滑入元素',
  scale: '缩放元素',
  rotate: '旋转元素',
}

function addItem(type) {
  itemCounter++
  items.value.push({
    id: itemCounter,
    type,
    name: typeNames[type],
  })
}

function clearItems() {
  items.value = []
  itemCounter = 0
}
</script>

<template>
  <div class="container">
    <div class="demo-section">
      <h3>点击添加新元素</h3>
      <div class="button-group">
        <button class="btn" @click="addItem('fade')">
          淡入
        </button>
        <button class="btn" @click="addItem('slide')">
          滑入
        </button>
        <button class="btn" @click="addItem('scale')">
          缩放
        </button>
        <button class="btn" @click="addItem('rotate')">
          旋转
        </button>
      </div>
    </div>

    <div class="demo-section">
      <div class="items-header">
        <h3>元素列表</h3>
        <button v-if="items.length > 0" class="btn btn-clear" @click="clearItems">
          清空
        </button>
      </div>
      <div class="items-list">
        <TransitionGroup name="item">
          <div
            v-for="item in items"
            :key="item.id"
            class="item"
            :class="item.type"
          >
            <span class="item-name">{{ item.name }}</span>
            <span class="item-id">#{{ item.id }}</span>
          </div>
        </TransitionGroup>
        <div v-if="items.length === 0" class="empty-tip">
          点击上方按钮添加新元素，观察入场动画
        </div>
      </div>
    </div>

    <div class="hint">
      <p>使用 @starting-style 定义新元素的初始状态</p>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.demo-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.demo-section h3 {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-muted);
  letter-spacing: 0.02em;
}

.button-group {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.btn {
  padding: 0.5rem 1rem;
  border: 1px solid var(--card-border);
  border-radius: 8px;
  background: var(--card-bg);
  color: var(--text-color);
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn:hover {
  border-color: var(--accent);
  background: rgba(138, 180, 232, 0.08);
}

.btn-clear {
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  color: var(--text-muted);
}

.items-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.items-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-height: 100px;
}

.item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: 10px;
  transition: all 0.3s;
}

.item-name {
  font-size: 0.9rem;
}

.item-id {
  font-size: 0.75rem;
  color: var(--text-muted);
  font-family: monospace;
}

.empty-tip {
  text-align: center;
  padding: 2rem;
  color: var(--text-muted);
  font-size: 0.85rem;
  border: 1px dashed var(--card-border);
  border-radius: 10px;
}

/* 淡入效果 */
.item.fade {
  border-left: 3px solid #8ab4e8;
}

/* 滑入效果 */
.item.slide {
  border-left: 3px solid #a8e89a;
}

/* 缩放效果 */
.item.scale {
  border-left: 3px solid #e8c88a;
}

/* 旋转效果 */
.item.rotate {
  border-left: 3px solid #e89ab4;
}

/* 入场动画基础 */
.item-enter-active,
.item-leave-active {
  transition: all 0.4s ease;
}

.item-enter-from {
  opacity: 0;
}

.item-leave-to {
  opacity: 0;
}

/* 不同类型的入场初始状态 */
@starting-style {
  .item-enter-from.fade {
    opacity: 0;
  }

  .item-enter-from.slide {
    opacity: 0;
    transform: translateX(-30px);
  }

  .item-enter-from.scale {
    opacity: 0;
    transform: scale(0.5);
  }

  .item-enter-from.rotate {
    opacity: 0;
    transform: rotate(-180deg);
  }
}

/* 非起始状态下的进入动画 */
.item-enter-from.fade {
  opacity: 0;
}

.item-enter-from.slide {
  opacity: 0;
  transform: translateX(-30px);
}

.item-enter-from.scale {
  opacity: 0;
  transform: scale(0.5);
}

.item-enter-from.rotate {
  opacity: 0;
  transform: rotate(-180deg);
}

.hint {
  text-align: center;
  padding: 0.5rem;
}

.hint p {
  color: var(--text-muted);
  font-size: 0.8rem;
}
</style>
