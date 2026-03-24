import { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'motion/react';
import { staggerContainer, staggerItem, fadeInUp } from '@/app/lib/motion';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Search, Plus, Grid2x2, FileText, Clock, Users, LayoutDashboard } from 'lucide-react';
import { useNavigate } from 'react-router';
import { AIAssistantSidebar } from '../components/ai-assistant-sidebar';
import { LeftPanel } from '../components/layout/left-panel';
import { DashboardLibraryPanel } from '../components/panels/dashboard-library-panel';
import { mockCanvases } from '../data/mock/canvas-data';
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

  &:hover {
    box-shadow: ${shadows.cardHover};
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: ${Theme.usage.space.small};
`;

const CardTitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xSmall};
`;

const CardTitle = styled.h3`
  font-weight: 500;
  color: ${colors.slate900};
`;

const CardDescription = styled.p`
  font-size: ${Theme.usage.fontSize.xSmall};
  color: ${colors.slate600};
  margin-bottom: ${Theme.usage.space.medium};
`;

const CardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: ${Theme.usage.fontSize.xxSmall};
  color: ${colors.slate600};
`;

const CardMeta = styled.div`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xxSmall};
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
  color: ${colors.slate600};
  margin-bottom: ${Theme.usage.space.medium};
`;

export function MyCanvasPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'mine' | 'shared'>('all');
  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [leftTab, setLeftTab] = useState('recent');
  const navigate = useNavigate();

  const filteredCanvases = mockCanvases.filter((canvas) => {
    const matchesSearch = canvas.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      canvas.description.toLowerCase().includes(searchTerm.toLowerCase());

    if (filter === 'mine') return matchesSearch && !canvas.shared;
    if (filter === 'shared') return matchesSearch && canvas.shared;
    return matchesSearch;
  });

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
          onDashboardClick={() => navigate('/dashboard/draft')}
        />
      </LeftPanel>

      <CenterPanel>
        <CenterContent>
          <motion.div variants={fadeInUp} initial="hidden" animate="visible">
            <PageHeader>
              <TitleRow>
                <Grid2x2 style={{ width: '24px', height: '24px', color: colors.violet600 }} />
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
            <NewButton onClick={() => navigate('/dashboard/draft')}>
              <Plus style={{ height: '16px', width: '16px' }} />
              New Canvas
            </NewButton>
          </ActionsBar>

          <FilterRow>
            <Button
              variant="outline"
              size="sm"
              style={filter === 'all' ? { backgroundColor: colors.muted, color: colors.foreground } : {}}
              onClick={() => { setFilter('all'); setLeftTab('recent'); }}
            >
              All
            </Button>
            <Button
              variant="outline"
              size="sm"
              style={filter === 'mine' ? { backgroundColor: colors.muted, color: colors.foreground } : {}}
              onClick={() => { setFilter('mine'); setLeftTab('templates'); }}
            >
              My Canvases
            </Button>
            <Button
              variant="outline"
              size="sm"
              style={filter === 'shared' ? { backgroundColor: colors.muted, color: colors.foreground } : {}}
              onClick={() => { setFilter('shared'); setLeftTab('shared'); }}
            >
              Shared with me
            </Button>
          </FilterRow>

          {filteredCanvases.length > 0 ? (
            <CardsGrid variants={staggerContainer} initial="hidden" animate="visible">
              {filteredCanvases.map((canvas) => (
                <motion.div variants={staggerItem} key={canvas.id}>
                  <CardWrapper onClick={() => navigate('/dashboard/draft')}>
                    <CardHeader>
                      <CardTitleRow>
                        <FileText style={{ width: '20px', height: '20px', color: 'rgb(var(--app-muted-fg-rgb) / 0.6)' }} />
                        <CardTitle>{canvas.title}</CardTitle>
                      </CardTitleRow>
                      {canvas.shared && (
                        <Users style={{ width: '16px', height: '16px', color: 'rgb(var(--app-muted-fg-rgb) / 0.6)' }} />
                      )}
                    </CardHeader>
                    <CardDescription>{canvas.description}</CardDescription>
                    <CardFooter>
                      <CardMeta>
                        <Clock style={{ width: '12px', height: '12px' }} />
                        <span>{canvas.lastEdited}</span>
                      </CardMeta>
                      <span>{canvas.metrics} metrics</span>
                    </CardFooter>
                  </CardWrapper>
                </motion.div>
              ))}
            </CardsGrid>
          ) : (
            <EmptyState>
              <EmptyIcon />
              <EmptyText>No canvases found</EmptyText>
              <NewButton onClick={() => navigate('/dashboard/draft')}>
                <Plus style={{ height: '16px', width: '16px' }} />
                Create your first canvas
              </NewButton>
            </EmptyState>
          )}
        </CenterContent>
      </CenterPanel>

      <AIAssistantSidebar title="Dashboard Assistant" />
      </ContentLayout>
    </PageContainer>
  );
}
