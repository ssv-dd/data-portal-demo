import { useState, useMemo, useCallback } from 'react';
import styled from 'styled-components';
import { useSearchParams, useNavigate } from 'react-router';
import { ArrowLeft } from 'lucide-react';
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

  &:hover {
    color: #FF3A00;
  }
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
  flex: 1;
  display: flex;
  flex-direction: column;
  border: 1px solid ${colors.border};
  border-radius: ${radius['2xl']};
  overflow: hidden;
`;

const Divider = styled.div`
  height: 1px;
  background: ${colors.border};
  flex-shrink: 0;
`;

const FieldInspectorWrapper = styled.div`
  flex: 1;
  overflow-y: auto;
  min-height: 0;
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

const RightPanelInner = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  padding: ${Theme.usage.space.xSmall};
  gap: ${Theme.usage.space.xSmall};
`;

const ChartPreviewWrapper = styled.div`
  flex: 1;
  min-height: 0;
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

  &:hover:not(:disabled) {
    opacity: 0.9;
  }
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

  // Handlers
  const handleSourceSelect = useCallback((source: SourceItem) => {
    setSelectedSource(source);
    setSelectedMeasures([]);
    setSelectedDimensions([]);
    setSelectedDateField(null);
    setChartType(source.type === 'metrics' ? 'kpi' : 'column');
  }, []);

  const handleTabChange = useCallback((tab: SourceTab) => {
    setActiveTab(tab);
    setSelectedSource(null);
    setSelectedMeasures([]);
    setSelectedDimensions([]);
    setSelectedDateField(null);
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
        <LeftPanel>
          <SourceTabBar activeTab={activeTab} onTabChange={handleTabChange} />
          <SourceList
            sources={CHART_BUILDER_SOURCES[activeTab]}
            selectedSourceId={selectedSource?.id ?? null}
            onSourceSelect={handleSourceSelect}
          />
          {fields && (
            <>
              <Divider />
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
            </>
          )}
        </LeftPanel>

        <RightPanel>
          <RightPanelInner>
            <FormulaBar
              measures={selectedMeasures}
              dimensions={selectedDimensions}
              dateField={selectedDateField}
              onRemoveMeasure={(id) => setSelectedMeasures((prev) => prev.filter((m) => m.id !== id))}
              onRemoveDimension={(id) => setSelectedDimensions((prev) => prev.filter((d) => d.id !== id))}
              onRemoveDateField={() => setSelectedDateField(null)}
            />
            <ChartTypeLibrary activeType={chartType} onTypeSelect={setChartType} />
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
          </RightPanelInner>
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
