import { useMemo } from 'react'

import { Theme } from '../../../styles/dataPortalAppTheme'

/**
 * Returns resolved CSS string values for chart theming.
 * All values come from Prism overrides which reference --app-* CSS variables,
 * so they automatically adapt to light/dark mode.
 */
export function useChartTheme() {
  return useMemo(
    () => ({
      gridStroke: String(Theme.usage.color.border.default),
      axisStroke: String(Theme.usage.color.border.default),
      tickFill: String(Theme.usage.color.text.subdued.default),
      textColor: String(Theme.usage.color.text.default),
      tooltipBg: String(Theme.usage.color.background.elevated.default),
      tooltipBorder: String(Theme.usage.color.border.default),
      tooltipText: String(Theme.usage.color.text.default),
      tooltipSubdued: String(Theme.usage.color.text.subdued.default),
    }),
    []
  )
}

export function getGridStroke(): string {
  return String(Theme.usage.color.border.default)
}

export function getAxisStroke(): string {
  return String(Theme.usage.color.border.default)
}

export function getTickFill(): string {
  return String(Theme.usage.color.text.subdued.default)
}
