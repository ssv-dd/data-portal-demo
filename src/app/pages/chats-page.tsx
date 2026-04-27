import { useState } from 'react';
import { useNavigate } from 'react-router';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { ChevronLeft, Send, MessageSquare, Layers, BookOpen, Sparkles } from 'lucide-react';
import { ChatHistoryPanel } from '../components/home/chat-history-panel';
import { AnalysisResponse } from '../components/analysis-response';
import { Input } from '../components/ui/input';
import { chartData, summaryData } from '../data/mock/analysis-data';
import { appConfig } from '@/config/app.config';
import { colors, glassPanel, shadows } from '@/styles/theme';
import { Theme } from '@doordash/prism-react';

const PageContainer = styled.div`
  display: flex;
  flex-direction: row;
  height: 100%;
  min-height: 0;
  background: ${colors.background};
`;

const ChatColumn = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  background: ${colors.background};
`;

const ChatHeader = styled.div`
  padding: ${Theme.usage.space.large} ${Theme.usage.space.xLarge};
  border-bottom: 1px solid ${colors.border};
`;

const ChatHeaderInner = styled.div`
  max-width: 1280px;
  margin: 0 auto;
`;

const BackButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: ${Theme.usage.space.xSmall};
  color: ${colors.mutedForeground};
  margin-bottom: ${Theme.usage.space.medium};
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  font-size: ${Theme.usage.fontSize.xSmall};
  transition: color 150ms;

  &:hover {
    color: ${colors.foreground};
  }
`;

const ChatTitle = styled.h1`
  font-size: ${Theme.usage.fontSize.xxLarge};
  color: ${colors.foreground};
  margin: 0;
`;

const MessagesArea = styled.div`
  flex: 1;
  overflow: auto;
  padding: ${Theme.usage.space.large} ${Theme.usage.space.xLarge};
`;

const MessagesInner = styled.div`
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
  color: ${colors.foreground};
`;

const ChatFooter = styled.div`
  border-top: 1px solid ${colors.border};
  background-color: ${colors.background};
  padding: ${Theme.usage.space.medium} ${Theme.usage.space.xLarge};
`;

const ChatFooterInner = styled.div`
  max-width: 1280px;
  margin: 0 auto;
`;

const ChatBoxWrapper = styled.div`
  ${glassPanel}
  border: 1px solid ${colors.border};
  border-radius: ${Theme.usage.borderRadius.xLarge};
  padding: ${Theme.usage.space.medium};
  transition: box-shadow 200ms;

  &:hover {
    box-shadow: ${shadows.cardHover};
  }
`;

const InputWrapper = styled.div`
  position: relative;
  margin-bottom: ${Theme.usage.space.small};
`;

const StyledSparklesIcon = styled(Sparkles)`
  position: absolute;
  left: ${Theme.usage.space.medium};
  top: 50%;
  transform: translateY(-50%);
  width: 18px;
  height: 18px;
  color: ${colors.violet600};
`;

const StyledSendIcon = styled(Send)`
  position: absolute;
  right: ${Theme.usage.space.medium};
  top: 50%;
  transform: translateY(-50%);
  width: 18px;
  height: 18px;
  cursor: pointer;
  color: ${colors.violet600};
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
  background-color: ${({ $active }) => ($active ? colors.background : 'transparent')};
  color: ${({ $active }) => ($active ? colors.foreground : colors.mutedForeground)};
  box-shadow: ${({ $active }) => ($active ? shadows.sm : 'none')};
  transition: color 150ms, background-color 150ms;
`;

const PurposeToggleGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xSmall};
`;

const PurposeButton = styled.button<{ $active: boolean }>`
  padding: ${Theme.usage.space.xxSmall} ${Theme.usage.space.small};
  border-radius: ${Theme.usage.borderRadius.full};
  font-size: ${Theme.usage.fontSize.xSmall};
  font-weight: 500;
  border: 1px solid ${({ $active }) => ($active ? colors.foreground : colors.border)};
  cursor: pointer;
  background-color: ${({ $active }) => ($active ? colors.foreground : colors.background)};
  color: ${({ $active }) => ($active ? colors.background : colors.foreground)};
  text-transform: capitalize;
  transition: color 150ms, background-color 150ms;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 24px;
  color: ${colors.mutedForeground};
  text-align: center;
`;

const EmptyTitle = styled.p`
  font-size: ${Theme.usage.fontSize.large};
  color: ${colors.foreground};
  margin: 0 0 8px 0;
  font-weight: 500;
`;

const EmptyHint = styled.p`
  font-size: ${Theme.usage.fontSize.small};
  margin: 0;
`;

const DEFAULT_PROMPT = 'I want to run a deep-dive analysis on Dashpass growth for the past 60 days.';

export function ChatsPage() {
  const navigate = useNavigate();
  const [historyOpen, setHistoryOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [agentMode, setAgentMode] = useState<'chat' | 'hybrid' | 'notebook'>('chat');
  const [agentPurpose, setAgentPurpose] = useState<'analysis' | 'exploration' | 'reporting'>('analysis');
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([
    { role: 'user', content: DEFAULT_PROMPT },
    { role: 'assistant', content: 'analysis' },
  ]);
  const [activeTitle, setActiveTitle] = useState('DashPass growth deep-dive');

  const submitPrompt = () => {
    const text = searchTerm.trim();
    if (!text) return;
    setMessages((prev) => [...prev, { role: 'user', content: text }, { role: 'assistant', content: 'analysis' }]);
    setSearchTerm('');
  };

  const handleNewChat = () => {
    setMessages([]);
    setActiveTitle('New chat');
  };

  const handleConversationClick = (conversation: { id: string; title: string }) => {
    setActiveTitle(conversation.title);
    setMessages([
      { role: 'user', content: `Show me ${conversation.title}` },
      { role: 'assistant', content: 'analysis' },
    ]);
  };

  const greeting = (() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  })();

  return (
    <PageContainer>
      <ChatHistoryPanel
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        onOpen={() => setHistoryOpen(true)}
        onNewChat={handleNewChat}
        onConversationClick={handleConversationClick}
        inline
      />

      <ChatColumn>
        <ChatHeader>
          <ChatHeaderInner>
            <BackButton onClick={() => navigate('/')}>
              <ChevronLeft size={16} />
              Back to Home
            </BackButton>
            <ChatTitle>
              {messages.length > 0 ? activeTitle : `${greeting}, ${appConfig.user.name}`}
            </ChatTitle>
          </ChatHeaderInner>
        </ChatHeader>

        <MessagesArea>
          <MessagesInner>
            {messages.length === 0 ? (
              <EmptyState>
                <EmptyTitle>Start a new chat</EmptyTitle>
                <EmptyHint>Ask anything about your data, or pick a recent chat from the sidebar.</EmptyHint>
              </EmptyState>
            ) : (
              messages.map((message, idx) => (
                <div key={idx}>
                  {message.role === 'user' && (
                    <UserMessageRow>
                      <UserBubble>{message.content}</UserBubble>
                    </UserMessageRow>
                  )}
                  {message.role === 'assistant' && message.content === 'analysis' && (
                    <AnalysisResponse chartData={chartData} summaryData={summaryData} />
                  )}
                </div>
              ))
            )}
          </MessagesInner>
        </MessagesArea>

        <ChatFooter>
          <ChatFooterInner>
            <ChatBoxWrapper>
              <InputWrapper>
                <StyledSparklesIcon />
                <Input
                  placeholder="Prompt to explore your data"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && searchTerm.trim()) submitPrompt();
                  }}
                  style={{ paddingLeft: '44px', paddingRight: '44px', height: '44px', fontSize: '15px', borderColor: colors.border }}
                />
                <StyledSendIcon onClick={submitPrompt} />
              </InputWrapper>

              <ChatControls>
                <ModeToggleGroup>
                  {(['chat', 'hybrid', 'notebook'] as const).map((mode) => (
                    <ModeButton key={mode} $active={agentMode === mode} onClick={() => setAgentMode(mode)}>
                      {mode === 'chat' && <MessageSquare size={14} />}
                      {mode === 'hybrid' && <Layers size={14} />}
                      {mode === 'notebook' && <BookOpen size={14} />}
                      {mode.charAt(0).toUpperCase() + mode.slice(1)}
                    </ModeButton>
                  ))}
                </ModeToggleGroup>

                <PurposeToggleGroup>
                  {(['analysis', 'exploration', 'reporting'] as const).map((purpose) => (
                    <PurposeButton key={purpose} $active={agentPurpose === purpose} onClick={() => setAgentPurpose(purpose)}>
                      {purpose}
                    </PurposeButton>
                  ))}
                </PurposeToggleGroup>
              </ChatControls>
            </ChatBoxWrapper>
          </ChatFooterInner>
        </ChatFooter>
      </ChatColumn>
    </PageContainer>
  );
}
