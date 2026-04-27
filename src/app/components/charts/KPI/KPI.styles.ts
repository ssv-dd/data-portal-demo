import styled, { keyframes } from 'styled-components'

import { glassPanel, radius, shadows, Theme } from '../../../styles/dataPortalAppTheme'

const pulse = keyframes`
  0%,
  100% {
    opacity: 0.45;
  }
  50% {
    opacity: 0.9;
  }
`

export const Root = styled.div<{ readonly $minHeight: number }>`
  ${glassPanel}
  position: relative;
  border-radius: ${radius['2xl']};
  border: 1px solid ${Theme.usage.color.border.default};
  box-shadow: ${shadows.card};
  padding: ${Theme.usage.space.large};
  min-height: ${({ $minHeight }) => $minHeight}px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: ${Theme.usage.space.small};
`

/** Compare layout: tighter vertical rhythm under the header. */
export const RootCompare = styled(Root)`
  justify-content: flex-start;
  gap: ${Theme.usage.space.medium};
`

export const HeaderBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${Theme.usage.space.small};
`

export const HeaderTitle = styled.span`
  font-size: ${Theme.usage.fontSize.medium};
  font-weight: 600;
  color: ${Theme.usage.color.text.default};
  line-height: 1.35;
`

export const HeaderDivider = styled.div`
  height: 1px;
  width: 100%;
  background: ${Theme.usage.color.border.default};
`

export const ColumnsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(0, 1fr));
  gap: ${Theme.usage.space.medium};
  min-width: 0;
`

export const ColumnCard = styled.div`
  min-width: 0;
  border-radius: ${radius.lg};
  border: 1px solid ${Theme.usage.color.border.default};
  background: ${Theme.usage.color.background.subdued.default};
  padding: ${Theme.usage.space.medium};
  display: flex;
  flex-direction: column;
  gap: ${Theme.usage.space.small};
`

export const ColumnLabel = styled.span`
  font-size: ${Theme.usage.fontSize.small};
  font-weight: 600;
  color: ${Theme.usage.color.text.default};
  line-height: 1.35;
`

export const ColumnValue = styled.span`
  font-size: ${Theme.usage.fontSize.xxLarge};
  font-weight: 700;
  color: ${Theme.usage.color.text.default};
  font-variant-numeric: tabular-nums;
  line-height: 1.1;
  letter-spacing: -0.02em;
  word-break: break-word;
`

export const Title = styled.span`
  font-size: ${Theme.usage.fontSize.small};
  font-weight: 500;
  color: ${Theme.usage.color.text.subdued.default};
  line-height: 1.4;
`

export const ValueRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: ${Theme.usage.space.small};
`

export const Value = styled.span`
  font-size: ${Theme.usage.fontSize.large};
  font-weight: 600;
  color: ${Theme.usage.color.text.default};
  font-variant-numeric: tabular-nums;
  line-height: 1.15;
`

/** Single-metric headline when you want figures closer to compare-mode prominence. */
export const ValueFeatured = styled(Value)`
  font-size: ${Theme.usage.fontSize.xLarge};
  font-weight: 700;
  letter-spacing: -0.02em;
`

export const Subtitle = styled.span`
  font-size: ${Theme.usage.fontSize.xSmall};
  color: ${Theme.usage.color.text.subdued.default};
  line-height: 1.45;
`

export const Delta = styled.span<{ readonly $trend: 'up' | 'down' | 'neutral' }>`
  font-size: ${Theme.usage.fontSize.xSmall};
  font-weight: 500;
  font-variant-numeric: tabular-nums;
  color: ${({ $trend }) =>
    $trend === 'up'
      ? Theme.usage.color.positive.default
      : $trend === 'down'
        ? Theme.usage.color.negative.default
        : Theme.usage.color.text.subdued.default};
`

export const SkeletonBlock = styled.div`
  height: 14px;
  border-radius: ${Theme.usage.borderRadius.small};
  background: ${Theme.usage.color.border.default};
  animation: ${pulse} 1.4s ease-in-out infinite;
  max-width: 100%;
`

export const SkeletonValue = styled(SkeletonBlock)`
  height: 32px;
  width: 55%;
`

export const CompareSkeletonRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${Theme.usage.space.medium};
  width: 100%;
`

export const ColumnSkeleton = styled.div`
  border-radius: ${radius.lg};
  border: 1px solid ${Theme.usage.color.border.default};
  background: ${Theme.usage.color.background.subdued.default};
  padding: ${Theme.usage.space.medium};
  display: flex;
  flex-direction: column;
  gap: ${Theme.usage.space.small};
`

export const Overlay = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${Theme.usage.space.small};
  text-align: center;
  padding: ${Theme.usage.space.medium} 0;
`

export const StateText = styled.p`
  margin: 0;
  font-size: ${Theme.usage.fontSize.small};
  color: ${Theme.usage.color.text.subdued.default};
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
