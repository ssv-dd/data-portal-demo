import { createGlobalStyle, keyframes } from 'styled-components';
import { colors, fonts, prismFontSize } from './theme';

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
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    border-width: 0;
    border-style: solid;
    border-color: ${colors.border};
  }

  html {
    font-size: 16px;
    -webkit-text-size-adjust: 100%;
  }

  body {
    background-color: ${colors.background};
    color: ${colors.foreground};
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
    background: ${colors.border};
    border-radius: 3px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${colors.borderStrong};
  }
`;
