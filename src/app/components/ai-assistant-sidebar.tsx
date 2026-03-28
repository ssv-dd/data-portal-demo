import { useState, useRef, useEffect } from 'react';
import { ArrowUp, Sparkles, ChevronLeft, ChevronRight, MessageSquare, BookOpen, Plus, X } from 'lucide-react';
import { motion } from 'framer-motion';
import styled, { css } from 'styled-components';
import { Theme } from '@doordash/prism-react';
import { colors, shadows, glassPanelSubtle, glassPanelChat } from '@/styles/theme';
import { knowledgeBases, type KnowledgeBase } from '../data/mock/knowledge-bases-data';

interface SuggestionChip {
  text: string;
  icon?: React.ReactNode;
}

interface AIAssistantSidebarProps {
  title?: string;
  welcomeMessage?: string;
  suggestions?: SuggestionChip[];
  knowledgeBaseId?: string;
  onKnowledgeBaseChange?: (id: string) => void;
  suggestedActions?: string[];
  contextLabel?: string;
  collapsible?: boolean;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  className?: string;
}

/* ── Collapsed state ── */

const CollapsedPanel = styled(motion.div)`
  border-radius: ${Theme.usage.borderRadius.xLarge};
  display: flex;
  flex-direction: column;
  align-items: center;
  ${glassPanelSubtle}
  background-color: rgb(var(--app-violet-rgb) / 0.06);
`;

const CollapsedHeader = styled.div`
  padding: ${Theme.usage.space.small};
  width: 100%;
  display: flex;
  justify-content: center;
`;

const ToggleButton = styled.button`
  padding: ${Theme.usage.space.xxSmall};
  border-radius: ${Theme.usage.borderRadius.large};
  background: transparent;
  border: none;
  color: ${colors.mutedForeground};
  cursor: pointer;
  transition: all 200ms;

  &:hover {
    background-color: rgb(var(--app-violet-deep-rgb) / 0.06);
    color: ${colors.foreground};
  }
`;

const CollapsedBody = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

/* ── Expanded panel ── */

const ExpandedPanel = styled(motion.div)`
  border-radius: ${Theme.usage.borderRadius.xLarge};
  ${glassPanelChat}
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  transition: all 200ms;
`;

/* ── Header with tabs ── */

const PanelHeader = styled.div`
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 ${Theme.usage.space.small};
  flex-shrink: 0;
`;

const TabGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xxSmall};
  padding: ${Theme.usage.space.xxSmall};
  border-radius: ${Theme.usage.borderRadius.full};
  background-color: rgb(var(--app-violet-deep-rgb) / 0.06);
`;

const Tab = styled.button<{ $active: boolean }>`
  padding: ${Theme.usage.space.xxSmall} ${Theme.usage.space.small};
  font-size: ${Theme.usage.fontSize.xxSmall};
  font-weight: 500;
  border-radius: ${Theme.usage.borderRadius.full};
  border: none;
  cursor: pointer;
  transition: all 200ms;
  display: flex;
  align-items: center;
  gap: 4px;

  ${({ $active }) => $active ? css`
    background-color: rgb(var(--app-surface-rgb) / 0.9);
    color: ${colors.foreground};
    box-shadow: ${shadows.sm};
  ` : css`
    background: none;
    color: ${colors.mutedForeground};
    &:hover { color: ${colors.foreground}; }
  `}
`;

const CollapseButton = styled.button`
  padding: ${Theme.usage.space.xSmall};
  border-radius: ${Theme.usage.borderRadius.large};
  border: none;
  background: none;
  color: ${colors.mutedForeground};
  cursor: pointer;
  transition: background-color 150ms;

  &:hover {
    background-color: rgb(var(--app-overlay-rgb) / 0.04);
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

/* ── Chat body ── */

const ChatBody = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
`;

const ChatMessages = styled.div`
  flex: 1;
  overflow: auto;
  padding: ${Theme.usage.space.large} ${Theme.usage.space.medium};
  display: flex;
  flex-direction: column;
`;

const ChatCenter = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const ChatIconBox = styled.div`
  width: 48px;
  height: 48px;
  border-radius: ${Theme.usage.borderRadius.xLarge};
  background: linear-gradient(to bottom right, rgb(var(--app-violet-deep-rgb) / 0.15), rgb(var(--app-violet-deep-rgb) / 0.08));
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${Theme.usage.space.medium};
`;

const ChatTitle = styled.h3`
  font-size: ${Theme.usage.fontSize.xSmall};
  font-weight: 600;
  color: ${colors.foreground};
  margin-bottom: ${Theme.usage.space.xxSmall};
`;

const ChatDescription = styled.p`
  font-size: ${Theme.usage.fontSize.xxSmall};
  color: rgb(var(--app-muted-fg-rgb) / 0.7);
  text-align: center;
  max-width: 240px;
  line-height: 1.625;
  margin-bottom: ${Theme.usage.space.large};
`;

const ChatSuggestionList = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${Theme.usage.space.xSmall};
`;

const ChatSuggestion = styled.button`
  width: 100%;
  padding: ${Theme.usage.space.small} ${Theme.usage.space.medium};
  border-radius: ${Theme.usage.borderRadius.large};
  background-color: rgb(var(--app-surface-rgb) / 0.5);
  border: 1px solid rgb(var(--app-violet-deep-rgb) / 0.06);
  color: ${colors.foreground};
  font-size: ${Theme.usage.fontSize.xxSmall};
  text-align: left;
  cursor: pointer;
  transition: all 200ms;

  &:hover {
    background-color: rgb(var(--app-surface-rgb) / 0.8);
    border-color: rgb(var(--app-violet-deep-rgb) / 0.12);
    transform: translateY(-1px);
    box-shadow: ${shadows.sm};
  }
`;

/* ── Chat input area ── */

const ChatInputArea = styled.div`
  padding: ${Theme.usage.space.small};
`;

const ChatInputBox = styled.div`
  border-radius: ${Theme.usage.borderRadius.xLarge};
  background-color: rgb(var(--app-surface-rgb) / 0.5);
  border: 1px solid rgb(var(--app-violet-deep-rgb) / 0.08);
  transition: all 200ms;

  &:focus-within {
    border-color: rgb(var(--app-violet-deep-rgb) / 0.2);
    box-shadow: 0 0 0 3px rgb(var(--app-violet-deep-rgb) / 0.06);
  }
`;

const ChatTextarea = styled.textarea`
  width: 100%;
  padding: ${Theme.usage.space.small};
  padding-bottom: ${Theme.usage.space.xSmall};
  font-size: ${Theme.usage.fontSize.xSmall};
  color: ${colors.foreground};
  background: transparent;
  border: none;
  outline: none;
  resize: none;

  &::placeholder { color: rgb(var(--app-muted-fg-rgb) / 0.4); }
`;

const ChatToolbar = styled.div`
  padding: 0 ${Theme.usage.space.small} ${Theme.usage.space.small};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ChatToolbarLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xxSmall};
`;

const ChatKbToggle = styled.button`
  padding: ${Theme.usage.space.xSmall};
  border-radius: ${Theme.usage.borderRadius.large};
  border: none;
  background: none;
  color: rgb(var(--app-muted-fg-rgb) / 0.5);
  cursor: pointer;
  transition: all 200ms;

  &:hover {
    background-color: rgb(var(--app-violet-deep-rgb) / 0.06);
    color: ${colors.mutedForeground};
  }
`;

const ChatKbBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${Theme.usage.space.xxSmall};
  padding: ${Theme.usage.space.xxSmall} ${Theme.usage.space.small};
  border-radius: ${Theme.usage.borderRadius.full};
  background-color: rgb(var(--app-violet-deep-rgb) / 0.07);
  font-size: ${Theme.usage.fontSize.xxSmall};
  color: ${colors.foreground};
`;

const ChatKbRemove = styled.button`
  color: rgb(var(--app-muted-fg-rgb) / 0.4);
  background: none;
  border: none;
  cursor: pointer;
  margin-left: ${Theme.usage.space.xxxSmall};
  padding: 0;
  transition: color 200ms;

  &:hover { color: ${colors.mutedForeground}; }
`;

const ChatSendButton = styled.button<{ $active: boolean }>`
  padding: ${Theme.usage.space.xSmall};
  border-radius: ${Theme.usage.borderRadius.large};
  border: none;
  cursor: pointer;
  transition: all 200ms;

  ${({ $active }) => $active ? css`
    background-color: var(--app-violet-button);
    color: ${colors.white};
    box-shadow: 0 2px 8px rgb(var(--app-violet-deep-rgb) / 0.2);
    &:hover { background-color: var(--app-violet-button-hover); }
  ` : css`
    background-color: rgb(var(--app-violet-deep-rgb) / 0.06);
    color: rgb(var(--app-muted-fg-rgb) / 0.3);
    cursor: default;
  `}
`;

/* ── KB Dropdown (positioned relative to ChatInputArea) ── */

const KbDropdown = styled.div`
  position: absolute;
  bottom: 100%;
  left: ${Theme.usage.space.small};
  right: ${Theme.usage.space.small};
  margin-bottom: ${Theme.usage.space.xSmall};
  background: ${colors.background};
  border: 1px solid ${colors.border};
  border-radius: ${Theme.usage.borderRadius.xLarge};
  box-shadow: ${shadows.popover};
  z-index: 50;
  overflow: hidden;
`;

const KbDropdownHeader = styled.div`
  padding: ${Theme.usage.space.small};
  border-bottom: 1px solid rgb(var(--app-overlay-rgb) / 0.06);
`;

const KbDropdownLabel = styled.div`
  font-size: ${Theme.usage.fontSize.xxSmall};
  font-weight: 600;
  color: ${colors.mutedForeground};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const KbDropdownItem = styled.button<{ $selected: boolean }>`
  width: 100%;
  display: flex;
  align-items: flex-start;
  gap: ${Theme.usage.space.small};
  padding: ${Theme.usage.space.small};
  transition: background-color 150ms;
  text-align: left;
  background: ${({ $selected }) => ($selected ? 'rgb(var(--app-accent-rgb) / 0.4)' : 'transparent')};
  border: none;
  cursor: pointer;

  &:hover {
    background: rgb(var(--app-accent-rgb) / 0.6);
  }
`;

const KbItemName = styled.div`
  font-size: ${Theme.usage.fontSize.xSmall};
  font-weight: 500;
  color: ${colors.foreground};
`;

const KbItemDesc = styled.div`
  font-size: ${Theme.usage.fontSize.xxSmall};
  color: ${colors.mutedForeground};
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const KbDropdownFooter = styled.div`
  border-top: 1px solid rgb(var(--app-overlay-rgb) / 0.06);
`;

const KbAddButton = styled.button`
  width: 100%;
  display: flex;
  align-items: flex-start;
  gap: ${Theme.usage.space.small};
  padding: ${Theme.usage.space.small};
  background: none;
  border: none;
  cursor: pointer;
  transition: background-color 150ms;

  &:hover { background: rgb(var(--app-accent-rgb) / 0.4); }
`;

const KbAddName = styled.div`
  font-size: ${Theme.usage.fontSize.xxSmall};
  font-weight: 500;
  color: ${colors.ddPrimary};
`;

/* ── Past Conversations Tab ── */

const PastConvBody = styled.div`
  flex: 1;
  overflow: auto;
  padding: ${Theme.usage.space.medium};
`;

const PastConvEmpty = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${Theme.usage.space.xLarge};
  color: rgb(var(--app-muted-fg-rgb) / 0.5);
  text-align: center;
`;

const PastConvEmptyText = styled.p`
  font-size: ${Theme.usage.fontSize.xxSmall};
  margin-top: ${Theme.usage.space.small};
`;

export function AIAssistantSidebar({
  title = 'AI Assistant',
  welcomeMessage = 'Hi! I can help you build your dashboards by searching for metrics and adding it to your canvas.',
  suggestions = [
    { text: 'Revenue by customer segment' },
    { text: 'Top products by category' },
    { text: 'Daily active users trend' },
    { text: 'Orders by region' },
  ],
  knowledgeBaseId = 'all',
  onKnowledgeBaseChange,
  suggestedActions: _suggestedActions = [],
  contextLabel: _contextLabel,
  collapsible = false,
  collapsed = false,
  onToggleCollapse,
  className,
}: AIAssistantSidebarProps) {
  const [activeTab, setActiveTab] = useState<'chat' | 'past'>('chat');
  const [chatInput, setChatInput] = useState('');
  const [selectedKB, setSelectedKB] = useState(knowledgeBaseId);
  const [kbDropdownOpen, setKbDropdownOpen] = useState(false);
  const kbDropdownRef = useRef<HTMLDivElement>(null);
  const kbButtonRef = useRef<HTMLButtonElement>(null);

  const currentKB = knowledgeBases.find((kb) => kb.id === selectedKB) || knowledgeBases[0];

  const handleKBSelect = (kb: KnowledgeBase) => {
    setSelectedKB(kb.id);
    onKnowledgeBaseChange?.(kb.id);
    setKbDropdownOpen(false);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (
        kbDropdownRef.current && !kbDropdownRef.current.contains(target) &&
        kbButtonRef.current && !kbButtonRef.current.contains(target)
      ) {
        setKbDropdownOpen(false);
      }
    }
    if (kbDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [kbDropdownOpen]);

  if (collapsed && collapsible) {
    return (
      <CollapsedPanel
        animate={{ width: 44 }}
        transition={{ duration: 0.2 }}
        className={className}
      >
        <CollapsedHeader>
          <ToggleButton
            onClick={onToggleCollapse}
            aria-label="Expand assistant"
          >
            <ChevronLeft style={{ width: 16, height: 16 }} />
          </ToggleButton>
        </CollapsedHeader>
        <CollapsedBody>
          <ToggleButton onClick={onToggleCollapse} aria-label="Expand assistant">
            <Sparkles style={{ width: 20, height: 20 }} />
          </ToggleButton>
        </CollapsedBody>
      </CollapsedPanel>
    );
  }

  return (
    <ExpandedPanel
      animate={{ width: 384 }}
      transition={{ duration: 0.2 }}
      className={className}
    >
      {/* Header with tabs */}
      <PanelHeader>
        <TabGroup>
          <Tab $active={activeTab === 'chat'} onClick={() => setActiveTab('chat')}>
            <Sparkles style={{ width: 12, height: 12 }} /> Chat
          </Tab>
          <Tab $active={activeTab === 'past'} onClick={() => setActiveTab('past')}>
            <MessageSquare style={{ width: 12, height: 12 }} /> Past Chats
          </Tab>
        </TabGroup>
        {collapsible && (
          <CollapseButton onClick={onToggleCollapse} aria-label="Collapse assistant">
            <ChevronRight />
          </CollapseButton>
        )}
      </PanelHeader>

      {activeTab === 'chat' ? (
        <ChatBody>
          <ChatMessages>
            <ChatCenter>
              <ChatIconBox>
                <Sparkles style={{ width: 20, height: 20, color: '#6352af' }} />
              </ChatIconBox>
              <ChatTitle>{title}</ChatTitle>
              <ChatDescription>{welcomeMessage}</ChatDescription>
              <ChatSuggestionList>
                {suggestions.map((suggestion, index) => (
                  <ChatSuggestion key={index} onClick={() => setChatInput(suggestion.text)}>
                    {suggestion.text}
                  </ChatSuggestion>
                ))}
              </ChatSuggestionList>
            </ChatCenter>
          </ChatMessages>

          {kbDropdownOpen && (
            <KbDropdown ref={kbDropdownRef}>
              <KbDropdownHeader>
                <KbDropdownLabel>Knowledge Bases</KbDropdownLabel>
              </KbDropdownHeader>
              {knowledgeBases.map((kb) => (
                <KbDropdownItem
                  key={kb.id}
                  $selected={selectedKB === kb.id}
                  onClick={() => handleKBSelect(kb)}
                >
                  <BookOpen style={{ width: 16, height: 16, color: 'rgb(var(--app-muted-fg-rgb) / 0.5)', marginTop: '2px', flexShrink: 0 }} />
                  <div>
                    <KbItemName>{kb.name}</KbItemName>
                    <KbItemDesc>{kb.description}</KbItemDesc>
                  </div>
                </KbDropdownItem>
              ))}
              <KbDropdownFooter>
                <KbAddButton>
                  <Plus style={{ width: 16, height: 16, color: 'rgb(var(--app-muted-fg-rgb) / 0.5)', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <KbAddName>Add Custom Knowledge</KbAddName>
                    <KbItemDesc>Import custom context or domain rules</KbItemDesc>
                  </div>
                </KbAddButton>
              </KbDropdownFooter>
            </KbDropdown>
          )}

          <ChatInputArea>
            <ChatInputBox>
              <ChatTextarea
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask about dashboards, metrics, or data..."
                rows={2}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    setChatInput('');
                  }
                }}
              />
              <ChatToolbar>
                <ChatToolbarLeft>
                  <ChatKbToggle
                    ref={kbButtonRef}
                    onClick={() => setKbDropdownOpen(!kbDropdownOpen)}
                    title="Add knowledge base"
                  >
                    <Plus style={{ width: 16, height: 16 }} />
                  </ChatKbToggle>
                  <ChatKbBadge>
                    <BookOpen style={{ width: 12, height: 12, color: 'rgb(var(--app-muted-fg-rgb) / 0.6)' }} />
                    <span>{currentKB.name}</span>
                    <ChatKbRemove onClick={() => { setSelectedKB(knowledgeBases[0].id); onKnowledgeBaseChange?.(knowledgeBases[0].id); }}>
                      <X style={{ width: 12, height: 12 }} />
                    </ChatKbRemove>
                  </ChatKbBadge>
                </ChatToolbarLeft>

                <ChatSendButton
                  $active={!!chatInput.trim()}
                  disabled={!chatInput.trim()}
                  onClick={() => setChatInput('')}
                >
                  <ArrowUp style={{ width: 16, height: 16 }} />
                </ChatSendButton>
              </ChatToolbar>
            </ChatInputBox>
          </ChatInputArea>
        </ChatBody>
      ) : (
        <PastConvBody>
          <PastConvEmpty>
            <MessageSquare style={{ width: 24, height: 24 }} />
            <PastConvEmptyText>No past conversations yet</PastConvEmptyText>
          </PastConvEmpty>
        </PastConvBody>
      )}
    </ExpandedPanel>
  );
}
