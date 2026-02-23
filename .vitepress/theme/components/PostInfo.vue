<script setup lang='ts'>
import { useBlogStore } from '../store'

const props = defineProps<{
  date: string
  category: string | undefined
}>()

const blogStore = useBlogStore()

const root = ''
function selectCat() {
  blogStore.selectedCat = props.category || ''
}
</script>

<template>
  <dl class="pb-2">
    <dt class="text-base text-gray-500 leading-6 font-medium flex justify-between dark:text-gray-300">
      <span class="theme-date">{{ date }}</span>
      <a
        v-show="category"
        class="font-medium ml-5 hover:underline"
        :href="`${root}/category`"
        @click="selectCat"
      >
        {{ category }}
      </a>
    </dt>
  </dl>
</template>
