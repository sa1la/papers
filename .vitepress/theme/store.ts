import { defineStore } from 'pinia'

export const useBlogStore = defineStore('blog', {
  state() {
    return {
      selectedCat: '',
      selectedTag: '',
    }
  },
  getters: {},
  actions: {
    updateSelectedCat(catName: string) {
      this.selectedCat = catName
    },
    updateSelectedTag(tagName: string) {
      this.selectedTag = tagName
    },

  },
})
