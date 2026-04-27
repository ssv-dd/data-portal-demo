import styled, { keyframes } from 'styled-components'

import { Theme } from '../../../styles/dataPortalAppTheme'

export const Wrapper = styled.div`
  position: relative;
  width: 100%;
  min-height: 120px;
`

export const ChartArea = styled.div`
  width: 100%;
  height: 100%;

  .recharts-wrapper,
  .recharts-wrapper *:focus,
  .recharts-wrapper *:focus-visible {
    font-family: inherit;
    outline: none !important;
    box-shadow: none !important;
  }

  /* Theme-aware Brush slider */
  .recharts-brush {
    .recharts-brush-slide {
      fill: rgb(var(--app-muted-rgb) / 0.15);
      fill-opacity: 1;
    }

    .recharts-brush-traveller rect {
      fill: ${Theme.usage.color.background.elevated.default};
      stroke: ${Theme.usage.color.border.strong.default};
    }

    .recharts-brush-texts text {
      fill: ${Theme.usage.color.text.subdued.default};
    }

    > rect:first-child {
      fill: ${Theme.usage.color.background.default};
      stroke: ${Theme.usage.color.border.default};
    }
  /* Recharts renders SVG — make sure it fills the container */
  .recharts-wrapper {
    font-family: inherit;
    outline: none !important;
    box-shadow: none !important;
  }

  /* Theme-aware Brush slider */
  .recharts-brush {
    .recharts-brush-slide {
      fill: rgb(var(--app-muted-rgb) / 0.15);
      fill-opacity: 1;
    }

    .recharts-brush-traveller rect {
      fill: ${Theme.usage.color.background.elevated.default};
      stroke: ${Theme.usage.color.border.strong.default};
    }

    .recharts-brush-texts text {
      fill: ${Theme.usage.color.text.subdued.default};
    }

    > rect:first-child {
      fill: ${Theme.usage.color.background.default};
      stroke: ${Theme.usage.color.border.default};
    }
  }
`

// ---------------------------------------------------------------------------
// State overlays
// ---------------------------------------------------------------------------

export const Overlay = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${Theme.usage.space.small};
  width: 100%;
  padding: ${Theme.usage.space.xLarge} ${Theme.usage.space.medium};
  text-align: center;
`

export const StateText = styled.p`
  margin: 0;
  font-size: ${Theme.usage.fontSize.small};
  color: ${Theme.usage.color.text.subdued.default};
  line-height: 1.5;
`

export const ErrorText = styled(StateText)`
  color: var(--app-error);
`

export const RetryButton = styled.button`
  margin-top: ${Theme.usage.space.xSmall};
  padding: ${Theme.usage.space.xSmall} ${Theme.usage.space.medium};
  font-size: ${Theme.usage.fontSize.small};
  color: ${Theme.usage.color.text.default};
  background: ${Theme.usage.color.background.elevated.default};
  border: 1px solid ${Theme.usage.color.border.default};
  border-radius: ${Theme.usage.borderRadius.medium};
  cursor: pointer;
  transition: all 150ms;

  &:hover {
    background: ${Theme.usage.color.action.secondary.hovered};
    border-color: ${Theme.usage.color.border.strong.default};
  }
`

// ---------------------------------------------------------------------------
// Skeleton loader
// ---------------------------------------------------------------------------

const pulse = keyframes`
  0%, 100% { opacity: 0.4; }
  50% { opacity: 0.8; }
`

const shimmer = keyframes`
  from { transform: translateX(-100%); }
  to   { transform: translateX(100%); }
`

export const SkeletonContainer = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 6px;
  width: 100%;
  height: 100%;
  padding: ${Theme.usage.space.large} ${Theme.usage.space.medium};
`

export const SkeletonBar = styled.div<{ readonly $height: string; readonly $delay: number }>`
  flex: 1;
  height: ${({ $height }) => $height};
  border-radius: 4px 4px 0 0;
  background: ${Theme.usage.color.border.default};
  animation: ${pulse} 1.6s ease-in-out infinite;
  animation-delay: ${({ $delay }) => $delay}ms;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgb(var(--app-surface-rgb) / 0.3) 50%,
      transparent 100%
    );
    animation: ${shimmer} 2s ease-in-out infinite;
    animation-delay: ${({ $delay }) => $delay}ms;
  }
`

const BAR_HEIGHTS = ['55%', '80%', '42%', '90%', '60%', '75%', '35%', '85%'] as const

export function getSkeletonHeights(): readonly string[] {
  return BAR_HEIGHTS
}
