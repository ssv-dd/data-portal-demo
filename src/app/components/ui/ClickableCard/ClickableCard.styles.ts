import { Theme } from '@doordash/prism-react'
import styled from 'styled-components'

import { shadows } from '../../../styles/dataPortalAppTheme'
import { surfaceCardRootStyles, type SurfaceCardStyleProps } from '../SurfaceCard/SurfaceCard.styles'

export const Root = styled.button<SurfaceCardStyleProps>`
  margin: 0;
  appearance: none;
  font: inherit;
  color: inherit;
  text-align: inherit;
  ${surfaceCardRootStyles}
  cursor: pointer;

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      box-shadow: ${shadows.cardHover};
      border-color: ${Theme.usage.color.border.strong.default};
    }
  }

  &:active {
    transform: scale(0.98);
  }

  &:focus-visible {
    outline: none;
    border-color: ${Theme.usage.color.border.focused};
    box-shadow: 0 0 0 2px ${Theme.usage.color.border.focused};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
    transform: none;
    box-shadow: ${shadows.card};
  }

  @media (prefers-reduced-motion: reduce) {
    &:active {
      transform: none;
    }
  }
`
