import { AlertCircle, BarChart3 } from 'lucide-react'

import type { KpiProps } from '../types'
import { formatCompactNumber } from '../utils/formatters'

import * as S from './KPI.styles'

function formatDelta(delta: number): string {
  const sign = delta > 0 ? '+' : ''
  return `${sign}${formatCompactNumber(delta)}`
}

function formatKpiScalar(
  value: string | number | null | undefined,
  formatValue?: (value: number) => string
): string {
  if (value === null || value === undefined || value === '') {
    return ''
  }
  if (typeof value === 'number') {
    return formatValue ? formatValue(value) : formatCompactNumber(value)
  }
  const n = Number(value)
  if (formatValue && Number.isFinite(n)) {
    return formatValue(n)
  }
  return String(value)
}

export function DPKPI({
  title,
  value,
  formatValue,
  subtitle,
  delta,
  columns,
  emphasizeValue,
  height = 132,
  className,
  style,
  loading,
  error,
  emptyMessage = 'No value',
  onRetry,
}: KpiProps) {
  const trend =
    delta?.trend ?? (delta ? (delta.value > 0 ? 'up' : delta.value < 0 ? 'down' : 'neutral') : 'neutral')

  const isCompare = Boolean(columns && columns.length > 0)
  const compareHeight = Math.max(height, isCompare ? 168 : height)

  if (loading) {
    if (isCompare) {
      return (
        <S.RootCompare
          className={className}
          style={style}
          $minHeight={compareHeight}
          aria-busy="true"
          aria-label={title}
        >
          <S.HeaderBlock>
            <S.SkeletonBlock style={{ width: '72%' }} />
            <S.HeaderDivider />
          </S.HeaderBlock>
          <S.CompareSkeletonRow>
            <S.ColumnSkeleton>
              <S.SkeletonBlock style={{ width: '55%' }} />
              <S.SkeletonValue style={{ width: '85%', height: 40 }} />
            </S.ColumnSkeleton>
            <S.ColumnSkeleton>
              <S.SkeletonBlock style={{ width: '55%' }} />
              <S.SkeletonValue style={{ width: '85%', height: 40 }} />
            </S.ColumnSkeleton>
          </S.CompareSkeletonRow>
        </S.RootCompare>
      )
    }

    return (
      <S.Root className={className} style={style} $minHeight={height} aria-busy="true" aria-label={title}>
        <S.SkeletonBlock style={{ width: '40%' }} />
        <S.SkeletonValue />
        <S.SkeletonBlock style={{ width: '70%' }} />
      </S.Root>
    )
  }

  if (error) {
    const ErrorShell = isCompare ? S.RootCompare : S.Root
    return (
      <ErrorShell className={className} style={style} $minHeight={isCompare ? compareHeight : height}>
        <S.Overlay>
          <AlertCircle size={24} style={{ color: 'var(--app-error)' }} aria-hidden />
          <S.ErrorText>{error}</S.ErrorText>
          {onRetry && (
            <S.RetryButton type="button" onClick={onRetry}>
              Retry
            </S.RetryButton>
          )}
        </S.Overlay>
      </ErrorShell>
    )
  }

  if (isCompare) {
    const cols = columns ?? []
    const allEmpty = cols.every((c) => c.value === null || c.value === undefined || c.value === '')

    if (allEmpty) {
      return (
        <S.RootCompare className={className} style={style} $minHeight={compareHeight}>
          <S.HeaderBlock>
            <S.HeaderTitle>{title}</S.HeaderTitle>
            <S.HeaderDivider />
          </S.HeaderBlock>
          <S.Overlay>
            <BarChart3 size={24} style={{ color: 'var(--app-muted-fg)' }} aria-hidden />
            <S.StateText>{emptyMessage}</S.StateText>
          </S.Overlay>
        </S.RootCompare>
      )
    }

    return (
      <S.RootCompare className={className} style={style} $minHeight={compareHeight}>
        <S.HeaderBlock>
          <S.HeaderTitle>{title}</S.HeaderTitle>
          <S.HeaderDivider />
        </S.HeaderBlock>
        <S.ColumnsGrid role="group" aria-label={title}>
          {cols.map((col) => (
            <S.ColumnCard key={col.label}>
              <S.ColumnLabel>{col.label}</S.ColumnLabel>
              <S.ColumnValue>{formatKpiScalar(col.value, col.formatValue) || '—'}</S.ColumnValue>
            </S.ColumnCard>
          ))}
        </S.ColumnsGrid>
        {subtitle && <S.Subtitle>{subtitle}</S.Subtitle>}
      </S.RootCompare>
    )
  }

  const isEmpty = value === null || value === undefined || value === ''

  if (isEmpty) {
    return (
      <S.Root className={className} style={style} $minHeight={height}>
        <S.Title>{title}</S.Title>
        <S.Overlay>
          <BarChart3 size={24} style={{ color: 'var(--app-muted-fg)' }} aria-hidden />
          <S.StateText>{emptyMessage}</S.StateText>
        </S.Overlay>
      </S.Root>
    )
  }

  const display = formatKpiScalar(value, formatValue)
  const ValueTag = emphasizeValue ? S.ValueFeatured : S.Value

  return (
    <S.Root className={className} style={style} $minHeight={height}>
      <S.Title>{title}</S.Title>
      <S.ValueRow>
        <ValueTag>{display}</ValueTag>
        {delta && (
          <S.Delta $trend={trend}>
            {formatDelta(delta.value)}
            {delta.label ? ` ${delta.label}` : ''}
          </S.Delta>
        )}
      </S.ValueRow>
      {subtitle && <S.Subtitle>{subtitle}</S.Subtitle>}
    </S.Root>
  )
}
