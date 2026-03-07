/**
 * Shared types for the playground system
 */

export type LogEntry
  = | { type: 'log' | 'warn' | 'error', args: string[] }
    | { type: 'bench', label: string, ms: number, min: number, max: number, n: number }

export interface FileEntry {
  name: string
  highlightedHtml: string
  source?: string
}

export interface JsOutput {
  files: FileEntry[]
  logs: LogEntry[]
  error: string | null
  executedAt: string
}

export interface GoOutput {
  stdout: string
  stderr: string
  exitCode: number
  executedAt: string
  files: FileEntry[]
}
