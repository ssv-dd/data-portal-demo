import styled from 'styled-components'

import { shadows } from '../../../styles/dataPortalAppTheme'

export const TooltipContainer = styled.div`
  background: var(--app-card);
  border: 1px solid var(--app-border);
  border-radius: 10px;
  padding: 12px 16px;
  box-shadow: ${shadows.popover};
  min-width: 140px;
  max-width: 320px;
  pointer-events: none;
`

export const TooltipHeader = styled.div`
  margin-bottom: 8px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--app-border);
`

export const TooltipHeaderLabel = styled.div`
  font-size: 10px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  color: var(--app-muted-fg);
  margin-bottom: 2px;
`

export const TooltipHeaderValue = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: var(--app-fg);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const TooltipRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 3px 0;
`

export const TooltipDot = styled.span<{ readonly $color: string }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  flex-shrink: 0;
`

export const TooltipSeriesName = styled.span`
  font-size: 12px;
  color: var(--app-muted-fg);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
  display: flex;
  align-items: center;
  gap: 6px;
`

export const TooltipValue = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: var(--app-fg);
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
`
