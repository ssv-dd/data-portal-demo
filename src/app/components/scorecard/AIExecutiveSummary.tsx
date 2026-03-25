import { useState } from 'react';
import styled from 'styled-components';
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
import { motion, AnimatePresence } from 'framer-motion';
import { colors, radius, shadows, Theme } from '@/styles/theme';
import type { AIExecutiveSummary as AIExecutiveSummaryType, SourceDashboard } from '@/types';

interface AIExecutiveSummaryProps {
  summary: AIExecutiveSummaryType;
  areaName: string;
  sourceDashboards: SourceDashboard[];
  onSettingsClick: () => void;
}

const StyledCard = styled(Card)`
  padding: ${Theme.usage.space.large};
  border-color: ${colors.purple200};
  background: linear-gradient(to right, ${colors.purple50}, var(--app-status-info-bg));
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${Theme.usage.space.small};
  margin-bottom: ${Theme.usage.space.medium};
`;

const IconBox = styled.div`
  padding: ${Theme.usage.space.xSmall};
  border-radius: ${radius.lg};
  background-color: ${colors.purple100};
`;

const HeaderContent = styled.div`
  flex: 1;
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${Theme.usage.space.xSmall};
`;

const Title = styled.h3`
  font-size: ${Theme.usage.fontSize.medium};
  font-weight: 600;
`;

const TitleActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xSmall};
`;

const SettingsButton = styled(Button)`
  height: 32px;
  width: 32px;
`;

const ConfidenceBadge = styled(Badge)`
  background-color: ${colors.purple100};
  color: ${colors.purple700};
  border-color: ${colors.purple200};
`;

const TooltipWrapper = styled.div`
  position: relative;

  &:hover > div {
    opacity: 1;
    visibility: visible;
  }
`;

const TooltipContent = styled.div`
  position: absolute;
  right: 0;
  top: ${Theme.usage.space.large};
  width: 320px;
  padding: ${Theme.usage.space.small};
  background-color: ${colors.white};
  border: 1px solid rgb(var(--app-overlay-rgb) / 0.06);
  border-radius: ${radius.xl};
  box-shadow: ${shadows.lg};
  opacity: 0;
  visibility: hidden;
  transition: all 200ms;
  z-index: 50;
`;

const TooltipInner = styled.div`
  font-size: ${Theme.usage.fontSize.xxSmall};
  display: flex;
  flex-direction: column;
  gap: ${Theme.usage.space.xSmall};
`;

const TooltipTitle = styled.p`
  font-weight: 600;
  color: ${colors.foreground};
`;

const TooltipBody = styled.p`
  color: ${colors.foreground};
`;

const TooltipList = styled.ul`
  list-style-type: disc;
  list-style-position: inside;
  display: flex;
  flex-direction: column;
  gap: ${Theme.usage.space.xxSmall};
  color: ${colors.mutedForeground};
`;

const TooltipFooter = styled.p`
  color: ${colors.mutedForeground};
  padding-top: ${Theme.usage.space.xxSmall};
`;

const Timestamp = styled.p`
  font-size: ${Theme.usage.fontSize.xxSmall};
  color: ${colors.mutedForeground};
  margin-bottom: 0;
`;

const SectionsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${Theme.usage.space.medium};
`;

const SectionTitle = styled.h4`
  font-size: ${Theme.usage.fontSize.xSmall};
  font-weight: 600;
  margin-bottom: ${Theme.usage.space.xSmall};
`;

const HighlightsSection = styled.div`
  margin-top: -16px;
`;

const ItemList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${Theme.usage.space.small};
`;

const HighlightItem = styled.div`
  padding-left: ${Theme.usage.space.medium};
  border-left: 2px solid ${colors.emerald500};
  position: relative;
`;

const ConcernItem = styled.div`
  padding-left: ${Theme.usage.space.medium};
  border-left: 2px solid ${colors.ddWarning};
  position: relative;
`;

const ItemHeader = styled.div<{ $hoverColor: string }>`
  display: flex;
  align-items: flex-start;
  gap: ${Theme.usage.space.xSmall};
  cursor: pointer;
  margin-left: -16px;
  padding-left: ${Theme.usage.space.medium};
  padding-top: ${Theme.usage.space.xxSmall};
  padding-bottom: ${Theme.usage.space.xxSmall};
  border-radius: ${radius.md};
  transition: background-color 150ms;

  &:hover {
    background-color: ${({ $hoverColor }) => $hoverColor};
  }
`;

const ChevronIcon = styled(ChevronRight)<{ $expanded: boolean }>`
  height: 16px;
  width: 16px;
  color: ${colors.mutedForeground};
  flex-shrink: 0;
  margin-top: ${Theme.usage.space.xxxSmall};
  transition: transform 150ms;
  transform: ${({ $expanded }) => ($expanded ? 'rotate(90deg)' : 'rotate(0deg)')};
`;

const ItemContent = styled.div`
  flex: 1;
`;

const ItemTitle = styled.div`
  font-weight: 500;
  font-size: ${Theme.usage.fontSize.xSmall};
`;

const SourceSup = styled.sup`
  margin-left: ${Theme.usage.space.xxxSmall};
  color: ${colors.purple600};
  font-weight: 400;
`;

const ExpandedContent = styled.div`
  margin-top: ${Theme.usage.space.xSmall};
  margin-left: ${Theme.usage.space.large};
  display: flex;
  flex-direction: column;
  gap: ${Theme.usage.space.xSmall};
`;

const InsightText = styled.p`
  font-size: ${Theme.usage.fontSize.xSmall};
  color: ${colors.mutedForeground};
`;

const CrossProductText = styled.p`
  font-size: ${Theme.usage.fontSize.xxSmall};
  color: ${colors.blue600};
`;

const ActionText = styled.p`
  font-size: ${Theme.usage.fontSize.xxSmall};
  color: ${colors.purple600};
`;

const CautionText = styled.p`
  font-size: ${Theme.usage.fontSize.xxSmall};
  color: ${colors.yellow600};
`;

const ForegroundActionText = styled.p`
  font-size: ${Theme.usage.fontSize.xxSmall};
  color: ${colors.foreground};
`;

const ConcernActions = styled.div`
  margin-top: ${Theme.usage.space.xSmall};
  display: flex;
  flex-direction: column;
  gap: ${Theme.usage.space.xxSmall};
`;

const PatternItem = styled.li`
  font-size: ${Theme.usage.fontSize.xSmall};
  color: ${colors.mutedForeground};
`;

const PatternList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: ${Theme.usage.space.xxSmall};
`;

const SourcesSection = styled.div`
  padding-top: ${Theme.usage.space.small};
  border-top: 1px solid ${colors.border};
`;

const SourcesHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const SourcesToggle = styled.button`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xSmall};
  font-size: ${Theme.usage.fontSize.xSmall};
  font-weight: 500;
  color: ${colors.purple700};
  background: none;
  border: none;
  cursor: pointer;
  transition: color 150ms;

  &:hover {
    color: ${colors.purple800};
  }
`;

const SourcesChevron = styled(ChevronRight)<{ $expanded: boolean }>`
  height: 16px;
  width: 16px;
  transition: transform 150ms;
  transform: ${({ $expanded }) => ($expanded ? 'rotate(90deg)' : 'rotate(0deg)')};
`;

const DisclaimerText = styled.p`
  font-size: ${Theme.usage.fontSize.xxSmall};
  color: ${colors.mutedForeground};
`;

const OverflowHidden = styled(motion.div)`
  overflow: hidden;
`;

const SourcesList = styled.div`
  margin-top: ${Theme.usage.space.small};
  display: flex;
  flex-direction: column;
  gap: ${Theme.usage.space.xSmall};
`;

const SourceRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: ${Theme.usage.space.xSmall} ${Theme.usage.space.small};
  background-color: ${colors.white};
  border-radius: ${radius.md};
  border: 1px solid ${colors.border};
  transition: border-color 150ms;

  &:hover {
    border-color: ${colors.purple200};
  }
`;

const SourceInfo = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${Theme.usage.space.xSmall};
  flex: 1;
`;

const SourceId = styled.span`
  font-size: ${Theme.usage.fontSize.xxSmall};
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  color: ${colors.purple600};
  margin-top: ${Theme.usage.space.xxxSmall};
`;

const SourceDetails = styled.div`
  flex: 1;
  min-width: 0;
`;

const SourceNameRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xSmall};
`;

const SourceName = styled.p`
  font-size: ${Theme.usage.fontSize.xSmall};
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const SourceTypeBadge = styled(Badge)`
  font-size: ${Theme.usage.fontSize.xxSmall};
  flex-shrink: 0;
`;

const SourceUpdated = styled.p`
  font-size: ${Theme.usage.fontSize.xxSmall};
  color: ${colors.mutedForeground};
`;

const SourceLinkButton = styled.button`
  flex-shrink: 0;
  margin-left: ${Theme.usage.space.xSmall};
  padding: ${Theme.usage.space.xxSmall};
  border-radius: ${radius.md};
  background: none;
  border: none;
  cursor: pointer;
  transition: background-color 150ms;

  &:hover {
    background-color: ${colors.purple50};
  }
`;

const SourceButtonsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${Theme.usage.space.xxSmall};
  margin-top: ${Theme.usage.space.xSmall};
`;

const InlineSourceButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: ${Theme.usage.space.xxSmall};
  padding: ${Theme.usage.space.xxxSmall} ${Theme.usage.space.xSmall};
  background-color: ${colors.purple100};
  color: ${colors.purple700};
  border-radius: ${radius.md};
  font-size: ${Theme.usage.fontSize.xxSmall};
  border: none;
  cursor: pointer;
  transition: background-color 150ms;

  &:hover {
    background-color: ${colors.purple200};
  }
`;

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
    <StyledCard>
      <HeaderRow>
        <IconBox>
          <Sparkles style={{ height: '20px', width: '20px', color: colors.purple600 }} />
        </IconBox>
        <HeaderContent>
          <TitleRow>
            <Title>
              AI Overview: {areaName} - Week of Feb 2-8, 2026
            </Title>
            <TitleActions>
              <SettingsButton
                variant="ghost"
                size="icon"
                onClick={onSettingsClick}
              >
                <Settings style={{ height: '16px', width: '16px', color: colors.mutedForeground }} />
              </SettingsButton>
              <ConfidenceBadge>
                Confidence: {summary.confidence}%
              </ConfidenceBadge>
              <TooltipWrapper>
                <Info style={{ height: '16px', width: '16px', color: colors.mutedForeground, cursor: 'help' }} />
                <TooltipContent>
                  <TooltipInner>
                    <TooltipTitle>Confidence Score Calculation</TooltipTitle>
                    <TooltipBody>
                      The confidence score (0-100%) indicates AI's certainty in its analysis based on:
                    </TooltipBody>
                    <TooltipList>
                      <li><strong>Data Quality:</strong> Completeness and freshness of source data</li>
                      <li><strong>Source Reliability:</strong> Number and credibility of cited sources</li>
                      <li><strong>Pattern Strength:</strong> Statistical significance of identified trends</li>
                      <li><strong>Historical Accuracy:</strong> Past prediction accuracy for similar insights</li>
                    </TooltipList>
                    <TooltipFooter>
                      <strong>90%+:</strong> High confidence • <strong>70-89%:</strong> Moderate • <strong>&lt;70%:</strong> Low confidence
                    </TooltipFooter>
                  </TooltipInner>
                </TooltipContent>
              </TooltipWrapper>
            </TitleActions>
          </TitleRow>
          <Timestamp>
            Generated: {summary.timestamp} | Next refresh: 20 mins
          </Timestamp>
        </HeaderContent>
      </HeaderRow>

      <SectionsWrapper>
        {/* Highlights */}
        <HighlightsSection>
          <SectionTitle>🎯 Top 3 Highlights This Week</SectionTitle>
          <ItemList>
            {summary.highlights.map((highlight, idx) => (
              <HighlightItem key={idx}>
                <ItemHeader
                  $hoverColor="var(--app-hover-green-bg)"
                  onClick={() => toggleHighlight(idx)}
                >
                  <ChevronIcon $expanded={expandedHighlights.includes(idx)} />
                  <ItemContent>
                    <ItemTitle>
                      {highlight.title}: {highlight.metric}
                      {highlight.sources && highlight.sources.map((sourceId) => (
                        <SourceSup key={sourceId}>[{sourceId}]</SourceSup>
                      ))}
                    </ItemTitle>
                  </ItemContent>
                </ItemHeader>
                <AnimatePresence>
                  {expandedHighlights.includes(idx) && (
                    <OverflowHidden
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ExpandedContent>
                        <InsightText>{highlight.insight}</InsightText>
                        {highlight.crossProduct && (
                          <CrossProductText>→ Cross-product insight: {highlight.crossProduct}</CrossProductText>
                        )}
                        {highlight.action && (
                          <ActionText>→ {highlight.action}</ActionText>
                        )}
                        {highlight.caution && (
                          <CautionText>⚠️ {highlight.caution}</CautionText>
                        )}
                        {highlight.sources && highlight.sources.length > 0 && (
                          <SourceButtons sourceIds={highlight.sources} dashboards={sourceDashboards} />
                        )}
                      </ExpandedContent>
                    </OverflowHidden>
                  )}
                </AnimatePresence>
              </HighlightItem>
            ))}
          </ItemList>
        </HighlightsSection>

        {/* Concerns */}
        <div>
          <SectionTitle>⚠️ Top 2 Areas Needing Attention</SectionTitle>
          <ItemList>
            {summary.concerns.map((concern, idx) => (
              <ConcernItem key={idx}>
                <ItemHeader
                  $hoverColor="var(--app-hover-yellow-bg)"
                  onClick={() => toggleConcern(idx)}
                >
                  <ChevronIcon $expanded={expandedConcerns.includes(idx)} />
                  <ItemContent>
                    <ItemTitle>
                      {concern.title}: {concern.metric}
                      {concern.sources && concern.sources.map((sourceId) => (
                        <SourceSup key={sourceId}>[{sourceId}]</SourceSup>
                      ))}
                    </ItemTitle>
                  </ItemContent>
                </ItemHeader>
                <AnimatePresence>
                  {expandedConcerns.includes(idx) && (
                    <OverflowHidden
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ExpandedContent>
                        <InsightText>{concern.insight}</InsightText>
                        {concern.actions && (
                          <ConcernActions>
                            {concern.actions.map((action, i) => (
                              <ForegroundActionText key={i}>→ {action}</ForegroundActionText>
                            ))}
                          </ConcernActions>
                        )}
                        {concern.sources && concern.sources.length > 0 && (
                          <SourceButtons sourceIds={concern.sources} dashboards={sourceDashboards} />
                        )}
                      </ExpandedContent>
                    </OverflowHidden>
                  )}
                </AnimatePresence>
              </ConcernItem>
            ))}
          </ItemList>
        </div>

        {/* Emerging Patterns */}
        <div>
          <SectionTitle>🔮 Emerging Patterns & Opportunities</SectionTitle>
          <PatternList>
            {summary.emergingPatterns.map((pattern, idx) => (
              <PatternItem key={idx}>• {pattern}</PatternItem>
            ))}
          </PatternList>
        </div>

        {/* Sources Section */}
        <SourcesSection>
          <SourcesHeader>
            <SourcesToggle onClick={() => setShowSources(!showSources)}>
              <ExternalLink style={{ height: '16px', width: '16px' }} />
              View Sources ({summary.sources?.length || 0} sources)
              <SourcesChevron $expanded={showSources} />
            </SourcesToggle>
            <DisclaimerText>
              AskAI can make mistakes. Verify important information.
            </DisclaimerText>
          </SourcesHeader>

          <AnimatePresence>
            {showSources && (
              <OverflowHidden
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <SourcesList>
                  {(summary.sources || []).map((source) => (
                    <SourceRow key={source.id}>
                      <SourceInfo>
                        <SourceId>[{source.id}]</SourceId>
                        <SourceDetails>
                          <SourceNameRow>
                            <SourceName>{source.name}</SourceName>
                            <SourceTypeBadge variant="outline">{source.type}</SourceTypeBadge>
                          </SourceNameRow>
                          <SourceUpdated>Updated {source.lastRefreshed}</SourceUpdated>
                        </SourceDetails>
                      </SourceInfo>
                      {source.url !== '#' && (
                        <SourceLinkButton
                          onClick={() => window.open(source.url, '_blank')}
                        >
                          <ExternalLink style={{ height: '16px', width: '16px', color: colors.purple600 }} />
                        </SourceLinkButton>
                      )}
                    </SourceRow>
                  ))}
                </SourcesList>
              </OverflowHidden>
            )}
          </AnimatePresence>
        </SourcesSection>
      </SectionsWrapper>
    </StyledCard>
  );
}

function SourceButtons({ sourceIds, dashboards }: { sourceIds: number[]; dashboards: SourceDashboard[] }) {
  return (
    <SourceButtonsWrapper>
      {sourceIds.map((sourceId) => {
        const source = dashboards.find(s => s.id === sourceId);
        return source ? (
          <InlineSourceButton
            key={sourceId}
            onClick={(e) => {
              e.stopPropagation();
              if (source.url !== '#') window.open(source.url, '_blank');
            }}
          >
            <ExternalLink style={{ height: '12px', width: '12px' }} />
            {source.name}
          </InlineSourceButton>
        ) : null;
      })}
    </SourceButtonsWrapper>
  );
}
