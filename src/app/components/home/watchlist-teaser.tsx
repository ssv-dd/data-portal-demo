import { motion } from 'motion/react';
import { Eye, ChevronRight, Settings2 } from 'lucide-react';
import styled from 'styled-components';
import { colors, radius, glassPanel, Theme } from '@/styles/theme';
import type { ProductAreaWatchlist, WatchlistMetric } from '@/app/data/mock/watchlist-data';

interface WatchlistTeaserProps {
  areas: ProductAreaWatchlist[];
  selectedAreaIds: string[];
  onViewFull?: () => void;
}

const trendColor = {
  up: { change: '#059669', spark: '#10b981', bg: 'rgba(236, 253, 245, 1)' },
  down: { change: '#ef4444', spark: '#ef4444', bg: 'rgba(254, 242, 242, 1)' },
  flat: { change: colors.mutedForeground, spark: '#9ca3af', bg: 'rgba(236, 236, 240, 0.4)' },
};

const CardWrapper = styled(motion.div)`
  ${glassPanel}
  border-radius: ${radius['2xl']};
  padding: ${Theme.usage.space.medium} 20px;
  border: 1px solid ${colors.border};
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${Theme.usage.space.small};
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xSmall};
`;

const Title = styled.h3`
  font-size: ${Theme.usage.fontSize.xSmall};
  font-weight: 600;
  color: ${colors.foreground};
`;

const SettingsBtn = styled.button`
  padding: ${Theme.usage.space.xxSmall};
  border-radius: ${radius.md};
  background: none;
  border: none;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: rgba(236, 236, 240, 0.6);
  }
`;

const ViewFullBtn = styled.button`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xxSmall};
  font-size: ${Theme.usage.fontSize.xxSmall};
  font-weight: 500;
  color: ${colors.violet600};
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.2s;

  &:hover {
    color: ${colors.violet700};
  }
`;

const AreasGrid = styled.div<{ $cols: number }>`
  display: grid;
  grid-template-columns: repeat(${({ $cols }) => $cols}, 1fr);
`;

const AreaSection = styled.div`
  min-width: 0;
  padding: 0 ${Theme.usage.space.medium};

  &:first-child {
    padding-left: 0;
  }
  &:last-child {
    padding-right: 0;
  }

  & + & {
    border-left: 1px solid rgba(0, 0, 0, 0.04);
  }
`;

const AreaLabel = styled.p`
  font-size: 11px;
  font-weight: 600;
  color: ${colors.mutedForeground};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: ${Theme.usage.space.xSmall};
`;

const TileGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${Theme.usage.space.xSmall};
`;

const MetricTileWrapper = styled.div`
  border-radius: ${radius.xl};
  padding: ${Theme.usage.space.xSmall} ${Theme.usage.space.small};
  display: flex;
  flex-direction: column;
  gap: ${Theme.usage.space.xxSmall};
  background: rgba(255, 255, 255, 0.4);
  border: 1px solid rgba(0, 0, 0, 0.03);
  transition: all 0.2s;

  &:hover {
    border-color: rgba(0, 0, 0, 0.05);
  }
`;

const MetricName = styled.p`
  font-size: 10px;
  color: ${colors.mutedForeground};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const MetricValueRow = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: ${Theme.usage.space.xxSmall};
`;

const MetricValue = styled.p`
  font-size: ${Theme.usage.fontSize.small};
  font-weight: 700;
  color: ${colors.foreground};
  line-height: 1.25;
`;

const MetricChange = styled.span<{ $color: string; $bg: string }>`
  font-size: 11px;
  font-weight: 600;
  display: inline-block;
  padding: ${Theme.usage.space.xxxSmall} ${Theme.usage.space.xxSmall};
  border-radius: ${radius.md};
  color: ${({ $color }) => $color};
  background: ${({ $bg }) => $bg};
`;

function MiniSparkline({ data, color }: { data: number[]; color: string }) {
  if (!data || data.length === 0) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 72;
  const h = 28;
  const points = data
    .map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`)
    .join(' ');
  const fillPoints = `0,${h} ${points} ${w},${h}`;

  return (
    <svg width={w} height={h} style={{ flexShrink: 0 }}>
      <defs>
        <linearGradient id={`fill-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.2} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <polygon points={fillPoints} fill={`url(#fill-${color.replace('#', '')})`} />
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MetricTile({ metric }: { metric: WatchlistMetric }) {
  const { change: changeColor, spark: sparkColor, bg } = trendColor[metric.trend];
  return (
    <MetricTileWrapper>
      <MetricName>{metric.name}</MetricName>
      <MetricValueRow>
        <div>
          <MetricValue>{metric.value}</MetricValue>
          <MetricChange $color={changeColor} $bg={bg}>
            {metric.change}
          </MetricChange>
        </div>
        <MiniSparkline data={metric.sparkline} color={sparkColor} />
      </MetricValueRow>
    </MetricTileWrapper>
  );
}

function AreaSectionComp({ area }: { area: ProductAreaWatchlist }) {
  const topMetrics = area.metrics.slice(0, 2);
  return (
    <AreaSection>
      <AreaLabel>{area.shortName}</AreaLabel>
      <TileGrid>
        {topMetrics.map((metric) => (
          <MetricTile key={metric.id} metric={metric} />
        ))}
      </TileGrid>
    </AreaSection>
  );
}

export function WatchlistTeaser({ areas, selectedAreaIds, onViewFull }: WatchlistTeaserProps) {
  const selectedAreas = areas.filter((a) => selectedAreaIds.includes(a.id));
  const cols = Math.min(Math.max(selectedAreas.length, 1), 4);

  return (
    <CardWrapper
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
    >
      <HeaderRow>
        <HeaderLeft>
          <Eye style={{ width: 16, height: 16, color: colors.violet600 }} />
          <Title>Your Watchlist</Title>
          <SettingsBtn title="Customize watchlist">
            <Settings2 style={{ width: 14, height: 14, color: colors.mutedForeground }} />
          </SettingsBtn>
        </HeaderLeft>
        <ViewFullBtn onClick={onViewFull}>
          View full scorecard
          <ChevronRight style={{ width: 14, height: 14, transition: 'transform 0.2s' }} />
        </ViewFullBtn>
      </HeaderRow>

      <AreasGrid $cols={cols}>
        {selectedAreas.map((area) => (
          <AreaSectionComp key={area.id} area={area} />
        ))}
      </AreasGrid>
    </CardWrapper>
  );
}
