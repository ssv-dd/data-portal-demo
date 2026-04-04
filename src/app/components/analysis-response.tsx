import { Sparkles, ChevronUp, ChevronDown, TrendingUp, ArrowRight, LayoutDashboard, Code2, FileText, Copy, Download, Share2, Pin, CheckCircle2, ExternalLink, BookOpen } from 'lucide-react';
import { Button } from './ui/button';
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import styled from 'styled-components';
import { Theme } from '@doordash/prism-react';
import { colors, radius, shadows } from '@/styles/theme';
import { PinToDashboardDialog } from './chart-builder/pin-to-dashboard-dialog';
import { canvasStorage } from '../data/canvas-storage';
import { createNotebook, setPrefillCells } from '../data/notebook-storage';
import type { WidgetConfig, CanvasLayoutItem } from '@/types';

interface AnalysisChartDataPoint {
  date: string;
  subscribers: number;
  target: number;
}

interface AnalysisSummaryRow {
  region: string;
  subs: string;
  growth: string;
  retention: string;
  aov: string;
  trend: 'up' | 'down';
}

interface AnalysisResponseProps {
  chartData: AnalysisChartDataPoint[];
  summaryData: AnalysisSummaryRow[];
}

const OuterContainer = styled.div`
  background: rgb(var(--app-muted-rgb) / 0.5);
  border-radius: ${radius.xl};
  border: 1px solid ${colors.border};
`;

const HeaderBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${Theme.usage.space.medium} ${Theme.usage.space.large};
  border-bottom: 1px solid ${colors.border};
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.small};
`;

const AiIconBadge = styled.div`
  width: 32px;
  height: 32px;
  border-radius: ${radius.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${colors.violet600};
`;

const HeaderInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xSmall};
`;

const CompletionText = styled.span`
  font-size: ${Theme.usage.fontSize.xSmall};
  color: ${colors.mutedForeground};
`;

const ConfidenceBadge = styled.span`
  font-size: ${Theme.usage.fontSize.xxSmall};
  padding: ${Theme.usage.space.xxxSmall} ${Theme.usage.space.xSmall};
  border-radius: ${Theme.usage.borderRadius.full};
  background-color: var(--app-status-success-bg);
  color: #15803d;
  font-weight: 500;
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xSmall};
`;

const IconButton = styled(Button)`
  height: 28px;
  padding: 0 ${Theme.usage.space.xSmall};
  color: ${colors.mutedForeground};
`;

const CollapseBtn = styled.button`
  color: rgb(var(--app-muted-fg-rgb) / 0.6);
  background: transparent;
  border: none;
  cursor: pointer;
  margin-left: ${Theme.usage.space.xxSmall};
  transition: color 150ms;

  &:hover {
    color: ${colors.mutedForeground};
  }
`;

const ContentBody = styled.div`
  padding: ${Theme.usage.space.large};
  display: flex;
  flex-direction: column;
  gap: ${Theme.usage.space.large};
`;

const TitleBlock = styled.div``;

const TitleText = styled.h2`
  font-size: ${Theme.usage.fontSize.xLarge};
  font-weight: 600;
  color: ${colors.foreground};
  margin-bottom: ${Theme.usage.space.xxSmall};
`;

const SubtitleText = styled.p`
  font-size: ${Theme.usage.fontSize.xSmall};
  color: ${colors.mutedForeground};
`;

const SectionCard = styled.div`
  background-color: ${colors.white};
  border-radius: ${radius.xl};
  border: 1px solid ${colors.border};
  overflow: hidden;
`;

const SectionHeader = styled.div`
  padding: ${Theme.usage.space.small} 20px;
  background: rgb(var(--app-muted-rgb) / 0.5);
  border-bottom: 1px solid ${colors.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const SectionTitle = styled.h3`
  font-size: ${Theme.usage.fontSize.xSmall};
  font-weight: 600;
  color: ${colors.foreground};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const SectionActionsWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xxxSmall};
`;

const ActionButton = styled(Button)`
  font-size: 11px;
  height: 24px;
  padding: 0 ${Theme.usage.space.xSmall};
  gap: ${Theme.usage.space.xxxSmall};
  color: ${colors.mutedForeground};

  &:hover {
    color: ${colors.foreground};
  }

  svg {
    width: 12px;
    height: 12px;
  }
`;

const SectionBody = styled.div`
  padding: 20px;
`;

const MetricGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${Theme.usage.space.medium};
`;

const MetricColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${Theme.usage.space.small};
`;

const MetricLabel = styled.div`
  font-size: ${Theme.usage.fontSize.xxSmall};
  font-weight: 500;
  color: ${colors.mutedForeground};
  text-transform: uppercase;
`;

const MetricDescription = styled.div`
  font-size: ${Theme.usage.fontSize.xSmall};
  color: ${colors.foreground};
  margin-top: ${Theme.usage.space.xxxSmall};
`;

const SourceFooter = styled.div`
  margin-top: ${Theme.usage.space.medium};
  padding-top: ${Theme.usage.space.small};
  border-top: 1px solid rgb(var(--app-overlay-rgb) / 0.04);
`;

const SourceText = styled.p`
  font-size: ${Theme.usage.fontSize.xxSmall};
  color: rgb(var(--app-muted-fg-rgb) / 0.6);
`;

const TableWrapper = styled.div`
  overflow-x: auto;
`;

const StyledTable = styled.table`
  width: 100%;
  font-size: ${Theme.usage.fontSize.xSmall};
`;

const ThCell = styled.th<{ $align?: string }>`
  text-align: ${({ $align }) => $align || 'left'};
  padding: ${Theme.usage.space.small} 20px;
  font-size: ${Theme.usage.fontSize.xxSmall};
  font-weight: 600;
  color: ${colors.mutedForeground};
  text-transform: uppercase;
`;

const ThRow = styled.tr`
  border-bottom: 1px solid ${colors.border};
`;

const DataRow = styled.tr<{ $isFirst: boolean }>`
  border-bottom: 1px solid rgb(var(--app-overlay-rgb) / 0.04);
  ${({ $isFirst }) =>
    $isFirst
      ? `background: var(--app-violet-light-bg); font-weight: 500;`
      : `&:hover { background: rgb(var(--app-accent-rgb) / 0.4); }`}
`;

const TdCell = styled.td<{ $align?: string }>`
  padding: ${Theme.usage.space.small} 20px;
  color: ${colors.foreground};
  text-align: ${({ $align }) => $align || 'left'};
`;

const GrowthBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${Theme.usage.space.xxSmall};
  color: #15803d;
`;

type TakeawayVariant = 'green' | 'amber' | 'blue';

const takeawayStyles = {
  green: { bg: '#f0fdf4', border: '#dcfce7', iconColor: '#16a34a', titleColor: '#14532d', descColor: '#15803d' },
  amber: { bg: '#fffbeb', border: '#fef3c7', iconColor: '#d97706', titleColor: '#78350f', descColor: '#b45309' },
  blue: { bg: '#eff6ff', border: '#dbeafe', iconColor: '#2563eb', titleColor: '#1e3a5f', descColor: '#1d4ed8' },
};

const TakeawayCard = styled.div<{ $variant: TakeawayVariant }>`
  display: flex;
  gap: ${Theme.usage.space.small};
  padding: ${Theme.usage.space.small};
  border-radius: ${radius.lg};
  background: ${({ $variant }) => takeawayStyles[$variant].bg};
  border: 1px solid ${({ $variant }) => takeawayStyles[$variant].border};
`;

const TakeawayIconWrap = styled.div<{ $variant: TakeawayVariant }>`
  color: ${({ $variant }) => takeawayStyles[$variant].iconColor};
  flex-shrink: 0;
  margin-top: ${Theme.usage.space.xxxSmall};
`;

const TakeawayTitle = styled.div<{ $variant: TakeawayVariant }>`
  font-size: ${Theme.usage.fontSize.xSmall};
  font-weight: 500;
  color: ${({ $variant }) => takeawayStyles[$variant].titleColor};
`;

const TakeawayDesc = styled.div<{ $variant: TakeawayVariant }>`
  font-size: ${Theme.usage.fontSize.xxSmall};
  color: ${({ $variant }) => takeawayStyles[$variant].descColor};
  margin-top: ${Theme.usage.space.xxxSmall};
`;

const TakeawaysBody = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: ${Theme.usage.space.medium};
`;

const ChartSectionWrapper = styled.div`
  background-color: ${colors.white};
  border-radius: ${radius.xl};
  border: 1px solid ${colors.border};
  overflow: hidden;
`;

const ChartHeaderRow = styled.div`
  padding: ${Theme.usage.space.small} 20px;
  background: rgb(var(--app-muted-rgb) / 0.5);
  border-bottom: 1px solid ${colors.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ChartHeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.small};
`;

const ChartTimeLabel = styled.span`
  font-size: ${Theme.usage.fontSize.xxSmall};
  color: rgb(var(--app-muted-fg-rgb) / 0.6);
`;

const ChartBody = styled.div`
  padding: 20px;
`;

const NextCutsIntro = styled.p`
  font-size: ${Theme.usage.fontSize.xSmall};
  color: ${colors.mutedForeground};
  margin-bottom: ${Theme.usage.space.medium};
`;

const NextCutsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${Theme.usage.space.small};
`;

const NextCutArrowWrap = styled.span`
  color: rgb(var(--app-muted-fg-rgb) / 0.4);
  flex-shrink: 0;
  margin-top: ${Theme.usage.space.xxxSmall};
  transition: color 150ms;
`;

const NextCutButton = styled.button`
  display: flex;
  align-items: flex-start;
  gap: ${Theme.usage.space.small};
  padding: 14px;
  border-radius: ${radius.xl};
  border: 1px solid ${colors.border};
  background: transparent;
  cursor: pointer;
  text-align: left;
  transition: all 200ms;

  &:hover {
    border-color: ${colors.borderStrong};
    background: rgb(var(--app-accent-rgb) / 0.4);
  }

  &:hover ${NextCutArrowWrap} {
    color: ${colors.mutedForeground};
  }
`;

const NextCutContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const NextCutQuery = styled.div`
  font-size: ${Theme.usage.fontSize.xSmall};
  color: ${colors.foreground};
`;

const NextCutTag = styled.div`
  font-size: ${Theme.usage.fontSize.xxSmall};
  color: rgb(var(--app-muted-fg-rgb) / 0.6);
  margin-top: ${Theme.usage.space.xxSmall};
`;

const PinSuccessBanner = styled.div`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.small};
  padding: 6px 20px;
  background: #f0fdf4;
  border-bottom: 1px solid #bbf7d0;
`;

const PinSuccessText = styled.span`
  font-size: ${Theme.usage.fontSize.xSmall};
  color: #15803d;
  flex: 1;
`;

const PinSuccessLink = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: ${Theme.usage.fontSize.xSmall};
  font-weight: 600;
  color: #15803d;
  background: transparent;
  border: none;
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 2px;

  &:hover {
    color: #166534;
  }
`;

function SectionActions({ onPinToCanvas, onOpenInNotebook }: { onPinToCanvas?: () => void; onOpenInNotebook?: () => void }) {
  const navigate = useNavigate();
  return (
    <SectionActionsWrapper>
      <ActionButton
        size="sm"
        variant="ghost"
        onClick={(e) => {
          e.stopPropagation();
          if (onPinToCanvas) onPinToCanvas();
          else navigate('/dashboards');
        }}
      >
        <Pin />
        Pin to Canvas
      </ActionButton>
      <ActionButton
        size="sm"
        variant="ghost"
        onClick={(e) => {
          e.stopPropagation();
          navigate('/sql-studio');
        }}
      >
        <Code2 />
        SQL
      </ActionButton>
      <ActionButton
        size="sm"
        variant="ghost"
        onClick={(e) => {
          e.stopPropagation();
          if (onOpenInNotebook) onOpenInNotebook();
          else navigate('/notebooks');
        }}
      >
        <BookOpen />
        Notebook
      </ActionButton>
    </SectionActionsWrapper>
  );
}

export function AnalysisResponse({ chartData, summaryData }: AnalysisResponseProps) {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [pinDialogOpen, setPinDialogOpen] = useState(false);
  const [pendingWidget, setPendingWidget] = useState<WidgetConfig | null>(null);
  const [pinSuccess, setPinSuccess] = useState<{ canvasId: string; canvasTitle: string; widgetTitle: string; section: 'chart' | 'table' } | null>(null);

  const handlePinChart = useCallback(() => {
    setPendingWidget({
      id: crypto.randomUUID(),
      title: 'Subscriber Growth Trend',
      subtitle: '60-day window • millions',
      type: 'area',
      data: chartData.map((d) => ({ name: d.date, value: d.subscribers, target: d.target })),
    });
    setPinSuccess(null);
    setPinDialogOpen(true);
  }, [chartData]);

  const handlePinTable = useCallback(() => {
    setPendingWidget({
      id: crypto.randomUUID(),
      title: 'Executive Summary by Region',
      subtitle: 'DashPass Growth Deep-Dive',
      type: 'table',
      data: summaryData.map((r) => ({ name: r.region, value: parseFloat(r.subs.replace(/[^0-9.]/g, '')), growth: r.growth, retention: r.retention, aov: r.aov })),
    });
    setPinSuccess(null);
    setPinDialogOpen(true);
  }, [summaryData]);

  const handlePin = useCallback((canvasId: string) => {
    if (!pendingWidget) return;
    canvasStorage.saveCanvasWidget(canvasId, pendingWidget);
    const existing = canvasStorage.getCanvas(canvasId);
    if (existing) {
      const maxY = existing.layout.reduce((max, item) => Math.max(max, item.y + item.h), 0);
      const newLayoutItem: CanvasLayoutItem = {
        widgetId: pendingWidget.id,
        x: 0,
        y: maxY,
        w: 6,
        h: 4,
      };
      canvasStorage.saveCanvas({ ...existing, layout: [...existing.layout, newLayoutItem] });
      const section = pendingWidget.type === 'table' ? 'table' as const : 'chart' as const;
      setPinSuccess({ canvasId, canvasTitle: existing.title, widgetTitle: pendingWidget.title, section });
    }
    setPendingWidget(null);
  }, [pendingWidget]);

  const [notebookSuccess, setNotebookSuccess] = useState<{ notebookId: string; notebookTitle: string; section: 'chart' | 'table' } | null>(null);

  const handleOpenChartInNotebook = useCallback(() => {
    const title = 'DashPass Growth Trend Analysis';
    const nb = createNotebook(title, 'CPU Small', 'data-science');
    setPrefillCells([
      { type: 'markdown', source: `# ${title}\nGenerated from AI Chat — deeper analysis of subscriber growth trend.` },
      { type: 'code', source: `import pandas as pd\nimport matplotlib.pyplot as plt\nimport seaborn as sns\nfrom doordash.data import SnowflakeConnector\n\nconn = SnowflakeConnector(role='DATA_ANALYST')\nprint("Connected to Snowflake ✓")` },
      { type: 'code', source: `query = """\nSELECT\n    ds,\n    COUNT(DISTINCT subscriber_id) as active_subscribers,\n    COUNT(DISTINCT CASE WHEN is_new THEN subscriber_id END) as new_subscribers\nFROM analytics.dashpass_subscribers\nWHERE ds BETWEEN '2026-01-15' AND '2026-03-16'\nGROUP BY ds\nORDER BY ds\n"""\n\ndf = pd.read_sql(query, conn)\nprint(f"Loaded {len(df):,} rows")\ndf.head()` },
      { type: 'code', source: `fig, ax = plt.subplots(figsize=(14, 6))\nax.plot(df['ds'], df['active_subscribers'], color='#7c3aed', linewidth=2, label='Active Subscribers')\nax.fill_between(df['ds'], df['active_subscribers'], alpha=0.1, color='#7c3aed')\nax.set_title('DashPass Subscriber Growth Trend')\nax.set_xlabel('Date')\nax.set_ylabel('Subscribers')\nax.legend()\nplt.tight_layout()\nplt.show()` },
      { type: 'markdown', source: '## Next steps\n- Segment by acquisition channel (organic vs paid vs referral)\n- Compare retention across cohorts\n- Forecast next 30-day trajectory' },
      { type: 'code', source: '' },
    ]);
    setNotebookSuccess({ notebookId: nb.id, notebookTitle: title, section: 'chart' });
  }, []);

  const handleOpenTableInNotebook = useCallback(() => {
    const title = 'DashPass Regional Deep-Dive';
    const nb = createNotebook(title, 'CPU Small', 'data-science');
    setPrefillCells([
      { type: 'markdown', source: `# ${title}\nGenerated from AI Chat — deeper analysis of executive summary by region.` },
      { type: 'code', source: `import pandas as pd\nimport numpy as np\nfrom doordash.data import SnowflakeConnector\n\nconn = SnowflakeConnector(role='DATA_ANALYST')\nprint("Connected to Snowflake ✓")` },
      { type: 'code', source: `query = """\nSELECT\n    region,\n    active_subscribers,\n    mom_growth_pct,\n    retention_rate,\n    avg_order_value\nFROM analytics.dashpass_regional_summary\nWHERE period = 'L60D'\nORDER BY active_subscribers DESC\n"""\n\ndf = pd.read_sql(query, conn)\nprint(f"{len(df)} regions loaded")\ndf` },
      { type: 'code', source: `# Custom segmentation — slice by growth tier\ndf['growth_tier'] = pd.cut(df['mom_growth_pct'], bins=[0, 5, 10, 15, 100], labels=['Slow', 'Moderate', 'Strong', 'Hypergrowth'])\ndf.groupby('growth_tier').agg(\n    regions=('region', 'count'),\n    avg_retention=('retention_rate', 'mean'),\n    total_subs=('active_subscribers', 'sum')\n).round(1)` },
      { type: 'code', source: '' },
    ]);
    setNotebookSuccess({ notebookId: nb.id, notebookTitle: title, section: 'table' });
  }, []);

  return (
    <OuterContainer>
      {/* Header */}
      <HeaderBar>
        <HeaderLeft>
          <AiIconBadge>
            <Sparkles style={{ width: 16, height: 16, color: '#ffffff' }} />
          </AiIconBadge>
          <HeaderInfo>
            <CompletionText>Completed in 3 minutes and 4 seconds</CompletionText>
            <ConfidenceBadge>High confidence</ConfidenceBadge>
          </HeaderInfo>
        </HeaderLeft>
        <HeaderActions>
          <IconButton variant="ghost" size="sm">
            <Copy style={{ width: 14, height: 14 }} />
          </IconButton>
          <IconButton variant="ghost" size="sm">
            <Download style={{ width: 14, height: 14 }} />
          </IconButton>
          <IconButton variant="ghost" size="sm">
            <Share2 style={{ width: 14, height: 14 }} />
          </IconButton>
          <CollapseBtn onClick={() => setIsCollapsed(!isCollapsed)}>
            {isCollapsed ? <ChevronDown style={{ width: 20, height: 20 }} /> : <ChevronUp style={{ width: 20, height: 20 }} />}
          </CollapseBtn>
        </HeaderActions>
      </HeaderBar>

      {!isCollapsed && (
        <ContentBody>
          {/* Title */}
          <TitleBlock>
            <TitleText>DashPass Growth Deep-Dive</TitleText>
            <SubtitleText>Analysis period: Jan 15 – Mar 16, 2026 (60 days)</SubtitleText>
          </TitleBlock>

          {/* Section 1: Metric Definitions */}
          <SectionCard>
            <SectionHeader>
              <SectionTitle>Metric Definitions &amp; Methodology</SectionTitle>
            </SectionHeader>
            <SectionBody>
              <MetricGrid>
                <MetricColumn>
                  <div>
                    <MetricLabel>Active Subscribers</MetricLabel>
                    <MetricDescription>Users with active DashPass billing in the period. Excludes trial and paused.</MetricDescription>
                  </div>
                  <div>
                    <MetricLabel>MoM Growth</MetricLabel>
                    <MetricDescription>Month-over-month change in active subscribers, seasonally adjusted.</MetricDescription>
                  </div>
                </MetricColumn>
                <MetricColumn>
                  <div>
                    <MetricLabel>Retention Rate</MetricLabel>
                    <MetricDescription>Percentage of subscribers renewing at end of billing cycle (30-day rolling).</MetricDescription>
                  </div>
                  <div>
                    <MetricLabel>Avg. Order Value (AOV)</MetricLabel>
                    <MetricDescription>Mean order value for DashPass members, pre-tip and pre-discount.</MetricDescription>
                  </div>
                </MetricColumn>
              </MetricGrid>
              <SourceFooter>
                <SourceText>Sources: billing_events, subscription_status, orders_completed | Warehouse: Snowflake prod | Last refreshed: 12 min ago</SourceText>
              </SourceFooter>
            </SectionBody>
          </SectionCard>

          {/* Section 2: Executive Summary Table */}
          <SectionCard>
            <SectionHeader>
              <SectionTitle>Executive Summary by Region</SectionTitle>
              <SectionActions onPinToCanvas={handlePinTable} onOpenInNotebook={handleOpenTableInNotebook} />
            </SectionHeader>
            {pinSuccess?.section === 'table' && (
              <PinSuccessBanner>
                <CheckCircle2 style={{ width: 14, height: 14, color: '#16a34a', flexShrink: 0 }} />
                <PinSuccessText>Pinned to <strong>{pinSuccess.canvasTitle}</strong></PinSuccessText>
                <PinSuccessLink onClick={() => navigate(`/dashboard/${pinSuccess.canvasId}`)}>
                  Open Canvas <ExternalLink style={{ width: 11, height: 11 }} />
                </PinSuccessLink>
              </PinSuccessBanner>
            )}
            {notebookSuccess?.section === 'table' && (
              <PinSuccessBanner>
                <BookOpen style={{ width: 14, height: 14, color: '#16a34a', flexShrink: 0 }} />
                <PinSuccessText>Notebook created: <strong>{notebookSuccess.notebookTitle}</strong></PinSuccessText>
                <PinSuccessLink onClick={() => navigate(`/notebook/${notebookSuccess.notebookId}?name=${encodeURIComponent(notebookSuccess.notebookTitle)}`)}>
                  Open Notebook <ExternalLink style={{ width: 11, height: 11 }} />
                </PinSuccessLink>
              </PinSuccessBanner>
            )}
            <TableWrapper>
              <StyledTable>
                <thead>
                  <ThRow>
                    <ThCell>Region</ThCell>
                    <ThCell $align="right">Subscribers</ThCell>
                    <ThCell $align="right">Growth (MoM)</ThCell>
                    <ThCell $align="right">Retention</ThCell>
                    <ThCell $align="right">AOV</ThCell>
                  </ThRow>
                </thead>
                <tbody>
                  {summaryData.map((row, i) => (
                    <DataRow key={row.region} $isFirst={i === 0}>
                      <TdCell>{row.region}</TdCell>
                      <TdCell $align="right">{row.subs}</TdCell>
                      <TdCell $align="right">
                        <GrowthBadge>
                          <TrendingUp style={{ width: 12, height: 12 }} />
                          {row.growth}
                        </GrowthBadge>
                      </TdCell>
                      <TdCell $align="right">{row.retention}</TdCell>
                      <TdCell $align="right">{row.aov}</TdCell>
                    </DataRow>
                  ))}
                </tbody>
              </StyledTable>
            </TableWrapper>
          </SectionCard>

          {/* Section 3: Key Takeaways */}
          <SectionCard>
            <SectionHeader>
              <SectionTitle>Key Takeaways &amp; Trend Highlights</SectionTitle>
            </SectionHeader>
            <TakeawaysBody>
              <TakeawayCard $variant="green">
                <TakeawayIconWrap $variant="green">
                  <TrendingUp style={{ width: 20, height: 20 }} />
                </TakeawayIconWrap>
                <div>
                  <TakeawayTitle $variant="green">Subscriptions surpassed 14M milestone</TakeawayTitle>
                  <TakeawayDesc $variant="green">14.2M active subscribers — 12.4% MoM growth, well ahead of 10% target. The fastest growth period since Q2 2025.</TakeawayDesc>
                </div>
              </TakeawayCard>
              <TakeawayCard $variant="green">
                <TakeawayIconWrap $variant="green">
                  <TrendingUp style={{ width: 20, height: 20 }} />
                </TakeawayIconWrap>
                <div>
                  <TakeawayTitle $variant="green">Retention improved +3.2pp to 87.3%</TakeawayTitle>
                  <TakeawayDesc $variant="green">Driven by the new &quot;pause instead of cancel&quot; flow shipped Feb 1. Churn rate dropped from 15.9% to 12.7%.</TakeawayDesc>
                </div>
              </TakeawayCard>
              <TakeawayCard $variant="amber">
                <TakeawayIconWrap $variant="amber">
                  <ArrowRight style={{ width: 20, height: 20 }} />
                </TakeawayIconWrap>
                <div>
                  <TakeawayTitle $variant="amber">Order frequency gap widening</TakeawayTitle>
                  <TakeawayDesc $variant="amber">DashPass members order 4.2x/week vs 1.8x for non-members (ratio: 2.3x, up from 2.1x). Suggests strong value lock-in.</TakeawayDesc>
                </div>
              </TakeawayCard>
              <TakeawayCard $variant="blue">
                <TakeawayIconWrap $variant="blue">
                  <TrendingUp style={{ width: 20, height: 20 }} />
                </TakeawayIconWrap>
                <div>
                  <TakeawayTitle $variant="blue">SF Bay Area leads regional growth at +18.2%</TakeawayTitle>
                  <TakeawayDesc $variant="blue">Correlated with the Feb 10 &quot;DashPass for Families&quot; launch in Bay Area. NYC (+15%) and Chicago (+13%) also strong.</TakeawayDesc>
                </div>
              </TakeawayCard>
            </TakeawaysBody>
          </SectionCard>

          {/* Section 4: Growth Trend Chart */}
          <ChartSectionWrapper>
            <ChartHeaderRow>
              <ChartHeaderLeft>
                <SectionTitle>Subscriber Growth Trend</SectionTitle>
                <ChartTimeLabel>60-day window • millions</ChartTimeLabel>
              </ChartHeaderLeft>
              <SectionActions onPinToCanvas={handlePinChart} onOpenInNotebook={handleOpenChartInNotebook} />
            </ChartHeaderRow>
            {pinSuccess?.section === 'chart' && (
              <PinSuccessBanner>
                <CheckCircle2 style={{ width: 14, height: 14, color: '#16a34a', flexShrink: 0 }} />
                <PinSuccessText>Pinned to <strong>{pinSuccess.canvasTitle}</strong></PinSuccessText>
                <PinSuccessLink onClick={() => navigate(`/dashboard/${pinSuccess.canvasId}`)}>
                  Open Canvas <ExternalLink style={{ width: 11, height: 11 }} />
                </PinSuccessLink>
              </PinSuccessBanner>
            )}
            {notebookSuccess?.section === 'chart' && (
              <PinSuccessBanner>
                <BookOpen style={{ width: 14, height: 14, color: '#16a34a', flexShrink: 0 }} />
                <PinSuccessText>Notebook created: <strong>{notebookSuccess.notebookTitle}</strong></PinSuccessText>
                <PinSuccessLink onClick={() => navigate(`/notebook/${notebookSuccess.notebookId}?name=${encodeURIComponent(notebookSuccess.notebookTitle)}`)}>
                  Open Notebook <ExternalLink style={{ width: 11, height: 11 }} />
                </PinSuccessLink>
              </PinSuccessBanner>
            )}
            <ChartBody>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <defs>
                    <linearGradient id="subscriberGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                  <YAxis domain={[10.5, 15]} tick={{ fontSize: 12 }} stroke="#9ca3af" tickFormatter={(v) => `${v}M`} />
                  <Tooltip
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '13px' }}
                    formatter={(value) => [`${value}M`, '']}
                  />
                  <Area type="monotone" dataKey="subscribers" stroke="#7c3aed" strokeWidth={2.5} fill="url(#subscriberGradient)" name="Actual" />
                  <Line type="monotone" dataKey="target" stroke="#9ca3af" strokeWidth={1.5} strokeDasharray="6 3" dot={false} name="Target" />
                </AreaChart>
              </ResponsiveContainer>
            </ChartBody>
          </ChartSectionWrapper>

          {/* Section 5: Recommended Next Cuts */}
          <SectionCard>
            <SectionHeader>
              <SectionTitle>Recommended Next Cuts</SectionTitle>
            </SectionHeader>
            <SectionBody>
              <NextCutsIntro>Based on this analysis, the agent suggests these follow-up explorations:</NextCutsIntro>
              <NextCutsGrid>
                {[
                  { q: 'Break down growth by acquisition channel (organic vs paid vs referral)', tag: 'Segmentation' },
                  { q: 'Compare "pause instead of cancel" cohort retention vs control', tag: 'A/B Analysis' },
                  { q: 'DashPass for Families adoption by market since Feb 10 launch', tag: 'Feature Impact' },
                  { q: 'Predict next 30-day subscriber trajectory with current trends', tag: 'Forecast' },
                ].map((item) => (
                  <NextCutButton key={item.q}>
                    <Sparkles style={{ width: 16, height: 16, color: colors.violet600, flexShrink: 0, marginTop: '2px' }} />
                    <NextCutContent>
                      <NextCutQuery>{item.q}</NextCutQuery>
                      <NextCutTag>{item.tag}</NextCutTag>
                    </NextCutContent>
                    <NextCutArrowWrap>
                      <ArrowRight style={{ width: 16, height: 16 }} />
                    </NextCutArrowWrap>
                  </NextCutButton>
                ))}
              </NextCutsGrid>
            </SectionBody>
          </SectionCard>
        </ContentBody>
      )}
      <PinToDashboardDialog
        open={pinDialogOpen}
        onClose={() => { setPinDialogOpen(false); setPendingWidget(null); }}
        onPin={handlePin}
      />
    </OuterContainer>
  );
}
