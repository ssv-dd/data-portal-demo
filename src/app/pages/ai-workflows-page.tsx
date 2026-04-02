import { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { staggerContainer, staggerItem, fadeInUp } from '@/app/lib/motion';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import {
  Search, Plus, Zap, Play, Pause, Clock, AlertCircle, Square,
  Calendar, ChevronRight, MoreVertical, Users, RefreshCw, GitBranch, Wand2,
  Sparkles, BarChart3,
} from 'lucide-react';
import { AIAssistantSidebar } from '../components/ai-assistant-sidebar';
import { LeftPanel } from '../components/layout/left-panel';
import { WorkflowNodesPanel } from '../components/panels/workflow-nodes-panel';
import { mockWorkflows, templates, statusConfig } from '../data/mock/workflows-data';
import { GradientOrb } from '../components/hero/gradient-orb';
import { Theme } from '@doordash/prism-react';
import { colors, glassPanel, radius } from '@/styles/theme';
import { appConfig } from '@/config/app.config';

/* ─── Page Shell ─── */

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
  padding: ${Theme.usage.space.large} ${Theme.usage.space.xLarge};
`;

/* ─── Right Panel (Stats + AI tabs) ─── */

const RightPanel = styled.div`
  width: 340px;
  min-width: 300px;
  ${glassPanel}
  border-radius: ${Theme.usage.borderRadius.xLarge};
  border: 1px solid ${colors.border};
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const RightPanelTabs = styled.div`
  display: flex;
  border-bottom: 1px solid ${colors.border};
  flex-shrink: 0;
`;

const RightPanelTab = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: ${Theme.usage.space.small};
  font-size: ${Theme.usage.fontSize.xxSmall};
  font-weight: ${({ $active }) => ($active ? '600' : '400')};
  color: ${({ $active }) => ($active ? colors.violet600 : colors.mutedForeground)};
  background: transparent;
  border: none;
  border-bottom: 2px solid ${({ $active }) => ($active ? colors.violet600 : 'transparent')};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: color 150ms;

  &:hover {
    color: ${({ $active }) => ($active ? colors.violet600 : colors.foreground)};
  }
`;

const RightPanelContent = styled.div`
  flex: 1;
  overflow: auto;
`;

const StatsPanel = styled.div`
  padding: ${Theme.usage.space.medium};
  display: flex;
  flex-direction: column;
  gap: ${Theme.usage.space.small};
`;

const StatRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${Theme.usage.space.small};
  background: rgb(var(--app-surface-rgb) / 0.4);
  border: 1px solid ${colors.border};
  border-radius: ${radius.lg};
`;

const StatRowLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.small};
`;

const StatIconBox = styled.div<{ $color: string }>`
  width: 32px;
  height: 32px;
  border-radius: ${radius.md};
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ $color }) => `${$color}15`};
`;

const StatRowLabel = styled.span`
  font-size: ${Theme.usage.fontSize.xxSmall};
  color: ${colors.mutedForeground};
`;

const StatRowValue = styled.span`
  font-size: ${Theme.usage.fontSize.medium};
  font-weight: 700;
  color: ${colors.foreground};
`;

const StatsSectionTitle = styled.div`
  font-size: ${Theme.usage.fontSize.xxSmall};
  font-weight: 600;
  color: ${colors.mutedForeground};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: ${Theme.usage.space.xxSmall};
`;

/* ─── Hero Entry Cards ─── */

const HeroRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${Theme.usage.space.small};
  margin-bottom: ${Theme.usage.space.large};
`;

const HeroCard = styled.button`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: ${Theme.usage.space.medium};
  background: rgb(var(--app-surface-rgb) / 0.4);
  border: 1px solid ${colors.border};
  border-radius: ${radius['2xl']};
  cursor: pointer;
  transition: all 200ms;
  text-align: left;

  &:hover {
    border-color: ${colors.violet500};
    box-shadow: 0 4px 16px rgb(var(--app-violet-rgb) / 0.08);
    transform: translateY(-2px);
  }
`;

const HeroIconBox = styled.div<{ $bg?: string }>`
  width: 36px;
  height: 36px;
  border-radius: ${radius.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ $bg }) => $bg ?? 'rgb(var(--app-violet-rgb) / 0.1)'};
  margin-bottom: ${Theme.usage.space.small};
`;

const HeroTitle = styled.span`
  font-size: ${Theme.usage.fontSize.xSmall};
  font-weight: 600;
  color: ${colors.foreground};
  margin-bottom: 2px;
`;

const HeroDesc = styled.span`
  font-size: ${Theme.usage.fontSize.xxSmall};
  color: ${colors.mutedForeground};
  line-height: 1.4;
`;

/* ─── Workflow Tabs ─── */

const TabBar = styled.div`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xSmall};
  margin-bottom: ${Theme.usage.space.medium};
  border-bottom: 1px solid ${colors.border};
`;

const WfTab = styled.button<{ $active: boolean }>`
  padding: ${Theme.usage.space.small} ${Theme.usage.space.medium};
  font-size: ${Theme.usage.fontSize.xSmall};
  font-weight: ${({ $active }) => ($active ? '600' : '400')};
  color: ${({ $active }) => ($active ? colors.violet600 : colors.mutedForeground)};
  background: transparent;
  border: none;
  border-bottom: 2px solid ${({ $active }) => ($active ? colors.violet600 : 'transparent')};
  cursor: pointer;
  margin-bottom: -1px;
  transition: color 150ms;
  white-space: nowrap;

  &:hover {
    color: ${({ $active }) => ($active ? colors.violet600 : colors.foreground)};
  }
`;

/* ─── Actions Bar ─── */

const ActionsBar = styled.div`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.small};
  margin-bottom: ${Theme.usage.space.medium};
`;

const SearchWrapper = styled.div`
  flex: 1;
  position: relative;
`;

const SearchIconStyled = styled(Search)`
  position: absolute;
  left: ${Theme.usage.space.small};
  top: 50%;
  transform: translateY(-50%);
  width: 14px;
  height: 14px;
  color: rgb(var(--app-muted-fg-rgb) / 0.5);
`;

const StatusFilterRow = styled.div`
  display: flex;
  gap: 4px;
`;

/* ─── Workflow Cards (Modernized) ─── */

const WorkflowList = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: ${Theme.usage.space.xSmall};
`;

const WorkflowCard = styled(motion.div)`
  background: rgb(var(--app-surface-rgb) / 0.4);
  border: 1px solid ${colors.border};
  border-radius: ${radius['2xl']};
  padding: ${Theme.usage.space.medium} ${Theme.usage.space.large};
  cursor: pointer;
  transition: all 200ms;

  &:hover {
    border-color: rgb(var(--app-violet-rgb) / 0.2);
    box-shadow: 0 2px 12px rgb(var(--app-overlay-rgb) / 0.06);
  }
`;

const CardTopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${Theme.usage.space.xxSmall};
`;

const CardTitleGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.small};
  min-width: 0;
`;

const CardTitle = styled.h3`
  font-size: ${Theme.usage.fontSize.xSmall};
  font-weight: 600;
  color: ${colors.foreground};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const StatusBadge = styled.span<{ $color: string; $bg: string; $border: string }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: 9999px;
  font-size: 11px;
  font-weight: 500;
  color: ${({ $color }) => $color};
  background: ${({ $bg }) => $bg};
  border: 1px solid ${({ $border }) => $border};
  flex-shrink: 0;
`;

const CardRightGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.small};
  flex-shrink: 0;
`;

const CardActions = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const ActionBtn = styled.button<{ $variant?: 'danger' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: ${radius.md};
  border: 1px solid ${({ $variant }) => $variant === 'danger' ? 'rgb(239 68 68 / 0.2)' : colors.border};
  background: transparent;
  color: ${({ $variant }) => $variant === 'danger' ? '#ef4444' : colors.mutedForeground};
  cursor: pointer;
  transition: all 150ms;

  &:hover {
    background: ${({ $variant }) => $variant === 'danger' ? 'rgb(239 68 68 / 0.06)' : 'rgb(var(--app-overlay-rgb) / 0.06)'};
    color: ${({ $variant }) => $variant === 'danger' ? '#dc2626' : colors.foreground};
  }
`;

const CardDescription = styled.p`
  font-size: ${Theme.usage.fontSize.xxSmall};
  color: ${colors.mutedForeground};
  margin-bottom: ${Theme.usage.space.xSmall};
  line-height: 1.4;
`;

const CardMeta = styled.div`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.medium};
  font-size: 11px;
  color: rgb(var(--app-muted-fg-rgb) / 0.6);
`;

const MetaItem = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
`;

const OwnerTag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-size: 11px;
  color: ${colors.mutedForeground};
  background: rgb(var(--app-overlay-rgb) / 0.06);
  padding: 1px 6px;
  border-radius: 9999px;
`;

/* ─── Component ─── */

const MY_TEAM = 'Data Platform';

type WorkflowTabKey = 'all' | 'mine' | 'team';

export function AIWorkflowsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'paused' | 'failed'>('all');
  const [workflowTab, setWorkflowTab] = useState<WorkflowTabKey>('all');
  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [leftTab, setLeftTab] = useState('workflows');
  const [rightTab, setRightTab] = useState<'assistant' | 'overview'>('assistant');

  const tabFiltered = mockWorkflows.filter((wf) => {
    if (workflowTab === 'mine') return wf.owner === appConfig.user.name;
    if (workflowTab === 'team') return wf.team === MY_TEAM;
    return true;
  });

  const filteredWorkflows = tabFiltered.filter((wf) => {
    const matchesSearch = wf.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wf.description.toLowerCase().includes(searchTerm.toLowerCase());
    if (statusFilter === 'all') return matchesSearch;
    return matchesSearch && wf.status === statusFilter;
  });

  const counts = {
    all: tabFiltered.length,
    active: tabFiltered.filter(w => w.status === 'active').length,
    paused: tabFiltered.filter(w => w.status === 'paused').length,
    failed: tabFiltered.filter(w => w.status === 'failed').length,
  };

  const globalCounts = {
    all: mockWorkflows.length,
    active: mockWorkflows.filter(w => w.status === 'active').length,
    paused: mockWorkflows.filter(w => w.status === 'paused').length,
    failed: mockWorkflows.filter(w => w.status === 'failed').length,
    completed: mockWorkflows.filter(w => w.status === 'completed').length,
  };

  return (
    <PageContainer>
      <GradientOverlay />
      <GradientOrb variant="primary" style={{ left: '-120px', top: '-20px' }} />
      <GradientOrb variant="secondary" style={{ right: '-80px', top: '120px' }} />

      <ContentLayout>
        <LeftPanel
          tabs={[
            { key: 'workflows', label: 'Workflows', icon: GitBranch },
            { key: 'nodes', label: 'Nodes', icon: Wand2 },
          ]}
          activeTab={leftTab}
          onTabChange={setLeftTab}
          collapsed={!leftPanelOpen}
          onToggleCollapse={() => setLeftPanelOpen(!leftPanelOpen)}
          showSearch={true}
          searchPlaceholder="Search workflows..."
        >
          <WorkflowNodesPanel activeTab={leftTab} />
        </LeftPanel>

        <CenterPanel>
          <CenterContent>
            {/* Entry Points */}
            <motion.div variants={fadeInUp} initial="hidden" animate="visible">
              <HeroRow>
                <HeroCard>
                  <HeroIconBox>
                    <Plus style={{ width: 18, height: 18, color: colors.violet600 }} />
                  </HeroIconBox>
                  <HeroTitle>Create from Scratch</HeroTitle>
                  <HeroDesc>Start a blank workflow with drag-and-drop nodes</HeroDesc>
                </HeroCard>
                <HeroCard>
                  <HeroIconBox $bg="linear-gradient(135deg, rgb(var(--app-purple-rgb) / 0.15), rgb(var(--app-fuchsia-rgb) / 0.1))">
                    <Sparkles style={{ width: 18, height: 18, color: colors.violet600 }} />
                  </HeroIconBox>
                  <HeroTitle>Create with AI</HeroTitle>
                  <HeroDesc>Describe what you need and AI builds it for you</HeroDesc>
                </HeroCard>
                <HeroCard>
                  <HeroIconBox $bg="rgb(var(--app-blue-rgb, 59 130 246) / 0.1)">
                    <BarChart3 style={{ width: 18, height: 18, color: '#3b82f6' }} />
                  </HeroIconBox>
                  <HeroTitle>Browse Templates</HeroTitle>
                  <HeroDesc>Pick from {templates.length} ready-made workflow templates</HeroDesc>
                </HeroCard>
              </HeroRow>
            </motion.div>

            {/* Workflow Tabs */}
            <TabBar>
              <WfTab $active={workflowTab === 'all'} onClick={() => setWorkflowTab('all')}>
                All ({mockWorkflows.length})
              </WfTab>
              <WfTab $active={workflowTab === 'mine'} onClick={() => setWorkflowTab('mine')}>
                My Workflows ({mockWorkflows.filter(w => w.owner === appConfig.user.name).length})
              </WfTab>
              <WfTab $active={workflowTab === 'team'} onClick={() => setWorkflowTab('team')}>
                My Team ({mockWorkflows.filter(w => w.team === MY_TEAM).length})
              </WfTab>
            </TabBar>

            {/* Search + Status Filter */}
            <ActionsBar>
              <SearchWrapper>
                <SearchIconStyled />
                <Input
                  placeholder="Search workflows..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ paddingLeft: '36px', height: '34px', fontSize: '13px', backgroundColor: 'rgb(var(--app-surface-rgb) / 0.5)', borderColor: colors.border }}
                />
              </SearchWrapper>
              <StatusFilterRow>
                {(['all', 'active', 'paused', 'failed'] as const).map((f) => (
                  <Button
                    key={f}
                    variant="outline"
                    size="sm"
                    style={{
                      height: '34px',
                      fontSize: '12px',
                      ...(statusFilter === f ? { backgroundColor: 'rgb(var(--app-violet-rgb) / 0.06)', color: colors.violet600, borderColor: colors.violet500 } : {}),
                    }}
                    onClick={() => setStatusFilter(f)}
                  >
                    {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)} ({counts[f]})
                  </Button>
                ))}
              </StatusFilterRow>
            </ActionsBar>

            {/* Workflow List */}
            {filteredWorkflows.length > 0 ? (
              <WorkflowList variants={staggerContainer} initial="hidden" animate="visible">
                {filteredWorkflows.map((wf) => {
                  const st = statusConfig[wf.status];
                  const StIcon = st.icon;
                  return (
                    <WorkflowCard key={wf.id} variants={staggerItem}>
                      <CardTopRow>
                        <CardTitleGroup>
                          <CardTitle>{wf.title}</CardTitle>
                          {wf.shared && <Users style={{ width: 13, height: 13, color: 'rgb(var(--app-muted-fg-rgb) / 0.5)' }} />}
                        </CardTitleGroup>
                        <CardRightGroup>
                          <CardActions>
                            {wf.status === 'active' && (
                              <ActionBtn title="Pause"><Pause style={{ width: 13, height: 13 }} /></ActionBtn>
                            )}
                            {wf.status === 'paused' && (
                              <ActionBtn title="Resume"><Play style={{ width: 13, height: 13 }} /></ActionBtn>
                            )}
                            {wf.status === 'failed' && (
                              <ActionBtn title="Retry"><RefreshCw style={{ width: 13, height: 13 }} /></ActionBtn>
                            )}
                            {(wf.status === 'active' || wf.status === 'paused') && (
                              <ActionBtn $variant="danger" title="Stop"><Square style={{ width: 11, height: 11 }} /></ActionBtn>
                            )}
                            <ActionBtn title="More options"><MoreVertical style={{ width: 13, height: 13 }} /></ActionBtn>
                          </CardActions>
                          <StatusBadge $color={st.color} $bg={st.bg} $border={st.borderColor}>
                            <StIcon style={{ width: 11, height: 11 }} />
                            {st.label}
                          </StatusBadge>
                        </CardRightGroup>
                      </CardTopRow>
                      <CardDescription>{wf.description}</CardDescription>
                      <CardMeta>
                        <MetaItem><Calendar style={{ width: 11, height: 11 }} /> {wf.schedule}</MetaItem>
                        <MetaItem><Clock style={{ width: 11, height: 11 }} /> {wf.lastRun}</MetaItem>
                        {wf.nextRun && <MetaItem><RefreshCw style={{ width: 11, height: 11 }} /> {wf.nextRun}</MetaItem>}
                        <MetaItem>{wf.steps} steps</MetaItem>
                        <MetaItem>{wf.successRate}</MetaItem>
                        <OwnerTag><Users style={{ width: 10, height: 10 }} /> {wf.owner}</OwnerTag>
                        {wf.team && <OwnerTag>{wf.team}</OwnerTag>}
                      </CardMeta>
                    </WorkflowCard>
                  );
                })}
              </WorkflowList>
            ) : (
              <div style={{ textAlign: 'center', padding: '64px 0', color: colors.mutedForeground }}>
                <Zap style={{ width: 40, height: 40, color: 'rgb(var(--app-muted-fg-rgb) / 0.4)', marginBottom: '12px' }} />
                <p>No workflows match your filters</p>
              </div>
            )}
          </CenterContent>
        </CenterPanel>

        {/* Right Panel: AI Assistant + Overview tabs */}
        <RightPanel>
          <RightPanelTabs>
            <RightPanelTab $active={rightTab === 'assistant'} onClick={() => setRightTab('assistant')}>
              <Sparkles style={{ width: 13, height: 13 }} />
              Assistant
            </RightPanelTab>
            <RightPanelTab $active={rightTab === 'overview'} onClick={() => setRightTab('overview')}>
              <BarChart3 style={{ width: 13, height: 13 }} />
              Overview
            </RightPanelTab>
          </RightPanelTabs>

          <RightPanelContent>
            {rightTab === 'assistant' ? (
              <AIAssistantSidebar
                title="Workflow Assistant"
                contextLabel="Workflows aware"
                knowledgeBaseId="workflows"
                welcomeMessage="Hi! I can help you create, schedule, and debug AI workflows."
                suggestions={[
                  { text: 'Create a scheduled report' },
                  { text: 'Set up an anomaly alert' },
                  { text: 'Debug a failed workflow' },
                  { text: 'Chain SQL + notebook' },
                ]}
                suggestedActions={['Schedule workflow', 'Add trigger', 'View logs']}
              />
            ) : (
              <StatsPanel>
                <StatsSectionTitle>Workflow Health</StatsSectionTitle>
                {[
                  { label: 'Total Workflows', value: globalCounts.all, icon: Zap, color: '#FF3A00' },
                  { label: 'Active', value: globalCounts.active, icon: Play, color: '#10b981' },
                  { label: 'Paused', value: globalCounts.paused, icon: Pause, color: '#f59e0b' },
                  { label: 'Failed', value: globalCounts.failed, icon: AlertCircle, color: '#ef4444' },
                  { label: 'Completed', value: globalCounts.completed, icon: Zap, color: '#3b82f6' },
                ].map((stat) => (
                  <StatRow key={stat.label}>
                    <StatRowLeft>
                      <StatIconBox $color={stat.color}>
                        <stat.icon style={{ width: 15, height: 15, color: stat.color }} />
                      </StatIconBox>
                      <StatRowLabel>{stat.label}</StatRowLabel>
                    </StatRowLeft>
                    <StatRowValue>{stat.value}</StatRowValue>
                  </StatRow>
                ))}

                <div style={{ height: '1px', background: colors.border, margin: `${Theme.usage.space.small} 0` }} />

                <StatsSectionTitle>Recent Runs</StatsSectionTitle>
                {mockWorkflows.slice(0, 4).map((wf) => {
                  const st = statusConfig[wf.status];
                  return (
                    <div key={wf.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: `1px solid ${colors.border}` }}>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: '12px', fontWeight: 500, color: colors.foreground, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{wf.title}</div>
                        <div style={{ fontSize: '11px', color: colors.mutedForeground }}>{wf.lastRun}</div>
                      </div>
                      <StatusBadge $color={st.color} $bg={st.bg} $border={st.borderColor} style={{ fontSize: '10px', padding: '1px 6px' }}>
                        {st.label}
                      </StatusBadge>
                    </div>
                  );
                })}
              </StatsPanel>
            )}
          </RightPanelContent>
        </RightPanel>
      </ContentLayout>
    </PageContainer>
  );
}
