// Favorites data - bookmarks collected over time
// Add new items here, they will be automatically sorted by date (newest first)
// and grouped by year-month on the favorites page

export interface Bookmark {
  title: string
  url?: string
  description: string
  descriptionEn?: string
  date: string // YYYY-MM-DD format
  type?: 'article' | 'quote'
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
    title: 'Mathiness: Fake Rigor in Numbers',
    url: 'https://www.votito.com/methods/mathiness',
    description: '识别用数学、科学和统计学语言包装的"新式废话"。从 ICE Score 到 Virginia Mason Quality Equation，作者拆解了那些看似严谨实则无意义的公式，并给出三条修正策略：比较数量级、避免数值量化、严格分桶赋分。',
    descriptionEn: 'Spotting new-school bullshit dressed in math and statistics. From ICE Score to Virginia Mason Quality Equation, the author dismantles formulas that look rigorous but mean nothing, offering three fixes: compare orders of magnitude, avoid numerical quantities, and assign scores to buckets consistently.',
    date: '2024-09-26',
  },
  {
    title: 'The Slow Collapse of Critical Thinking Due to AI',
    url: 'https://www.dutchosintguy.com/post/the-slow-collapse-of-critical-thinking-in-osint-due-to-ai',
    description: '基于微软 Lee 等人 2025 年的研究，文章论证了用户对 AI 的信心与批判性思维的衰退呈正相关。当工具快速、自信、清晰地给出结果时，经验丰富的专业人士也会放弃验证与质疑，最终沦为"自动化操作员"而非"调查者"。',
    descriptionEn: 'Based on Microsoft\'s Lee et al. (2025) study, the article argues that user confidence in AI correlates with declining critical thinking. When tools respond quickly and confidently, even experienced professionals stop verifying and questioning, becoming \'automation operators\' rather than investigators.',
    date: '2025-11-17',
  },
  {
    title: 'Suffering-Oriented Programming',
    url: 'http://nathanmarz.com/blog/suffering-oriented-programming.html',
    description: 'Nathan Marz 以构建 Storm 的亲身经历，提出"先让它能跑 → 再让它优雅 → 再让它快"的三阶段方法论。强调只有亲身感受到痛苦，才值得投入资源构建抽象；过早的泛化只会制造复杂度灾难。',
    descriptionEn: 'Nathan Marz shares the three-phase methodology from building Storm: first make it possible, then make it beautiful, then make it fast. Only invest in abstractions when you feel the pain; premature generalization breeds complexity.',
    date: '2012-02-06',
  },
  {
    title: 'Black Mirror Is Pessimism Porn, Not Plato\'s Parable',
    url: 'https://www.theguardian.com/technology/2025/apr/10/black-mirror-tv-show-pessimism',
    description: '文章以 GMO 粮食援助、德国弃核、菲律宾核电等历史案例，论证了"技术恐慌症"的现实危害——它让我们逃离未来的推测性风险，奔向过去已被证实的危险。引用 Jill Lepore 的"Frankenstein fallacy"概念，指出简化版反乌托邦叙事在政治上有用，但在建设性上毫无价值。',
    descriptionEn: 'Using historical cases like GMO food aid, Germany\'s nuclear exit, and the Philippines\' unused nuclear plant, the article argues that techno-pessimism drives us from speculative future risks toward proven past dangers. Cites Jill Lepore\'s \'Frankenstein fallacy\' to show reductive dystopian narratives are politically useful but constructively bankrupt.',
    date: '2025-04-10',
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
  {
    title: 'Hans Hofmann',
    description: '简化的能力意味着消除不必要的东西，让必要的东西发声。',
    descriptionEn: 'The ability to simplify means to eliminate the unnecessary so that the necessary may speak.',
    date: '2026-05-15',
    type: 'quote',
  },
  {
    title: 'David Craib',
    description: '设计永远不该说「看我」，它应该说「看这个」。',
    descriptionEn: 'Design should never say, "Look at me." It should always say, "Look at this."',
    date: '2026-05-15',
    type: 'quote',
  },
  {
    title: 'Leisa Reichelt',
    description: '不要为所有人设计。这不可能。最终你只会做出让所有人都不满意的设计。',
    descriptionEn: 'Don\'t design for everyone. It\'s impossible. All you end up doing is designing something that makes everyone unhappy.',
    date: '2026-05-15',
    type: 'quote',
  },
]
