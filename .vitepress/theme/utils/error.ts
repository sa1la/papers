/**
 * Extract a human-readable message from an unknown error value.
 * Handles Error instances, strings, and other types gracefully.
 */
export function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error)
}

/**
 * Extract full error details including stack trace if available.
 * Useful for debugging and logging.
 */
export function getErrorDetails(error: unknown): { message: string, stack?: string } {
  if (error instanceof Error) {
    return { message: error.message, stack: error.stack }
  }
  return { message: String(error) }
}
