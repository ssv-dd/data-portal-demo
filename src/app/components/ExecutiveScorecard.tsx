import { useState, useRef, type RefObject } from 'react';
import { Theme } from '@doordash/prism-react';
import styled from 'styled-components';
import { MetricDetailModal } from './MetricDetailModal';
import { TextSelectionToolbar } from './TextSelectionToolbar';
import { AskAIPromptModal } from './AskAIPromptModal';
import { CommentModal } from './CommentModal';
import { toast } from '@/app/lib/toast';
import { ScorecardCustomization } from './ScorecardCustomization';
import { AIOverviewSettingsModal, defaultAIOverviewSettings } from './AIOverviewSettingsModal';
import type { AIOverviewSettings } from './AIOverviewSettingsModal';
import type { Metric } from '@/types';
import { teamMembers } from '../data/mock/collaboration-data';
import { productAreas, aiSummariesByArea } from '../data/mock/scorecard-data';
import { FeatureBadge } from './scorecard/FeatureBadge';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${Theme.usage.space.large};
`;


interface ExecutiveScorecardProps {
  onTimeRangeChange?: (range: string) => void;
  onOpenChat?: (query: string, context: string) => void;
  userRole?: string;
}

export function ExecutiveScorecard({ onTimeRangeChange, onOpenChat, userRole = 'business-executive' }: ExecutiveScorecardProps) {
  const [, _setSelectedAreas] = useState<string[]>(['company']);
  const [, _setExpandedAreas] = useState<string[]>(['company']);
  const [, _setTimeRange] = useState('wow');
  const [selectedMetric, setSelectedMetric] = useState<Metric | null>(null);
  const [showMetricModal, setShowMetricModal] = useState(false);

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

  const scorecardContainerRef = useRef<HTMLDivElement>(null);
  const [selectedText, setSelectedText] = useState<string>('');
  const [selectionContext, setSelectionContext] = useState<'highlight' | 'concern' | null>(null);
  const [showAskAIModal, setShowAskAIModal] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [showNewFeatureBadge, setShowNewFeatureBadge] = useState(false);

  void productAreas;
  void aiSummariesByArea;

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

  const handleSubmitComment = (_comment: string, mentions: string[], _contextText: string) => {
    toast.success(`Comment posted${mentions.length > 0 ? ` and ${mentions.length} team member(s) notified` : ''}`);
  };

  void setSelectedMetric;
  void onTimeRangeChange;

  return (
    <Container ref={scorecardContainerRef}>
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
      {/* <MetricTableSection>
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
      </MetricTableSection> */}

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
    </Container>
  );
}
