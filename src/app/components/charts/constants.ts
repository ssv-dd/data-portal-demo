/**
 * Chart-system-wide defaults and color palettes.
 *
 * Palette tokens reference --app-* CSS variables so they
 * auto-switch between light and dark themes.
 */

export const CHART_PALETTE = [
  'var(--app-violet-500)',
  'var(--app-cyan-400)',
  'var(--app-rose-500)',
  'var(--app-emerald-500)',
  'var(--app-yellow-600)',
  'var(--app-blue-600)',
  'var(--app-purple-500)',
  'var(--app-rose-400)',
  'var(--app-green-600)',
  'var(--app-red-600)',
  'var(--app-violet-400)',
  'var(--app-emerald-400)',
] as const

export const CHART_DEFAULTS = {
  height: 400,
  animationDuration: 800,
  animationEasing: 'ease-out' as const,
  barRadius: 4,
  barSize: 32,
  strokeWidth: 2,
  fillOpacity: 0.15,
  donutInnerRadiusRatio: 0.55,
  brushHeight: 40,
  maxTickChars: 14,
  dotRadius: 3,
  activeDotRadius: 5,
} as const

export const CHART_MARGINS = {
  top: 8,
  right: 12,
  bottom: 8,
  left: 0,
} as const

export const CHART_FONT = {
  family: 'inherit',
  tickSize: 11,
  labelSize: 12,
} as const
