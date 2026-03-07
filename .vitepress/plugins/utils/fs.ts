import fs from 'node:fs'
import { getErrorMessage } from '../../theme/utils/error.js'

/**
 * Read a file with descriptive error wrapping.
 */
export function readFileSafe(filePath: string, encoding: BufferEncoding = 'utf-8'): string {
  try {
    return fs.readFileSync(filePath, encoding)
  }
  catch (e) {
    throw new Error(`Failed to read ${filePath}: ${getErrorMessage(e)}`)
  }
}

/**
 * Write a file with descriptive error wrapping.
 */
export function writeFileSafe(filePath: string, data: string): void {
  try {
    fs.writeFileSync(filePath, data)
  }
  catch (e) {
    throw new Error(`Failed to write ${filePath}: ${getErrorMessage(e)}`)
  }
}

// Re-export for convenience
export { getErrorMessage }
