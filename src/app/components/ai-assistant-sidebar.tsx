import { useState } from 'react';
import { Send, Sparkles, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import styled from 'styled-components';
import { Theme } from '@doordash/prism-react';
import { colors, radius, shadows, glassPanelSubtle, glassPanelChat } from '@/styles/theme';
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

const CollapsedPanel = styled(motion.div)`
  border-left: 1px solid ${colors.border};
  display: flex;
  flex-direction: column;
  align-items: center;
  ${glassPanelSubtle}
`;

const CollapsedHeader = styled.div`
  padding: ${Theme.usage.space.small};
  border-bottom: 1px solid rgb(var(--app-overlay-rgb) / 0.04);
  width: 100%;
  display: flex;
  justify-content: center;
`;

const ToggleButton = styled.button`
  padding: ${Theme.usage.space.xSmall};
  border-radius: ${radius.lg};
  background: transparent;
  border: none;
  cursor: pointer;
  transition: background-color 150ms;

  &:hover {
    background: rgb(var(--app-accent-rgb) / 0.6);
  }
`;

const CollapsedBody = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ExpandedPanel = styled(motion.div)`
  border-left: 1px solid ${colors.border};
  display: flex;
  flex-direction: column;
  overflow: hidden;
  ${glassPanelChat}
`;

const PanelHeader = styled.div`
  padding: ${Theme.usage.space.small} ${Theme.usage.space.medium};
  border-bottom: 1px solid ${colors.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xSmall};
`;

const PanelTitle = styled.h3`
  font-weight: 500;
  color: ${colors.foreground};
`;

const ContextBadge = styled.span`
  border-radius: ${radius.xl};
  border: 1px solid rgb(var(--app-violet-rgb) / 0.2);
  background: rgb(var(--app-violet-rgb) / 0.1);
  padding: ${Theme.usage.space.xxSmall} ${Theme.usage.space.small};
  font-size: ${Theme.usage.fontSize.xxSmall};
  font-weight: 500;
  color: ${colors.violet700};
`;

const CollapseButton = styled.button`
  padding: ${Theme.usage.space.xxSmall};
  border-radius: ${radius.lg};
  background: transparent;
  border: none;
  cursor: pointer;
  transition: background-color 150ms;

  &:hover {
    background: rgb(var(--app-accent-rgb) / 0.6);
  }
`;

const KBSection = styled.div`
  padding: ${Theme.usage.space.small} ${Theme.usage.space.medium};
  border-bottom: 1px solid rgb(var(--app-overlay-rgb) / 0.04);
  position: relative;
`;

const KBSelectorButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${Theme.usage.space.xSmall};
  padding: ${Theme.usage.space.xSmall} ${Theme.usage.space.small};
  border-radius: ${radius.lg};
  background: rgb(var(--app-surface-rgb) / 0.5);
  border: 1px solid rgb(var(--app-overlay-rgb) / 0.04);
  font-size: ${Theme.usage.fontSize.xSmall};
  cursor: pointer;
  transition: background-color 150ms;

  &:hover {
    background: rgb(var(--app-accent-rgb) / 0.4);
  }
`;

const KBButtonContent = styled.div`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xSmall};
  flex: 1;
  min-width: 0;
`;

const KBName = styled.span`
  color: ${colors.foreground};
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const KBDropdown = styled.div`
  position: absolute;
  top: 100%;
  left: ${Theme.usage.space.medium};
  right: ${Theme.usage.space.medium};
  margin-top: ${Theme.usage.space.xxSmall};
  background: ${colors.background};
  border: 1px solid ${colors.border};
  border-radius: ${radius.xl};
  box-shadow: ${shadows.popover};
  z-index: 50;
  padding: ${Theme.usage.space.xxSmall} 0;
`;

const KBDropdownItem = styled.button<{ $selected: boolean }>`
  width: 100%;
  display: flex;
  align-items: flex-start;
  gap: ${Theme.usage.space.small};
  padding: ${Theme.usage.space.small} ${Theme.usage.space.small};
  transition: background-color 150ms;
  text-align: left;
  background: ${({ $selected }) => ($selected ? 'rgb(var(--app-accent-rgb) / 0.4)' : 'transparent')};
  border: none;
  cursor: pointer;

  &:hover {
    background: rgb(var(--app-accent-rgb) / 0.6);
  }
`;

const KBItemContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const KBItemName = styled.div`
  font-size: ${Theme.usage.fontSize.xSmall};
  font-weight: 500;
  color: ${colors.foreground};
`;

const KBItemDescription = styled.div`
  font-size: ${Theme.usage.fontSize.xxSmall};
  color: ${colors.mutedForeground};
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ContentArea = styled.div`
  flex: 1;
  overflow: auto;
  padding: ${Theme.usage.space.large};
  display: flex;
  flex-direction: column;
`;

const WelcomeSection = styled.div`
  margin-bottom: ${Theme.usage.space.large};
`;

const WelcomeText = styled.p`
  color: ${colors.mutedForeground};
  font-size: ${Theme.usage.fontSize.xSmall};
  line-height: 1.625;
`;

const SuggestionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${Theme.usage.space.small};
  margin-bottom: auto;
`;

const SuggestionButton = styled.button`
  padding: ${Theme.usage.space.small} ${Theme.usage.space.medium};
  border-radius: ${radius.xl};
  border: 1px solid ${colors.border};
  background: rgb(var(--app-surface-rgb) / 0.4);
  color: ${colors.foreground};
  font-size: ${Theme.usage.fontSize.xSmall};
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xSmall};
  cursor: pointer;
  transition: all 200ms;

  &:hover {
    background: rgb(var(--app-accent-rgb) / 0.6);
    border-color: ${colors.border};
    box-shadow: ${shadows.sm};
  }
`;

const SuggestedActionsSection = styled.div`
  margin-top: ${Theme.usage.space.large};
  padding-top: ${Theme.usage.space.large};
  border-top: 1px solid rgb(var(--app-overlay-rgb) / 0.04);
`;

const SuggestedActionsLabel = styled.p`
  font-size: ${Theme.usage.fontSize.xxSmall};
  font-weight: 500;
  color: ${colors.mutedForeground};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: ${Theme.usage.space.small};
`;

const SuggestedActionsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${Theme.usage.space.xSmall};
`;

const SuggestedActionButton = styled.button`
  padding: ${Theme.usage.space.xSmall} ${Theme.usage.space.small};
  border-radius: ${Theme.usage.borderRadius.full};
  font-size: ${Theme.usage.fontSize.xxSmall};
  font-weight: 500;
  border: 1px solid rgb(var(--app-surface-rgb) / 0.1);
  background: rgb(var(--app-overlay-rgb) / 0.1);
  color: ${colors.slate700};
  cursor: pointer;
  transition: background-color 150ms;

  &:hover {
    background: rgb(var(--app-overlay-rgb) / 0.2);
  }
`;

const InputSection = styled.div`
  margin-top: ${Theme.usage.space.large};
  position: relative;
`;

const ChatInput = styled.input`
  width: 100%;
  padding: ${Theme.usage.space.small} ${Theme.usage.space.medium};
  padding-right: 2.780px;
  border-radius: ${radius.xl};
  border: 1px solid ${colors.border};
  color: ${colors.foreground};
  font-size: ${Theme.usage.fontSize.xSmall};
  background: rgb(var(--app-surface-rgb) / 0.5);
  transition: all 200ms;
  outline: none;

  &::placeholder {
    color: rgb(var(--app-muted-fg-rgb) / 0.6);
  }

  &:focus {
    box-shadow: 0 0 0 2px rgb(var(--app-violet-rgb) / 0.2);
    border-color: rgb(var(--app-violet-rgb) / 0.4);
  }
`;

const SendBtn = styled.button`
  position: absolute;
  right: ${Theme.usage.space.xSmall};
  top: 50%;
  transform: translateY(-50%);
  padding: ${Theme.usage.space.xSmall};
  color: rgb(var(--app-muted-fg-rgb) / 0.6);
  background: transparent;
  border: none;
  cursor: pointer;
  transition: color 150ms;

  &:hover {
    color: ${colors.violet500};
  }
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
  suggestedActions = [],
  contextLabel,
  collapsible = false,
  collapsed = false,
  onToggleCollapse,
  className,
}: AIAssistantSidebarProps) {
  const [showKBDropdown, setShowKBDropdown] = useState(false);
  const [selectedKB, setSelectedKB] = useState(knowledgeBaseId);

  const currentKB = knowledgeBases.find((kb) => kb.id === selectedKB) || knowledgeBases[0];
  const KBIcon = currentKB.icon;

  const handleKBSelect = (kb: KnowledgeBase) => {
    setSelectedKB(kb.id);
    onKnowledgeBaseChange?.(kb.id);
    setShowKBDropdown(false);
  };

  if (collapsed && collapsible) {
    return (
      <CollapsedPanel
        animate={{ width: 72 }}
        transition={{ duration: 0.2 }}
        className={className}
      >
        <CollapsedHeader>
          <ToggleButton
            onClick={onToggleCollapse}
            aria-label="Expand assistant"
          >
            <ChevronLeft style={{ width: 16, height: 16, color: colors.mutedForeground }} />
          </ToggleButton>
        </CollapsedHeader>
        <CollapsedBody>
          <Sparkles style={{ width: 20, height: 20, color: colors.mutedForeground }} />
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
      {/* Header */}
      <PanelHeader>
        <HeaderLeft>
          <PanelTitle>{title}</PanelTitle>
          {contextLabel && (
            <ContextBadge>{contextLabel}</ContextBadge>
          )}
        </HeaderLeft>
        {collapsible && (
          <CollapseButton
            onClick={onToggleCollapse}
            aria-label="Collapse assistant"
          >
            <ChevronRight style={{ width: 16, height: 16, color: colors.mutedForeground }} />
          </CollapseButton>
        )}
      </PanelHeader>

      {/* Knowledge Base Selector */}
      <KBSection>
        <KBSelectorButton onClick={() => setShowKBDropdown(!showKBDropdown)}>
          <KBButtonContent>
            <KBIcon style={{ width: 16, height: 16, flexShrink: 0 }} />
            <KBName>{currentKB.name}</KBName>
          </KBButtonContent>
          <ChevronDown style={{ width: 16, height: 16, color: colors.mutedForeground, flexShrink: 0 }} />
        </KBSelectorButton>

        {showKBDropdown && (
          <KBDropdown>
            {knowledgeBases.map((kb) => {
              const Icon = kb.icon;
              return (
                <KBDropdownItem
                  key={kb.id}
                  onClick={() => handleKBSelect(kb)}
                  $selected={selectedKB === kb.id}
                >
                  <Icon style={{ width: 16, height: 16, flexShrink: 0, marginTop: '2px' }} />
                  <KBItemContent>
                    <KBItemName>{kb.name}</KBItemName>
                    <KBItemDescription>{kb.description}</KBItemDescription>
                  </KBItemContent>
                </KBDropdownItem>
              );
            })}
          </KBDropdown>
        )}
      </KBSection>

      {/* Content */}
      <ContentArea>
        <WelcomeSection>
          <WelcomeText>{welcomeMessage}</WelcomeText>
        </WelcomeSection>

        {/* Suggestion Chips */}
        <SuggestionsGrid>
          {suggestions.map((suggestion, index) => (
            <SuggestionButton key={index}>
              {suggestion.icon || <Sparkles style={{ width: 16, height: 16 }} />}
              <span>{suggestion.text}</span>
            </SuggestionButton>
          ))}
        </SuggestionsGrid>

        {/* Suggested Actions */}
        {suggestedActions.length > 0 && (
          <SuggestedActionsSection>
            <SuggestedActionsLabel>Suggested actions</SuggestedActionsLabel>
            <SuggestedActionsRow>
              {suggestedActions.map((action, index) => (
                <SuggestedActionButton key={index}>
                  {action}
                </SuggestedActionButton>
              ))}
            </SuggestedActionsRow>
          </SuggestedActionsSection>
        )}

        {/* Input */}
        <InputSection>
          <ChatInput
            type="text"
            placeholder="@ for objects, / for commands, ↕ for history"
          />
          <SendBtn>
            <Send style={{ width: 16, height: 16 }} />
          </SendBtn>
        </InputSection>
      </ContentArea>
    </ExpandedPanel>
  );
}
