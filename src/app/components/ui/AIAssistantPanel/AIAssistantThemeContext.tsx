import type { ThemeType } from '@doordash/prism-react'
import * as React from 'react'

const AIAssistantThemeContext = React.createContext<ThemeType | null>(null)

export interface AIAssistantThemeProviderProps {
  /** Prism resolved theme tokens — pass the **`Theme`** export, e.g. `value={Theme}` (type is `ThemeType`). */
  readonly value: ThemeType
  readonly children: React.ReactNode
}

export function AIAssistantThemeProvider({ value, children }: AIAssistantThemeProviderProps) {
  return <AIAssistantThemeContext.Provider value={value}>{children}</AIAssistantThemeContext.Provider>
}

/**
 * Resolved Prism theme tokens (`ThemeType`). Use with `<AIAssistantThemeProvider value={Theme}>`.
 * Pass a type argument only if you use a custom theme object that extends the default shape.
 */
export function useAIAssistantTheme<T extends ThemeType = ThemeType>(): T {
  const ctx = React.useContext(AIAssistantThemeContext)
  if (!ctx) {
    throw new Error(
      'useAIAssistantTheme must be used within AIAssistantThemeProvider (pass Prism `Theme` as `value`, typed as ThemeType).'
    )
  }
  return ctx as T
}
