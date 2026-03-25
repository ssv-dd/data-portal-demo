import { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { staggerContainer, staggerItem, fadeInUp } from '@/app/lib/motion';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import {
  Search, Plus, Zap, Play, Pause, Clock, AlertCircle,
  Calendar, ChevronRight, MoreVertical, Users, RefreshCw, GitBranch, Wand2,
} from 'lucide-react';
import { AIAssistantSidebar } from '../components/ai-assistant-sidebar';
import { LeftPanel } from '../components/layout/left-panel';
import { WorkflowNodesPanel } from '../components/panels/workflow-nodes-panel';
import { mockWorkflows, templates, statusConfig } from '../data/mock/workflows-data';
import { GradientOrb } from '../components/hero/gradient-orb';
import { Theme } from '@doordash/prism-react';
import { colors, glassPanel, shadows } from '@/styles/theme';

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
  color: ${colors.slate900};
  font-weight: 600;
`;

const PageDescription = styled.p`
  color: ${colors.slate600};
`;

const StatsGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${Theme.usage.space.medium};
  margin-bottom: ${Theme.usage.space.xLarge};
`;

const StatCard = styled(motion.div)`
  background-color: rgb(var(--app-surface-rgb) / 0.4);
  border: 1px solid ${colors.border};
  border-radius: ${Theme.usage.borderRadius.xLarge};
  padding: ${Theme.usage.space.medium};
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.medium};
`;

const StatIconBox = styled.div<{ $color: string }>`
  width: 40px;
  height: 40px;
  border-radius: ${Theme.usage.borderRadius.large};
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ $color }) => `${$color}15`};
`;

const StatValue = styled.div`
  font-size: ${Theme.usage.fontSize.xxLarge};
  font-weight: 700;
  color: ${colors.slate900};
`;

const StatLabel = styled.div`
  font-size: ${Theme.usage.fontSize.xxSmall};
  color: ${colors.slate600};
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
  background-color: ${colors.white};
  border: 1px solid ${colors.slate200};
  padding: ${Theme.usage.space.xSmall} ${Theme.usage.space.medium};
  font-size: ${Theme.usage.fontSize.xSmall};
  font-weight: 600;
  color: ${colors.slate900};
  cursor: pointer;
  box-shadow: ${shadows.sm};
  transition: background-color 200ms;

  &:hover {
    background-color: ${colors.slate50};
  }
`;

const FilterRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xSmall};
  margin-bottom: ${Theme.usage.space.large};
`;

const WorkflowList = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: ${Theme.usage.space.small};
  margin-bottom: ${Theme.usage.space.xxLarge};
`;

const WorkflowCard = styled(motion.div)`
  background-color: rgb(var(--app-surface-rgb) / 0.4);
  border: 1px solid ${colors.border};
  border-radius: ${Theme.usage.borderRadius.xLarge};
  padding: 20px;
  cursor: pointer;
  transition: box-shadow 200ms;

  &:hover {
    box-shadow: ${shadows.cardHover};
  }
`;

const WorkflowRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
`;

const WorkflowContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const WorkflowTitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.small};
  margin-bottom: ${Theme.usage.space.xxSmall};
`;

const WorkflowTitle = styled.h3`
  font-weight: 500;
  color: ${colors.slate900};
`;

const WorkflowDescription = styled.p`
  font-size: ${Theme.usage.fontSize.xSmall};
  color: ${colors.mutedForeground};
  margin-bottom: ${Theme.usage.space.small};
`;

const WorkflowMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  font-size: ${Theme.usage.fontSize.xxSmall};
  color: ${colors.mutedForeground};
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xxSmall};
`;

const WorkflowActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xSmall};
  opacity: 0;
  transition: opacity 200ms;

  ${WorkflowCard}:hover & {
    opacity: 1;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 64px 0;
  background-color: rgb(var(--app-muted-rgb) / 0.5);
  border: 1px solid ${colors.border};
  border-radius: ${Theme.usage.borderRadius.xLarge};
  margin-bottom: ${Theme.usage.space.xxLarge};
`;

const EmptyIcon = styled(Zap)`
  width: 48px;
  height: 48px;
  margin: 0 auto ${Theme.usage.space.medium};
  color: rgb(var(--app-muted-fg-rgb) / 0.6);
`;

const EmptyText = styled.p`
  color: ${colors.slate600};
  margin-bottom: ${Theme.usage.space.medium};
`;

const TemplatesSection = styled.div``;

const TemplatesTitle = styled.h2`
  font-size: ${Theme.usage.fontSize.medium};
  color: ${colors.slate900};
  margin-bottom: ${Theme.usage.space.medium};
`;

const TemplatesGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${Theme.usage.space.medium};

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const TemplateCard = styled(motion.div)`
  border: 1px solid ${colors.border};
  border-radius: ${Theme.usage.borderRadius.xLarge};
  padding: 20px;
  background-color: rgb(var(--app-surface-rgb) / 0.4);
  cursor: pointer;
  transition: box-shadow 200ms;

  &:hover {
    box-shadow: ${shadows.cardHover};
  }
`;

const TemplateHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: ${Theme.usage.space.small};
`;

const TemplateIconBox = styled.div`
  width: 40px;
  height: 40px;
  border-radius: ${Theme.usage.borderRadius.large};
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgb(var(--app-violet-rgb) / 0.1);
`;

const TemplateBadge = styled.span`
  font-size: ${Theme.usage.fontSize.xxSmall};
  padding: ${Theme.usage.space.xxxSmall} ${Theme.usage.space.xSmall};
  border-radius: ${Theme.usage.borderRadius.full};
  background-color: ${colors.muted};
  color: ${colors.mutedForeground};
`;

const TemplateName = styled.h3`
  font-size: ${Theme.usage.fontSize.xSmall};
  font-weight: 500;
  color: ${colors.foreground};
  margin-bottom: ${Theme.usage.space.xxSmall};
`;

const TemplateDescription = styled.p`
  font-size: ${Theme.usage.fontSize.xxSmall};
  color: ${colors.mutedForeground};
  margin-bottom: ${Theme.usage.space.small};
`;

const TemplateFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const TemplateSteps = styled.span`
  font-size: ${Theme.usage.fontSize.xxSmall};
  color: rgb(var(--app-muted-fg-rgb) / 0.6);
`;

const TemplateAction = styled.span`
  font-size: ${Theme.usage.fontSize.xxSmall};
  font-weight: 500;
  color: ${colors.violet600};
  opacity: 0;
  transition: opacity 200ms;

  ${TemplateCard}:hover & {
    opacity: 1;
  }
`;

export function AIWorkflowsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'paused' | 'failed'>('all');
  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [leftTab, setLeftTab] = useState('workflows');

  const filteredWorkflows = mockWorkflows.filter((wf) => {
    const matchesSearch = wf.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wf.description.toLowerCase().includes(searchTerm.toLowerCase());
    if (filter === 'all') return matchesSearch;
    return matchesSearch && wf.status === filter;
  });

  const counts = {
    all: mockWorkflows.length,
    active: mockWorkflows.filter(w => w.status === 'active').length,
    paused: mockWorkflows.filter(w => w.status === 'paused').length,
    failed: mockWorkflows.filter(w => w.status === 'failed').length,
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
          <motion.div variants={fadeInUp} initial="hidden" animate="visible">
            <PageHeader>
              <TitleRow>
                <Zap style={{ width: '24px', height: '24px', color: colors.violet600 }} />
                <PageTitle>AI Workflows</PageTitle>
              </TitleRow>
              <PageDescription>
                Automate recurring data tasks — scheduled reports, alerts, pipelines, and AI analyses
              </PageDescription>
            </PageHeader>
          </motion.div>

          <StatsGrid variants={staggerContainer} initial="hidden" animate="visible">
            {[
              { label: 'Total Workflows', value: counts.all, icon: Zap, color: 'var(--dd-primary)' },
              { label: 'Active', value: counts.active, icon: Play, color: '#10b981' },
              { label: 'Paused', value: counts.paused, icon: Pause, color: '#f59e0b' },
              { label: 'Failed', value: counts.failed, icon: AlertCircle, color: '#ef4444' },
            ].map((stat) => (
              <StatCard key={stat.label} variants={staggerItem}>
                <StatIconBox $color={stat.color}>
                  <stat.icon style={{ width: '20px', height: '20px', color: stat.color }} />
                </StatIconBox>
                <div>
                  <StatValue>{stat.value}</StatValue>
                  <StatLabel>{stat.label}</StatLabel>
                </div>
              </StatCard>
            ))}
          </StatsGrid>

          <ActionsBar>
            <SearchWrapper>
              <SearchIcon />
              <Input
                placeholder="Search workflows..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ paddingLeft: '40px', backgroundColor: 'rgb(var(--app-surface-rgb) / 0.5)', borderColor: colors.border }}
              />
            </SearchWrapper>
            <NewButton>
              <Plus style={{ height: '16px', width: '16px' }} />
              New workflow
            </NewButton>
          </ActionsBar>

          <FilterRow>
            {(['all', 'active', 'paused', 'failed'] as const).map((f) => (
              <Button
                key={f}
                variant="outline"
                size="sm"
                style={filter === f ? { backgroundColor: colors.muted, color: colors.foreground } : {}}
                onClick={() => setFilter(f)}
              >
                {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)} ({counts[f]})
              </Button>
            ))}
          </FilterRow>

          {filteredWorkflows.length > 0 ? (
            <WorkflowList variants={staggerContainer} initial="hidden" animate="visible">
              {filteredWorkflows.map((workflow) => {
                const status = statusConfig[workflow.status];
                const StatusIcon = status.icon;
                return (
                  <WorkflowCard
                    key={workflow.id}
                    variants={staggerItem}
                  >
                    <WorkflowRow>
                      <WorkflowContent>
                        <WorkflowTitleRow>
                          <WorkflowTitle>{workflow.title}</WorkflowTitle>
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '2px 8px',
                              borderRadius: '9999px',
                              fontSize: '12px',
                              fontWeight: 500,
                              color: status.color,
                              backgroundColor: status.bg,
                              border: `1px solid ${status.borderColor}`,
                            }}
                          >
                            <StatusIcon style={{ width: '12px', height: '12px' }} />
                            {status.label}
                          </span>
                          {workflow.shared && <Users style={{ width: '14px', height: '14px', color: 'rgb(var(--app-muted-fg-rgb) / 0.6)' }} />}
                        </WorkflowTitleRow>
                        <WorkflowDescription>{workflow.description}</WorkflowDescription>
                        <WorkflowMeta>
                          <MetaItem>
                            <Calendar style={{ width: '12px', height: '12px' }} />
                            <span>{workflow.schedule}</span>
                          </MetaItem>
                          <MetaItem>
                            <Clock style={{ width: '12px', height: '12px' }} />
                            <span>Last run: {workflow.lastRun}</span>
                          </MetaItem>
                          {workflow.nextRun && (
                            <MetaItem>
                              <RefreshCw style={{ width: '12px', height: '12px' }} />
                              <span>Next: {workflow.nextRun}</span>
                            </MetaItem>
                          )}
                          <span>{workflow.steps} steps</span>
                          <span>Success rate: {workflow.successRate}</span>
                        </WorkflowMeta>
                      </WorkflowContent>
                      <WorkflowActions>
                        {workflow.status === 'active' && (
                          <Button variant="outline" size="sm" style={{ height: '28px', fontSize: '12px', gap: '4px' }}>
                            <Pause style={{ width: '12px', height: '12px' }} /> Pause
                          </Button>
                        )}
                        {workflow.status === 'paused' && (
                          <Button variant="outline" size="sm" style={{ height: '28px', fontSize: '12px', gap: '4px' }}>
                            <Play style={{ width: '12px', height: '12px' }} /> Resume
                          </Button>
                        )}
                        {workflow.status === 'failed' && (
                          <Button variant="outline" size="sm" style={{ height: '28px', fontSize: '12px', gap: '4px' }}>
                            <RefreshCw style={{ width: '12px', height: '12px' }} /> Retry
                          </Button>
                        )}
                        <Button variant="ghost" size="sm" style={{ height: '28px', width: '28px', padding: 0 }}>
                          <MoreVertical style={{ width: '16px', height: '16px', color: 'rgb(var(--app-muted-fg-rgb) / 0.6)' }} />
                        </Button>
                        <ChevronRight style={{ width: '16px', height: '16px', color: colors.border }} />
                      </WorkflowActions>
                    </WorkflowRow>
                  </WorkflowCard>
                );
              })}
            </WorkflowList>
          ) : (
            <EmptyState>
              <EmptyIcon />
              <EmptyText>No workflows match your search</EmptyText>
            </EmptyState>
          )}

          <TemplatesSection>
            <TemplatesTitle>Workflow Templates</TemplatesTitle>
            <TemplatesGrid variants={staggerContainer} initial="hidden" animate="visible">
              {templates.map((template) => (
                <TemplateCard
                  key={template.id}
                  variants={staggerItem}
                >
                  <TemplateHeader>
                    <TemplateIconBox>
                      <template.icon style={{ width: '20px', height: '20px', color: colors.violet600 }} />
                    </TemplateIconBox>
                    <TemplateBadge>{template.category}</TemplateBadge>
                  </TemplateHeader>
                  <TemplateName>{template.name}</TemplateName>
                  <TemplateDescription>{template.description}</TemplateDescription>
                  <TemplateFooter>
                    <TemplateSteps>{template.steps} steps</TemplateSteps>
                    <TemplateAction>
                      Use template →
                    </TemplateAction>
                  </TemplateFooter>
                </TemplateCard>
              ))}
            </TemplatesGrid>
          </TemplatesSection>
        </CenterContent>
      </CenterPanel>

      <AIAssistantSidebar
        title="Workflow Assistant"
        contextLabel="Workflows aware"
        knowledgeBaseId="workflows"
        welcomeMessage="Hi! I can help you create, schedule, and debug AI workflows. Ask me to set up alerts, automate reports, or chain data tasks."
        suggestions={[
          { text: 'Create a scheduled report' },
          { text: 'Set up an anomaly alert' },
          { text: 'Debug a failed workflow' },
          { text: 'Chain SQL + notebook' },
        ]}
        suggestedActions={['Schedule workflow', 'Add trigger', 'View logs']}
      />
      </ContentLayout>
    </PageContainer>
  );
}
