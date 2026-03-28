import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Eye, ChevronRight, ChevronDown, Settings2,
  TrendingUp, TrendingDown,
} from 'lucide-react';
import { Sparkline } from '../scorecard/Sparkline';
import styled from 'styled-components';
import { colors, radius, glassPanel, Theme } from '@/styles/theme';
import type { ProductArea, Metric } from '@/types';

export type WatchlistVariant = 'A' | 'B';

interface WatchlistTableProps {
  areas: ProductArea[];
  selectedAreaIds: string[];
  selectedMetricIds?: string[];
  maxRows?: number;
  variant?: WatchlistVariant;
  onViewFull?: () => void;
  onCustomize?: () => void;
  onMetricClick?: (metric: Metric) => void;
}

const CardWrapper = styled(motion.div)`
  ${glassPanel}
  border-radius: ${radius['2xl']};
  padding: ${Theme.usage.space.small} 20px;
  border: 1px solid ${colors.border};
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${Theme.usage.space.xxSmall};
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xSmall};
`;

const Title = styled.h3`
  font-size: ${Theme.usage.fontSize.medium};
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
    background: rgb(var(--app-muted-rgb) / 0.6);
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

const AreaList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${Theme.usage.space.xxSmall};
`;

const AreaContainer = styled.div`
  border-radius: ${radius.lg};
  overflow: hidden;
`;

const AreaHeaderBtn = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xSmall};
  padding: ${Theme.usage.space.xxSmall} ${Theme.usage.space.small};
  background: none;
  border: none;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: rgb(var(--app-muted-rgb) / 0.3);
  }
`;

const AreaName = styled.span`
  font-size: ${Theme.usage.fontSize.xxSmall};
  font-weight: 600;
  color: ${colors.foreground};
`;

const MetricCount = styled.span`
  font-size: 11px;
  color: ${colors.mutedForeground};
  margin-left: auto;
`;

const StyledTable = styled.table`
  width: 100%;
  font-size: ${Theme.usage.fontSize.xxSmall};
  table-layout: fixed;
`;

const THead = styled.thead`
  position: sticky;
  top: 0;
  z-index: 10;
`;

const ThRow = styled.tr`
  background: ${colors.white};
  border-top: 1px solid rgb(var(--app-overlay-rgb) / 0.02);
  border-bottom: 1px solid rgb(var(--app-overlay-rgb) / 0.02);
`;

const Th = styled.th`
  text-align: left;
  padding: ${Theme.usage.space.xxSmall} ${Theme.usage.space.small};
  font-weight: 500;
  color: ${colors.mutedForeground};
`;

const Tr = styled.tr<{ $striped?: boolean }>`
  border-bottom: 1px solid rgb(var(--app-overlay-rgb) / 0.01);
  cursor: pointer;
  transition: background 0.2s;
  background: ${({ $striped }) => ($striped ? 'rgb(var(--app-muted-rgb) / 0.1)' : 'transparent')};

  &:hover {
    background: rgb(var(--app-muted-rgb) / 0.2);
  }
`;

const Td = styled.td`
  padding: ${Theme.usage.space.xSmall} ${Theme.usage.space.small};
`;

const TdMetricName = styled(Td)`
  font-weight: 500;
  color: ${colors.foreground};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const TdValue = styled(Td)`
  font-weight: 600;
  color: ${colors.foreground};
  text-align: left;
`;

const TdPrior = styled(Td)`
  color: ${colors.mutedForeground};
  text-align: left;
`;

const ChangeLabel = styled.span<{ $up: boolean; $down: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: ${Theme.usage.space.xxxSmall};
  font-weight: 500;
  color: ${({ $up, $down }) =>
    $up ? '#059669' : $down ? '#ef4444' : colors.mutedForeground};
`;

const AIInsightCell = styled.div`
  font-size: 11px;
  color: ${colors.mutedForeground};
  line-height: 1.4;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

// Strip variant styles
const StripButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  padding: ${Theme.usage.space.xSmall} ${Theme.usage.space.small};
  border-radius: ${radius.lg};
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  transition: background 0.2s;

  &:hover {
    background: rgb(var(--app-muted-rgb) / 0.3);
  }
`;

const StripName = styled.span`
  font-size: ${Theme.usage.fontSize.xxSmall};
  color: ${colors.mutedForeground};
  width: 20%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const StripValue = styled.span`
  font-size: ${Theme.usage.fontSize.xxSmall};
  font-weight: 700;
  color: ${colors.foreground};
  width: 11%;
  text-align: right;
`;

const StripPrior = styled.span`
  font-size: ${Theme.usage.fontSize.xxSmall};
  color: ${colors.mutedForeground};
  width: 11%;
  text-align: right;
`;

const StripChange = styled.span`
  width: 11%;
  text-align: right;
`;

const StripSparkline = styled.span`
  width: 9%;
  display: flex;
  justify-content: center;
`;

const StripInsight = styled.span`
  width: 38%;
  display: flex;
  align-items: center;
  padding-left: ${Theme.usage.space.xSmall};
`;

function ChangeLabelComp({ value, label }: { value: number; label: string }) {
  const isUp = value > 0;
  const isDown = value < 0;
  return (
    <ChangeLabel $up={isUp} $down={isDown}>
      {isUp ? <TrendingUp style={{ width: 12, height: 12 }} /> : isDown ? <TrendingDown style={{ width: 12, height: 12 }} /> : null}
      {label}
    </ChangeLabel>
  );
}


function sparkColor(change: number) {
  return change >= 0 ? '#10b981' : '#ef4444';
}

function AreaTableSlim({ area, defaultExpanded, maxRows, onMetricClick }: {
  area: ProductArea; defaultExpanded: boolean; maxRows?: number; onMetricClick?: (metric: Metric) => void;
}) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const rowHeight = 33;
  const maxHeight = maxRows ? maxRows * rowHeight : undefined;

  return (
    <AreaContainer>
      <AreaHeaderBtn onClick={() => setExpanded(!expanded)}>
        {expanded
          ? <ChevronDown style={{ width: 14, height: 14, color: colors.mutedForeground }} />
          : <ChevronRight style={{ width: 14, height: 14, color: colors.mutedForeground }} />}
        <AreaName>{area.name}</AreaName>
        {!expanded && <MetricCount>{area.metrics.length} metrics</MetricCount>}
      </AreaHeaderBtn>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div
              style={{ overflowY: 'auto', ...(maxHeight ? { maxHeight: maxHeight + 28 } : {}) }}
            >
              <StyledTable>
                <colgroup>
                  <col style={{ width: '20%' }} />
                  <col style={{ width: '11%' }} />
                  <col style={{ width: '11%' }} />
                  <col style={{ width: '11%' }} />
                  <col style={{ width: '9%' }} />
                  <col style={{ width: '38%' }} />
                </colgroup>
                <THead>
                  <ThRow>
                    <Th>Metric</Th>
                    <Th>Current Week</Th>
                    <Th>Prior Week</Th>
                    <Th>vs Prior Week</Th>
                    <Th>Trend (T28D)</Th>
                    <Th>AI Insight</Th>
                  </ThRow>
                </THead>
                <tbody>
                  {area.metrics.map((metric, idx) => (
                    <Tr
                      key={metric.id}
                      onClick={() => onMetricClick?.(metric)}
                      $striped={idx % 2 === 1}
                    >
                      <TdMetricName>{metric.name}</TdMetricName>
                      <TdValue>{metric.current}</TdValue>
                      <TdPrior>{metric.prior}</TdPrior>
                      <Td style={{ textAlign: 'left' }}>
                        <ChangeLabelComp value={metric.change} label={metric.changeLabel} />
                      </Td>
                      <Td style={{ textAlign: 'left' }}>
                        <Sparkline data={metric.trend} color={sparkColor(metric.change)} />
                      </Td>
                      <Td style={{ textAlign: 'left', paddingRight: '16px' }}>
                        <AIInsightCell>{metric.aiInsight?.summary || 'No insight available'}</AIInsightCell>
                      </Td>
                    </Tr>
                  ))}
                </tbody>
              </StyledTable>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </AreaContainer>
  );
}

function AreaStrips({ area, defaultExpanded, maxRows, onMetricClick }: {
  area: ProductArea; defaultExpanded: boolean; maxRows?: number; onMetricClick?: (metric: Metric) => void;
}) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const visibleMetrics = maxRows ? area.metrics.slice(0, maxRows) : area.metrics;
  const hasMore = maxRows ? area.metrics.length > maxRows : false;

  return (
    <AreaContainer>
      <AreaHeaderBtn onClick={() => setExpanded(!expanded)} style={{ padding: '8px 12px' }}>
        {expanded
          ? <ChevronDown style={{ width: 16, height: 16, color: colors.mutedForeground }} />
          : <ChevronRight style={{ width: 16, height: 16, color: colors.mutedForeground }} />}
        <span style={{ fontSize: '14px', fontWeight: 600, color: colors.foreground }}>{area.name}</span>
        {!expanded && <MetricCount>{area.metrics.length} metrics</MetricCount>}
      </AreaHeaderBtn>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ padding: '0 12px 8px' }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {visibleMetrics.map((metric) => (
                <StripButton
                  key={metric.id}
                  onClick={() => onMetricClick?.(metric)}
                >
                  <StripName>{metric.name}</StripName>
                  <StripValue>{metric.current}</StripValue>
                  <StripPrior>{metric.prior}</StripPrior>
                  <StripChange><ChangeLabelComp value={metric.change} label={metric.changeLabel} /></StripChange>
                  <StripSparkline>
                    <Sparkline data={metric.trend} color={sparkColor(metric.change)} />
                  </StripSparkline>
                  <StripInsight>
                    <AIInsightCell>{metric.aiInsight?.summary || 'No insight available'}</AIInsightCell>
                  </StripInsight>
                </StripButton>
              ))}
            </div>
            {hasMore && (
              <div style={{ padding: '4px 12px 0', textAlign: 'center' }}>
                <span style={{ fontSize: 11, color: colors.mutedForeground }}>+{area.metrics.length - maxRows!} more</span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </AreaContainer>
  );
}

export function WatchlistTable({ areas, selectedAreaIds, selectedMetricIds, maxRows = 5, variant = 'A', onViewFull, onCustomize, onMetricClick }: WatchlistTableProps) {
  const selectedAreas = areas.filter((a) => selectedAreaIds.includes(a.id));

  return (
    <CardWrapper
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
    >
      <HeaderRow>
        <HeaderLeft>
          <Eye style={{ width: 20, height: 20, color: colors.violet600 }} />
          <Title>Your Watchlist</Title>
        </HeaderLeft>
        <ViewFullBtn onClick={onCustomize}>
          Customize your Watchlist
          <ChevronRight style={{ width: 14, height: 14, transition: 'transform 0.2s' }} />
        </ViewFullBtn>
      </HeaderRow>

      <AreaList>
        {selectedAreas.map((area, idx) => (
          variant === 'A'
            ? <AreaTableSlim key={area.id} area={area} defaultExpanded={idx === 0} maxRows={maxRows} onMetricClick={onMetricClick} />
            : <AreaStrips key={area.id} area={area} defaultExpanded={idx === 0} maxRows={maxRows} onMetricClick={onMetricClick} />
        ))}
      </AreaList>
    </CardWrapper>
  );
}
