// https://vitepress.dev/guide/custom-theme
import type { Theme } from 'vitepress'
import type { Component } from 'vue'

import { createPinia } from 'pinia'

import DefaultTheme from 'vitepress/theme'
import { defineComponent, h } from 'vue'

import Category from './components/Category.vue'
import Favorites from './components/Favorites.vue'
import Tags from './components/Tags.vue'
import ThemeLayout from './components/ThemeLayout.vue'
import Title from './components/Title.vue'
import './style/tailwind.css'
import './style/index.css'

const pinia = createPinia()

export default {
  extends: DefaultTheme,
  Layout: withInitialize(ThemeLayout),
  enhanceApp({ app }) {
    app.use(pinia)
    app.component('Title', Title)
    app.component('Category', Category)
    app.component('Favorites', Favorites)
    app.component('Tags', Tags)
    // ...
  },
} satisfies Theme

function withInitialize(app: Component) {
  return defineComponent({
    name: 'ConfigProvider',
    setup(_, { slots }) {
      return () => h(app, { class: 'paper-content' }, slots)
    },
  })
}
