import { useState } from 'react';
import { useNavigate } from 'react-router';
import styled, { css, keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ChevronLeft, Send, MessageSquare, Layers, BookOpen } from 'lucide-react';
import { GradientOrb } from '../components/hero/gradient-orb';
import { HeroPanel } from '../components/hero/hero-panel';
import { YourWorkCard, type RecentWorkItem, type QuickAction } from '../components/home/your-work-card';
import { DiscoveryCard } from '../components/home/discovery-card';
import { WatchlistTable } from '../components/home/watchlist-table';
import { productAreas } from '../data/mock/scorecard-data';
import { AnalysisResponse } from '../components/analysis-response';
import { Input } from '../components/ui/input';
import { appConfig } from '@/config/app.config';
import { discoveryFeed, quickActions } from '../data/mock/home-data';
import { recentWork } from '../data/mock/recent-work-data';
import { quickPrompts } from '../data/mock/quick-prompts-data';
import { chartData, summaryData } from '../data/mock/analysis-data';
import { Theme } from '@doordash/prism-react';
import { colors, glassPanel, shadows } from '@/styles/theme';

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

const PageContainer = styled.div`
  min-height: 100vh;
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

const ContentLayer = styled.div`
  position: relative;
  z-index: 10;
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

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xSmall};
  color: ${colors.mutedForeground};
  margin-bottom: ${Theme.usage.space.medium};
  transition: color 150ms, background-color 150ms;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;

  &:hover {
    color: ${colors.foreground};
  }
`;

const BackText = styled.span`
  font-size: ${Theme.usage.fontSize.xSmall};
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

const CenteredHint = styled.p`
  text-align: center;
  color: ${colors.mutedForeground};
  font-size: ${Theme.usage.fontSize.xSmall};
  margin-top: ${Theme.usage.space.medium};
`;

const ChatBoxWrapper = styled.div`
  ${glassPanel}
  border: 1px solid ${colors.border};
  border-radius: ${Theme.usage.borderRadius.xLarge};
  padding: ${Theme.usage.space.large};
  transition: box-shadow 200ms;

  &:hover {
    box-shadow: ${shadows.cardHover};
  }
`;

const InputWrapper = styled.div`
  position: relative;
  margin-bottom: ${Theme.usage.space.medium};
`;

const StyledSparklesIcon = styled(Sparkles)`
  position: absolute;
  left: ${Theme.usage.space.medium};
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  color: ${colors.violet600};
`;

const StyledSendIcon = styled(Send)`
  position: absolute;
  right: ${Theme.usage.space.medium};
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  cursor: pointer;
  color: ${colors.violet600};
  transition: color 150ms, background-color 150ms;

  &:hover {
    color: ${colors.violet700 ?? '#6d28d9'};
  }
`;

const ChatControls = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ModeToggleGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xxSmall};
  background-color: ${colors.muted};
  padding: ${Theme.usage.space.xxSmall};
  border-radius: ${Theme.usage.borderRadius.xLarge};
`;

const ModeButton = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xSmall};
  padding: ${Theme.usage.space.xSmall} ${Theme.usage.space.medium};
  border-radius: ${Theme.usage.borderRadius.large};
  font-size: ${Theme.usage.fontSize.xSmall};
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: color 150ms, background-color 150ms;

  ${({ $active }) => $active ? css`
    background-color: ${colors.background};
    color: ${colors.foreground};
    box-shadow: ${shadows.sm};
  ` : css`
    background: none;
    color: ${colors.mutedForeground};
    &:hover { color: ${colors.foreground}; }
  `}
`;

const PurposeToggleGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xSmall};
`;

const PurposeButton = styled.button<{ $active: boolean }>`
  padding: ${Theme.usage.space.small};
  padding-top: ${Theme.usage.space.xxSmall};
  padding-bottom: ${Theme.usage.space.xxSmall};
  border-radius: ${Theme.usage.borderRadius.full};
  font-size: ${Theme.usage.fontSize.xSmall};
  font-weight: 500;
  border: 1px solid;
  cursor: pointer;
  transition: color 150ms, background-color 150ms;
  text-transform: capitalize;

  ${({ $active }) => $active ? css`
    background-color: ${colors.foreground};
    color: ${colors.background};
    border-color: ${colors.foreground};
  ` : css`
    background-color: ${colors.background};
    color: ${colors.foreground};
    border-color: ${colors.border};
    &:hover { background-color: rgb(var(--app-accent-rgb) / 0.4); }
  `}
`;

const ChatMessagesOverlay = styled(motion.div)`
  position: absolute;
  inset: 0;
  z-index: 20;
  background-color: ${colors.background};
  display: flex;
  flex-direction: column;
`;

const ChatHeader = styled.div`
  padding: ${Theme.usage.space.large} ${Theme.usage.space.xLarge};
  border-bottom: 1px solid ${colors.border};
`;

const ChatHeaderInner = styled.div`
  max-width: 1280px;
  margin: 0 auto;
`;

const ChatTitle = styled.h1`
  font-size: ${Theme.usage.fontSize.xxLarge};
  color: ${colors.foreground};
`;

const ChatMessagesArea = styled.div`
  flex: 1;
  overflow: auto;
  padding: ${Theme.usage.space.large} ${Theme.usage.space.xLarge};
`;

const ChatMessagesInner = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: ${Theme.usage.space.large};
`;

const UserMessageRow = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: ${Theme.usage.space.large};
`;

const UserBubble = styled.div`
  background-color: ${colors.muted};
  border-radius: ${Theme.usage.borderRadius.large};
  padding: ${Theme.usage.space.small} ${Theme.usage.space.medium};
  max-width: 768px;
`;

const UserBubbleText = styled.p`
  color: ${colors.foreground};
`;

const LoadingRow = styled.div`
  display: flex;
  justify-content: flex-start;
`;

const LoadingInner = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${Theme.usage.space.small};
`;

const AvatarCircle = styled.div`
  width: 32px;
  height: 32px;
  border-radius: ${Theme.usage.borderRadius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${colors.violet600};
`;

const LoadingBubble = styled.div`
  background-color: rgb(var(--app-muted-rgb) / 0.5);
  border-radius: ${Theme.usage.borderRadius.large};
  padding: ${Theme.usage.space.small} ${Theme.usage.space.medium};
`;

const DotsContainer = styled.div`
  display: flex;
  gap: ${Theme.usage.space.xxSmall};
`;

const PulseDot = styled.div`
  width: 4px;
  height: 4px;
  background-color: rgb(var(--app-muted-fg-rgb) / 0.4);
  border-radius: ${Theme.usage.borderRadius.full};
  animation: ${pulse} 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
`;

const ChatFooter = styled(motion.div)`
  border-top: 1px solid ${colors.border};
  background-color: ${colors.background};
  padding: ${Theme.usage.space.medium} ${Theme.usage.space.xLarge};
`;

const ChatFooterInner = styled.div`
  max-width: 1280px;
  margin: 0 auto;
`;

const ease = [0.4, 0, 0.2, 1] as const;

const EXAMPLE_PROMPT = 'I want to run a deep-dive analysis on Dashpass growth for the past 60 days.';

export function HomePage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState(EXAMPLE_PROMPT);
  const [agentMode, setAgentMode] = useState<'chat' | 'hybrid' | 'notebook'>('chat');
  const [agentPurpose, setAgentPurpose] = useState<'analysis' | 'exploration' | 'reporting'>('analysis');
  const [isChatCentered, setIsChatCentered] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);

  const hasMessages = messages.length > 0;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const handlePromptClick = (prompt: string) => {
    setSearchTerm(prompt);
    setIsChatCentered(true);
    setTimeout(() => submitPrompt(prompt), 100);
  };

  const submitPrompt = (customPrompt?: string) => {
    const userMessage = customPrompt || searchTerm;
    if (!userMessage.trim()) return;
    if (!isChatCentered) setIsChatCentered(true);
    setMessages([{ role: 'user', content: userMessage }]);
    setIsLoading(true);
    setSearchTerm('');
    setTimeout(() => {
      setMessages([
        { role: 'user', content: userMessage },
        { role: 'assistant', content: 'analysis' },
      ]);
      setIsLoading(false);
    }, 2000);
  };

  const handleBackClick = () => {
    setIsChatCentered(false);
    setMessages([]);
    setSearchTerm(EXAMPLE_PROMPT);
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

  const chatBox = (
    <ChatBoxWrapper>
      <InputWrapper>
        <StyledSparklesIcon />
        <Input
          placeholder="Prompt to explore your data"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && searchTerm.trim()) submitPrompt(); }}
          style={{ paddingLeft: '48px', height: '48px', fontSize: '16px', borderColor: colors.border }}
        />
        <StyledSendIcon onClick={() => submitPrompt()} />
      </InputWrapper>

      <ChatControls>
        <ModeToggleGroup>
          {(['chat', 'hybrid', 'notebook'] as const).map((mode) => (
            <ModeButton
              key={mode}
              $active={agentMode === mode}
              onClick={() => setAgentMode(mode)}
            >
              {mode === 'chat' && <MessageSquare style={{ width: '16px', height: '16px' }} />}
              {mode === 'hybrid' && <Layers style={{ width: '16px', height: '16px' }} />}
              {mode === 'notebook' && <BookOpen style={{ width: '16px', height: '16px' }} />}
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </ModeButton>
          ))}
        </ModeToggleGroup>

        <PurposeToggleGroup>
          {(['analysis', 'exploration', 'reporting'] as const).map((purpose) => (
            <PurposeButton
              key={purpose}
              $active={agentPurpose === purpose}
              onClick={() => setAgentPurpose(purpose)}
            >
              {purpose}
            </PurposeButton>
          ))}
        </PurposeToggleGroup>
      </ChatControls>
    </ChatBoxWrapper>
  );

  return (
    <PageContainer>
      <GradientOverlay />

      <GradientOrb variant="primary" style={{ left: '-120px', top: '-20px' }} />
      <GradientOrb variant="secondary" style={{ right: '-80px', top: '120px' }} />
      <GradientOrb variant="primary" style={{ left: '60%', top: '600px' }} />

      <ContentLayer
        style={{ display: hasMessages && isChatCentered ? 'none' : undefined }}
      >
        <ScrollContainer>
          <MaxWidthContainer>
            <AnimatePresence>
              {isChatCentered && !hasMessages && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <BackButton onClick={handleBackClick}>
                    <ChevronLeft style={{ width: '20px', height: '20px' }} />
                    <BackText>Back to Home</BackText>
                  </BackButton>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div
              animate={{ height: isChatCentered && !hasMessages ? 'calc(20vh)' : 0 }}
              transition={{ duration: 0.5, ease }}
            />

            <motion.div
              animate={{
                opacity: isChatCentered ? 0 : 1,
                height: isChatCentered ? 0 : 'auto',
              }}
              transition={{ duration: 0.4, ease }}
              style={{ overflow: 'hidden', pointerEvents: isChatCentered ? 'none' : 'auto' }}
            >
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
                  maxRows={5}
                  onViewFull={() => navigate('/dashboards')}
                />
              </SectionMarginBottom2>

              <BottomGrid>
                <YourWorkCard
                  recentItems={recentWork}
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
            </motion.div>

            <AnimatePresence>
              {isChatCentered && !hasMessages && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.4 }}
                >
                  {chatBox}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.3 }}
                  >
                    <CenteredHint>
                      Start typing to explore your data with AI
                    </CenteredHint>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </MaxWidthContainer>
        </ScrollContainer>
      </ContentLayer>

      <AnimatePresence>
        {isChatCentered && hasMessages && (
          <ChatMessagesOverlay
            key="chat-messages"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChatHeader>
              <ChatHeaderInner>
                <BackButton onClick={handleBackClick}>
                  <ChevronLeft style={{ width: '20px', height: '20px' }} />
                  <BackText>Back to Home</BackText>
                </BackButton>
                <ChatTitle>{getGreeting()}, {appConfig.user.name}</ChatTitle>
              </ChatHeaderInner>
            </ChatHeader>

            <ChatMessagesArea>
              <ChatMessagesInner>
                {messages.map((message, index) => (
                  <div key={index}>
                    {message.role === 'user' && (
                      <UserMessageRow>
                        <UserBubble>
                          <UserBubbleText>{message.content}</UserBubbleText>
                        </UserBubble>
                      </UserMessageRow>
                    )}
                    {message.role === 'assistant' && message.content === 'analysis' && <AnalysisResponse chartData={chartData} summaryData={summaryData} />}
                  </div>
                ))}
                {isLoading && (
                  <LoadingRow>
                    <LoadingInner>
                      <AvatarCircle>
                        <Sparkles style={{ width: '20px', height: '20px', color: colors.white }} />
                      </AvatarCircle>
                      <LoadingBubble>
                        <DotsContainer>
                          <PulseDot style={{ animationDelay: '0ms' }} />
                          <PulseDot style={{ animationDelay: '150ms' }} />
                          <PulseDot style={{ animationDelay: '300ms' }} />
                        </DotsContainer>
                      </LoadingBubble>
                    </LoadingInner>
                  </LoadingRow>
                )}
              </ChatMessagesInner>
            </ChatMessagesArea>

            <ChatFooter
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, ease }}
            >
              <ChatFooterInner>
                {chatBox}
              </ChatFooterInner>
            </ChatFooter>
          </ChatMessagesOverlay>
        )}
      </AnimatePresence>
    </PageContainer>
  );
}
