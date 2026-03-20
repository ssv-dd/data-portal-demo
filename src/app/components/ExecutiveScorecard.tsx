import { useState, useRef, type RefObject } from 'react';
import { MetricDetailModal } from './MetricDetailModal';
import { TextSelectionToolbar } from './TextSelectionToolbar';
import { AskAIPromptModal } from './AskAIPromptModal';
import { CommentModal } from './CommentModal';
import { toast } from 'sonner';
import { ScorecardCustomization } from './ScorecardCustomization';
import { AIOverviewSettingsModal, defaultAIOverviewSettings } from './AIOverviewSettingsModal';
import type { AIOverviewSettings } from './AIOverviewSettingsModal';
import type { Metric } from '@/types';
import { teamMembers } from '../data/mock/collaboration-data';
import { productAreas, sourceDashboards, aiSummariesByArea } from '../data/mock/scorecard-data';
import { FeatureBadge } from './scorecard/FeatureBadge';
import { ScorecardContextBar } from './scorecard/ScorecardContextBar';
import { AIExecutiveSummary } from './scorecard/AIExecutiveSummary';
import { MetricTable } from './scorecard/MetricTable';

interface ExecutiveScorecardProps {
  onTimeRangeChange?: (range: string) => void;
  onOpenChat?: (query: string, context: string) => void;
  userRole?: string;
}

export function ExecutiveScorecard({ onTimeRangeChange, onOpenChat, userRole = 'business-executive' }: ExecutiveScorecardProps) {
  const [selectedAreas, setSelectedAreas] = useState<string[]>(['company']);
  const [expandedAreas, setExpandedAreas] = useState<string[]>(['company']);
  const [timeRange, setTimeRange] = useState('wow');
  const [selectedMetric, setSelectedMetric] = useState<Metric | null>(null);
  const [showMetricModal, setShowMetricModal] = useState(false);

  // Customization states
  const [showCustomization, setShowCustomization] = useState(false);
  const [showAISettings, setShowAISettings] = useState(false);
  const [scorecardConfig, setScorecardConfig] = useState(() => {
    const getRoleDefaults = () => {
      switch (userRole) {
        case 'business-executive':
          return [
            { id: 'company', name: 'Company / Top-line', enabled: true, selectedMetrics: ['company-gov', 'company-revenue', 'company-contribution', 'company-vp-order', 'company-mau'] },
            { id: 'consumer', name: 'Consumer', enabled: false, selectedMetrics: [] },
            { id: 'merchant', name: 'Merchant', enabled: false, selectedMetrics: [] },
            { id: 'dasher', name: 'Dasher', enabled: false, selectedMetrics: [] },
          ];
        default:
          return [
            { id: 'company', name: 'Company / Top-line', enabled: true, selectedMetrics: ['company-gov', 'company-revenue', 'company-mau'] },
          ];
      }
    };
    return getRoleDefaults();
  });
  const [aiOverviewSettings, setAIOverviewSettings] = useState<AIOverviewSettings>(defaultAIOverviewSettings);

  // Text selection states
  const scorecardContainerRef = useRef<HTMLDivElement>(null);
  const [selectedText, setSelectedText] = useState<string>('');
  const [selectionContext, setSelectionContext] = useState<'highlight' | 'concern' | null>(null);
  const [showAskAIModal, setShowAskAIModal] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [showNewFeatureBadge, setShowNewFeatureBadge] = useState(true);

  // Sort productAreas based on desired order
  const areaOrder = ['company', 'us-marketplace', 'us-nv', 'ads-promos', 'dd-commerce', 'canz', 'dasher'];
  const allAreas = [...productAreas].sort((a, b) => {
    const indexA = areaOrder.indexOf(a.id);
    const indexB = areaOrder.indexOf(b.id);
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });

  const aiExecutiveSummary = aiSummariesByArea[selectedAreas[0]] || aiSummariesByArea.company;

  // Get dynamic column headers based on timeRange
  const getColumnHeaders = () => {
    switch (timeRange) {
      case 'dod': return { current: 'Current Day', vsPrior: 'vs Prior Day' };
      case 'wow': return { current: 'Current Week', vsPrior: 'vs Prior Week' };
      case 'mom': return { current: 'Current Month', vsPrior: 'vs Prior Month' };
      case 'yoy': return { current: 'Current Year', vsPrior: 'vs Prior Year' };
      default: return { current: 'Current', vsPrior: 'vs Prior' };
    }
  };
  const columnHeaders = getColumnHeaders();

  const toggleArea = (areaId: string) => {
    setSelectedAreas([areaId]);
    if (!expandedAreas.includes(areaId)) {
      setExpandedAreas([...expandedAreas, areaId]);
    }
  };

  const toggleExpanded = (areaId: string) => {
    setExpandedAreas(prev =>
      prev.includes(areaId) ? prev.filter(id => id !== areaId) : [...prev, areaId]
    );
  };

  const detectContext = (text: string) => {
    const lower = text.toLowerCase();
    if (lower.includes('storm') || lower.includes('decline') || lower.includes('concern')) return 'concern' as const;
    return 'highlight' as const;
  };

  const handleAskAI = (text: string) => {
    setSelectedText(text);
    setSelectionContext(detectContext(text));
    setShowAskAIModal(true);
  };

  const handleComment = (text: string) => {
    setSelectedText(text);
    setSelectionContext(detectContext(text));
    setShowCommentModal(true);
  };

  const handleSelectPrompt = (prompt: string, contextText: string) => {
    const fullQuery = `Regarding "${contextText.substring(0, 100)}...": ${prompt}`;
    onOpenChat?.(fullQuery, contextText);
    toast.success('Opening Data Debby chat...');
  };

  const handleSubmitComment = (comment: string, mentions: string[], _contextText: string) => {
    toast.success(`Comment posted${mentions.length > 0 ? ` and ${mentions.length} team member(s) notified` : ''}`);
  };

  const handleMetricClick = (metric: Metric) => {
    setSelectedMetric(metric);
    setShowMetricModal(true);
  };

  const handleTimeRangeChange = (range: string) => {
    setTimeRange(range);
    onTimeRangeChange?.(range);
  };

  return (
    <div className="space-y-6" ref={scorecardContainerRef}>
      <FeatureBadge
        visible={showNewFeatureBadge}
        onDismiss={() => setShowNewFeatureBadge(false)}
      />

      {/* Product Areas - Temporarily commented out */}
      {/* <ScorecardContextBar
        areas={allAreas}
        selectedAreas={selectedAreas}
        onToggleArea={toggleArea}
        timeRange={timeRange}
        onTimeRangeChange={handleTimeRangeChange}
      /> */}

      {/* AI Overview - Temporarily commented out */}
      {/* <AIExecutiveSummary
        summary={aiExecutiveSummary}
        areaName={allAreas.find(a => a.id === selectedAreas[0])?.name || 'Company'}
        sourceDashboards={sourceDashboards}
        onSettingsClick={() => setShowAISettings(true)}
      /> */}

      {/* Company/Top-line Metrics - Temporarily commented out */}
      {/* <div className="space-y-4">
        {allAreas
          .filter(area => selectedAreas.includes(area.id))
          .map(area => (
            <MetricTable
              key={area.id}
              area={area}
              columnHeaders={columnHeaders}
              expanded={expandedAreas.includes(area.id)}
              onToggleExpand={() => toggleExpanded(area.id)}
              onMetricClick={handleMetricClick}
              onCustomize={() => setShowCustomization(true)}
            />
          ))}
      </div> */}

      {/* Modals */}
      {selectedMetric && (
        <MetricDetailModal
          open={showMetricModal}
          onOpenChange={setShowMetricModal}
          metric={selectedMetric}
        />
      )}

      {scorecardContainerRef.current && (
        <TextSelectionToolbar
          containerRef={scorecardContainerRef as RefObject<HTMLElement>}
          onAskAI={handleAskAI}
          onComment={handleComment}
        />
      )}

      <AskAIPromptModal
        open={showAskAIModal}
        onOpenChange={setShowAskAIModal}
        selectedText={selectedText}
        contextType={selectionContext || 'highlight'}
        onSelectPrompt={handleSelectPrompt}
      />

      <CommentModal
        open={showCommentModal}
        onOpenChange={setShowCommentModal}
        selectedText={selectedText}
        onSubmitComment={handleSubmitComment}
        teamMembers={teamMembers}
      />

      <ScorecardCustomization
        isOpen={showCustomization}
        onClose={() => setShowCustomization(false)}
        userRole={userRole}
        currentConfig={scorecardConfig}
        onChange={setScorecardConfig}
        onSave={setScorecardConfig}
      />

      <AIOverviewSettingsModal
        isOpen={showAISettings}
        onClose={() => setShowAISettings(false)}
        currentSettings={aiOverviewSettings}
        onSave={setAIOverviewSettings}
      />
    </div>
  );
}
