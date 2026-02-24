// Favorites data - bookmarks collected over time
// Add new items here, they will be automatically sorted by date (newest first)
// and grouped by year-month on the favorites page

export interface Bookmark {
  title: string
  url: string
  description: string
  date: string // YYYY-MM-DD format
}

export const bookmarks: Bookmark[] = [
  // Example data - add your own bookmarks here
  // {
  //   title: 'Example Site',
  //   url: 'https://example.com',
  //   description: 'A great resource for learning',
  //   date: '2024-02-24',
  // },
]
