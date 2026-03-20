import { useState } from 'react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import {
  ChevronRight,
  Sparkles,
  Info,
  ExternalLink,
  Settings,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import type { AIExecutiveSummary as AIExecutiveSummaryType, SourceDashboard } from '@/types';

interface AIExecutiveSummaryProps {
  summary: AIExecutiveSummaryType;
  areaName: string;
  sourceDashboards: SourceDashboard[];
  onSettingsClick: () => void;
}

export function AIExecutiveSummary({
  summary,
  areaName,
  sourceDashboards,
  onSettingsClick,
}: AIExecutiveSummaryProps) {
  const [expandedHighlights, setExpandedHighlights] = useState<number[]>([]);
  const [expandedConcerns, setExpandedConcerns] = useState<number[]>([]);
  const [showSources, setShowSources] = useState(false);

  const toggleHighlight = (index: number) => {
    setExpandedHighlights(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const toggleConcern = (index: number) => {
    setExpandedConcerns(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  return (
    <Card className="p-6 border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
      <div className="flex items-start gap-3 mb-4">
        <div className="p-2 rounded-lg bg-purple-100">
          <Sparkles className="h-5 w-5 text-purple-600" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold">
              AI Overview: {areaName} - Week of Feb 2-8, 2026
            </h3>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={onSettingsClick}
                className="h-8 w-8"
              >
                <Settings className="h-4 w-4 text-muted-foreground" />
              </Button>
              <Badge className="bg-purple-100 text-purple-700 border-purple-200">
                Confidence: {summary.confidence}%
              </Badge>
              <div className="relative group">
                <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                <div className="absolute right-0 top-6 w-80 p-3 bg-white border border-border/60 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="text-xs space-y-2">
                    <p className="font-semibold text-foreground">Confidence Score Calculation</p>
                    <p className="text-foreground">
                      The confidence score (0-100%) indicates AI's certainty in its analysis based on:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li><strong>Data Quality:</strong> Completeness and freshness of source data</li>
                      <li><strong>Source Reliability:</strong> Number and credibility of cited sources</li>
                      <li><strong>Pattern Strength:</strong> Statistical significance of identified trends</li>
                      <li><strong>Historical Accuracy:</strong> Past prediction accuracy for similar insights</li>
                    </ul>
                    <p className="text-muted-foreground pt-1">
                      <strong>90%+:</strong> High confidence • <strong>70-89%:</strong> Moderate • <strong>&lt;70%:</strong> Low confidence
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mb-0">
            Generated: {summary.timestamp} | Next refresh: 20 mins
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Highlights */}
        <div className="-mt-4">
          <h4 className="text-sm font-semibold mb-2">🎯 Top 3 Highlights This Week</h4>
          <div className="space-y-3">
            {summary.highlights.map((highlight, idx) => (
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
                      {highlight.sources && highlight.sources.map((sourceId) => (
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
                          <SourceButtons sourceIds={highlight.sources} dashboards={sourceDashboards} />
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
            {summary.concerns.map((concern, idx) => (
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
                      {concern.sources && concern.sources.map((sourceId) => (
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
                            {concern.actions.map((action, i) => (
                              <p key={i} className="text-xs text-foreground">→ {action}</p>
                            ))}
                          </div>
                        )}
                        {concern.sources && concern.sources.length > 0 && (
                          <SourceButtons sourceIds={concern.sources} dashboards={sourceDashboards} />
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
            {summary.emergingPatterns.map((pattern, idx) => (
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
              View Sources ({summary.sources?.length || 0} sources)
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
                  {(summary.sources || []).map((source) => (
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
  );
}

/** Inline helper for rendering source dashboard links */
function SourceButtons({ sourceIds, dashboards }: { sourceIds: number[]; dashboards: SourceDashboard[] }) {
  return (
    <div className="flex flex-wrap gap-1 mt-2">
      {sourceIds.map((sourceId) => {
        const source = dashboards.find(s => s.id === sourceId);
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
  );
}
