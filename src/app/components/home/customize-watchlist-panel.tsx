import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Info, Trash2, Plus, RotateCcw, Save, ChevronDown, ChevronRight, Settings2 } from 'lucide-react';
import styled from 'styled-components';
import { Button } from '../ui/button';
import { Tooltip, TooltipPosition } from '../ui/tooltip';
import { colors, spacing, radius, shadows, prismFontSize, Theme } from '@/styles/theme';
import { focusRing } from '../ui/utils';
import type { ProductArea, Metric } from '@/types';

interface CustomizeWatchlistPanelProps {
  open: boolean;
  onClose: () => void;
  areas: ProductArea[];
  selectedMetricIds: string[];
  onSave: (metricIds: string[]) => void;
}

const OPTIMAL_MIN = 3;
const OPTIMAL_MAX = 6;

// Styled Components

const Overlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.2);
  z-index: 40;
`;

const Panel = styled(motion.div)`
  position: fixed;
  right: 0;
  top: 0;
  bottom: 0;
  width: 420px;
  background: ${colors.background};
  border-left: 1px solid rgb(var(--app-overlay-rgb) / 0.6);
  z-index: 50;
  display: flex;
  flex-direction: column;
  box-shadow: ${shadows['2xl']};
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${spacing[4]} ${spacing[5]};
  border-bottom: 1px solid rgb(var(--app-overlay-rgb) / 0.4);
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing[2]};
`;

const HeaderIcon = styled(Settings2)`
  width: 20px;
  height: 20px;
  color: ${colors.violet600};
`;

const HeaderTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: ${colors.foreground};
  margin: 0;
  line-height: 1.4;
`;

const CloseButton = styled.button`
  padding: ${spacing[1]};
  border-radius: ${radius.md};
  border: none;
  background: transparent;
  color: ${colors.mutedForeground};
  cursor: pointer;
  transition: background-color 0.15s ease;

  &:hover {
    background: rgb(var(--app-overlay-rgb) / 0.6);
  }

  ${focusRing}
`;

const MetricCountBadge = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing[2]};
  padding: ${spacing[3]} ${spacing[5]};
  border-bottom: 1px solid rgb(var(--app-overlay-rgb) / 0.2);
`;

const MetricCount = styled.span`
  font-size: ${prismFontSize.small};
  font-weight: 500;
  color: ${colors.foreground};
`;

const OptimalLabel = styled.span<{ $status: 'add-more' | 'optimal' | 'too-many' }>`
  font-size: ${prismFontSize.xSmall};
  font-weight: 500;
  color: ${({ $status }) =>
    $status === 'optimal' ? colors.emerald500 : colors.yellow600};

  &::before {
    content: '· ';
    margin-right: 2px;
  }
`;

const ScrollableContent = styled.div`
  flex: 1;
  overflow-y: auto;
`;

const Section = styled.div`
  padding: ${spacing[3]} ${spacing[5]};
`;

const SectionTitle = styled.h3`
  font-size: 11px;
  font-weight: 600;
  color: ${colors.mutedForeground};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0 0 ${spacing[2]} 0;
`;

const MetricsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const MetricCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${spacing[2.5]} ${spacing[3]};
  border-radius: ${radius.lg};
  background: rgb(var(--app-overlay-rgb) / 0.03);
  border: 1px solid rgb(var(--app-overlay-rgb) / 0.06);
`;

const MetricInfo = styled.div`
  min-width: 0;
  flex: 1;
`;

const MetricName = styled.p`
  font-size: ${prismFontSize.small};
  font-weight: 500;
  color: ${colors.foreground};
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const MetricAreaName = styled.p`
  font-size: 11px;
  color: ${colors.mutedForeground};
  margin: 2px 0 0 0;
`;

const MetricActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing[1]};
  flex-shrink: 0;
`;

const IconButton = styled.button<{ $variant?: 'info' | 'remove' }>`
  padding: 6px;
  border-radius: ${radius.md};
  border: none;
  background: transparent;
  color: ${colors.mutedForeground};
  cursor: pointer;
  transition: all 0.15s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: ${({ $variant }) =>
      $variant === 'remove'
        ? 'rgb(var(--app-red-rgb) / 0.1)'
        : 'rgb(var(--app-overlay-rgb) / 0.6)'};
    color: ${({ $variant }) =>
      $variant === 'remove' ? colors.red600 : colors.mutedForeground};
  }

  ${focusRing}
`;

const TipBox = styled.div`
  margin: 0 ${spacing[5]} ${spacing[3]};
  padding: ${spacing[2]} ${spacing[3]};
  border-radius: ${radius.lg};
  background: rgb(var(--app-violet-rgb) / 0.08);
  border: 1px solid rgb(var(--app-violet-rgb) / 0.15);
`;

const TipText = styled.p`
  font-size: ${prismFontSize.xSmall};
  color: ${colors.violet700};
  margin: 0;
  display: flex;
  align-items: flex-start;
  gap: ${spacing[1]};
  line-height: 1.5;

  svg {
    width: 12px;
    height: 12px;
    flex-shrink: 0;
    margin-top: 2px;
  }
`;

const SearchWrapper = styled.div`
  padding: 0 ${spacing[5]} ${spacing[3]};
`;

const SearchContainer = styled.div`
  position: relative;
`;

const SearchIcon = styled(Search)`
  position: absolute;
  left: ${spacing[3]};
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  color: ${colors.mutedForeground};
  pointer-events: none;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: ${spacing[2]} ${spacing[3]} ${spacing[2]} 36px;
  border-radius: ${radius.lg};
  font-size: ${prismFontSize.small};
  background: rgb(var(--app-overlay-rgb) / 0.03);
  border: 1px solid rgb(var(--app-overlay-rgb) / 0.4);
  color: ${colors.foreground};
  transition: all 0.15s ease;

  &::placeholder {
    color: rgb(var(--app-overlay-rgb) / 0.5);
  }

  &:focus {
    outline: none;
    border-color: rgb(var(--app-violet-rgb) / 0.3);
    box-shadow: 0 0 0 1px rgb(var(--app-violet-rgb) / 0.3);
  }
`;

const QuickAddSection = styled.div`
  padding: 0 ${spacing[5]} ${spacing[4]};
`;

const AreasContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing[1]};
`;

const AreaCard = styled.div`
  border-radius: ${radius.lg};
  border: 1px solid rgb(var(--app-overlay-rgb) / 0.2);
  overflow: hidden;
`;

const AreaButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${spacing[2]} ${spacing[3]};
  border: none;
  background: transparent;
  cursor: pointer;
  transition: background-color 0.15s ease;

  &:hover {
    background: rgb(var(--app-overlay-rgb) / 0.02);
  }

  ${focusRing}
`;

const AreaButtonLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing[2]};
`;

const AreaName = styled.span`
  font-size: ${prismFontSize.small};
  font-weight: 500;
  color: ${colors.foreground};
`;

const AreaMetricCount = styled.span`
  font-size: 11px;
  color: ${colors.mutedForeground};
`;

const AreaMetricsContainer = styled(motion.div)`
  border-top: 1px solid rgb(var(--app-overlay-rgb) / 0.1);
`;

const AreaMetricsList = styled.div`
  padding: 6px ${spacing[2]};
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const AreaMetricItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px ${spacing[2]};
  border-radius: ${radius.md};
  transition: background-color 0.15s ease;

  &:hover {
    background: rgb(var(--app-overlay-rgb) / 0.02);
  }
`;

const AreaMetricContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const AreaMetricName = styled.p`
  font-size: ${prismFontSize.small};
  color: ${colors.foreground};
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const AreaMetricCategory = styled.p`
  font-size: 10px;
  color: ${colors.mutedForeground};
  margin: 2px 0 0 0;
`;

const AreaMetricActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing[1]};
  flex-shrink: 0;
`;

const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${spacing[3]} ${spacing[5]};
  border-top: 1px solid rgb(var(--app-overlay-rgb) / 0.4);
  background: rgb(var(--app-overlay-rgb) / 0.02);
`;

const FooterLeft = styled.div``;

const FooterRight = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing[2]};
`;

// Utility function to get optimal label
function getOptimalLabel(count: number): { text: string; status: 'add-more' | 'optimal' | 'too-many' } {
  if (count < OPTIMAL_MIN) return { text: 'Add more', status: 'add-more' };
  if (count <= OPTIMAL_MAX) return { text: 'Optimal', status: 'optimal' };
  return { text: 'Too many', status: 'too-many' };
}

// MetricInfoTooltip Component
function MetricInfoTooltip({ metric }: { metric: Metric }) {
  const tooltipContent = (
    <div style={{ maxWidth: '280px', padding: '12px' }}>
      <p style={{ fontSize: '12px', fontWeight: 600, margin: '0 0 4px 0' }}>{metric.name}</p>
      <p style={{ fontSize: '11px', color: colors.mutedForeground, margin: '0 0 8px 0' }}>
        {metric.description}
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '10px', color: colors.mutedForeground }}>
        <span
          style={{
            padding: '2px 6px',
            borderRadius: radius.sm,
            background: 'rgb(var(--app-overlay-rgb) / 0.08)',
          }}
        >
          {metric.category}
        </span>
        <span>Current: {metric.current}</span>
      </div>
    </div>
  );

  return (
    <Tooltip content={tooltipContent}>
      <IconButton $variant="info" type="button">
        <Info size={14} />
      </IconButton>
    </Tooltip>
  );
}

export function CustomizeWatchlistPanel({
  open,
  onClose,
  areas,
  selectedMetricIds,
  onSave,
}: CustomizeWatchlistPanelProps) {
  const [selected, setSelected] = useState<string[]>(selectedMetricIds);
  const [savedSnapshot] = useState<string[]>(selectedMetricIds);
  const [search, setSearch] = useState('');
  const [expandedAreas, setExpandedAreas] = useState<string[]>([]);

  const resetPanelState = () => {
    setSelected(savedSnapshot);
    setSearch('');
    setExpandedAreas([]);
  };

  const allMetrics = areas.flatMap((area) =>
    area.metrics.map((m) => ({ ...m, areaName: area.name, areaId: area.id }))
  );

  const selectedMetrics = selected
    .map((id) => allMetrics.find((m) => m.id === id))
    .filter(Boolean) as (Metric & { areaName: string; areaId: string })[];

  const availableAreas = areas.map((area) => ({
    ...area,
    metrics: area.metrics.filter(
      (m) =>
        !selected.includes(m.id) &&
        (search === '' ||
          m.name.toLowerCase().includes(search.toLowerCase()) ||
          area.name.toLowerCase().includes(search.toLowerCase()))
    ),
  })).filter((area) => area.metrics.length > 0);

  const handleRemove = (id: string) => {
    setSelected((prev) => prev.filter((mid) => mid !== id));
  };

  const handleAdd = (id: string) => {
    setSelected((prev) => [...prev, id]);
  };

  const handleReset = () => {
    setSelected(savedSnapshot);
  };

  const handleSave = () => {
    onSave(selected);
    setSearch('');
    setExpandedAreas([]);
    onClose();
  };

  const handleClose = () => {
    resetPanelState();
    onClose();
  };

  const toggleArea = (areaId: string) => {
    setExpandedAreas((prev) =>
      prev.includes(areaId) ? prev.filter((id) => id !== areaId) : [...prev, areaId]
    );
  };

  const optimal = getOptimalLabel(selected.length);
  const hasChanges = JSON.stringify(selected) !== JSON.stringify(savedSnapshot);

  return (
    <AnimatePresence>
      {open && (
        <>
          <Overlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />
          <Panel
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {/* Header */}
            <Header>
              <HeaderContent>
                <HeaderIcon />
                <HeaderTitle>Customize Your Watchlist</HeaderTitle>
              </HeaderContent>
              <CloseButton onClick={handleClose}>
                <X size={20} />
              </CloseButton>
            </Header>

            {/* Metrics count + optimal badge */}
            <MetricCountBadge>
              <MetricCount>{selected.length} metrics</MetricCount>
              <OptimalLabel $status={optimal.status}>{optimal.text}</OptimalLabel>
            </MetricCountBadge>

            {/* Scrollable content */}
            <ScrollableContent>
              {/* Current metrics */}
              <Section>
                <SectionTitle>Current Metrics ({selected.length})</SectionTitle>
                <MetricsList>
                  {selectedMetrics.map((metric) => (
                    <MetricCard key={metric.id}>
                      <MetricInfo>
                        <MetricName>{metric.name}</MetricName>
                        <MetricAreaName>{metric.areaName}</MetricAreaName>
                      </MetricInfo>
                      <MetricActions>
                        <MetricInfoTooltip metric={metric} />
                        <IconButton
                          $variant="remove"
                          onClick={() => handleRemove(metric.id)}
                          title="Remove metric"
                        >
                          <Trash2 size={14} />
                        </IconButton>
                      </MetricActions>
                    </MetricCard>
                  ))}
                </MetricsList>
              </Section>

              {/* Tip */}
              <TipBox>
                <TipText>
                  <Info />
                  Show only what you check weekly. You can always add more metrics later.
                </TipText>
              </TipBox>

              {/* Search */}
              <SearchWrapper>
                <SearchContainer>
                  <SearchIcon />
                  <SearchInput
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search metrics..."
                  />
                </SearchContainer>
              </SearchWrapper>

              {/* Quick Add by Product Area */}
              <QuickAddSection>
                <SectionTitle>Quick Add by Product Area</SectionTitle>
                <AreasContainer>
                  {availableAreas.map((area) => {
                    const isExpanded = expandedAreas.includes(area.id);
                    return (
                      <AreaCard key={area.id}>
                        <AreaButton onClick={() => toggleArea(area.id)}>
                          <AreaButtonLeft>
                            {isExpanded
                              ? <ChevronDown size={14} color={colors.mutedForeground} />
                              : <ChevronRight size={14} color={colors.mutedForeground} />}
                            <AreaName>{area.name}</AreaName>
                          </AreaButtonLeft>
                          <AreaMetricCount>{area.metrics.length} available</AreaMetricCount>
                        </AreaButton>
                        <AnimatePresence>
                          {isExpanded && (
                            <AreaMetricsContainer
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.15 }}
                            >
                              <AreaMetricsList>
                                {area.metrics.map((metric) => (
                                  <AreaMetricItem key={metric.id}>
                                    <AreaMetricContent>
                                      <AreaMetricName>{metric.name}</AreaMetricName>
                                      <AreaMetricCategory>{metric.category}</AreaMetricCategory>
                                    </AreaMetricContent>
                                    <AreaMetricActions>
                                      <MetricInfoTooltip metric={metric} />
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleAdd(metric.id)}
                                        style={{
                                          height: '24px',
                                          padding: '0 8px',
                                          fontSize: '11px',
                                          gap: '4px',
                                          color: colors.violet600,
                                          borderColor: colors.violet200,
                                        }}
                                      >
                                        <Plus size={12} />
                                        Add
                                      </Button>
                                    </AreaMetricActions>
                                  </AreaMetricItem>
                                ))}
                              </AreaMetricsList>
                            </AreaMetricsContainer>
                          )}
                        </AnimatePresence>
                      </AreaCard>
                    );
                  })}
                </AreasContainer>
              </QuickAddSection>
            </ScrollableContent>

            {/* Footer */}
            <Footer>
              <FooterLeft>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleReset}
                  style={{ fontSize: '12px', gap: '6px', color: colors.mutedForeground }}
                >
                  <RotateCcw size={14} />
                  Reset to Default
                </Button>
              </FooterLeft>
              <FooterRight>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClose}
                  style={{ fontSize: '12px' }}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSave}
                  disabled={!hasChanges}
                  style={{
                    fontSize: '12px',
                    gap: '6px',
                    background: hasChanges ? colors.violet600 : undefined,
                    opacity: hasChanges ? 1 : 0.5,
                  }}
                >
                  <Save size={14} />
                  Save Changes
                </Button>
              </FooterRight>
            </Footer>
          </Panel>
        </>
      )}
    </AnimatePresence>
  );
}
