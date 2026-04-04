import { useState, useCallback, useMemo, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer, staggerItem } from '@/app/lib/motion';
import { useParams, useNavigate, useSearchParams } from 'react-router';
import {
  ArrowLeft,
  ExternalLink,
  Save,
  Play,
  Square,
  RotateCcw,
  Circle,
  Download,
  Share2,
  MoreHorizontal,
  Type,
  Code,
  Trash2,
} from 'lucide-react';
import { AIAssistantSidebar } from '../components/ai-assistant-sidebar';
import { GradientOrb } from '../components/hero/gradient-orb';
import { Theme } from '@doordash/prism-react';
import { colors, glassPanel, radius, fonts } from '@/styles/theme';
import { getAllNotebooks, consumePrefillCells } from '../data/notebook-storage';

type KernelStatus = 'starting' | 'idle' | 'busy' | 'not_connected';
type CellType = 'code' | 'markdown';

interface NotebookCell {
  id: string;
  type: CellType;
  source: string;
  output?: string;
  executionCount?: number | null;
  isRunning?: boolean;
}

const JUPYTERHUB_BASE_URL = 'https://jupyterhub.doordash.com';

const SAMPLE_CELLS: NotebookCell[] = [
  {
    id: 'md-1',
    type: 'markdown',
    source: '# DashPass Growth Trend Analysis\nExploratory analysis of DashPass subscriber growth patterns, retention trends, and regional performance across markets.',
  },
  {
    id: 'code-1',
    type: 'code',
    source: `import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import matplotlib.pyplot as plt
import seaborn as sns

# Connect to warehouse
from doordash.data import SnowflakeConnector
conn = SnowflakeConnector(role='DATA_ANALYST')

print("Connected to Snowflake ✓")
print(f"Session started: {datetime.now().strftime('%Y-%m-%d %H:%M')}")`,
    output: 'Connected to Snowflake ✓\nSession started: 2026-03-31 14:22',
    executionCount: 1,
  },
  {
    id: 'code-2',
    type: 'code',
    source: `# Pull courier availability data for the last 28 days
query = """
SELECT 
    ds,
    market_id,
    market_name,
    hour_of_day,
    active_couriers,
    available_couriers,
    on_delivery_couriers,
    ROUND(available_couriers / NULLIF(active_couriers, 0) * 100, 1) as availability_rate
FROM analytics.courier_availability_hourly
WHERE ds >= DATEADD(day, -28, CURRENT_DATE())
ORDER BY ds, market_id, hour_of_day
"""

df = pd.read_sql(query, conn)
print(f"Loaded {len(df):,} rows across {df['market_name'].nunique()} markets")
df.head()`,
    output: 'Loaded 48,384 rows across 72 markets\n\n  ds          market_id  market_name     hour  active  avail  on_del  rate\n0 2026-03-03  1          San Francisco   0     142     98     44      69.0\n1 2026-03-03  1          San Francisco   1     118     89     29      75.4\n2 2026-03-03  1          San Francisco   2      95     78     17      82.1\n3 2026-03-03  1          San Francisco   3      67     58      9      86.6\n4 2026-03-03  1          San Francisco   4      54     48      6      88.9',
    executionCount: 2,
  },
  {
    id: 'md-2',
    type: 'markdown',
    source: '## Peak Hour Analysis\nIdentify hours with lowest courier availability to inform incentive targeting.',
  },
  {
    id: 'code-3',
    type: 'code',
    source: `# Aggregate availability by hour across all markets
hourly_avg = df.groupby('hour_of_day').agg(
    avg_rate=('availability_rate', 'mean'),
    p25_rate=('availability_rate', lambda x: np.percentile(x, 25)),
    p75_rate=('availability_rate', lambda x: np.percentile(x, 75)),
).reset_index()

fig, ax = plt.subplots(figsize=(12, 5))
ax.fill_between(hourly_avg['hour_of_day'], hourly_avg['p25_rate'], 
                hourly_avg['p75_rate'], alpha=0.2, color='#6366f1')
ax.plot(hourly_avg['hour_of_day'], hourly_avg['avg_rate'], 
        color='#6366f1', linewidth=2, marker='o', markersize=4)
ax.axhline(y=70, color='#ef4444', linestyle='--', alpha=0.5, label='Target: 70%')
ax.set_xlabel('Hour of Day')
ax.set_ylabel('Availability Rate (%)')
ax.set_title('Courier Availability by Hour (28-day avg, P25-P75 band)')
ax.legend()
plt.tight_layout()
plt.show()`,
    output: '[Chart: Courier availability curve showing dip to ~55% at hours 11-13 and 17-19, with P25-P75 shaded band]',
    executionCount: 3,
  },
  {
    id: 'code-4',
    type: 'code',
    source: `# Bottom 5 markets by availability during peak hours (11am-1pm, 5pm-7pm)
peak_hours = [11, 12, 13, 17, 18, 19]
peak_df = df[df['hour_of_day'].isin(peak_hours)]

market_peak = peak_df.groupby('market_name')['availability_rate'].mean().sort_values()
print("Markets with lowest peak-hour availability:\\n")
print(market_peak.head().to_string())`,
    output: 'Markets with lowest peak-hour availability:\n\nmarket_name\nMiami              41.2\nHouston            44.8\nPhoenix            47.1\nDallas             49.3\nAtlanta            51.7',
    executionCount: 4,
  },
  {
    id: 'code-5',
    type: 'code',
    source: '',
    executionCount: null,
  },
];

/* ── Styled Components ── */

const PageContainer = styled.div`
  height: 100%;
  background-color: ${colors.background};
  overflow: hidden;
  position: relative;
`;

const GradientOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at top left, rgb(var(--app-fuchsia-rgb) / 0.05), transparent 35%),
              radial-gradient(circle at bottom right, rgb(var(--app-blue-rgb) / 0.05), transparent 35%);
`;

const ContentLayout = styled.div`
  position: relative;
  z-index: 10;
  height: 100%;
  display: flex;
  gap: ${Theme.usage.space.xSmall};
  padding: ${Theme.usage.space.xSmall};
`;

const MainPanel = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  ${glassPanel}
  border-radius: ${Theme.usage.borderRadius.xLarge};
  border: 1px solid ${colors.border};
`;

const Toolbar = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.small};
  padding: ${Theme.usage.space.xSmall} ${Theme.usage.space.medium};
  border-bottom: 1px solid ${colors.border};
  background: rgb(var(--app-surface-rgb) / 0.6);
  flex-shrink: 0;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: ${radius.lg};
  border: 1px solid ${colors.border};
  background: transparent;
  cursor: pointer;
  color: ${colors.foreground};
  transition: background-color 200ms;
  &:hover { background: rgb(var(--app-muted-rgb) / 0.5); }
`;

const NotebookTitleText = styled.h2`
  font-size: ${Theme.usage.fontSize.small};
  font-weight: 600;
  color: ${colors.foreground};
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ToolbarDivider = styled.div`
  width: 1px;
  height: 20px;
  background: ${colors.border};
`;

const KernelIndicator = styled.div<{ $status: KernelStatus }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: ${radius.full};
  font-size: ${Theme.usage.fontSize.xxSmall};
  font-weight: 500;
  border: 1px solid ${colors.border};
  background: rgb(var(--app-surface-rgb) / 0.4);
  color: ${({ $status }) => {
    switch ($status) {
      case 'idle': return colors.green600;
      case 'busy': return colors.yellow600;
      case 'starting': return colors.blue600;
      case 'not_connected': return colors.slate400;
    }
  }};
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
`;

const StatusDot = styled(Circle)<{ $status: KernelStatus }>`
  width: 8px;
  height: 8px;
  fill: currentColor;
  stroke: none;
  animation: ${({ $status }) => ($status === 'busy' || $status === 'starting') ? pulse : 'none'} 1.5s ease-in-out infinite;
`;

const ToolbarButton = styled.button<{ $variant?: 'primary' }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: ${radius.lg};
  border: 1px solid ${({ $variant }) => $variant === 'primary' ? colors.ddPrimary : colors.border};
  background: ${({ $variant }) => $variant === 'primary' ? colors.ddPrimary : 'transparent'};
  color: ${({ $variant }) => $variant === 'primary' ? colors.white : colors.foreground};
  font-size: ${Theme.usage.fontSize.xxSmall};
  font-weight: 500;
  cursor: pointer;
  transition: all 200ms;
  &:hover { background: ${({ $variant }) => $variant === 'primary' ? 'var(--app-dd-primary-hover, var(--app-dd-primary))' : 'rgb(var(--app-muted-rgb) / 0.5)'}; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

const ToolbarIconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: ${radius.lg};
  border: 1px solid ${colors.border};
  background: transparent;
  cursor: pointer;
  color: ${colors.foreground};
  transition: background-color 200ms;
  &:hover { background: rgb(var(--app-muted-rgb) / 0.5); }
`;

/* ── Notebook Editor Area ── */

const EditorArea = styled.div`
  flex: 1;
  overflow-y: auto;
  background: var(--app-bg);
`;

const CellsContainer = styled(motion.div)`
  max-width: 960px;
  margin: 0 auto;
  padding: ${Theme.usage.space.large} ${Theme.usage.space.xLarge};
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const CellWrapper = styled(motion.div)<{ $focused: boolean }>`
  position: relative;
  display: flex;
  border-left: 3px solid ${({ $focused }) => $focused ? colors.violet500 : 'transparent'};
  border-radius: ${radius.sm};
  transition: border-color 150ms;

  &:hover {
    border-left-color: ${({ $focused }) => $focused ? colors.violet500 : colors.slate300};
  }
`;

const CellGutter = styled.div`
  width: 56px;
  flex-shrink: 0;
  padding-top: 10px;
  text-align: right;
  padding-right: 10px;
  font-family: ${fonts.mono};
  font-size: 11px;
  color: ${colors.slate400};
  user-select: none;
`;

const CellBody = styled.div`
  flex: 1;
  min-width: 0;
`;

const CodeCellInput = styled.div<{ $focused: boolean }>`
  background: rgb(var(--app-surface-rgb) / 0.5);
  border: 1px solid ${({ $focused }) => $focused ? colors.violet400 : colors.border};
  border-radius: ${radius.sm};
  overflow: hidden;
  transition: border-color 150ms;
`;

const CodeContent = styled.pre`
  margin: 0;
  padding: 12px 16px;
  font-family: ${fonts.mono};
  font-size: 13px;
  line-height: 1.5;
  color: ${colors.foreground};
  white-space: pre-wrap;
  word-break: break-word;
  min-height: 20px;

  &:empty::before {
    content: '# Type code here...';
    color: ${colors.slate400};
  }
`;

const CellOutput = styled.div`
  border: 1px solid ${colors.border};
  border-top: none;
  border-radius: 0 0 ${radius.sm} ${radius.sm};
  background: rgb(var(--app-muted-rgb) / 0.3);
  padding: 10px 16px;
`;

const OutputText = styled.pre`
  margin: 0;
  font-family: ${fonts.mono};
  font-size: 12px;
  line-height: 1.5;
  color: ${colors.slate700};
  white-space: pre-wrap;
  word-break: break-word;
`;

const MarkdownCell = styled.div<{ $focused: boolean }>`
  padding: 12px 16px;
  border: 1px solid ${({ $focused }) => $focused ? colors.violet400 : 'transparent'};
  border-radius: ${radius.sm};
  transition: border-color 150ms;

  h1 {
    font-size: 22px;
    font-weight: 700;
    color: ${colors.foreground};
    margin: 0 0 6px;
  }

  h2 {
    font-size: 17px;
    font-weight: 600;
    color: ${colors.foreground};
    margin: 0 0 4px;
  }

  p {
    font-size: 14px;
    color: ${colors.slate600};
    margin: 0;
    line-height: 1.6;
  }
`;

const CellActions = styled.div<{ $visible: boolean }>`
  position: absolute;
  right: -4px;
  top: 4px;
  display: flex;
  gap: 2px;
  opacity: ${({ $visible }) => $visible ? 1 : 0};
  transition: opacity 150ms;
`;

const CellActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border-radius: ${radius.sm};
  border: 1px solid ${colors.border};
  background: var(--app-bg);
  cursor: pointer;
  color: ${colors.slate500};
  transition: all 150ms;
  &:hover { color: ${colors.foreground}; background: ${colors.muted}; }
`;

const AddCellBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${Theme.usage.space.xSmall};
  padding: ${Theme.usage.space.small} 0;
  opacity: 0.5;
  transition: opacity 200ms;
  &:hover { opacity: 1; }
`;

const AddCellButton = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 12px;
  border-radius: ${radius.full};
  border: 1px dashed ${colors.border};
  background: transparent;
  font-size: 12px;
  color: ${colors.slate500};
  cursor: pointer;
  transition: all 150ms;
  &:hover { border-color: ${colors.violet400}; color: ${colors.violet600}; background: rgb(var(--app-violet-rgb) / 0.05); }
`;

/* ── Kernel status labels ── */

const KERNEL_STATUS_LABELS: Record<KernelStatus, string> = {
  idle: 'Kernel Idle',
  busy: 'Kernel Busy',
  starting: 'Starting…',
  not_connected: 'Not Connected',
};

/* ── Simple markdown renderer ── */

function renderMarkdown(source: string) {
  return source.split('\n').map((line, i) => {
    if (line.startsWith('## ')) return <h2 key={i}>{line.slice(3)}</h2>;
    if (line.startsWith('# ')) return <h1 key={i}>{line.slice(2)}</h1>;
    if (line.trim() === '') return null;
    return <p key={i}>{line}</p>;
  });
}

/* ── Component ── */

export function NotebookEditorPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const existingNotebook = getAllNotebooks().find((n) => n.id === id);
  const notebookTitle = existingNotebook?.title ?? searchParams.get('name') ?? 'Untitled Notebook';

  const initialCells = useMemo(() => {
    const prefill = id ? consumePrefillCells(id) : null;
    if (prefill && prefill.length > 0) {
      return prefill.map((c, i) => ({
        id: `prefill-${i}`,
        type: c.type,
        source: c.source,
        executionCount: c.type === 'code' ? null : undefined,
      } as NotebookCell));
    }
    return SAMPLE_CELLS;
  }, [id]);

  const [kernelStatus, setKernelStatus] = useState<KernelStatus>('idle');
  const [cells, setCells] = useState<NotebookCell[]>(initialCells);

  useEffect(() => {
    setCells(initialCells);
  }, [initialCells]);
  const [focusedCellId, setFocusedCellId] = useState<string | null>(null);
  const [hoveredCellId, setHoveredCellId] = useState<string | null>(null);

  const jupyterUrl = `${JUPYTERHUB_BASE_URL}/user/notebooks/${encodeURIComponent(notebookTitle)}.ipynb`;

  const handleRunAll = useCallback(() => {
    setKernelStatus('busy');
    setTimeout(() => setKernelStatus('idle'), 3000);
  }, []);

  const handleInterrupt = useCallback(() => {
    setKernelStatus('idle');
  }, []);

  const handleRestart = useCallback(() => {
    setKernelStatus('starting');
    setTimeout(() => setKernelStatus('idle'), 2500);
  }, []);

  const addCell = useCallback((type: CellType, afterId?: string) => {
    const newCell: NotebookCell = {
      id: `cell-${Date.now()}`,
      type,
      source: '',
      executionCount: type === 'code' ? null : undefined,
    };
    setCells(prev => {
      if (!afterId) return [...prev, newCell];
      const idx = prev.findIndex(c => c.id === afterId);
      const next = [...prev];
      next.splice(idx + 1, 0, newCell);
      return next;
    });
    setFocusedCellId(newCell.id);
  }, []);

  const deleteCell = useCallback((cellId: string) => {
    setCells(prev => prev.filter(c => c.id !== cellId));
  }, []);

  return (
    <PageContainer>
      <GradientOverlay />
      <GradientOrb variant="primary" style={{ left: '-200px', top: '-100px' }} />
      <GradientOrb variant="secondary" style={{ right: '-150px', bottom: '-100px' }} />

      <ContentLayout>
        <MainPanel>
          <Toolbar variants={fadeInUp} initial="hidden" animate="visible">
            <BackButton onClick={() => navigate('/notebooks')} title="Back to Notebooks">
              <ArrowLeft style={{ width: 16, height: 16 }} />
            </BackButton>

            <NotebookTitleText>{notebookTitle}</NotebookTitleText>

            <KernelIndicator $status={kernelStatus}>
              <StatusDot $status={kernelStatus} />
              {KERNEL_STATUS_LABELS[kernelStatus]}
            </KernelIndicator>

            <ToolbarDivider />

            <ToolbarButton
              onClick={handleRunAll}
              disabled={kernelStatus === 'starting' || kernelStatus === 'not_connected'}
              title="Run All Cells"
            >
              <Play style={{ width: 14, height: 14 }} />
              Run All
            </ToolbarButton>

            <ToolbarIconButton
              onClick={handleInterrupt}
              disabled={kernelStatus !== 'busy'}
              title="Interrupt Kernel"
            >
              <Square style={{ width: 14, height: 14 }} />
            </ToolbarIconButton>

            <ToolbarIconButton onClick={handleRestart} title="Restart Kernel">
              <RotateCcw style={{ width: 14, height: 14 }} />
            </ToolbarIconButton>

            <ToolbarDivider />

            <ToolbarButton $variant="primary" title="Save Notebook">
              <Save style={{ width: 14, height: 14 }} />
              Save
            </ToolbarButton>

            <ToolbarIconButton title="Download">
              <Download style={{ width: 14, height: 14 }} />
            </ToolbarIconButton>

            <ToolbarIconButton title="Share">
              <Share2 style={{ width: 14, height: 14 }} />
            </ToolbarIconButton>

            <ToolbarDivider />

            <ToolbarIconButton
              as="a"
              href={jupyterUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Open in JupyterHub"
              style={{ textDecoration: 'none' }}
            >
              <ExternalLink style={{ width: 14, height: 14 }} />
            </ToolbarIconButton>

            <ToolbarIconButton title="More options">
              <MoreHorizontal style={{ width: 14, height: 14 }} />
            </ToolbarIconButton>
          </Toolbar>

          <EditorArea>
            <CellsContainer variants={staggerContainer} initial="hidden" animate="visible">
              {cells.map((cell) => {
                const isFocused = focusedCellId === cell.id;
                const isHovered = hoveredCellId === cell.id;

                return (
                  <CellWrapper
                    key={cell.id}
                    $focused={isFocused}
                    variants={staggerItem}
                    onClick={() => setFocusedCellId(cell.id)}
                    onMouseEnter={() => setHoveredCellId(cell.id)}
                    onMouseLeave={() => setHoveredCellId(null)}
                  >
                    <CellGutter>
                      {cell.type === 'code' && (
                        cell.executionCount != null
                          ? `[${cell.executionCount}]`
                          : '[ ]'
                      )}
                    </CellGutter>

                    <CellBody>
                      {cell.type === 'code' ? (
                        <>
                          <CodeCellInput $focused={isFocused}>
                            <CodeContent>{cell.source}</CodeContent>
                          </CodeCellInput>
                          {cell.output && (
                            <CellOutput>
                              <OutputText>{cell.output}</OutputText>
                            </CellOutput>
                          )}
                        </>
                      ) : (
                        <MarkdownCell $focused={isFocused}>
                          {renderMarkdown(cell.source)}
                        </MarkdownCell>
                      )}
                    </CellBody>

                    <CellActions $visible={isHovered || isFocused}>
                      <CellActionButton title="Run cell" onClick={(e) => { e.stopPropagation(); }}>
                        <Play style={{ width: 12, height: 12 }} />
                      </CellActionButton>
                      <CellActionButton title="Delete cell" onClick={(e) => { e.stopPropagation(); deleteCell(cell.id); }}>
                        <Trash2 style={{ width: 12, height: 12 }} />
                      </CellActionButton>
                    </CellActions>
                  </CellWrapper>
                );
              })}

              <AddCellBar>
                <AddCellButton onClick={() => addCell('code')}>
                  <Code style={{ width: 12, height: 12 }} />
                  Code
                </AddCellButton>
                <AddCellButton onClick={() => addCell('markdown')}>
                  <Type style={{ width: 12, height: 12 }} />
                  Markdown
                </AddCellButton>
              </AddCellBar>
            </CellsContainer>
          </EditorArea>
        </MainPanel>

        <AIAssistantSidebar
          title="Notebook Assistant"
          contextLabel="Notebooks aware"
          knowledgeBaseId="notebooks"
          welcomeMessage="Hi! I can help you with this notebook — summarize cells, explain code, debug errors, or run snippets."
          suggestions={[
            { text: 'Summarize this notebook' },
            { text: 'Explain the last cell' },
            { text: 'Debug this error' },
            { text: 'Optimize this query' },
          ]}
          suggestedActions={['Run cell', 'Add markdown', 'Import library']}
        />
      </ContentLayout>
    </PageContainer>
  );
}
