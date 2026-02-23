<script setup lang="ts">
import { useData } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { computed } from 'vue'
import Home from './Home.vue'
import PostFooter from './PostFooter.vue'
import PostHeader from './PostHeader.vue'

const { Layout } = DefaultTheme
const { frontmatter } = useData()

const isHome = computed(() => frontmatter.value.layout === 'home')
</script>

<template>
  <Layout :class="{ 'is-home': isHome }">
    <template #home-hero-after>
      <Home />
    </template>
    <template #doc-before>
      <PostHeader />
    </template>
    <template #doc-after>
      <PostFooter />
    </template>
  </Layout>
</template>
