/**
 * Prism theming types (from `@doordash/prism-react`):
 *
 * - **`ThemeType`** — shape of the resolved token object (`typeof Theme`). Pass **`value={Theme}`** to
 *   `AIAssistantThemeProvider`. This is what `AIAssistantPanel` reads via `useAIAssistantTheme()`.
 *
 * - **`ThemingProps`** — props for Prism’s **`<Theming>`** component (`overrides`, `theme` collection, `scope`).
 *   Not the same as the resolved `Theme` object; do not use as `AIAssistantThemeProvider` value.
 *
 * - **`ThemingOverridesType`** — override objects / functions for customizing Prism tokens.
 */
export type { ThemeType, ThemingProps, ThemingOverridesType } from '@doordash/prism-react'
