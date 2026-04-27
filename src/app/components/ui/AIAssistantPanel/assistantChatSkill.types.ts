/** Optional knowledge-base / skill row shown in the chat composer popover. */
export interface AssistantChatSkillOption {
  readonly id: string
  readonly title: string
  readonly description: string
  /** Renders title with emphasis (e.g. “Add custom” style). */
  readonly tone?: 'default' | 'emphasis'
  /** Icon hint for the list row; defaults from tone. */
  readonly icon?: 'book' | 'plus'
}
