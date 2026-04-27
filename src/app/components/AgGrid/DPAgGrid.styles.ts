import styled from 'styled-components'

import { radius, shadows, Theme } from '../../styles/dataPortalAppTheme'

export const GridShell = styled.div<{ $height: number | string }>`
  width: 100%;
  height: ${({ $height }) => (typeof $height === 'number' ? `${$height}px` : $height)};
  min-height: 200px;
  border-radius: ${radius['2xl']};
  border: 1px solid ${Theme.usage.color.border.default};
  box-shadow: ${shadows.card};
  /* Wider matrices need horizontal scroll; autoHeight shells use height: auto and must not clip the grid body. */
  overflow-x: auto;
  overflow-y: ${({ $height }) => ($height === 'auto' ? 'visible' : 'hidden')};
  background: ${Theme.usage.color.background.elevated.default};
`
