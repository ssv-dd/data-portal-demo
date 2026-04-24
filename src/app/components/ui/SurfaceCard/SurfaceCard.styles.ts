import { Theme } from '@doordash/prism-react'
import styled, { css } from 'styled-components'

import { glassPanel, radius, shadows } from '../../../styles/dataPortalAppTheme'

export type SurfaceCardStyleProps = {
  readonly $variant: 'solid' | 'glass'
  readonly $padding: 'none' | 'sm' | 'md' | 'lg'
}

const paddingFor = (size: SurfaceCardStyleProps['$padding']) => {
  switch (size) {
    case 'none':
      return '0'
    case 'sm':
      return Theme.usage.space.small
    case 'md':
      return Theme.usage.space.medium
    case 'lg':
      return Theme.usage.space.large
    default:
      return Theme.usage.space.medium
  }
}

/** Shared surface rules for {@link SurfaceCard} and {@link ClickableCard}. */
export const surfaceCardRootStyles = css<SurfaceCardStyleProps>`
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  width: 100%;
  max-width: 100%;
  min-width: 0;
  border-radius: ${radius['2xl']};
  border: 1px solid ${Theme.usage.color.border.default};
  box-shadow: ${shadows.card};
  padding: ${({ $padding }) => paddingFor($padding)};
  transition:
    border-color 200ms ease,
    box-shadow 200ms ease;

  ${({ $variant }) =>
    $variant === 'glass'
      ? css`
          ${glassPanel}
        `
      : css`
          background: ${Theme.usage.color.background.elevated.default};
        `}

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`

export const Root = styled.div<SurfaceCardStyleProps>`
  ${surfaceCardRootStyles}
`
