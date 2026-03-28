import { useState, useCallback } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { staggerContainer, staggerItem, fadeInUp } from '@/app/lib/motion';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import {
  Search, Plus, Grid2x2, Clock, Users, LayoutDashboard,
  MoreVertical, Trash2,
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { AIAssistantSidebar } from '../components/ai-assistant-sidebar';
import { LeftPanel } from '../components/layout/left-panel';
import { DashboardLibraryPanel } from '../components/panels/dashboard-library-panel';
import { CreateCanvasModal } from '../components/dashboard/create-canvas-modal';
import { canvasStorage } from '../data/canvas-storage';
import { GradientOrb } from '../components/hero/gradient-orb';
import { Dialog, DialogContent, DialogDescription } from '../components/ui/dialog';
import { Theme } from '@doordash/prism-react';
import { colors, glassPanel, shadows, radius } from '@/styles/theme';
import { canvasDomains, domainColors } from '@/config/app.config';
import type { Canvas } from '@/types';

const PageContainer = styled.div`
  height: 100%;
  background-color: ${colors.background};
  overflow: hidden;
  position: relative;
`;

const GradientOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at top left, rgb(var(--app-fuchsia-rgb) / 0.08), transparent 35%),
              radial-gradient(circle at bottom right, rgb(var(--app-blue-rgb) / 0.08), transparent 35%);
`;

const ContentLayout = styled.div`
  position: relative;
  z-index: 10;
  height: 100%;
  display: flex;
  gap: ${Theme.usage.space.xSmall};
  padding: ${Theme.usage.space.xSmall};
`;

const CenterPanel = styled.div`
  flex: 1;
  ${glassPanel}
  border-radius: ${Theme.usage.borderRadius.xLarge};
  border: 1px solid ${colors.border};
  overflow: auto;
`;

const CenterContent = styled.div`
  padding: ${Theme.usage.space.xLarge};
`;

const PageHeader = styled.div`
  margin-bottom: ${Theme.usage.space.xLarge};
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.small};
  margin-bottom: ${Theme.usage.space.small};
`;

const PageTitle = styled.h1`
  font-size: ${Theme.usage.fontSize.xxLarge};
  color: ${colors.foreground};
  font-weight: 600;
`;

const PageDescription = styled.p`
  color: ${colors.mutedForeground};
`;

const ActionsBar = styled.div`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.medium};
  margin-bottom: ${Theme.usage.space.large};
`;

const SearchWrapper = styled.div`
  flex: 1;
  position: relative;
`;

const SearchIcon = styled(Search)`
  position: absolute;
  left: ${Theme.usage.space.small};
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  color: rgb(var(--app-muted-fg-rgb) / 0.6);
`;

const NewButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: ${Theme.usage.space.xSmall};
  border-radius: ${Theme.usage.borderRadius.xLarge};
  background-color: ${colors.violet600};
  border: none;
  padding: ${Theme.usage.space.xSmall} ${Theme.usage.space.medium};
  font-size: ${Theme.usage.fontSize.xSmall};
  font-weight: 600;
  color: ${colors.white};
  cursor: pointer;
  box-shadow: 0 4px 6px -1px rgb(var(--app-violet-rgb) / 0.25);
  transition: background-color 200ms;

  &:hover {
    background-color: ${colors.violet700};
  }
`;

const FilterRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xSmall};
  margin-bottom: ${Theme.usage.space.large};
  flex-wrap: wrap;
`;

const TierSelect = styled.select`
  padding: ${Theme.usage.space.xxSmall} ${Theme.usage.space.small};
  border: 1px solid ${colors.border};
  border-radius: 9999px;
  background: ${colors.background};
  color: ${colors.foreground};
  font-size: ${Theme.usage.fontSize.xxSmall};
  font-weight: 500;
  cursor: pointer;
  outline: none;

  &:focus {
    border-color: ${colors.violet500};
  }
`;

const FilterDivider = styled.div`
  width: 1px;
  height: 20px;
  background: ${colors.border};
  margin: 0 ${Theme.usage.space.xxSmall};
`;

const CardsGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${Theme.usage.space.large};

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const CardWrapper = styled.div`
  background-color: rgb(var(--app-surface-rgb) / 0.4);
  border: 1px solid ${colors.border};
  border-radius: ${Theme.usage.borderRadius.xLarge};
  padding: 20px;
  cursor: pointer;
  transition: box-shadow 200ms;
  position: relative;

  &:hover {
    box-shadow: ${shadows.cardHover};
  }
`;

const CardTopRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: ${Theme.usage.space.xSmall};
`;

const CardBadges = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const DomainBadge = styled.span<{ $color?: string }>`
  display: inline-flex;
  padding: 2px 8px;
  border-radius: 9999px;
  font-size: 11px;
  font-weight: 500;
  background: ${({ $color }) => $color ? `${$color}18` : 'rgb(var(--app-overlay-rgb) / 0.06)'};
  color: ${({ $color }) => $color ?? colors.mutedForeground};
`;

const TierBadge = styled.span`
  display: inline-flex;
  padding: 2px 8px;
  border-radius: 9999px;
  font-size: 11px;
  font-weight: 500;
  background: rgb(var(--app-overlay-rgb) / 0.06);
  color: ${colors.mutedForeground};
`;

const StatusDot = styled.span<{ $published: boolean }>`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${({ $published }) => $published ? colors.emerald500 : colors.mutedForeground};
`;

const CardMenuButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: ${radius.sm};
  color: rgb(var(--app-muted-fg-rgb) / 0.4);
  opacity: 0;
  transition: opacity 200ms, background 200ms;

  ${CardWrapper}:hover & {
    opacity: 1;
  }

  &:hover {
    background: rgb(var(--app-overlay-rgb) / 0.06);
    color: ${colors.mutedForeground};
  }
`;

const CardTitle = styled.h3`
  font-weight: 500;
  color: ${colors.foreground};
  margin-bottom: 4px;
`;

const CardDescription = styled.p`
  font-size: ${Theme.usage.fontSize.xSmall};
  color: ${colors.mutedForeground};
  margin-bottom: ${Theme.usage.space.small};
`;

const SparklineWrapper = styled.div`
  height: 40px;
  margin-bottom: ${Theme.usage.space.small};
`;

const CardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: ${Theme.usage.fontSize.xxSmall};
  color: ${colors.mutedForeground};
`;

const CardMeta = styled.div`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xxSmall};
`;

const CardDropdown = styled.div`
  position: absolute;
  right: 16px;
  top: 48px;
  z-index: 50;
  background: ${colors.background};
  border: 1px solid ${colors.border};
  border-radius: ${radius.lg};
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  padding: 4px;
  min-width: 140px;
`;

const DropdownItem = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xSmall};
  padding: ${Theme.usage.space.xSmall} ${Theme.usage.space.small};
  border: none;
  background: none;
  cursor: pointer;
  font-size: ${Theme.usage.fontSize.xSmall};
  color: ${colors.destructive};
  border-radius: ${radius.sm};

  &:hover {
    background: rgb(var(--app-overlay-rgb) / 0.06);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 64px 0;
  background-color: rgb(var(--app-muted-rgb) / 0.5);
  border: 1px solid ${colors.border};
  border-radius: ${Theme.usage.borderRadius.xLarge};
`;

const EmptyIcon = styled(Grid2x2)`
  width: 48px;
  height: 48px;
  margin: 0 auto ${Theme.usage.space.medium};
  color: rgb(var(--app-muted-fg-rgb) / 0.6);
`;

const EmptyText = styled.p`
  color: ${colors.mutedForeground};
  margin-bottom: ${Theme.usage.space.medium};
`;

// Simple sparkline data
const sparklineData = [4, 6, 3, 8, 5, 7, 9, 6, 8, 10, 7, 9].map((v, i) => ({ i, v }));

export function MyCanvasPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'mine' | 'shared'>('all');
  const [domainFilter, setDomainFilter] = useState<string | null>(null);
  const [tierFilter, setTierFilter] = useState<string | null>(null);
  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [leftTab, setLeftTab] = useState('recent');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Canvas | null>(null);
  const [canvases, setCanvases] = useState<Canvas[]>(() => canvasStorage.getCanvases());
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const navigate = useNavigate();

  const refreshCanvases = useCallback(() => {
    setCanvases(canvasStorage.getCanvases());
  }, []);

  const filteredCanvases = canvases.filter((canvas) => {
    const matchesSearch = canvas.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      canvas.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDomain = !domainFilter || canvas.domain === domainFilter;
    const matchesTier = !tierFilter || canvas.tier === tierFilter;

    if (filter === 'mine') return matchesSearch && matchesDomain && matchesTier && !canvas.shared;
    if (filter === 'shared') return matchesSearch && matchesDomain && matchesTier && canvas.shared;
    return matchesSearch && matchesDomain && matchesTier;
  });

  const handleDelete = () => {
    if (!deleteTarget) return;
    canvasStorage.deleteCanvas(deleteTarget.id);
    refreshCanvases();
    setDeleteTarget(null);
    setMenuOpenId(null);
  };

  const handleTabChange = (tab: string) => {
    setLeftTab(tab);
    if (tab === 'recent') setFilter('all');
    else if (tab === 'templates') setFilter('mine');
    else if (tab === 'shared') setFilter('shared');
  };

  return (
    <PageContainer>
      <GradientOverlay />
      <GradientOrb variant="primary" style={{ left: '-120px', top: '-20px' }} />
      <GradientOrb variant="secondary" style={{ right: '-80px', top: '120px' }} />

      <ContentLayout>
        <LeftPanel
          tabs={[
            { key: 'recent', label: 'Recent', icon: Clock },
            { key: 'templates', label: 'Canvases', icon: LayoutDashboard },
            { key: 'shared', label: 'Shared', icon: Users },
          ]}
          activeTab={leftTab}
          onTabChange={handleTabChange}
          collapsed={!leftPanelOpen}
          onToggleCollapse={() => setLeftPanelOpen(!leftPanelOpen)}
          showSearch={true}
          searchPlaceholder="Search canvases..."
        >
          <DashboardLibraryPanel
            activeTab={leftTab}
            onDashboardClick={(d) => {
              const match = canvases.find((c) => c.title === d.title);
              if (match) navigate(`/dashboard/${match.id}`);
            }}
          />
        </LeftPanel>

        <CenterPanel>
          <CenterContent>
            <motion.div variants={fadeInUp} initial="hidden" animate="visible">
              <PageHeader>
                <TitleRow>
                  <Grid2x2 style={{ width: 24, height: 24, color: colors.violet600 }} />
                  <PageTitle>Dashboards</PageTitle>
                </TitleRow>
                <PageDescription>
                  Create and manage metric dashboards. Open a canvas to edit or start a new one
                </PageDescription>
              </PageHeader>
            </motion.div>

            <ActionsBar>
              <SearchWrapper>
                <SearchIcon />
                <Input
                  placeholder="Search canvases..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ paddingLeft: '40px', backgroundColor: 'rgb(var(--app-surface-rgb) / 0.5)', borderColor: colors.border }}
                />
              </SearchWrapper>
              <NewButton onClick={() => setShowCreateModal(true)}>
                <Plus style={{ height: 16, width: 16 }} />
                Create Canvas
              </NewButton>
            </ActionsBar>

            <FilterRow>
              {canvasDomains.map((d) => (
                <Button key={d} variant="outline" size="sm"
                  style={domainFilter === d ? {
                    backgroundColor: `${domainColors[d]}18`,
                    color: domainColors[d],
                    borderColor: `${domainColors[d]}40`,
                  } : {}}
                  onClick={() => { setDomainFilter(domainFilter === d ? null : d); setTierFilter(null); }}
                >
                  {d}
                </Button>
              ))}
              {domainFilter && (
                <>
                  <FilterDivider />
                  <TierSelect
                    value={tierFilter || ''}
                    onChange={(e) => setTierFilter(e.target.value ? e.target.value as 'T0' | 'T1' | 'T2' : null)}
                  >
                    <option value="">All tiers</option>
                    <option value="T0">T0 — Company Critical</option>
                    <option value="T1">T1 — Business Critical</option>
                    <option value="T2">T2 — Team Level</option>
                  </TierSelect>
                </>
              )}
            </FilterRow>

            {filteredCanvases.length > 0 ? (
              <CardsGrid variants={staggerContainer} initial="hidden" animate="visible">
                {filteredCanvases.map((canvas) => (
                  <motion.div variants={staggerItem} key={canvas.id}>
                    <CardWrapper onClick={() => navigate(`/dashboard/${canvas.id}`)}>
                      <CardTopRow>
                        <CardBadges>
                          <DomainBadge $color={domainColors[canvas.domain]}>
                            {canvas.domain}
                          </DomainBadge>
                          <TierBadge>{canvas.tier}</TierBadge>
                          <StatusDot $published={canvas.status === 'published'} />
                        </CardBadges>
                        <CardMenuButton onClick={(e) => { e.stopPropagation(); setMenuOpenId(menuOpenId === canvas.id ? null : canvas.id); }}>
                          <MoreVertical style={{ width: 16, height: 16 }} />
                        </CardMenuButton>
                      </CardTopRow>
                      <CardTitle>{canvas.title}</CardTitle>
                      <CardDescription>{canvas.description}</CardDescription>
                      <SparklineWrapper>
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={sparklineData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                            <defs>
                              <linearGradient id={`spark-${canvas.id}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={domainColors[canvas.domain] || '#8B5CF6'} stopOpacity={0.2} />
                                <stop offset="95%" stopColor={domainColors[canvas.domain] || '#8B5CF6'} stopOpacity={0} />
                              </linearGradient>
                            </defs>
                            <Area type="monotone" dataKey="v" stroke={domainColors[canvas.domain] || '#8B5CF6'} strokeWidth={1.5} fill={`url(#spark-${canvas.id})`} />
                          </AreaChart>
                        </ResponsiveContainer>
                      </SparklineWrapper>
                      <CardFooter>
                        <CardMeta>
                          <Clock style={{ width: 12, height: 12 }} />
                          <span>{canvasStorage.formatRelativeTime(canvas.lastEdited)}</span>
                        </CardMeta>
                        <span>{canvas.layout.length} widgets</span>
                      </CardFooter>
                      {menuOpenId === canvas.id && (
                        <CardDropdown>
                          <DropdownItem onClick={(e) => { e.stopPropagation(); setDeleteTarget(canvas); setMenuOpenId(null); }}>
                            <Trash2 style={{ width: 14, height: 14 }} />
                            Delete
                          </DropdownItem>
                        </CardDropdown>
                      )}
                    </CardWrapper>
                  </motion.div>
                ))}
              </CardsGrid>
            ) : (
              <EmptyState>
                <EmptyIcon />
                <EmptyText>No canvases found</EmptyText>
                <NewButton onClick={() => setShowCreateModal(true)}>
                  <Plus style={{ height: 16, width: 16 }} />
                  Create your first canvas
                </NewButton>
              </EmptyState>
            )}
          </CenterContent>
        </CenterPanel>

        <AIAssistantSidebar title="Dashboard Assistant" />
      </ContentLayout>

      <CreateCanvasModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onCreated={(canvas) => {
          refreshCanvases();
          navigate(`/dashboard/${canvas.id}`);
        }}
      />

      {/* Delete confirmation dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) setDeleteTarget(null); }} title="Delete Canvas">
        <DialogContent style={{ maxWidth: '400px' }}>
          <DialogDescription>
            Are you sure you want to delete "{deleteTarget?.title}"? This action cannot be undone.
          </DialogDescription>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button
              style={{ backgroundColor: colors.destructive, color: colors.white }}
              onClick={handleDelete}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}
