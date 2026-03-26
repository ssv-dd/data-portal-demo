import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, MessageSquare, PenSquare, Sparkles, PanelLeftClose } from 'lucide-react';
import styled from 'styled-components';
import { colors } from '@/styles/theme';

interface ChatConversation {
  id: string;
  title: string;
  group: 'today' | 'yesterday' | 'previous7' | 'previous30';
}

interface ChatHistoryPanelProps {
  open: boolean;
  onClose: () => void;
  onOpen?: () => void;
  onNewChat?: () => void;
  onConversationClick?: (conversation: ChatConversation) => void;
  inline?: boolean;
}

const conversations: ChatConversation[] = [
  { id: 'c1', title: 'DashPass growth deep-dive (60 days)', group: 'today' },
  { id: 'c2', title: 'GOV drivers — SuperBowl impact', group: 'today' },
  { id: 'c3', title: 'Merchant churn by segment', group: 'yesterday' },
  { id: 'c4', title: 'CANZ delivery time trends', group: 'yesterday' },
  { id: 'c5', title: 'Ads revenue forecast Q2', group: 'yesterday' },
  { id: 'c6', title: 'NV Grocery vs Retail performance', group: 'previous7' },
  { id: 'c7', title: 'Order frequency by DP tier', group: 'previous7' },
  { id: 'c8', title: 'VP/order unit economics trend', group: 'previous7' },
  { id: 'c9', title: 'Customer retention cohort analysis', group: 'previous7' },
  { id: 'c10', title: 'DashMart VP per delivery trends', group: 'previous30' },
  { id: 'c11', title: 'Top metro GOV breakdown', group: 'previous30' },
  { id: 'c12', title: 'Dasher acceptance rate analysis', group: 'previous30' },
  { id: 'c13', title: 'Gift card sales seasonal patterns', group: 'previous30' },
  { id: 'c14', title: 'CXI defect ratio deep dive', group: 'previous30' },
];

const groupLabels: Record<string, string> = {
  today: 'Today',
  yesterday: 'Yesterday',
  previous7: 'Previous 7 days',
  previous30: 'Previous 30 days',
};

const groupOrder = ['today', 'yesterday', 'previous7', 'previous30'];

const SidebarContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  border-right: 1px solid rgb(var(--app-border-rgb) / 0.6);
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 12px 8px;
`;

const IconButton = styled.button`
  padding: 6px;
  border-radius: 6px;
  background: none;
  border: none;
  cursor: pointer;
  color: ${colors.mutedForeground};
  transition: background-color 150ms;
  position: relative;

  &:hover {
    background-color: rgb(var(--app-muted-rgb) / 0.6);
  }
`;

const Tooltip = styled.span`
  position: absolute;
  left: 40px;
  top: 50%;
  transform: translateY(-50%);
  padding: 4px 8px;
  border-radius: 6px;
  background-color: ${colors.foreground};
  color: ${colors.background};
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 150ms;

  ${IconButton}:hover & {
    opacity: 1;
  }
`;

const SearchWrapper = styled.div`
  position: relative;
  padding: 0 12px 12px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 8px 12px 8px 32px;
  border-radius: 8px;
  font-size: 14px;
  background-color: rgb(var(--app-muted-rgb) / 0.3);
  border: 1px solid rgb(var(--app-border-rgb) / 0.4);
  color: ${colors.foreground};
  transition: all 150ms;

  &::placeholder {
    color: rgb(var(--app-muted-fg-rgb) / 0.5);
  }

  &:focus {
    outline: none;
    border-color: rgb(var(--app-violet-deep-rgb) / 0.3);
    box-shadow: 0 0 0 1px rgb(var(--app-violet-deep-rgb) / 0.3);
  }
`;

const SearchIcon = styled(Search)`
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  color: ${colors.mutedForeground};
  pointer-events: none;
`;

const ConversationList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0 8px;
`;

const GroupLabel = styled.p`
  padding: 0 8px 6px;
  font-size: 11px;
  font-weight: 500;
  color: rgb(var(--app-muted-fg-rgb) / 0.6);
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const ConversationButton = styled.button`
  width: 100%;
  padding: 8px 10px;
  border-radius: 8px;
  text-align: left;
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background-color 150ms;

  &:hover {
    background-color: rgb(var(--app-muted-rgb) / 0.5);
  }

  &:hover span {
    color: ${colors.foreground};
  }
`;

const ConversationTitle = styled.span`
  font-size: 14px;
  color: rgb(var(--app-fg-rgb) / 0.8);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: color 150ms;
`;

const Footer = styled.div`
  padding: 12px;
  border-top: 1px solid rgb(var(--app-border-rgb) / 0.4);
`;

const FooterContent = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 8px;
`;

const Avatar = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: ${colors.violet600};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const FooterText = styled.div`
  min-width: 0;
  flex: 1;
`;

const FooterTitle = styled.p`
  font-size: 14px;
  font-weight: 500;
  color: ${colors.foreground};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const FooterSubtitle = styled.p`
  font-size: 10px;
  color: ${colors.mutedForeground};
`;

const CollapsedContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 0;
  gap: 12px;
  height: 100%;
  background-color: ${colors.background};
`;

const CollapsedButton = styled.button`
  padding: 8px;
  border-radius: 8px;
  background: none;
  border: none;
  cursor: pointer;
  color: ${colors.mutedForeground};
  transition: background-color 150ms;
  position: relative;

  &:hover {
    background-color: rgb(var(--app-muted-rgb) / 0.6);
  }
`;

const CollapsedTooltip = styled.span`
  position: absolute;
  left: 48px;
  top: 50%;
  transform: translateY(-50%);
  padding: 4px 8px;
  border-radius: 6px;
  background-color: ${colors.foreground};
  color: ${colors.background};
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 150ms;

  ${CollapsedButton}:hover & {
    opacity: 1;
  }
`;

const Overlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.2);
  z-index: 50;
`;

const Panel = styled(motion.div)`
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: 280px;
  background-color: ${colors.background};
  border-right: 1px solid rgb(var(--app-border-rgb) / 0.6);
  z-index: 60;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
`;

export function ChatHistoryPanel({ open, onClose, onOpen, onNewChat, onConversationClick, inline = false }: ChatHistoryPanelProps) {
  const [search, setSearch] = useState('');

  const filtered = conversations.filter(
    (c) => search === '' || c.title.toLowerCase().includes(search.toLowerCase())
  );

  const grouped = groupOrder
    .map((group) => ({
      group,
      label: groupLabels[group],
      items: filtered.filter((c) => c.group === group),
    }))
    .filter((g) => g.items.length > 0);

  const handleClose = () => {
    setSearch('');
    onClose();
  };

  const panelContent = (
    <>
      <Header>
        <IconButton onClick={handleClose}>
          {inline ? <PanelLeftClose style={{ width: 20, height: 20 }} /> : <X style={{ width: 20, height: 20 }} />}
          {inline && <Tooltip>Close sidebar</Tooltip>}
        </IconButton>
        <IconButton onClick={onNewChat} title="New chat">
          <PenSquare style={{ width: 20, height: 20 }} />
        </IconButton>
      </Header>
      <SearchWrapper>
        <SearchIcon />
        <SearchInput
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search chats..."
        />
      </SearchWrapper>
      <ConversationList>
        {grouped.map((group) => (
          <div key={group.group} style={{ marginBottom: '16px' }}>
            <GroupLabel>{group.label}</GroupLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {group.items.map((conversation) => (
                <ConversationButton
                  key={conversation.id}
                  onClick={() => onConversationClick?.(conversation)}
                >
                  <MessageSquare style={{ width: 14, height: 14, color: 'rgb(var(--app-muted-fg-rgb) / 0.5)', flexShrink: 0 }} />
                  <ConversationTitle>{conversation.title}</ConversationTitle>
                </ConversationButton>
              ))}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{ padding: '32px 0', textAlign: 'center' }}>
            <p style={{ fontSize: '14px', color: colors.mutedForeground }}>No chats found</p>
          </div>
        )}
      </ConversationList>
      <Footer>
        <FooterContent>
          <Avatar>
            <Sparkles style={{ width: 14, height: 14, color: colors.white }} />
          </Avatar>
          <FooterText>
            <FooterTitle>Data Portal AI</FooterTitle>
            <FooterSubtitle>{conversations.length} conversations</FooterSubtitle>
          </FooterText>
        </FooterContent>
      </Footer>
    </>
  );

  if (inline) {
    return (
      <SidebarContainer>
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div
              key="expanded"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 260, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', backgroundColor: colors.background }}
            >
              {panelContent}
            </motion.div>
          ) : (
            <motion.div
              key="collapsed"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 48, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.15, ease: 'easeInOut' }}
            >
              <CollapsedContainer>
                <CollapsedButton onClick={onOpen}>
                  <PanelLeftClose style={{ width: 20, height: 20, transform: 'rotate(180deg)' }} />
                  <CollapsedTooltip>Open sidebar</CollapsedTooltip>
                </CollapsedButton>
                <CollapsedButton onClick={onNewChat}>
                  <PenSquare style={{ width: 20, height: 20 }} />
                  <CollapsedTooltip>New chat</CollapsedTooltip>
                </CollapsedButton>
                <CollapsedButton onClick={onOpen}>
                  <Search style={{ width: 20, height: 20 }} />
                  <CollapsedTooltip>Search chats</CollapsedTooltip>
                </CollapsedButton>
              </CollapsedContainer>
            </motion.div>
          )}
        </AnimatePresence>
      </SidebarContainer>
    );
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <Overlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />
          <Panel
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {panelContent}
          </Panel>
        </>
      )}
    </AnimatePresence>
  );
}
