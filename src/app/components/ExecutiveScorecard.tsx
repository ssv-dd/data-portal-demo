import { useState, useRef, type RefObject } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import {
  ChevronDown,
  ChevronRight,
  Sparkles,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Info,
  ExternalLink,
  RefreshCw,
  Settings
} from 'lucide-react';
import { MetricDetailModal } from './MetricDetailModal';
import { motion, AnimatePresence } from 'motion/react';
import { TextSelectionToolbar } from './TextSelectionToolbar';
import { AskAIPromptModal } from './AskAIPromptModal';
import { CommentModal } from './CommentModal';
import { toast } from 'sonner';
import { ScorecardCustomization } from './ScorecardCustomization';
import { AIOverviewSettingsModal, defaultAIOverviewSettings } from './AIOverviewSettingsModal';
import type { AIOverviewSettings } from './AIOverviewSettingsModal';
import type { Metric, ProductArea } from '@/types';
import { teamMembers } from '../data/mock/collaboration-data';
import { productAreas, sourceDashboards, aiSummariesByArea } from '../data/mock/scorecard-data';

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
  const [_hoveredMetric, setHoveredMetric] = useState<string | null>(null);
  const [expandedHighlights, setExpandedHighlights] = useState<number[]>([]);
  const [expandedConcerns, setExpandedConcerns] = useState<number[]>([]);
  const [showSources, setShowSources] = useState(false);
  
  // Customization states
  const [showCustomization, setShowCustomization] = useState(false);
  const [showAISettings, setShowAISettings] = useState(false);
  const [scorecardConfig, setScorecardConfig] = useState(() => {
    // Get role-based defaults on first load
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
  
  // Text selection states - now for entire page
  const scorecardContainerRef = useRef<HTMLDivElement>(null);
  const [selectedText, setSelectedText] = useState<string>('');
  const [selectionContext, setSelectionContext] = useState<'highlight' | 'concern' | null>(null);
  const [showAskAIModal, setShowAskAIModal] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [showNewFeatureBadge, setShowNewFeatureBadge] = useState(true);

  // Define desired order for product areas
  const areaOrder = [
    'company',
    'us-marketplace',
    'us-nv',
    'ads-promos',
    'dd-commerce',
    'canz',
    'dasher'
  ];

  // Sort productAreas based on desired order
  const allAreas = [...productAreas].sort((a, b) => {
    const indexA = areaOrder.indexOf(a.id);
    const indexB = areaOrder.indexOf(b.id);
    // If not in order list, put at end
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });

  // Get AI summary for currently selected area
  const aiExecutiveSummary = aiSummariesByArea[selectedAreas[0]] || aiSummariesByArea.company;

  // Get dynamic column headers based on timeRange
  const getColumnHeaders = () => {
    switch (timeRange) {
      case 'dod':
        return { current: 'Current Day', vsPrior: 'vs Prior Day' };
      case 'wow':
        return { current: 'Current Week', vsPrior: 'vs Prior Week' };
      case 'mom':
        return { current: 'Current Month', vsPrior: 'vs Prior Month' };
      case 'yoy':
        return { current: 'Current Year', vsPrior: 'vs Prior Year' };
      default:
        return { current: 'Current', vsPrior: 'vs Prior' };
    }
  };

  const columnHeaders = getColumnHeaders();

  const toggleArea = (areaId: string) => {
    // Single selection - always select the clicked area
    setSelectedAreas([areaId]);
    // Auto-expand newly selected area
    if (!expandedAreas.includes(areaId)) {
      setExpandedAreas([...expandedAreas, areaId]);
    }
  };

  const toggleExpanded = (areaId: string) => {
    if (expandedAreas.includes(areaId)) {
      setExpandedAreas(expandedAreas.filter(id => id !== areaId));
    } else {
      setExpandedAreas([...expandedAreas, areaId]);
    }
  };

  const toggleHighlight = (index: number) => {
    if (expandedHighlights.includes(index)) {
      setExpandedHighlights(expandedHighlights.filter(i => i !== index));
    } else {
      setExpandedHighlights([...expandedHighlights, index]);
    }
  };

  const toggleConcern = (index: number) => {
    if (expandedConcerns.includes(index)) {
      setExpandedConcerns(expandedConcerns.filter(i => i !== index));
    } else {
      setExpandedConcerns([...expandedConcerns, index]);
    }
  };

  // Text selection handlers
  const handleAskAI = (text: string) => {
    setSelectedText(text);
    // Determine context based on content (smart detection)
    const lowerText = text.toLowerCase();
    if (lowerText.includes('retention') || lowerText.includes('rollout') || lowerText.includes('improve')) {
      setSelectionContext('highlight');
    } else if (lowerText.includes('storm') || lowerText.includes('decline') || lowerText.includes('concern')) {
      setSelectionContext('concern');
    } else {
      // Default to highlight for neutral content
      setSelectionContext('highlight');
    }
    setShowAskAIModal(true);
  };

  const handleComment = (text: string) => {
    setSelectedText(text);
    const lowerText = text.toLowerCase();
    if (lowerText.includes('retention') || lowerText.includes('rollout') || lowerText.includes('improve')) {
      setSelectionContext('highlight');
    } else if (lowerText.includes('storm') || lowerText.includes('decline') || lowerText.includes('concern')) {
      setSelectionContext('concern');
    } else {
      setSelectionContext('highlight');
    }
    setShowCommentModal(true);
  };

  const handleSelectPrompt = (prompt: string, contextText: string) => {
    const fullQuery = `Regarding "${contextText.substring(0, 100)}...": ${prompt}`;
    if (onOpenChat) {
      onOpenChat(fullQuery, contextText);
    }
    toast.success('Opening Data Debby chat...');
  };

  const handleSubmitComment = (comment: string, mentions: string[], contextText: string) => {
    // In real implementation, this would save to backend
    toast.success(`Comment posted${mentions.length > 0 ? ` and ${mentions.length} team member(s) notified` : ''}`);
    console.log('Comment submitted:', { comment, mentions, contextText });
  };

  const handleMetricClick = (metric: Metric) => {
    setSelectedMetric(metric);
    setShowMetricModal(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'healthy': return 'text-green-600 bg-green-50 border-green-200';
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };
  void getStatusColor;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent': return <CheckCircle2 className="h-4 w-4 text-blue-600" />;
      case 'healthy': return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <CheckCircle2 className="h-4 w-4 text-gray-600" />;
    }
  };

  const Sparkline = ({ data, color = '#10b981' }: { data: number[], color?: string }) => {
    if (!data || data.length === 0) return null;
    
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    
    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * 100;
      const y = 100 - ((value - min) / range) * 100;
      return `${x},${y}`;
    }).join(' ');

    return (
      <svg width="60" height="24" className="inline-block">
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    );
  };

  return (
    <div className="space-y-6" ref={scorecardContainerRef}>
      {/* New Feature Badge - Floating at top */}
      <AnimatePresence>
        {showNewFeatureBadge && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-8 z-50 max-w-sm"
          >
            <Card className="p-4 bg-purple-600 text-white shadow-2xl border-2 border-purple-400">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-sm mb-1">✨ New Feature: Smart Highlighting</h4>
                  <p className="text-xs text-purple-100 mb-2">
                    Highlight any text, number, or metric to ask AI questions or collaborate with teammates
                  </p>
                  <div className="flex gap-2">
                    <Badge className="bg-purple-500 text-white border-purple-400 text-xs">
                      Try it now!
                    </Badge>
                  </div>
                </div>
                <button
                  onClick={() => setShowNewFeatureBadge(false)}
                  className="flex-shrink-0 h-5 w-5 bg-purple-700 hover:bg-purple-800 rounded-full flex items-center justify-center text-sm transition-colors"
                >
                  ×
                </button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Context Bar */}
      <Card className="p-4">
        <div className="flex items-center justify-between gap-16">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Product Areas:</span>
              <div className="relative">
                <div className="flex gap-2 overflow-x-auto max-w-[750px] pb-1 scrollbar-thin">
                  {allAreas.map(area => (
                    <Button
                      key={area.id}
                      variant={selectedAreas.includes(area.id) ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => toggleArea(area.id)}
                      className="text-xs whitespace-nowrap shrink-0"
                    >
                      {area.name}
                    </Button>
                  ))}
                </div>
                {/* Gradient fade indicator */}
                <div className="absolute right-0 top-0 bottom-1 w-16 bg-gradient-to-l from-white via-white/80 to-transparent pointer-events-none" />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Comparison:</span>
              <select
                value={timeRange}
                onChange={(e) => {
                  setTimeRange(e.target.value);
                  onTimeRangeChange?.(e.target.value);
                }}
                className="text-sm px-2 py-1 rounded border bg-background"
              >
                <option value="dod">DoD</option>
                <option value="wow">WoW</option>
                <option value="mom">MoM</option>
                <option value="yoy">YoY</option>
              </select>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <RefreshCw className="h-3 w-3" />
              Updated 5 mins ago
            </div>
          </div>
        </div>
        
        {/* Subsidiary Callout */}
        <div className="mt-3 pt-3 border-t text-xs text-muted-foreground">
          <span className="font-medium">Scope:</span> DoorDash US, DoorDash Canada, SevenRooms
          <span className="mx-2">|</span>
          <span className="text-yellow-700">⚠️ Excludes: Wolt, Deliveroo (pending integration)</span>
        </div>
      </Card>

      {/* AI Executive Summary */}
      <Card className="p-6 border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
        <div className="flex items-start gap-3 mb-4">
          <div className="p-2 rounded-lg bg-purple-100">
            <Sparkles className="h-5 w-5 text-purple-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">
                AI Overview: {allAreas.find(a => a.id === selectedAreas[0])?.name || 'Company'} - Week of Feb 2-8, 2026
              </h3>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowAISettings(true)}
                  className="h-8 w-8"
                >
                  <Settings className="h-4 w-4 text-gray-600" />
                </Button>
                <Badge className="bg-purple-100 text-purple-700 border-purple-200">
                  Confidence: {aiExecutiveSummary.confidence}%
                </Badge>
                <div className="relative group">
                  <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                  <div className="absolute right-0 top-6 w-80 p-3 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="text-xs space-y-2">
                      <p className="font-semibold text-gray-900">Confidence Score Calculation</p>
                      <p className="text-gray-700">
                        The confidence score (0-100%) indicates AI's certainty in its analysis based on:
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-gray-600">
                        <li><strong>Data Quality:</strong> Completeness and freshness of source data</li>
                        <li><strong>Source Reliability:</strong> Number and credibility of cited sources</li>
                        <li><strong>Pattern Strength:</strong> Statistical significance of identified trends</li>
                        <li><strong>Historical Accuracy:</strong> Past prediction accuracy for similar insights</li>
                      </ul>
                      <p className="text-gray-600 pt-1">
                        <strong>90%+:</strong> High confidence • <strong>70-89%:</strong> Moderate • <strong>&lt;70%:</strong> Low confidence
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mb-0">
              Generated: {aiExecutiveSummary.timestamp} | Next refresh: 20 mins
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Highlights */}
          <div className="-mt-4">
            <h4 className="text-sm font-semibold mb-2">🎯 Top 3 Highlights This Week</h4>
            <div className="space-y-3">
              {aiExecutiveSummary.highlights.map((highlight: { title: string; metric: string; insight: string; sources?: number[]; crossProduct?: string; action?: string; caution?: string }, idx: number) => (
                <div 
                  key={idx} 
                  className="pl-4 border-l-2 border-green-500 relative"
                >
                  <div 
                    className="flex items-start gap-2 cursor-pointer hover:bg-green-50/50 -ml-4 pl-4 py-1 rounded transition-colors"
                    onClick={() => toggleHighlight(idx)}
                  >
                    <ChevronRight 
                      className={`h-4 w-4 text-muted-foreground shrink-0 mt-0.5 transition-transform ${
                        expandedHighlights.includes(idx) ? 'rotate-90' : ''
                      }`}
                    />
                    <div className="flex-1">
                      <div className="font-medium text-sm">
                        {highlight.title}: {highlight.metric}
                        {highlight.sources && highlight.sources.map((sourceId: number) => (
                          <sup key={sourceId} className="ml-0.5 text-purple-600 font-normal">[{sourceId}]</sup>
                        ))}
                      </div>
                    </div>
                  </div>
                  <AnimatePresence>
                    {expandedHighlights.includes(idx) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-2 ml-6 space-y-2">
                          <p className="text-sm text-muted-foreground">{highlight.insight}</p>
                          {highlight.crossProduct && (
                            <p className="text-xs text-blue-600">→ Cross-product insight: {highlight.crossProduct}</p>
                          )}
                          {highlight.action && (
                            <p className="text-xs text-purple-600">→ {highlight.action}</p>
                          )}
                          {highlight.caution && (
                            <p className="text-xs text-yellow-600">⚠️ {highlight.caution}</p>
                          )}
                          {highlight.sources && highlight.sources.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {highlight.sources.map((sourceId: number) => {
                                const source = sourceDashboards.find((s: { id: number; name: string; url: string }) => s.id === sourceId);
                                return source ? (
                                  <button
                                    key={sourceId}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (source.url !== '#') window.open(source.url, '_blank');
                                    }}
                                    className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs hover:bg-purple-200 transition-colors"
                                  >
                                    <ExternalLink className="h-3 w-3" />
                                    {source.name}
                                  </button>
                                ) : null;
                              })}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>

          {/* Concerns */}
          <div>
            <h4 className="text-sm font-semibold mb-2">⚠️ Top 2 Areas Needing Attention</h4>
            <div className="space-y-3">
              {aiExecutiveSummary.concerns.map((concern: { title: string; metric: string; insight: string; sources?: number[]; actions?: string[] }, idx: number) => (
                <div 
                  key={idx} 
                  className="pl-4 border-l-2 border-yellow-500 relative"
                >
                  <div 
                    className="flex items-start gap-2 cursor-pointer hover:bg-yellow-50/50 -ml-4 pl-4 py-1 rounded transition-colors"
                    onClick={() => toggleConcern(idx)}
                  >
                    <ChevronRight 
                      className={`h-4 w-4 text-muted-foreground shrink-0 mt-0.5 transition-transform ${
                        expandedConcerns.includes(idx) ? 'rotate-90' : ''
                      }`}
                    />
                    <div className="flex-1">
                      <div className="font-medium text-sm">
                        {concern.title}: {concern.metric}
                        {concern.sources && concern.sources.map((sourceId: number) => (
                          <sup key={sourceId} className="ml-0.5 text-purple-600 font-normal">[{sourceId}]</sup>
                        ))}
                      </div>
                    </div>
                  </div>
                  <AnimatePresence>
                    {expandedConcerns.includes(idx) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-2 ml-6 space-y-2">
                          <p className="text-sm text-muted-foreground">{concern.insight}</p>
                          {concern.actions && (
                            <div className="mt-2 space-y-1">
                              {concern.actions.map((action: string, i: number) => (
                                <p key={i} className="text-xs text-gray-700">→ {action}</p>
                              ))}
                            </div>
                          )}
                          {concern.sources && concern.sources.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {concern.sources.map((sourceId: number) => {
                                const source = sourceDashboards.find((s: { id: number; name: string; url: string }) => s.id === sourceId);
                                return source ? (
                                  <button
                                    key={sourceId}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (source.url !== '#') window.open(source.url, '_blank');
                                    }}
                                    className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs hover:bg-purple-200 transition-colors"
                                  >
                                    <ExternalLink className="h-3 w-3" />
                                    {source.name}
                                  </button>
                                ) : null;
                              })}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>

          {/* Emerging Patterns */}
          <div>
            <h4 className="text-sm font-semibold mb-2">🔮 Emerging Patterns & Opportunities</h4>
            <ul className="space-y-1">
              {aiExecutiveSummary.emergingPatterns.map((pattern: string, idx: number) => (
                <li key={idx} className="text-sm text-muted-foreground">• {pattern}</li>
              ))}
            </ul>
          </div>

          {/* Sources Section */}
          <div className="pt-3 border-t">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setShowSources(!showSources)}
                className="flex items-center gap-2 text-sm font-medium text-purple-700 hover:text-purple-800 transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                View Sources ({aiExecutiveSummary.sources?.length || 0} sources)
                <ChevronRight className={`h-4 w-4 transition-transform ${showSources ? 'rotate-90' : ''}`} />
              </button>
              <p className="text-xs text-muted-foreground">
                AskAI can make mistakes. Verify important information.
              </p>
            </div>
            
            <AnimatePresence>
              {showSources && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="mt-3 space-y-2">
                    {(aiExecutiveSummary.sources || []).map((source: { id: number; name: string; type: string; url: string; lastRefreshed: string }) => (
                      <div
                        key={source.id}
                        className="flex items-start justify-between py-2 px-3 bg-white rounded border hover:border-purple-300 transition-colors"
                      >
                        <div className="flex items-start gap-2 flex-1">
                          <span className="text-xs font-mono text-purple-600 mt-0.5">[{source.id}]</span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium truncate">{source.name}</p>
                              <Badge variant="outline" className="text-xs shrink-0">{source.type}</Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">Updated {source.lastRefreshed}</p>
                          </div>
                        </div>
                        {source.url !== '#' && (
                          <button
                            onClick={() => window.open(source.url, '_blank')}
                            className="flex-shrink-0 ml-2 p-1 hover:bg-purple-50 rounded transition-colors"
                          >
                            <ExternalLink className="h-4 w-4 text-purple-600" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </Card>

      {/* Metric Scorecard Tables */}
      <div className="space-y-4">
        {allAreas
          .filter(area => selectedAreas.includes(area.id))
          .map(area => (
            <Card key={area.id} className="overflow-hidden">
              {/* Area Header */}
              <div 
                className={`p-4 border-l-4 ${ area.overallStatus === 'excellent' ? 'border-blue-500' :
                  area.overallStatus === 'healthy' ? 'border-green-500' :
                  area.overallStatus === 'warning' ? 'border-yellow-500' :
                  'border-red-500'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div 
                    className="flex items-center gap-3 cursor-pointer hover:opacity-70 transition-opacity flex-1"
                    onClick={() => toggleExpanded(area.id)}
                  >
                    {expandedAreas.includes(area.id) ? (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    )}
                    <h3 className="font-semibold text-lg">{area.name}</h3>
                  </div>
                  <div className="flex items-center gap-4">
                    {!expandedAreas.includes(area.id) && area.quickView && (
                      <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <span>{area.quickView.metric1}</span>
                        <span>{area.quickView.metric2}</span>
                      </div>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowCustomization(true);
                      }}
                      className="flex items-center gap-2"
                    >
                      <Settings className="h-4 w-4" />
                      Customize
                    </Button>
                  </div>
                </div>
              </div>

              {/* Expanded Table */}
              <AnimatePresence>
                {expandedAreas.includes(area.id) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-muted/50 border-y">
                          <tr>
                            <th className="text-left py-3 px-4 font-medium w-[12%]">Category</th>
                            <th className="text-left py-3 px-4 font-medium w-[22%]">Metric</th>
                            <th className="text-right py-3 px-4 font-medium w-[10%]">{columnHeaders.current}</th>
                            <th className="text-right py-3 px-4 font-medium w-[10%]">{columnHeaders.vsPrior}</th>
                            <th className="text-right py-3 px-4 font-medium w-[10%]">vs Q1 Plan</th>
                            <th className="text-center py-3 px-4 font-medium w-[10%]">Trend (7D)</th>
                            <th className="text-center py-3 px-4 font-medium w-[8%]">Status</th>
                            <th className="text-center py-3 px-4 font-medium w-[18%]">AI Insight</th>
                          </tr>
                        </thead>
                        <tbody>
                          {area.metrics.map((metric, idx) => (
                            <tr 
                              key={metric.id} 
                              className={`border-b hover:bg-muted/30 transition-colors cursor-pointer ${
                                idx % 2 === 0 ? 'bg-white' : 'bg-muted/10'
                              }`}
                              onClick={() => handleMetricClick(metric)}
                              onMouseEnter={() => setHoveredMetric(metric.id)}
                              onMouseLeave={() => setHoveredMetric(null)}
                            >
                              <td className="py-3 px-4 text-xs text-muted-foreground">{metric.category}</td>
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">{metric.name}</span>
                                  <Info className="h-3 w-3 text-muted-foreground" />
                                </div>
                              </td>
                              <td className="py-3 px-4 text-right font-semibold">{metric.current}</td>
                              <td className="py-3 px-4 text-right">
                                <div className={`flex items-center justify-end gap-1 ${
                                  metric.change > 0 ? 'text-green-600' : 'text-red-600'
                                }`}>
                                  {metric.change > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                                  <span className="font-medium">{metric.changeLabel}</span>
                                </div>
                              </td>
                              <td className="py-3 px-4 text-right">
                                {metric.vsPlan && (
                                  <span className={metric.vsPlanValue && metric.vsPlanValue > 0 ? 'text-green-600' : 'text-red-600'}>
                                    {metric.vsPlan}
                                  </span>
                                )}
                              </td>
                              <td className="py-3 px-4 text-center">
                                <Sparkline 
                                  data={metric.trend} 
                                  color={metric.change > 0 ? '#10b981' : '#ef4444'}
                                />
                              </td>
                              <td className="py-3 px-4 text-center">
                                {getStatusIcon(metric.status)}
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-2">
                                  <Sparkles className="h-4 w-4 text-purple-500 shrink-0" />
                                  <span className="text-xs text-muted-foreground line-clamp-2">
                                    {metric.aiInsight.summary}
                                  </span>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          ))}
      </div>

      {/* Metric Detail Modal */}
      {selectedMetric && (
        <MetricDetailModal
          open={showMetricModal}
          onOpenChange={setShowMetricModal}
          metric={selectedMetric}
        />
      )}

      {/* Text Selection Toolbar - Works across entire scorecard */}
      {scorecardContainerRef.current && (
        <TextSelectionToolbar
          containerRef={scorecardContainerRef as RefObject<HTMLElement>}
          onAskAI={handleAskAI}
          onComment={handleComment}
        />
      )}

      {/* Ask AI Prompt Modal */}
      <AskAIPromptModal
        open={showAskAIModal}
        onOpenChange={setShowAskAIModal}
        selectedText={selectedText}
        contextType={selectionContext || 'highlight'}
        onSelectPrompt={handleSelectPrompt}
      />

      {/* Comment Modal */}
      <CommentModal
        open={showCommentModal}
        onOpenChange={setShowCommentModal}
        selectedText={selectedText}
        onSubmitComment={handleSubmitComment}
        teamMembers={teamMembers}
      />

      {/* Scorecard Customization */}
      <ScorecardCustomization
        isOpen={showCustomization}
        onClose={() => setShowCustomization(false)}
        userRole={userRole}
        currentConfig={scorecardConfig}
        onChange={(config) => {
          // Live update as user makes changes
          setScorecardConfig(config);
        }}
        onSave={(config) => {
          setScorecardConfig(config);
          // In real implementation, would save to backend
        }}
      />

      {/* AI Overview Settings */}
      <AIOverviewSettingsModal
        isOpen={showAISettings}
        onClose={() => setShowAISettings(false)}
        currentSettings={aiOverviewSettings}
        onSave={(settings) => {
          setAIOverviewSettings(settings);
          // In real implementation, would save to backend
        }}
      />
    </div>
  );
}
