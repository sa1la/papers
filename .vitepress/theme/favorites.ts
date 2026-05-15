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
  {
    title: 'Thrive in Obscurity',
    url: 'https://www.jeetmehta.com/posts/thrive-in-obscurity',
    description: '创作者不应该期望成功，应该在平静的时间里不断持续创作，提炼自己的才华。',
    descriptionEn: 'Creators should not expect success, but keep creating and refining their craft in quiet times.',
    date: '2026-05-15',
  },
  {
    title: 'Being Too Ambitious Is a Clever Form of Procrastination',
    url: 'https://maalvika.substack.com/p/being-too-ambitious-is-a-clever-form',
    description: '野心过大是自我设障的巧妙形式。数量总会补偿质量——降低标准、拥抱初学者心态、关注过程、将失败视为信息。真正的成长来自于不完美的实践。',
    descriptionEn: 'Being too ambitious is a clever form of self-sabotage. Volume always compensates for quality — lower your standards, embrace the beginner\'s mind, focus on the process, and treat failure as information.',
    date: '2025-06-07',
  },
  {
    title: 'The Great Displacement Is Already Here',
    url: 'https://shawnfromportland.substack.com/p/the-great-displacement-is-already',
    description: '经济不景气与AI革命的双重冲击下，有经验的工程师正在快速贬值。就业市场不再充满机会，一个20年经验的开发者投递800份简历后，最终住进拖车靠送外卖维生。',
    descriptionEn: 'In the current era, experienced engineers are becoming increasingly devalued. The job market is no longer filled with opportunities as economic downturn meets the AI revolution.',
    date: '2025-05-05',
  },
]
