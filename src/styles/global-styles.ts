import { createGlobalStyle, keyframes } from 'styled-components';
import { fonts, prismFontSize } from './theme';

export const aiPulse = keyframes`
  0%, 100% {
    box-shadow: 0 0 12px rgba(139, 92, 246, 0.15), 0 0 2px rgba(139, 92, 246, 0.1);
    border-color: rgba(139, 92, 246, 0.25);
  }
  50% {
    box-shadow: 0 0 24px rgba(139, 92, 246, 0.25), 0 0 4px rgba(34, 211, 238, 0.15);
    border-color: rgba(139, 92, 246, 0.4);
  }
`;

export const shimmer = keyframes`
  0%, 100% { opacity: 0.7; }
  50% { opacity: 1; filter: drop-shadow(0 0 6px rgba(139, 92, 246, 0.5)); }
`;

export const pulseAnimation = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

export const GlobalStyles = createGlobalStyle`
  :root, html.light {
    --app-bg: #ffffff;
    --app-bg-secondary: #fafafa;
    --app-fg: #1a1a2e;
    --app-card: #ffffff;
    --app-card-fg: #1a1a2e;
    --app-primary: #030213;
    --app-primary-fg: #ffffff;
    --app-secondary: #f0f0f4;
    --app-secondary-fg: #030213;
    --app-muted: #ececf0;
    --app-muted-fg: #717182;
    --app-accent: #e9ebef;
    --app-accent-fg: #030213;
    --app-destructive: #d4183d;
    --app-destructive-fg: #ffffff;
    --app-border: rgba(0, 0, 0, 0.06);
    --app-border-strong: rgba(0, 0, 0, 0.10);
    --app-input-bg: #f3f3f5;
    --app-dd-primary: #FF3A00;
    --app-success: #10b981;
    --app-warning: #f59e0b;
    --app-error: #ef4444;
    --app-info: #3b82f6;

    --app-slate-50: #f8fafc;
    --app-slate-100: #f1f5f9;
    --app-slate-200: #e2e8f0;
    --app-slate-300: #cbd5e1;
    --app-slate-400: #94a3b8;
    --app-slate-500: #64748b;
    --app-slate-600: #475569;
    --app-slate-700: #334155;
    --app-slate-800: #1e293b;
    --app-slate-900: #0f172a;
    --app-slate-950: #020617;

    --app-white: #ffffff;
    --app-black: #000000;

    --app-violet-50: #f5f3ff;
    --app-violet-100: #ede9fe;
    --app-violet-200: #ddd6fe;
    --app-violet-400: #a78bfa;
    --app-violet-500: #8b5cf6;
    --app-violet-600: #7c3aed;
    --app-violet-700: #6d28d9;
    --app-cyan-400: #22d3ee;

    --app-purple-50: #faf5ff;
    --app-purple-100: #f3e8ff;
    --app-purple-200: #e9d5ff;
    --app-purple-400: #c084fc;
    --app-purple-500: #a855f7;
    --app-purple-600: #9333ea;
    --app-purple-700: #7e22ce;
    --app-purple-800: #6b21a8;

    --app-rose-50: #fff1f2;
    --app-rose-200: #fecdd3;
    --app-rose-400: #fb7185;
    --app-rose-500: #f43f5e;
    --app-emerald-400: #34d399;
    --app-emerald-500: #10b981;
    --app-green-600: #16a34a;
    --app-red-600: #dc2626;
    --app-yellow-600: #ca8a04;
    --app-blue-600: #2563eb;

    --app-surface-rgb: 255 255 255;
    --app-muted-rgb: 236 236 240;
    --app-accent-rgb: 233 235 239;
    --app-primary-rgb: 3 2 19;
    --app-fg-rgb: 26 26 46;
    --app-overlay-rgb: 0 0 0;
    --app-muted-fg-rgb: 113 113 130;
    --app-slate50-rgb: 248 250 252;
    --app-slate100-rgb: 241 245 249;
    --app-violet-rgb: 139 92 246;
    --app-violet-deep-rgb: 99 82 175;
    --app-fuchsia-rgb: 217 70 239;
    --app-blue-rgb: 59 130 246;
    --app-purple-rgb: 168 85 247;
    --app-dd-primary-rgb: 255 58 0;
    --app-cyan-rgb: 34 211 238;
    --app-indigo-rgb: 99 102 241;
    --app-destructive-rgb: 212 24 61;
    --app-rose200-rgb: 254 205 211;
    --app-yellow200-rgb: 254 240 138;
    --app-blue200-rgb: 191 219 254;
    --app-purple200-rgb: 233 213 255;
    --app-fuchsia300-rgb: 232 121 249;
    --app-pink300-rgb: 249 168 212;
    --app-purple300-rgb: 216 180 254;
    --app-violet-light-bg: rgba(245, 243, 255, 0.4);
    --app-violet-button: #6352af;
    --app-violet-button-hover: #5646a0;
    --app-route-blue-bg: rgba(219, 234, 254, 1);
    --app-route-violet-bg: rgba(237, 233, 254, 1);
    --app-route-amber-bg: rgba(254, 243, 199, 1);
    --app-route-emerald-bg: rgba(209, 250, 229, 1);
    --app-trend-up-bg: rgba(236, 253, 245, 1);
    --app-trend-down-bg: rgba(254, 242, 242, 1);
    --app-trend-up-change: #059669;
    --app-trend-up-spark: #10b981;
    --app-trend-down-change: #ef4444;
    --app-trend-down-spark: #ef4444;
    --app-route-blue-text: #2563eb;
    --app-route-violet-text: #7c3aed;
    --app-route-amber-text: #d97706;
    --app-route-emerald-text: #059669;
    --app-hover-green-bg: rgba(240, 253, 244, 0.5);
    --app-hover-yellow-bg: rgba(254, 252, 232, 0.5);
    --app-status-success-bg: #dcfce7;
    --app-status-success-bg-light: #f0fdf4;
    --app-status-info-bg: #eff6ff;
    --app-status-warning-bg: #fefce8;
    --app-status-warning-bg-light: #fff7ed;
    --app-status-success-solid: #059669;
    --app-status-error-solid: #e11d48;
    --app-status-info-solid: #2563eb;
    --app-status-success-solid-alt: #16a34a;
    --app-glass-bg: rgba(255, 255, 255, 0.82);
    --app-glass-subtle-bg: rgba(255, 255, 255, 0.6);
    --app-glass-hero-bg: rgba(255, 255, 255, 0.85);
    --app-glass-chat-bg: linear-gradient(165deg, rgba(245, 243, 255, 0.88) 0%, rgba(238, 240, 255, 0.82) 50%, rgba(243, 240, 255, 0.78) 100%);
    --app-nav-bg: rgba(255, 255, 255, 0.8);
  }

  html.dark {
    --app-bg: #0f172a;
    --app-bg-secondary: #1e293b;
    --app-fg: #f1f5f9;
    --app-card: #1e293b;
    --app-card-fg: #f1f5f9;
    --app-primary: #f1f5f9;
    --app-primary-fg: #0f172a;
    --app-secondary: #334155;
    --app-secondary-fg: #f1f5f9;
    --app-muted: #334155;
    --app-muted-fg: #94a3b8;
    --app-accent: #475569;
    --app-accent-fg: #f1f5f9;
    --app-destructive: #ef4444;
    --app-destructive-fg: #ffffff;
    --app-border: rgba(255, 255, 255, 0.08);
    --app-border-strong: rgba(255, 255, 255, 0.15);
    --app-input-bg: #334155;
    --app-dd-primary: #FF3A00;
    --app-success: #34d399;
    --app-warning: #fbbf24;
    --app-error: #f87171;
    --app-info: #60a5fa;

    --app-slate-50: #0f172a;
    --app-slate-100: #1e293b;
    --app-slate-200: #334155;
    --app-slate-300: #475569;
    --app-slate-400: #94a3b8;
    --app-slate-500: #64748b;
    --app-slate-600: #cbd5e1;
    --app-slate-700: #e2e8f0;
    --app-slate-800: #f1f5f9;
    --app-slate-900: #f8fafc;
    --app-slate-950: #f8fafc;

    --app-white: #1e293b;
    --app-black: #f8fafc;

    --app-violet-50: #1e1b4b;
    --app-violet-100: #2e1065;
    --app-violet-200: #3b0764;
    --app-violet-400: #a78bfa;
    --app-violet-500: #8b5cf6;
    --app-violet-600: #a78bfa;
    --app-violet-700: #c4b5fd;
    --app-cyan-400: #22d3ee;

    --app-purple-50: #1e1b4b;
    --app-purple-100: #2e1065;
    --app-purple-200: #3b0764;
    --app-purple-400: #c084fc;
    --app-purple-500: #a855f7;
    --app-purple-600: #c084fc;
    --app-purple-700: #d8b4fe;
    --app-purple-800: #e9d5ff;

    --app-rose-50: #1c1917;
    --app-rose-200: #4c0519;
    --app-rose-400: #fb7185;
    --app-rose-500: #f43f5e;
    --app-emerald-400: #34d399;
    --app-emerald-500: #10b981;
    --app-green-600: #34d399;
    --app-red-600: #f87171;
    --app-yellow-600: #fbbf24;
    --app-blue-600: #60a5fa;

    --app-surface-rgb: 15 23 42;
    --app-muted-rgb: 51 65 85;
    --app-accent-rgb: 71 85 105;
    --app-primary-rgb: 241 245 249;
    --app-fg-rgb: 241 245 249;
    --app-overlay-rgb: 0 0 0;
    --app-muted-fg-rgb: 148 163 184;
    --app-slate50-rgb: 15 23 42;
    --app-slate100-rgb: 30 41 59;
    --app-violet-rgb: 139 92 246;
    --app-violet-deep-rgb: 139 120 200;
    --app-fuchsia-rgb: 217 70 239;
    --app-blue-rgb: 96 165 250;
    --app-purple-rgb: 168 85 247;
    --app-dd-primary-rgb: 255 58 0;
    --app-cyan-rgb: 34 211 238;
    --app-indigo-rgb: 129 140 248;
    --app-destructive-rgb: 239 68 68;
    --app-rose200-rgb: 100 40 50;
    --app-yellow200-rgb: 100 80 20;
    --app-blue200-rgb: 40 60 100;
    --app-purple200-rgb: 60 40 100;
    --app-fuchsia300-rgb: 232 121 249;
    --app-pink300-rgb: 249 168 212;
    --app-purple300-rgb: 216 180 254;
    --app-violet-light-bg: rgba(139, 92, 246, 0.08);
    --app-violet-button: #7c6bc4;
    --app-violet-button-hover: #6d5cb5;
    --app-route-blue-bg: rgba(37, 99, 235, 0.15);
    --app-route-violet-bg: rgba(139, 92, 246, 0.15);
    --app-route-amber-bg: rgba(251, 191, 36, 0.15);
    --app-route-emerald-bg: rgba(52, 211, 153, 0.15);
    --app-trend-up-bg: rgba(52, 211, 153, 0.1);
    --app-trend-down-bg: rgba(248, 113, 113, 0.1);
    --app-trend-up-change: #34d399;
    --app-trend-up-spark: #34d399;
    --app-trend-down-change: #f87171;
    --app-trend-down-spark: #f87171;
    --app-route-blue-text: #60a5fa;
    --app-route-violet-text: #a78bfa;
    --app-route-amber-text: #fbbf24;
    --app-route-emerald-text: #34d399;
    --app-hover-green-bg: rgba(52, 211, 153, 0.1);
    --app-hover-yellow-bg: rgba(251, 191, 36, 0.1);
    --app-status-success-bg: rgba(34, 197, 94, 0.15);
    --app-status-success-bg-light: rgba(34, 197, 94, 0.1);
    --app-status-info-bg: rgba(96, 165, 250, 0.15);
    --app-status-warning-bg: rgba(250, 204, 21, 0.15);
    --app-status-warning-bg-light: rgba(251, 191, 36, 0.1);
    --app-status-success-solid: #34d399;
    --app-status-error-solid: #fb7185;
    --app-status-info-solid: #60a5fa;
    --app-status-success-solid-alt: #34d399;
    --app-glass-bg: rgba(15, 23, 42, 0.85);
    --app-glass-subtle-bg: rgba(15, 23, 42, 0.6);
    --app-glass-hero-bg: rgba(15, 23, 42, 0.88);
    --app-glass-chat-bg: linear-gradient(165deg, rgba(30, 27, 75, 0.88) 0%, rgba(46, 16, 101, 0.82) 50%, rgba(30, 27, 75, 0.78) 100%);
    --app-nav-bg: rgba(15, 23, 42, 0.8);
  }

  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    border-width: 0;
    border-style: solid;
    border-color: var(--app-border);
  }

  html {
    font-size: 16px;
    -webkit-text-size-adjust: 100%;
  }

  body {
    background-color: var(--app-bg);
    color: var(--app-fg);
    font-family: ${fonts.base};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-feature-settings: 'cv02', 'cv03', 'cv04', 'cv11';
    line-height: 1.5;
  }

  h1 {
    font-size: 28px;
    font-weight: 600;
    line-height: 1.3;
    letter-spacing: -0.2px;
  }

  h2 {
    font-size: ${prismFontSize.xLarge};
    font-weight: 600;
    line-height: 1.35;
    letter-spacing: 0px;
  }

  h3 {
    font-size: ${prismFontSize.small};
    font-weight: 600;
    line-height: 1.4;
  }

  h4 {
    font-size: ${prismFontSize.xSmall};
    font-weight: 600;
    line-height: 1.4;
  }

  label {
    font-size: ${prismFontSize.xSmall};
    font-weight: 500;
    line-height: 1.5;
  }

  button {
    font-size: ${prismFontSize.xSmall};
    font-weight: 500;
    line-height: 1.5;
    cursor: pointer;
    background: none;
    border: none;
    padding: 0;
    font-family: inherit;
  }

  input, textarea {
    font-size: ${prismFontSize.xSmall};
    font-weight: 400;
    line-height: 1.5;
    font-family: inherit;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  img, svg {
    display: block;
    max-width: 100%;
  }

  #root {
    height: 100vh;
    width: 100vw;
  }

  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  ::-webkit-scrollbar-track {
    background: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background: var(--app-border-strong);
    border-radius: 3px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: var(--app-muted-fg);
  }
`;
