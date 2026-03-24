import { Theme } from '@doordash/prism-react';

export { Theme };

export const prismSpace = Theme.usage.space;
export const prismFontSize = Theme.usage.fontSize;
export const prismBorderRadius = Theme.usage.borderRadius;

export const colors = {
  background: '#ffffff',
  backgroundSecondary: '#fafafa',
  foreground: '#1a1a2e',
  card: '#ffffff',
  cardForeground: '#1a1a2e',
  primary: '#030213',
  primaryForeground: '#ffffff',
  secondary: '#f0f0f4',
  secondaryForeground: '#030213',
  muted: '#ececf0',
  mutedForeground: '#717182',
  accent: '#e9ebef',
  accentForeground: '#030213',
  destructive: '#d4183d',
  destructiveForeground: '#ffffff',
  border: 'rgba(0, 0, 0, 0.06)',
  borderStrong: 'rgba(0, 0, 0, 0.10)',
  input: 'transparent',
  inputBackground: '#f3f3f5',
  ddPrimary: '#FF3A00',
  ddGray900: '#1a1a1a',
  ddGray700: '#4a4a4a',
  ddGray300: '#d1d5db',
  ddGray100: '#f3f4f6',
  ddSuccess: '#10b981',
  ddWarning: '#f59e0b',
  ddError: '#ef4444',
  ddInfo: '#3b82f6',
  violet50: '#f5f3ff',
  violet100: '#ede9fe',
  violet200: '#ddd6fe',
  violet400: '#a78bfa',
  violet500: '#8b5cf6',
  violet600: '#7c3aed',
  violet700: '#6d28d9',
  cyan400: '#22d3ee',
  slate50: '#f8fafc',
  slate100: '#f1f5f9',
  slate200: '#e2e8f0',
  slate300: '#cbd5e1',
  slate400: '#94a3b8',
  slate500: '#64748b',
  slate600: '#475569',
  slate700: '#334155',
  slate800: '#1e293b',
  slate900: '#0f172a',
  slate950: '#020617',
  green600: '#16a34a',
  red600: '#dc2626',
  yellow600: '#ca8a04',
  blue600: '#2563eb',
  purple50: '#faf5ff',
  purple100: '#f3e8ff',
  purple200: '#e9d5ff',
  purple400: '#c084fc',
  purple500: '#a855f7',
  purple600: '#9333ea',
  purple700: '#7e22ce',
  purple800: '#6b21a8',
  rose50: '#fff1f2',
  rose200: '#fecdd3',
  rose400: '#fb7185',
  rose500: '#f43f5e',
  emerald400: '#34d399',
  emerald500: '#10b981',
  white: '#ffffff',
  black: '#000000',
} as const;

export const spacing = {
  0: Theme.usage.space.none,
  0.5: Theme.usage.space.xxxSmall,
  1: Theme.usage.space.xxSmall,
  1.5: '6px',
  2: Theme.usage.space.xSmall,
  2.5: '10px',
  3: Theme.usage.space.small,
  4: Theme.usage.space.medium,
  5: '20px',
  6: Theme.usage.space.large,
  8: Theme.usage.space.xLarge,
  10: Theme.usage.space.xxLarge,
  12: Theme.usage.space.xxxLarge,
  16: '64px',
} as const;

export const radius = {
  sm: Theme.usage.borderRadius.medium,
  md: '10px',
  lg: Theme.usage.borderRadius.large,
  xl: Theme.usage.borderRadius.xLarge,
  '2xl': Theme.usage.borderRadius.xLarge,
  '3xl': '20px',
  full: Theme.usage.borderRadius.full,
} as const;

export const shadows = {
  xs: '0 1px 2px rgba(0, 0, 0, 0.04)',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  card: '0 1px 3px rgba(0, 0, 0, 0.03), 0 2px 8px rgba(0, 0, 0, 0.03)',
  cardHover: '0 4px 12px rgba(0, 0, 0, 0.06), 0 8px 24px rgba(0, 0, 0, 0.04)',
  popover: '0 4px 16px rgba(0, 0, 0, 0.08), 0 12px 40px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
} as const;

export const fonts = {
  base: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  mono: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
} as const;

export const glassPanel = `
  background: rgba(255, 255, 255, 0.82);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  box-shadow: 0 2px 24px rgba(0, 0, 0, 0.04), 0 0 1px rgba(0, 0, 0, 0.06);
`;

export const glassPanelSubtle = `
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  box-shadow: 0 1px 12px rgba(0, 0, 0, 0.03), 0 0 1px rgba(0, 0, 0, 0.04);
`;

export const glassPanelChat = `
  background: linear-gradient(165deg, rgba(245, 243, 255, 0.88) 0%, rgba(238, 240, 255, 0.82) 50%, rgba(243, 240, 255, 0.78) 100%);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  box-shadow: 0 2px 24px rgba(99, 82, 175, 0.06), 0 0 1px rgba(99, 82, 175, 0.1);
`;

export const glassHero = `
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(28px);
  -webkit-backdrop-filter: blur(28px);
  box-shadow: 0 8px 32px rgba(139, 92, 246, 0.08), 0 0 1px rgba(0, 0, 0, 0.08);
`;
