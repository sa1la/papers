/**
 * VueDemo type definitions
 */

export interface VueDemoFile {
  name: string
  source: string
  highlightedHtml: string
}

export interface VueDemoOutput {
  files: VueDemoFile[]
}
