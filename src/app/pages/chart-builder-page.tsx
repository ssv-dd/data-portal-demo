import { useState, useMemo, useCallback } from 'react';
import styled from 'styled-components';
import { useSearchParams, useNavigate } from 'react-router';
import { ArrowLeft, ChevronLeft, Code2, ExternalLink, User, Clock } from 'lucide-react';
import { Theme } from '@doordash/prism-react';
import { colors, glassPanel, radius } from '@/styles/theme';
import { SourceTabBar, type SourceTab } from '@/app/components/chart-builder/source-tab-bar';
import { SourceList } from '@/app/components/chart-builder/source-list';
import { FieldInspector } from '@/app/components/chart-builder/field-inspector';
import { FormulaBar } from '@/app/components/chart-builder/formula-bar';
import { ChartTypeLibrary } from '@/app/components/chart-builder/chart-type-library';
import { ChartPreview } from '@/app/components/chart-builder/chart-preview';
import { PinToDashboardDialog } from '@/app/components/chart-builder/pin-to-dashboard-dialog';
import {
  CHART_BUILDER_SOURCES,
  SOURCE_FIELDS,
  SOURCE_META,
  generateMockChartData,
  generateMockKpiData,
  type SourceItem,
} from '@/app/data/mock/chart-builder-data';
import { canvasStorage } from '@/app/data/canvas-storage';
import type { ChartBuilderField, ChartType, WidgetConfig } from '@/types';

// --- Styled components ---

const PageContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: ${colors.background};
  position: relative;
  overflow: hidden;
`;

const GradientOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at top left, rgb(var(--app-fuchsia-rgb) / 0.08), transparent 35%),
              radial-gradient(circle at bottom right, rgb(var(--app-blue-rgb) / 0.08), transparent 35%);
  pointer-events: none;
`;

const BackLink = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: ${Theme.usage.space.xSmall} ${Theme.usage.space.medium};
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: ${Theme.usage.fontSize.xSmall};
  font-weight: 500;
  color: ${colors.mutedForeground};
  transition: color 0.15s ease;
  z-index: 10;
  flex-shrink: 0;

  &:hover { color: #FF3A00; }
`;

const PanelsContainer = styled.div`
  position: relative;
  z-index: 10;
  flex: 1;
  display: flex;
  min-height: 0;
  padding: 0 ${Theme.usage.space.xSmall} ${Theme.usage.space.xSmall};
  gap: ${Theme.usage.space.xSmall};
`;

const LeftPanel = styled.div`
  ${glassPanel}
  width: 300px;
  min-width: 260px;
  max-width: 340px;
  display: flex;
  flex-direction: column;
  border: 1px solid ${colors.border};
  border-radius: ${radius['2xl']};
  overflow: hidden;
  flex-shrink: 0;
`;

const FieldInspectorWrapper = styled.div`
  flex: 1;
  overflow-y: auto;
  min-height: 0;
`;

// Source header shown when a source is selected (replaces source list)
const SelectedSourceHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-bottom: 1px solid ${colors.border};
  flex-shrink: 0;
`;

const ChangeSourceBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: rgb(var(--app-overlay-rgb) / 0.06);
  border: 1px solid ${colors.border};
  border-radius: ${radius.sm};
  cursor: pointer;
  color: ${colors.mutedForeground};
  flex-shrink: 0;

  &:hover {
    color: ${colors.foreground};
    border-color: ${colors.borderStrong};
  }
`;

const SourceHeaderInfo = styled.div`
  min-width: 0;
  flex: 1;
`;

const SourceHeaderName = styled.div`
  font-size: ${Theme.usage.fontSize.xSmall};
  font-weight: 600;
  color: ${colors.foreground};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const SourceHeaderDesc = styled.div`
  font-size: 11px;
  color: ${colors.mutedForeground};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const RightPanel = styled.div`
  ${glassPanel}
  flex: 1;
  display: flex;
  flex-direction: column;
  border: 1px solid ${colors.border};
  border-radius: ${radius['2xl']};
  overflow: hidden;
`;

const RightTopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${Theme.usage.space.xSmall} ${Theme.usage.space.small};
  border-bottom: 1px solid ${colors.border};
  flex-shrink: 0;
  gap: ${Theme.usage.space.xSmall};
`;

const RightTopLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xSmall};
  min-width: 0;
  flex: 1;
`;

const ChartPreviewWrapper = styled.div`
  flex: 1;
  min-height: 0;
  padding: ${Theme.usage.space.xSmall};
`;

const ActionsBar = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: ${Theme.usage.space.xSmall};
  border-top: 1px solid ${colors.border};
  flex-shrink: 0;
`;

const PinButton = styled.button<{ $disabled?: boolean }>`
  padding: 8px 20px;
  font-size: ${Theme.usage.fontSize.xSmall};
  font-weight: 600;
  color: #fff;
  background: ${({ $disabled }) => ($disabled ? colors.mutedForeground : '#FF3A00')};
  border: none;
  border-radius: ${radius.sm};
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  transition: opacity 0.15s ease;
  opacity: ${({ $disabled }) => ($disabled ? 0.6 : 1)};

  &:hover:not(:disabled) { opacity: 0.9; }
`;

// Source info panel styles
const SourceInfoPanel = styled.div`
  border-top: 1px solid ${colors.border};
  flex-shrink: 0;
  max-height: 180px;
  overflow-y: auto;
`;

const SourceInfoToggle = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
  padding: 8px 12px;
  font-size: 11px;
  font-weight: 500;
  color: ${colors.mutedForeground};
  background: none;
  border: none;
  cursor: pointer;

  &:hover { color: ${colors.foreground}; }

  svg { width: 12px; height: 12px; }
`;

const SourceInfoContent = styled.div`
  padding: 0 12px 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const QueryPreview = styled.pre`
  font-family: 'SF Mono', 'Fira Code', monospace;
  font-size: 11px;
  line-height: 1.5;
  color: ${colors.foreground};
  background: rgb(var(--app-overlay-rgb) / 0.06);
  border: 1px solid ${colors.border};
  border-radius: ${radius.sm};
  padding: 8px 10px;
  margin: 0;
  overflow-x: auto;
  white-space: pre;
  max-height: 80px;
`;

const MetaRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: ${colors.mutedForeground};

  svg { width: 12px; height: 12px; flex-shrink: 0; }
  a { color: #FF3A00; text-decoration: none; &:hover { text-decoration: underline; } }
`;

// --- Helpers ---

function findSourceById(sourceId: string | null): SourceItem | null {
  if (!sourceId) return null;
  for (const sources of Object.values(CHART_BUILDER_SOURCES)) {
    const found = sources.find((s) => s.id === sourceId);
    if (found) return found;
  }
  return null;
}

// --- Component ---

export function ChartBuilderPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const initialTab = (searchParams.get('tab') as SourceTab) ?? 'sql';
  const initialSourceId = searchParams.get('source');
  const dashboardId = searchParams.get('dashboard');

  const [activeTab, setActiveTab] = useState<SourceTab>(initialTab);
  const [selectedSource, setSelectedSource] = useState<SourceItem | null>(
    () => findSourceById(initialSourceId),
  );
  const [selectedMeasures, setSelectedMeasures] = useState<ChartBuilderField[]>([]);
  const [selectedDimensions, setSelectedDimensions] = useState<ChartBuilderField[]>([]);
  const [selectedDateField, setSelectedDateField] = useState<ChartBuilderField | null>(null);
  const [chartType, setChartType] = useState<ChartType>('column');
  const [pinDialogOpen, setPinDialogOpen] = useState(false);
  const [sourceInfoOpen, setSourceInfoOpen] = useState(false);

  // Generate mock data
  const mockData = useMemo(
    () => generateMockChartData(selectedMeasures, selectedDimensions, selectedDateField ?? undefined),
    [selectedMeasures, selectedDimensions, selectedDateField],
  );

  const kpiData = useMemo(() => {
    if (selectedMeasures.length === 0) return undefined;
    const raw = generateMockKpiData(selectedMeasures[0]);
    return { kpiValue: raw.value, kpiChange: raw.change, kpiTrend: raw.trend };
  }, [selectedMeasures]);

  const sourceMeta = selectedSource ? SOURCE_META[selectedSource.id] : null;

  // Handlers
  const handleSourceSelect = useCallback((source: SourceItem) => {
    setSelectedSource(source);
    setSelectedMeasures([]);
    setSelectedDimensions([]);
    setSelectedDateField(null);
    setChartType(source.type === 'metrics' ? 'kpi' : 'column');
    setSourceInfoOpen(false);
  }, []);

  const handleTabChange = useCallback((tab: SourceTab) => {
    setActiveTab(tab);
    setSelectedSource(null);
    setSelectedMeasures([]);
    setSelectedDimensions([]);
    setSelectedDateField(null);
    setSourceInfoOpen(false);
  }, []);

  const handleChangeSource = useCallback(() => {
    setSelectedSource(null);
    setSelectedMeasures([]);
    setSelectedDimensions([]);
    setSelectedDateField(null);
    setSourceInfoOpen(false);
  }, []);

  const handleMeasureToggle = useCallback((field: ChartBuilderField) => {
    setSelectedMeasures((prev) => {
      const exists = prev.some((m) => m.id === field.id);
      if (exists) return prev.filter((m) => m.id !== field.id);
      return [...prev, { ...field, aggregation: field.aggregation ?? 'SUM' }];
    });
  }, []);

  const handleDimensionToggle = useCallback((field: ChartBuilderField) => {
    setSelectedDimensions((prev) => {
      const exists = prev.some((d) => d.id === field.id);
      if (exists) return prev.filter((d) => d.id !== field.id);
      return [...prev, field];
    });
  }, []);

  const handleDateFieldSelect = useCallback((field: ChartBuilderField | null) => {
    setSelectedDateField(field);
  }, []);

  const handleAggregationChange = useCallback(
    (fieldId: string, agg: ChartBuilderField['aggregation']) => {
      setSelectedMeasures((prev) =>
        prev.map((m) => (m.id === fieldId ? { ...m, aggregation: agg } : m)),
      );
    },
    [],
  );

  const handlePin = useCallback(
    (canvasId: string) => {
      const widgetId = canvasStorage.generateId();
      const sourceName = selectedSource?.name ?? 'Chart';
      const typeName = chartType.charAt(0).toUpperCase() + chartType.slice(1);

      const widget: WidgetConfig = {
        id: widgetId,
        title: `${sourceName} — ${typeName}`,
        subtitle: selectedMeasures.map((m) => `${m.aggregation ?? 'SUM'}(${m.name})`).join(', '),
        type: chartType,
        data: chartType === 'kpi' ? undefined : mockData,
        ...(chartType === 'kpi' ? kpiData : {}),
        query: {
          sourceId: selectedSource!.id,
          sourceType: activeTab,
          measures: selectedMeasures,
          dimensions: selectedDimensions,
          dateField: selectedDateField ?? undefined,
        },
      };

      canvasStorage.saveCanvasWidget(canvasId, widget);
      const canvas = canvasStorage.getCanvas(canvasId);
      if (canvas) {
        canvasStorage.saveCanvas({
          ...canvas,
          layout: [...canvas.layout, { widgetId, x: 0, y: Infinity, w: 6, h: 4 }],
        });
      }
      setPinDialogOpen(false);
      navigate(`/dashboard/${canvasId}?highlight=${widgetId}`);
    },
    [selectedSource, chartType, selectedMeasures, selectedDimensions, selectedDateField, mockData, kpiData, activeTab, navigate],
  );

  const handleBack = useCallback(() => {
    if (dashboardId) {
      navigate(`/dashboard/${dashboardId}`);
    } else {
      navigate(-1);
    }
  }, [dashboardId, navigate]);

  const fields = selectedSource ? SOURCE_FIELDS[selectedSource.id] : null;
  const hasMeasures = selectedMeasures.length > 0;

  return (
    <PageContainer>
      <GradientOverlay />

      <BackLink onClick={handleBack}>
        <ArrowLeft style={{ width: 14, height: 14 }} />
        {dashboardId ? 'Back to Dashboard' : 'Back'}
      </BackLink>

      <PanelsContainer>
        {/* Left panel: narrower, fixed width */}
        <LeftPanel>
          <SourceTabBar activeTab={activeTab} onTabChange={handleTabChange} />

          {/* Show source list only when no source is selected */}
          {!selectedSource && (
            <SourceList
              sources={CHART_BUILDER_SOURCES[activeTab]}
              selectedSourceId={null}
              onSourceSelect={handleSourceSelect}
            />
          )}

          {/* Show selected source header + field inspector when source is picked */}
          {selectedSource && (
            <>
              <SelectedSourceHeader>
                <ChangeSourceBtn onClick={handleChangeSource} title="Change source">
                  <ChevronLeft style={{ width: 14, height: 14 }} />
                </ChangeSourceBtn>
                <SourceHeaderInfo>
                  <SourceHeaderName>{selectedSource.name}</SourceHeaderName>
                  <SourceHeaderDesc>{selectedSource.description}</SourceHeaderDesc>
                </SourceHeaderInfo>
              </SelectedSourceHeader>
              {fields && (
                <FieldInspectorWrapper>
                  <FieldInspector
                    fields={fields}
                    selectedMeasures={selectedMeasures}
                    selectedDimensions={selectedDimensions}
                    selectedDateField={selectedDateField}
                    onMeasureToggle={handleMeasureToggle}
                    onDimensionToggle={handleDimensionToggle}
                    onDateFieldSelect={handleDateFieldSelect}
                    onAggregationChange={handleAggregationChange}
                  />
                </FieldInspectorWrapper>
              )}

              {/* Source info panel at bottom of left panel */}
              {sourceMeta && (
                <SourceInfoPanel>
                  <SourceInfoToggle onClick={() => setSourceInfoOpen((v) => !v)}>
                    <Code2 />
                    Source Info
                    <ChevronDown style={{ width: 10, height: 10, transform: sourceInfoOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.15s' }} />
                  </SourceInfoToggle>
                  {sourceInfoOpen && (
                    <SourceInfoContent>
                      <QueryPreview>{sourceMeta.queryPreview}</QueryPreview>
                      <MetaRow>
                        <ExternalLink />
                        <a href={sourceMeta.repoUrl} target="_blank" rel="noopener noreferrer">
                          {sourceMeta.repoPath}
                        </a>
                      </MetaRow>
                      <MetaRow>
                        <User />
                        Owner: {sourceMeta.owner}
                      </MetaRow>
                      <MetaRow>
                        <Clock />
                        Updated {sourceMeta.lastUpdated}
                      </MetaRow>
                    </SourceInfoContent>
                  )}
                </SourceInfoPanel>
              )}
            </>
          )}
        </LeftPanel>

        {/* Right panel: takes remaining space */}
        <RightPanel>
          <RightTopBar>
            <RightTopLeft>
              <FormulaBar
                measures={selectedMeasures}
                dimensions={selectedDimensions}
                dateField={selectedDateField}
                onRemoveMeasure={(id) => setSelectedMeasures((prev) => prev.filter((m) => m.id !== id))}
                onRemoveDimension={(id) => setSelectedDimensions((prev) => prev.filter((d) => d.id !== id))}
                onRemoveDateField={() => setSelectedDateField(null)}
              />
            </RightTopLeft>
            <ChartTypeLibrary activeType={chartType} onTypeSelect={setChartType} />
          </RightTopBar>

          <ChartPreviewWrapper>
            <ChartPreview
              chartType={chartType}
              data={mockData}
              measures={selectedMeasures}
              dimensions={selectedDimensions}
              dateField={selectedDateField}
              kpiData={kpiData}
            />
          </ChartPreviewWrapper>

          <ActionsBar>
            <PinButton
              $disabled={!hasMeasures}
              disabled={!hasMeasures}
              onClick={() => setPinDialogOpen(true)}
            >
              Pin to Dashboard
            </PinButton>
          </ActionsBar>
        </RightPanel>
      </PanelsContainer>

      <PinToDashboardDialog
        open={pinDialogOpen}
        onClose={() => setPinDialogOpen(false)}
        onPin={handlePin}
        preSelectedDashboardId={dashboardId}
      />
    </PageContainer>
  );
}
