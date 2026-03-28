import { useState, useRef, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { Eye, Share2, Maximize2, Minimize2, Filter, Plus, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/app/components/ui/button';
import { Theme } from '@doordash/prism-react';
import { colors, radius } from '@/styles/theme';
import { domainColors } from '@/config/app.config';
import type { Canvas } from '@/types';

export interface DashboardFilter {
  id: string;
  column: string;
  operator: string;
  value: string;
}

const DASHBOARD_FILTER_COLUMNS = ['region', 'country', 'date_range', 'store_type', 'channel', 'platform', 'tier', 'market'];
const DASHBOARD_FILTER_OPERATORS = ['equals', 'not equals', 'contains', 'in'];

interface CanvasTopBarProps {
  canvas: Canvas;
  onUpdate: (updates: Partial<Canvas>) => void;
  onAddWidget: () => void;
  onPublish: () => void;
  maximized?: boolean;
  onToggleMaximize?: () => void;
  dashboardFilters?: DashboardFilter[];
  onDashboardFiltersChange?: (filters: DashboardFilter[]) => void;
}

const TopBarOuter = styled.div``;

const ToolbarContainer = styled.div`
  border-bottom: 1px solid ${colors.border};
  padding: ${Theme.usage.space.xSmall} ${Theme.usage.space.large};
`;

const ToolbarRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const TitleSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const TitleInput = styled.input`
  font-size: ${Theme.usage.fontSize.large};
  color: ${colors.foreground};
  font-weight: 600;
  background: none;
  border: 1px solid transparent;
  border-radius: 6px;
  padding: 1px 6px;
  margin: -1px -6px;
  outline: none;
  width: 100%;
  max-width: 400px;

  &:hover {
    border-color: ${colors.border};
  }

  &:focus {
    border-color: ${colors.violet500};
    background: rgb(var(--app-surface-rgb) / 0.5);
  }
`;

const MetaRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xSmall};
  margin-top: 2px;
`;

const Badge = styled.span<{ $color?: string }>`
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 9999px;
  font-size: ${Theme.usage.fontSize.xxSmall};
  font-weight: 500;
  background: ${({ $color }) => $color ? `${$color}18` : 'rgb(var(--app-overlay-rgb) / 0.06)'};
  color: ${({ $color }) => $color ?? colors.mutedForeground};
`;

const StatusBadge = styled(Badge)<{ $published: boolean }>`
  background: ${({ $published }) => $published ? 'rgb(var(--app-emerald-rgb, 16 185 129) / 0.12)' : 'rgb(var(--app-overlay-rgb) / 0.06)'};
  color: ${({ $published }) => $published ? colors.emerald500 : colors.mutedForeground};
`;

const Separator = styled.span`
  color: rgb(var(--app-muted-fg-rgb) / 0.3);
  font-size: ${Theme.usage.fontSize.xxSmall};
`;

const SubtitleText = styled.span`
  font-size: ${Theme.usage.fontSize.xxSmall};
  color: ${colors.mutedForeground};
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xSmall};
`;

const MaximizeButton = styled.button`
  padding: ${Theme.usage.space.xSmall};
  border-radius: 6px;
  border: none;
  background: transparent;
  color: ${colors.mutedForeground};
  cursor: pointer;
  transition: all 150ms;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: ${Theme.usage.space.xxSmall};

  &:hover {
    background: rgb(var(--app-overlay-rgb) / 0.06);
    color: ${colors.foreground};
  }
`;

const FilterBarContainer = styled.div`
  border-bottom: 1px solid ${colors.border};
  background: rgb(var(--app-muted-rgb) / 0.25);
  position: relative;
`;

const FilterBar = styled.div`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xSmall};
  padding: 6px ${Theme.usage.space.large};
  flex-wrap: wrap;
`;

const FilterToggleBtn = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: ${radius.md};
  border: 1px solid ${({ $active }) => $active ? colors.violet500 : colors.border};
  background: ${({ $active }) => $active ? 'rgb(var(--app-violet-rgb) / 0.06)' : 'transparent'};
  color: ${({ $active }) => $active ? colors.violet600 : colors.mutedForeground};
  font-size: ${Theme.usage.fontSize.xxSmall};
  font-weight: 500;
  cursor: pointer;
  transition: all 150ms;

  &:hover {
    border-color: ${colors.violet500};
    color: ${colors.violet600};
  }
`;

const DashFilterChip = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 10px;
  border-radius: 9999px;
  font-size: 11px;
  font-weight: 500;
  background: rgb(var(--app-violet-rgb) / 0.08);
  color: ${colors.violet600};
  border: 1px solid rgb(var(--app-violet-rgb) / 0.15);
`;

const DashFilterChipRemove = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  color: ${colors.violet600};
  opacity: 0.6;

  &:hover {
    opacity: 1;
  }
`;

const AddFilterBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 3px 8px;
  border-radius: ${radius.md};
  border: 1px dashed ${colors.border};
  background: none;
  color: ${colors.mutedForeground};
  font-size: 11px;
  cursor: pointer;
  transition: all 150ms;

  &:hover {
    border-color: ${colors.violet500};
    color: ${colors.violet600};
  }
`;

const FilterDropdown = styled(motion.div)`
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 50;
  background: ${colors.background};
  border: 1px solid ${colors.border};
  border-radius: ${radius.lg};
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  padding: ${Theme.usage.space.small};
  width: 400px;
  margin-top: 4px;
`;

const FilterFormRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xSmall};
  margin-bottom: ${Theme.usage.space.xSmall};
`;

const FilterFormSelect = styled.select`
  flex: 1;
  padding: 6px 10px;
  border: 1px solid ${colors.border};
  border-radius: ${radius.md};
  background: ${colors.background};
  color: ${colors.foreground};
  font-size: ${Theme.usage.fontSize.xxSmall};
  outline: none;

  &:focus {
    border-color: ${colors.violet500};
  }
`;

const FilterFormInput = styled.input`
  flex: 1;
  padding: 6px 10px;
  border: 1px solid ${colors.border};
  border-radius: ${radius.md};
  background: ${colors.background};
  color: ${colors.foreground};
  font-size: ${Theme.usage.fontSize.xxSmall};
  outline: none;

  &:focus {
    border-color: ${colors.violet500};
  }
`;

const FilterFormApply = styled.button`
  padding: 6px 14px;
  border: none;
  border-radius: ${radius.md};
  background: ${colors.violet600};
  color: white;
  font-size: ${Theme.usage.fontSize.xxSmall};
  font-weight: 500;
  cursor: pointer;
  transition: opacity 150ms;

  &:hover {
    opacity: 0.9;
  }
`;

const AllChartsLabel = styled.span`
  font-size: 11px;
  color: ${colors.mutedForeground};
  font-style: italic;
`;

export function CanvasTopBar({ canvas, onUpdate, onAddWidget: _onAddWidget, onPublish, maximized = false, onToggleMaximize, dashboardFilters = [], onDashboardFiltersChange }: CanvasTopBarProps) {
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState(canvas.title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTitleValue(canvas.title);
  }, [canvas.title]);

  useEffect(() => {
    if (editingTitle && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingTitle]);

  const commitTitle = () => {
    setEditingTitle(false);
    const trimmed = titleValue.trim();
    if (trimmed && trimmed !== canvas.title) {
      onUpdate({ title: trimmed });
    } else {
      setTitleValue(canvas.title);
    }
  };

  const [showFilterBar, setShowFilterBar] = useState(dashboardFilters.length > 0);
  const [showFilterForm, setShowFilterForm] = useState(false);
  const [draftFilter, setDraftFilter] = useState({ column: DASHBOARD_FILTER_COLUMNS[0], operator: DASHBOARD_FILTER_OPERATORS[0], value: '' });
  const filterFormRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showFilterForm) return;
    const handleClick = (e: MouseEvent) => {
      if (filterFormRef.current && !filterFormRef.current.contains(e.target as Node)) {
        setShowFilterForm(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showFilterForm]);

  const handleAddDashboardFilter = useCallback(() => {
    if (!draftFilter.value.trim() || !onDashboardFiltersChange) return;
    const newFilter: DashboardFilter = { id: crypto.randomUUID().slice(0, 8), ...draftFilter };
    onDashboardFiltersChange([...dashboardFilters, newFilter]);
    setDraftFilter({ column: DASHBOARD_FILTER_COLUMNS[0], operator: DASHBOARD_FILTER_OPERATORS[0], value: '' });
    setShowFilterForm(false);
  }, [draftFilter, dashboardFilters, onDashboardFiltersChange]);

  const handleRemoveDashboardFilter = useCallback((filterId: string) => {
    if (!onDashboardFiltersChange) return;
    const updated = dashboardFilters.filter((f) => f.id !== filterId);
    onDashboardFiltersChange(updated);
    if (updated.length === 0) setShowFilterBar(false);
  }, [dashboardFilters, onDashboardFiltersChange]);

  const domainColor = domainColors[canvas.domain] ?? undefined;
  const widgetCount = canvas.layout.length;

  return (
    <TopBarOuter>
      <ToolbarContainer>
        <ToolbarRow>
          <TitleSection>
            <TitleInput
              ref={inputRef}
              value={titleValue}
              readOnly={!editingTitle}
              onClick={() => setEditingTitle(true)}
              onChange={(e) => setTitleValue(e.target.value)}
              onBlur={commitTitle}
              onKeyDown={(e) => {
                if (e.key === 'Enter') commitTitle();
                if (e.key === 'Escape') { setTitleValue(canvas.title); setEditingTitle(false); }
              }}
            />
            <MetaRow>
              <Badge $color={domainColor}>{canvas.domain}</Badge>
              <Badge>{canvas.tier}</Badge>
              <StatusBadge $published={canvas.status === 'published'}>
                {canvas.status === 'published' ? 'Published' : 'Draft'}
              </StatusBadge>
              <Separator>·</Separator>
              <SubtitleText>{widgetCount} widget{widgetCount !== 1 ? 's' : ''}</SubtitleText>
            </MetaRow>
          </TitleSection>
          <Actions>
            <Button variant="outline" style={{ gap: '8px', fontSize: '13px' }}>
              <Eye style={{ width: 14, height: 14 }} />
              Preview
            </Button>
            <Button
              variant="outline"
              style={{ gap: '8px', fontSize: '13px', backgroundColor: colors.violet600, color: colors.white, borderColor: colors.violet600 }}
              onClick={onPublish}
            >
              <Share2 style={{ width: 14, height: 14 }} />
              Publish
            </Button>
            {onToggleMaximize && (
              <MaximizeButton
                onClick={onToggleMaximize}
                title={maximized ? 'Restore panels' : 'Maximize canvas'}
              >
                {maximized
                  ? <Minimize2 style={{ width: 16, height: 16 }} />
                  : <Maximize2 style={{ width: 16, height: 16 }} />
                }
              </MaximizeButton>
            )}
          </Actions>
        </ToolbarRow>
      </ToolbarContainer>

      {/* Dashboard-level filter bar — separate line below title */}
      <FilterBarContainer>
        <FilterBar>
          <FilterToggleBtn
            $active={showFilterBar}
            onClick={() => { setShowFilterBar((p) => !p); if (!showFilterBar) setShowFilterForm(false); }}
          >
            <Filter style={{ width: 13, height: 13 }} />
            Filters
            {dashboardFilters.length > 0 && (
              <span style={{ background: colors.violet600, color: 'white', borderRadius: '9999px', padding: '0 5px', fontSize: '10px', lineHeight: '16px' }}>
                {dashboardFilters.length}
              </span>
            )}
          </FilterToggleBtn>

          {showFilterBar && (
            <>
              {dashboardFilters.map((f) => (
                <DashFilterChip key={f.id}>
                  {f.column} {f.operator} "{f.value}"
                  <DashFilterChipRemove onClick={() => handleRemoveDashboardFilter(f.id)}>
                    <X style={{ width: 10, height: 10 }} />
                  </DashFilterChipRemove>
                </DashFilterChip>
              ))}
              <AddFilterBtn onClick={() => setShowFilterForm(true)}>
                <Plus style={{ width: 12, height: 12 }} />
                Add filter
              </AddFilterBtn>
              {dashboardFilters.length > 0 && (
                <AllChartsLabel>Applied to all charts</AllChartsLabel>
              )}
            </>
          )}
        </FilterBar>

        <AnimatePresence>
          {showFilterForm && (
            <FilterDropdown
              ref={filterFormRef}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.12 }}
            >
              <div style={{ fontSize: '12px', fontWeight: 500, color: colors.foreground, marginBottom: '8px' }}>
                Add dashboard filter
              </div>
              <div style={{ fontSize: '11px', color: colors.mutedForeground, marginBottom: '10px' }}>
                This filter will apply to all charts in this dashboard.
              </div>
              <FilterFormRow>
                <FilterFormSelect
                  value={draftFilter.column}
                  onChange={(e) => setDraftFilter((p) => ({ ...p, column: e.target.value }))}
                >
                  {DASHBOARD_FILTER_COLUMNS.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </FilterFormSelect>
                <FilterFormSelect
                  value={draftFilter.operator}
                  onChange={(e) => setDraftFilter((p) => ({ ...p, operator: e.target.value }))}
                >
                  {DASHBOARD_FILTER_OPERATORS.map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </FilterFormSelect>
              </FilterFormRow>
              <FilterFormRow>
                <FilterFormInput
                  placeholder="Filter value…"
                  value={draftFilter.value}
                  onChange={(e) => setDraftFilter((p) => ({ ...p, value: e.target.value }))}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleAddDashboardFilter(); }}
                  autoFocus
                />
                <FilterFormApply onClick={handleAddDashboardFilter}>
                  Apply
                </FilterFormApply>
              </FilterFormRow>
            </FilterDropdown>
          )}
        </AnimatePresence>
      </FilterBarContainer>
    </TopBarOuter>
  );
}
