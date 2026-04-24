import * as S from './Sparkline.styles'

type SparklineProps = {
  readonly data: readonly number[]
  readonly color?: string
}

export function Sparkline({ data, color = 'var(--app-emerald-500)' }: SparklineProps) {
  if (!data || data.length === 0) return null

  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1

  const points = data
    .map((value, index) => {
      const x = (index / (data.length - 1)) * 100
      const y = 100 - ((value - min) / range) * 100
      return `${x},${y}`
    })
    .join(' ')

  return (
    <S.StyledSvg width="60" height="24" viewBox="0 0 100 100" preserveAspectRatio="none">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        vectorEffect="non-scaling-stroke"
      />
    </S.StyledSvg>
  )
}
