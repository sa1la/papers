<script setup>
import { computed, ref } from 'vue'

const colors = ['#e8c88a', '#8ab4e8', '#a8e89a', '#e89ab4', '#c8a8e8']
const activeIndex = ref(null)

const dotColors = computed(() => {
  return colors.map((color, i) =>
    activeIndex.value === i ? color : 'var(--dot-inactive)',
  )
})
</script>

<template>
  <div class="container">
    <div
      v-for="(color, i) in colors"
      :key="i"
      class="card"
      @mouseenter="activeIndex = i"
      @mouseleave="activeIndex = null"
    >
      <div class="dot" :style="{ background: dotColors[i] }" />
      <p>hover me</p>
    </div>
  </div>
</template>

<style scoped>
/* Demo-specific theme variables */
:root {
  --dot-inactive: #333;
  --card-border-hover: rgba(255, 255, 255, 0.4);
  --card-bg-hover: rgba(255, 255, 255, 0.04);
  --text-hover: rgba(255, 255, 255, 0.7);
}

:root[data-theme="light"] {
  --dot-inactive: #ccc;
  --card-border-hover: rgba(0, 0, 0, 0.4);
  --card-bg-hover: rgba(0, 0, 0, 0.04);
  --text-hover: rgba(0, 0, 0, 0.8);
}

.container {
  display: flex;
  flex-direction: row;
  gap: 1.5rem;
}

.card {
  width: 120px;
  height: 140px;
  border: 1px solid var(--card-border);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  cursor: pointer;
  transition:
    border-color 0.3s,
    background 0.3s;
}

.card:hover {
  border-color: var(--card-border-hover);
  background: var(--card-bg-hover);
}

.dot {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  transition:
    background 0.4s,
    transform 0.4s;
}

.card:hover .dot {
  transform: scale(1.2);
}

p {
  color: var(--text-color);
  font-size: 0.75rem;
  letter-spacing: 0.05em;
  transition: color 0.3s;
}

.card:hover p {
  color: var(--text-hover);
}
</style>
