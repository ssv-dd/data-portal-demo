import { useState } from 'react';
import { useNavigate } from 'react-router';
import styled from 'styled-components';
import { GradientOrb } from '../components/hero/gradient-orb';
import { HeroPanel } from '../components/hero/hero-panel';
import { YourWorkCard, type RecentWorkItem, type QuickAction } from '../components/home/your-work-card';
import { DiscoveryCard } from '../components/home/discovery-card';
import { WatchlistTable } from '../components/home/watchlist-table';
import { productAreas } from '../data/mock/scorecard-data';
import { appConfig } from '@/config/app.config';
import { discoveryFeed, quickActions } from '../data/mock/home-data';
import { yourProjects, recentlyVisited } from '../data/mock/recent-work-data';
import { quickPrompts } from '../data/mock/quick-prompts-data';
import { Theme } from '@doordash/prism-react';
import { colors } from '@/styles/theme';
import { CustomizeWatchlistPanel } from '../components/home/customize-watchlist-panel';

const PageContainer = styled.div`
  min-height: 100vh;
  background-color: ${colors.background};
  overflow: hidden;
  position: relative;
  display: flex;
`;

const GradientOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at top left, rgb(var(--app-fuchsia-rgb) / 0.08), transparent 35%),
              radial-gradient(circle at bottom right, rgb(var(--app-blue-rgb) / 0.08), transparent 35%);
`;

const ContentLayer = styled.div`
  position: relative;
  z-index: 10;
  flex: 1;
  min-width: 0;
`;

const ScrollContainer = styled.div`
  overflow: auto;
  height: 100vh;
`;

const MaxWidthContainer = styled.div`
  max-width: 1600px;
  margin: 0 auto;
  padding: ${Theme.usage.space.xLarge};
`;

const SectionMarginBottom5 = styled.div`
  margin-bottom: 20px;
`;

const SectionMarginBottom2 = styled.div`
  margin-bottom: ${Theme.usage.space.xSmall};
`;

const BottomGrid = styled.div`
  display: grid;
  gap: ${Theme.usage.space.xSmall};

  @media (min-width: 1280px) {
    grid-template-columns: 0.85fr 1.15fr;
  }
`;

const EXAMPLE_PROMPT = 'I want to run a deep-dive analysis on Dashpass growth for the past 60 days.';

export function HomePage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState(EXAMPLE_PROMPT);
  const [agentMode, setAgentMode] = useState<'chat' | 'hybrid' | 'notebook'>('chat');
  const [agentPurpose, setAgentPurpose] = useState<'analysis' | 'exploration' | 'reporting'>('analysis');
  const [customizeWatchlistOpen, setCustomizeWatchlistOpen] = useState(false);

  // Get initial selected metrics from the Company area
  const companyArea = productAreas.find(area => area.id === 'company');
  const initialMetricIds = companyArea?.metrics.slice(0, 5).map(m => m.id) || [];
  const [selectedMetricIds, setSelectedMetricIds] = useState<string[]>(initialMetricIds);


  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const handlePromptClick = (prompt: string) => {
    setSearchTerm(prompt);
    submitPrompt(prompt);
  };

  const submitPrompt = (customPrompt?: string) => {
    const userMessage = customPrompt || searchTerm;
    if (!userMessage.trim()) return;
    // Navigate to chat page with the message
    navigate('/chat', { state: { initialMessage: userMessage } });
  };


  const handleRecentWorkClick = (item: RecentWorkItem) => {
    navigate(item.route);
  };

  const handleQuickAction = (action: QuickAction) => {
    if (action.route) {
      navigate(action.route);
    }
  };

  const handleDiscoveryItemClick = (item: typeof discoveryFeed.team[0]) => {
    if (item.route) {
      navigate(item.route);
    }
  };


  return (
    <PageContainer>
      <GradientOverlay />

      <GradientOrb variant="primary" style={{ left: '-120px', top: '-20px' }} />
      <GradientOrb variant="secondary" style={{ right: '-80px', top: '120px' }} />
      <GradientOrb variant="primary" style={{ left: '60%', top: '600px' }} />

      <ContentLayer>
        <ScrollContainer>
          <MaxWidthContainer>
              <SectionMarginBottom5>
                <HeroPanel
                  userName={appConfig.user.name}
                  greeting={getGreeting()}
                  prompts={quickPrompts}
                  searchTerm={searchTerm}
                  onSearchTermChange={setSearchTerm}
                  onSubmit={() => submitPrompt()}
                  onPromptClick={handlePromptClick}
                  agentMode={agentMode}
                  onAgentModeChange={setAgentMode}
                  agentPurpose={agentPurpose}
                  onAgentPurposeChange={setAgentPurpose}
                />
              </SectionMarginBottom5>

              <SectionMarginBottom2>
                <WatchlistTable
                  areas={productAreas}
                  selectedAreaIds={['company']}
                  selectedMetricIds={selectedMetricIds}
                  maxRows={5}
                  onCustomize={() => setCustomizeWatchlistOpen(true)}
                />
              </SectionMarginBottom2>

              <BottomGrid>
                <YourWorkCard
                  projects={yourProjects}
                  recentlyVisited={recentlyVisited}
                  quickActions={quickActions}
                  onItemClick={handleRecentWorkClick}
                  onActionClick={handleQuickAction}
                  variant="A"
                />
                <DiscoveryCard
                  {...discoveryFeed}
                  onItemClick={handleDiscoveryItemClick}
                />
              </BottomGrid>
          </MaxWidthContainer>
        </ScrollContainer>
      </ContentLayer>

      <CustomizeWatchlistPanel
        open={customizeWatchlistOpen}
        onClose={() => setCustomizeWatchlistOpen(false)}
        areas={productAreas}
        selectedMetricIds={selectedMetricIds}
        onSave={(newMetricIds) => {
          setSelectedMetricIds(newMetricIds);
          setCustomizeWatchlistOpen(false);
        }}
      />
    </PageContainer>
  );
}
