import { AlertCircle, BarChart3 } from 'lucide-react'
import type { CSSProperties, ReactNode } from 'react'

import { CHART_DEFAULTS } from '../constants'
import { useContainerSize } from '../utils/responsive'

import * as S from './ChartWrapper.styles'

interface ChartWrapperProps {
  readonly loading?: boolean
  readonly error?: string | null
  readonly emptyMessage?: string
  readonly isEmpty?: boolean
  readonly height?: number
  readonly className?: string
  readonly style?: CSSProperties
  readonly responsive?: boolean
  readonly onRetry?: () => void
  readonly children: (width: number, height: number) => ReactNode
}

/**
 * Shared wrapper for all chart types.
 * - Manages loading / error / empty states
 * - Tracks container size via ResizeObserver for responsive rendering
 * - Delegates actual chart content to the render-prop `children(width, height)`
 */
export function ChartWrapper({
  loading,
  error,
  emptyMessage = 'No data available',
  isEmpty,
  height = CHART_DEFAULTS.height,
  className,
  style,
  responsive = true,
  onRetry,
  children,
}: ChartWrapperProps) {
  const { ref, width: measuredWidth } = useContainerSize(600, height)

  const effectiveWidth = responsive ? measuredWidth : ((style?.width as number) ?? measuredWidth)
  const effectiveHeight = height

  if (loading) {
    return (
      <S.Wrapper className={className} style={{ ...style, height }} ref={ref}>
        <S.SkeletonContainer>
          {S.getSkeletonHeights().map((h, i) => (
            <S.SkeletonBar key={i} $height={h} $delay={i * 100} />
          ))}
        </S.SkeletonContainer>
      </S.Wrapper>
    )
  }

  if (error) {
    return (
      <S.Wrapper className={className} style={{ ...style, height }} ref={ref}>
        <S.Overlay>
          <AlertCircle size={28} style={{ color: 'var(--app-error)' }} />
          <S.ErrorText>{error}</S.ErrorText>
          {onRetry && (
            <S.RetryButton type="button" onClick={onRetry}>
              Retry
            </S.RetryButton>
          )}
        </S.Overlay>
      </S.Wrapper>
    )
  }

  if (isEmpty) {
    return (
      <S.Wrapper className={className} style={{ ...style, height }} ref={ref}>
        <S.Overlay>
          <BarChart3 size={28} style={{ color: 'var(--app-muted-fg)' }} />
          <S.StateText>{emptyMessage}</S.StateText>
        </S.Overlay>
      </S.Wrapper>
    )
  }

  return (
    <S.Wrapper className={className} style={{ ...style, height }} ref={ref}>
      <S.ChartArea>{children(effectiveWidth, effectiveHeight)}</S.ChartArea>
    </S.Wrapper>
  )
}
