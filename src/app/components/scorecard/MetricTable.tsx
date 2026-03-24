import styled, { css } from 'styled-components';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import {
  ChevronDown,
  ChevronRight,
  Sparkles,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Info,
  Settings,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkline } from './Sparkline';
import { colors, Theme } from '@/styles/theme';
import type { Metric, ProductArea } from '@/types';

interface MetricTableProps {
  area: ProductArea;
  columnHeaders: { current: string; vsPrior: string };
  expanded: boolean;
  onToggleExpand: () => void;
  onMetricClick: (metric: Metric) => void;
  onCustomize: () => void;
}

const StyledCard = styled(Card)`
  overflow: hidden;
`;

const statusBorderColors: Record<string, string> = {
  excellent: colors.blue600,
  healthy: colors.emerald500,
  warning: colors.ddWarning,
  critical: colors.ddError,
};

const AreaHeader = styled.div<{ $status: string }>`
  padding: ${Theme.usage.space.medium};
  border-left: 4px solid ${({ $status }) => statusBorderColors[$status] || colors.ddError};
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ExpandToggle = styled.div`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.small};
  cursor: pointer;
  flex: 1;
  transition: opacity 150ms;

  &:hover {
    opacity: 0.7;
  }
`;

const AreaName = styled.h3`
  font-weight: 600;
  font-size: ${Theme.usage.fontSize.medium};
`;

const ActionsRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.medium};
`;

const QuickViewInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.large};
  font-size: ${Theme.usage.fontSize.xSmall};
  color: ${colors.mutedForeground};
`;

const CustomizeButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xSmall};
`;

const TableWrapper = styled.div`
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  font-size: ${Theme.usage.fontSize.xSmall};
`;

const TableHead = styled.thead`
  background-color: rgb(var(--app-muted-rgb) / 0.5);
  border-top: 1px solid ${colors.border};
  border-bottom: 1px solid ${colors.border};
`;

const ThCell = styled.th<{ $align?: string; $width?: string }>`
  text-align: ${({ $align }) => $align || 'left'};
  padding: ${Theme.usage.space.small} ${Theme.usage.space.medium};
  font-weight: 500;
  width: ${({ $width }) => $width || 'auto'};
`;

const TableRow = styled.tr<{ $even: boolean }>`
  border-bottom: 1px solid ${colors.border};
  cursor: pointer;
  transition: background-color 150ms;
  background-color: ${({ $even }) => ($even ? colors.white : 'rgb(var(--app-muted-rgb) / 0.1)')};

  &:hover {
    background-color: rgb(var(--app-muted-rgb) / 0.3);
  }
`;

const TdCell = styled.td<{ $align?: string }>`
  padding: ${Theme.usage.space.small} ${Theme.usage.space.medium};
  text-align: ${({ $align }) => $align || 'left'};
`;

const CategoryCell = styled(TdCell)`
  font-size: ${Theme.usage.fontSize.xxSmall};
  color: ${colors.mutedForeground};
`;

const MetricNameWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xSmall};
`;

const MetricName = styled.span`
  font-weight: 500;
`;

const CurrentValue = styled(TdCell)`
  font-weight: 600;
`;

const changeColorStyles = {
  positive: css`color: ${colors.green600};`,
  negative: css`color: ${colors.red600};`,
};

const ChangeCell = styled.div<{ $positive: boolean }>`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: ${Theme.usage.space.xxSmall};
  ${({ $positive }) => $positive ? changeColorStyles.positive : changeColorStyles.negative}
`;

const ChangeLabel = styled.span`
  font-weight: 500;
`;

const VsPlanValue = styled.span<{ $positive: boolean }>`
  ${({ $positive }) => $positive ? changeColorStyles.positive : changeColorStyles.negative}
`;

const AiInsightCell = styled.div`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xSmall};
`;

const AiInsightText = styled.span`
  font-size: ${Theme.usage.fontSize.xxSmall};
  color: ${colors.mutedForeground};
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const iconStyle = (color: string) => ({ height: '16px', width: '16px', color });
const smallIconStyle = (color: string) => ({ height: '12px', width: '12px', color });
const chevronStyle = { height: '20px', width: '20px', color: colors.mutedForeground };

export function MetricTable({
  area,
  columnHeaders,
  expanded,
  onToggleExpand,
  onMetricClick,
  onCustomize,
}: MetricTableProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent': return <CheckCircle2 style={iconStyle(colors.blue600)} />;
      case 'healthy': return <CheckCircle2 style={iconStyle(colors.green600)} />;
      case 'warning': return <AlertTriangle style={iconStyle(colors.yellow600)} />;
      case 'critical': return <AlertTriangle style={iconStyle(colors.red600)} />;
      default: return <CheckCircle2 style={iconStyle(colors.mutedForeground)} />;
    }
  };

  return (
    <StyledCard>
      <AreaHeader $status={area.overallStatus}>
        <HeaderRow>
          <ExpandToggle onClick={onToggleExpand}>
            {expanded ? (
              <ChevronDown style={chevronStyle} />
            ) : (
              <ChevronRight style={chevronStyle} />
            )}
            <AreaName>{area.name}</AreaName>
          </ExpandToggle>
          <ActionsRow>
            {!expanded && area.quickView && (
              <QuickViewInfo>
                <span>{area.quickView.metric1}</span>
                <span>{area.quickView.metric2}</span>
              </QuickViewInfo>
            )}
            <CustomizeButton
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onCustomize();
              }}
            >
              <Settings style={{ height: '16px', width: '16px' }} />
              Customize
            </CustomizeButton>
          </ActionsRow>
        </HeaderRow>
      </AreaHeader>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <TableWrapper>
              <Table>
                <TableHead>
                  <tr>
                    <ThCell $width="12%">Category</ThCell>
                    <ThCell $width="22%">Metric</ThCell>
                    <ThCell $align="right" $width="10%">{columnHeaders.current}</ThCell>
                    <ThCell $align="right" $width="10%">{columnHeaders.vsPrior}</ThCell>
                    <ThCell $align="right" $width="10%">vs Q1 Plan</ThCell>
                    <ThCell $align="center" $width="10%">Trend (7D)</ThCell>
                    <ThCell $align="center" $width="8%">Status</ThCell>
                    <ThCell $align="center" $width="18%">AI Insight</ThCell>
                  </tr>
                </TableHead>
                <tbody>
                  {area.metrics.map((metric, idx) => (
                    <TableRow
                      key={metric.id}
                      $even={idx % 2 === 0}
                      onClick={() => onMetricClick(metric)}
                    >
                      <CategoryCell>{metric.category}</CategoryCell>
                      <TdCell>
                        <MetricNameWrapper>
                          <MetricName>{metric.name}</MetricName>
                          <Info style={smallIconStyle(colors.mutedForeground)} />
                        </MetricNameWrapper>
                      </TdCell>
                      <CurrentValue $align="right">{metric.current}</CurrentValue>
                      <TdCell $align="right">
                        <ChangeCell $positive={metric.change > 0}>
                          {metric.change > 0
                            ? <TrendingUp style={smallIconStyle('currentColor')} />
                            : <TrendingDown style={smallIconStyle('currentColor')} />
                          }
                          <ChangeLabel>{metric.changeLabel}</ChangeLabel>
                        </ChangeCell>
                      </TdCell>
                      <TdCell $align="right">
                        {metric.vsPlan && (
                          <VsPlanValue $positive={!!(metric.vsPlanValue && metric.vsPlanValue > 0)}>
                            {metric.vsPlan}
                          </VsPlanValue>
                        )}
                      </TdCell>
                      <TdCell $align="center">
                        <Sparkline
                          data={metric.trend}
                          color={metric.change > 0 ? '#10b981' : '#ef4444'}
                        />
                      </TdCell>
                      <TdCell $align="center">
                        {getStatusIcon(metric.status)}
                      </TdCell>
                      <TdCell>
                        <AiInsightCell>
                          <Sparkles style={{ ...iconStyle(colors.purple500), flexShrink: 0 }} />
                          <AiInsightText>
                            {metric.aiInsight.summary}
                          </AiInsightText>
                        </AiInsightCell>
                      </TdCell>
                    </TableRow>
                  ))}
                </tbody>
              </Table>
            </TableWrapper>
          </motion.div>
        )}
      </AnimatePresence>
    </StyledCard>
  );
}
