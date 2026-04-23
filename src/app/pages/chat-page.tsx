import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import { Sparkles, ChevronLeft, Send, MessageSquare, Layers, BookOpen } from 'lucide-react';
import { AnalysisResponse } from '../components/analysis-response';
import { Input } from '../components/ui/input';
import { appConfig } from '@/config/app.config';
import { chartData, summaryData } from '../data/mock/analysis-data';
import { Theme } from '@doordash/prism-react';
import { colors, glassPanel, shadows } from '@/styles/theme';
import { ChatHistoryPanel } from '../components/home/chat-history-panel';

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

const PageContainer = styled.div`
  display: flex;
  height: 100%;
  background-color: ${colors.background};
  overflow: hidden;
  position: relative;
`;

const EmptyStateContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${Theme.usage.space.medium};
  padding: ${Theme.usage.space.xLarge};
`;

const EmptyStateIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: ${Theme.usage.borderRadius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${colors.violet600};
`;

const EmptyStateText = styled.p`
  text-align: center;
  color: ${colors.mutedForeground};
  font-size: ${Theme.usage.fontSize.medium};
  max-width: 400px;
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
  background: ${({ $active }) => $active ? colors.background : 'none'};
  color: ${({ $active }) => $active ? colors.foreground : colors.mutedForeground};
  box-shadow: ${({ $active }) => $active ? shadows.sm : 'none'};

  &:hover {
    color: ${colors.foreground};
  }
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
  background-color: ${({ $active }) => $active ? colors.foreground : colors.background};
  color: ${({ $active }) => $active ? colors.background : colors.foreground};
  border-color: ${({ $active }) => $active ? colors.foreground : colors.border};

  &:hover {
    background-color: ${({ $active }) => $active ? colors.foreground : 'rgb(var(--app-accent-rgb) / 0.4)'};
  }
`;

const ChatMessagesOverlay = styled(motion.div)`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
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
  margin: 0;
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

export function ChatPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState(EXAMPLE_PROMPT);
  const [agentMode, setAgentMode] = useState<'chat' | 'hybrid' | 'notebook'>('chat');
  const [agentPurpose, setAgentPurpose] = useState<'analysis' | 'exploration' | 'reporting'>('analysis');
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistoryOpen, setChatHistoryOpen] = useState(true);

  const hasMessages = messages.length > 0;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const submitPrompt = (customPrompt?: string) => {
    const userMessage = customPrompt || searchTerm;
    if (!userMessage.trim()) return;
    if (!chatHistoryOpen) setChatHistoryOpen(true);
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

  useEffect(() => {
    const state = location.state as { initialMessage?: string } | null;
    if (state?.initialMessage) {
      const userMessage = state.initialMessage;
      if (!chatHistoryOpen) setChatHistoryOpen(true);
      setMessages([{ role: 'user', content: userMessage }]);
      setIsLoading(true);
      setSearchTerm('');

      const timer = setTimeout(() => {
        setMessages([
          { role: 'user', content: userMessage },
          { role: 'assistant', content: 'analysis' },
        ]);
        setIsLoading(false);
      }, 2000);

      // Clear the state to prevent re-submission on re-render
      navigate(location.pathname, { replace: true, state: {} });

      return () => clearTimeout(timer);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleBackClick = () => {
    navigate('/');
  };

  const handleNewChat = () => {
    setMessages([]);
    setSearchTerm(EXAMPLE_PROMPT);
  };

  const handleConversationClick = (conversation: { id: string; title: string; group: string }) => {
    console.log('Loading conversation:', conversation.id);
    setMessages([
      { role: 'user', content: `Show me ${conversation.title}` },
      { role: 'assistant', content: 'analysis' },
    ]);
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
      <ChatHistoryPanel
        open={chatHistoryOpen}
        onClose={() => setChatHistoryOpen(false)}
        onOpen={() => setChatHistoryOpen(true)}
        onNewChat={handleNewChat}
        onConversationClick={handleConversationClick}
        inline
      />

      <ChatMessagesOverlay
        key="chat-messages"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        style={{ left: chatHistoryOpen ? '260px' : '48px' }}
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
            {!hasMessages && !isLoading && (
              <EmptyStateContainer>
                <EmptyStateIcon>
                  <Sparkles style={{ width: '24px', height: '24px', color: colors.white }} />
                </EmptyStateIcon>
                <EmptyStateText>
                  Start a conversation to explore your data with AI
                </EmptyStateText>
              </EmptyStateContainer>
            )}
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
    </PageContainer>
  );
}
