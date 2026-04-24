import type { LucideIcon } from 'lucide-react'

export interface AIAssistantRecommendation {
  readonly id: string
  readonly label: string
  /**
   * Text sent to the chat API when the pill is clicked (after `chatCustomPrompt` is applied).
   * If omitted, `label` is sent.
   */
  readonly message?: string
  /** Optional Lucide icon shown before the label. */
  readonly icon?: LucideIcon
}

/** Payload passed to Replace Widget / Pin as New Widget callbacks. */
export interface WidgetActionPayload {
  readonly sql: string
  readonly chartType: 'bar' | 'line' | 'area' | 'pie'
  readonly xKey: string
  readonly yKeys: string[]
}
