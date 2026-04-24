import { useMemo } from 'react'
import { Rectangle, Sankey as RechartsSankey, Tooltip } from 'recharts'

import { ChartTooltip } from '../ChartTooltip'
import { ChartWrapper } from '../ChartWrapper'
import { CHART_DEFAULTS, CHART_PALETTE } from '../constants'
import type { SankeyChartProps } from '../types'
import { useChartTheme } from '../utils/chartTheme'

const DEFAULT_SANKEY_MARGIN = { top: 16, right: 72, bottom: 16, left: 72 } as const

export function DPSankeyChart({
  data,
  height = CHART_DEFAULTS.height,
  className,
  style,
  responsive = true,
  colors,
  tooltip,
  margin,
  loading,
  error,
  emptyMessage,
  nodeWidth = 12,
  nodePadding = 12,
  linkCurvature = 0.5,
}: SankeyChartProps) {
  const theme = useChartTheme()
  const palette = colors ?? CHART_PALETTE
  const sankeyData = useMemo(
    () => ({
      nodes: [...data.nodes],
      links: [...data.links],
    }),
    [data.links, data.nodes]
  )

  const isEmpty = data.nodes.length === 0 || data.links.length === 0
  const accent = palette[0] ?? CHART_PALETTE[0]

  return (
    <ChartWrapper
      loading={loading}
      error={error}
      emptyMessage={emptyMessage}
      isEmpty={isEmpty}
      height={height}
      className={className}
      style={style}
      responsive={responsive}
    >
      {(width, h) => (
        <RechartsSankey
          width={width}
          height={h}
          data={sankeyData}
          nodePadding={nodePadding}
          nodeWidth={nodeWidth}
          linkCurvature={linkCurvature}
          margin={{ ...DEFAULT_SANKEY_MARGIN, ...margin }}
          node={(nodeProps) => (
            <Rectangle
              x={nodeProps.x}
              y={nodeProps.y}
              width={nodeProps.width}
              height={nodeProps.height}
              fill={palette[nodeProps.index % palette.length]}
              stroke={theme.axisStroke}
              strokeWidth={1}
              radius={2}
            />
          )}
          link={{ stroke: accent, strokeOpacity: 0.35 }}
        >
          <Tooltip content={<ChartTooltip config={tooltip} />} />
        </RechartsSankey>
      )}
    </ChartWrapper>
  )
}
