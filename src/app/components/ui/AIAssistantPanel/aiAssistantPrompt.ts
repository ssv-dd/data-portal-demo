/**
 * Prepends optional host context to the user message for the Ask Data AI API.
 * Supports dynamic parameters in customPrompt using {{paramName}} syntax.
 * When `customPrompt` is omitted or blank, returns `text` unchanged (aside from trim).
 *
 * @example
 * applyCustomPromptToUserMessage('my question', 'Use {{sql}} context', { sql: 'SELECT * FROM users' })
 * // Returns: 'Use SELECT * FROM users context\n\nmy question'
 */
export function applyCustomPromptToUserMessage(
  text: string,
  customPrompt?: string,
  params?: Record<string, string>
): string {
  const trimmed = text.trim()
  if (!customPrompt?.trim()) {
    return trimmed
  }

  let processedPrompt = customPrompt.trim()

  // Replace dynamic parameters using {{paramName}} syntax
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g')
      processedPrompt = processedPrompt.replace(regex, value || '')
    })
  }

  return `${processedPrompt}\n\n${trimmed}`
}

/**
 * Inverse of {@link applyCustomPromptToUserMessage}: strips the prepended `customPrompt`
 * (plus the same `\n\n` separator) from a full outgoing payload so the UI can show only
 * what the user typed. If `customPrompt` is blank or the payload does not start with that
 * prefix, returns the trimmed full string unchanged.
 */
export function extractUserWrittenPrompt(fullOutgoing: string, customPromptMatch?: RegExp): string {
  const trimmed = fullOutgoing.trim()
  const prefix = customPromptMatch
  if (!prefix) {
    return trimmed
  }
  const userText = fullOutgoing.replace(customPromptMatch, '').trim()
  return userText
}
