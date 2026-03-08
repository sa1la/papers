/**
 * Types for the HTML demo system
 */

export interface HtmlDemoFile {
  name: string
  highlightedHtml: string
  source?: string
}

export interface HtmlDemoOutput {
  files: HtmlDemoFile[]
}
