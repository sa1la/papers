<script setup lang='ts'>
import type { FunctionalComponent } from 'vue'

const props = defineProps<{
  text: string
  icon?: FunctionalComponent
}>()
</script>

<template>
  <div class="page-title">
    <div class="title-content">
      <component
        :is="props.icon"
        v-if="props.icon"
        class="title-icon"
      />
      <h1 class="title-text">
        {{ props.text }}
      </h1>
    </div>
    <div class="title-underline" />
  </div>
</template>

<style scoped>
.page-title {
  padding: 2rem 0 2.5rem;
  text-align: center;
}

.title-content {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.title-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: var(--vp-c-text-3);
  stroke-width: 1.5;
}

.title-text {
  font-size: 1.5rem;
  font-weight: 300;
  color: var(--vp-c-text-2);
  margin: 0;
  letter-spacing: 0.05em;
  font-family: var(--vp-font-family-mono);
  text-transform: lowercase;
}

.title-underline {
  width: 1.5rem;
  height: 1px;
  background: var(--vp-c-text-3);
  margin: 1rem auto 0;
  opacity: 0.5;
  transition: width 0.3s ease, opacity 0.3s ease;
}

.page-title:hover .title-underline {
  width: 3rem;
  opacity: 0.8;
}

@media (max-width: 640px) {
  .page-title {
    padding: 1.5rem 0 2rem;
  }

  .title-text {
    font-size: 1.25rem;
  }

  .title-icon {
    width: 1rem;
    height: 1rem;
  }

  .title-underline {
    width: 1.25rem;
  }

  .page-title:hover .title-underline {
    width: 2rem;
  }
}
</style>
