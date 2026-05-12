// Favorites data - bookmarks collected over time
// Add new items here, they will be automatically sorted by date (newest first)
// and grouped by year-month on the favorites page

export interface Bookmark {
  title: string
  url: string
  description: string
  descriptionEn?: string
  date: string // YYYY-MM-DD format
}

export const bookmarks: Bookmark[] = [
  {
    title: 'The Peril of Laziness, Lost',
    url: 'https://bcantrill.dtrace.org/2026/04/12/the-peril-of-laziness-lost/',
    description: 'Larry Wall 的「懒惰」是一种需要艰苦智力工作的美德——它驱使程序员创造简洁抽象以避免未来重复劳动。LLM 不受时间约束，不会追求简洁，只会堆砌代码；工具应当服务于人的美德性懒惰，而非让虚假勤奋泛滥。',
    descriptionEn: 'Larry Wall\'s "laziness" is a virtue that demands hard intellectual work — it drives programmers to create crisp abstractions to spare future toil. LLMs, unconstrained by time, do not seek simplicity but pile on garbage. Tools should serve our virtuous laziness, not let performative industriousness run rampant.',
    date: '2026-04-12',
  },
]
