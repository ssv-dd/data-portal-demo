import { Theme } from '@doordash/prism-react'

export { Theme }

export const prismFontSize = Theme.usage.fontSize

export const colors = {
  background: 'var(--app-bg)',
  backgroundSecondary: 'var(--app-bg-secondary)',
  foreground: 'var(--app-fg)',
  card: 'var(--app-card)',
  cardForeground: 'var(--app-card-fg)',
  primary: 'var(--app-primary)',
  primaryForeground: 'var(--app-primary-fg)',
  secondary: 'var(--app-secondary)',
  secondaryForeground: 'var(--app-secondary-fg)',
  muted: 'var(--app-muted)',
  mutedForeground: 'var(--app-muted-fg)',
  accent: 'var(--app-accent)',
  accentForeground: 'var(--app-accent-fg)',
  destructive: 'var(--app-destructive)',
  destructiveForeground: 'var(--app-destructive-fg)',
  border: 'var(--app-border)',
  borderStrong: 'var(--app-border-strong)',
  input: 'transparent',
  inputBackground: 'var(--app-input-bg)',
  ddPrimary: 'var(--app-dd-primary)',
  ddPrimaryFg: 'var(--app-dd-primary-fg)',
  ddGray900: 'var(--app-fg)',
  ddGray700: 'var(--app-muted-fg)',
  ddGray300: 'var(--app-border)',
  ddGray100: 'var(--app-bg-secondary)',
  ddSuccess: 'var(--app-success)',
  ddWarning: 'var(--app-warning)',
  ddError: 'var(--app-error)',
  ddInfo: 'var(--app-info)',
  violet50: 'var(--app-violet-50)',
  violet100: 'var(--app-violet-100)',
  violet200: 'var(--app-violet-200)',
  violet400: 'var(--app-violet-400)',
  violet500: 'var(--app-violet-500)',
  violet600: 'var(--app-violet-600)',
  violet700: 'var(--app-violet-700)',
  cyan400: 'var(--app-cyan-400)',
  slate50: 'var(--app-slate-50)',
  slate100: 'var(--app-slate-100)',
  slate200: 'var(--app-slate-200)',
  slate300: 'var(--app-slate-300)',
  slate400: 'var(--app-slate-400)',
  slate500: 'var(--app-slate-500)',
  slate600: 'var(--app-slate-600)',
  slate700: 'var(--app-slate-700)',
  slate800: 'var(--app-slate-800)',
  slate900: 'var(--app-slate-900)',
  slate950: 'var(--app-slate-950)',
  green600: 'var(--app-green-600)',
  red600: 'var(--app-red-600)',
  yellow600: 'var(--app-yellow-600)',
  blue600: 'var(--app-blue-600)',
  purple50: 'var(--app-purple-50)',
  purple100: 'var(--app-purple-100)',
  purple200: 'var(--app-purple-200)',
  purple400: 'var(--app-purple-400)',
  purple500: 'var(--app-purple-500)',
  purple600: 'var(--app-purple-600)',
  purple700: 'var(--app-purple-700)',
  purple800: 'var(--app-purple-800)',
  rose50: 'var(--app-rose-50)',
  rose200: 'var(--app-rose-200)',
  rose400: 'var(--app-rose-400)',
  rose500: 'var(--app-rose-500)',
  emerald400: 'var(--app-emerald-400)',
  emerald500: 'var(--app-emerald-500)',
  white: 'var(--app-white)',
  black: 'var(--app-black)',
  segmentedBg: 'var(--app-segmented-bg)',
  segmentedBorder: 'var(--app-segmented-border)',
  segmentedInactive: 'var(--app-segmented-inactive)',
  segmentedHover: 'var(--app-segmented-hover)',
  personaBorder: 'var(--app-persona-border)',
  personaBg: 'var(--app-persona-bg)',
  personaText: 'var(--app-persona-text)',
  navLabel: 'var(--app-nav-label)',
  violetButton: 'var(--app-violet-button)',
  violetButtonHover: 'var(--app-violet-button-hover)',
} as const

export const radius = {
  sm: Theme.usage.borderRadius.medium,
  md: '10px',
  lg: Theme.usage.borderRadius.large,
  xl: Theme.usage.borderRadius.xLarge,
  '2xl': Theme.usage.borderRadius.xLarge,
  '3xl': '20px',
  full: Theme.usage.borderRadius.full,
} as const

export const shadows = {
  xs: '0 1px 2px rgba(0, 0, 0, 0.04)',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  card: '0 1px 3px rgba(0, 0, 0, 0.03), 0 2px 8px rgba(0, 0, 0, 0.03)',
  cardHover: '0 4px 12px rgba(0, 0, 0, 0.06), 0 8px 24px rgba(0, 0, 0, 0.04)',
  popover: '0 4px 16px rgba(0, 0, 0, 0.08), 0 12px 40px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
} as const

export const glassPanel = `
  background: var(--app-glass-bg);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  box-shadow: 0 2px 24px rgba(0, 0, 0, 0.04), 0 0 1px rgba(0, 0, 0, 0.06);
`

export const glassHero = `
  background: var(--app-glass-hero-bg);
  backdrop-filter: blur(28px);
  -webkit-backdrop-filter: blur(28px);
  box-shadow: 0 8px 32px rgba(139, 92, 246, 0.08), 0 0 1px rgba(0, 0, 0, 0.08);
`
