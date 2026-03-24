import { motion } from 'motion/react';
import { Sparkles, Send, MessageSquare, Layers } from 'lucide-react';
import styled from 'styled-components';
import { colors, radius, shadows, glassHero, Theme } from '@/styles/theme';

type AgentMode = 'chat' | 'hybrid' | 'notebook';
type AgentPurpose = 'analysis' | 'exploration' | 'reporting';

interface HeroPanelProps {
  userName: string;
  greeting?: string;
  prompts: string[];
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  onSubmit: () => void;
  onPromptClick?: (prompt: string) => void;
  agentMode: AgentMode;
  onAgentModeChange: (mode: AgentMode) => void;
  agentPurpose: AgentPurpose;
  onAgentPurposeChange: (purpose: AgentPurpose) => void;
}

const PanelWrapper = styled(motion.div)`
  ${glassHero}
  border-radius: ${radius['2xl']};
  padding: 20px ${Theme.usage.space.large};
  border: 1px solid ${colors.border};
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.small};
  margin-bottom: ${Theme.usage.space.medium};
`;

const IconBox = styled.div`
  width: 40px;
  height: 40px;
  border-radius: ${radius.lg};
  background: linear-gradient(to bottom right, ${colors.violet500}, ${colors.cyan400});
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 4px 6px -1px rgb(var(--app-violet-rgb) / 0.2);
`;

const Greeting = styled.h2`
  font-size: ${Theme.usage.fontSize.xLarge};
  font-weight: 600;
  color: ${colors.foreground};
`;

const SubText = styled.p`
  font-size: ${Theme.usage.fontSize.xxSmall};
  color: ${colors.mutedForeground};
`;

const InputWrapper = styled.div`
  position: relative;
  margin-bottom: ${Theme.usage.space.small};
`;

const SearchInput = styled.input`
  width: 100%;
  padding-left: 20px;
  padding-right: 56px;
  height: 56px;
  border-radius: ${radius['2xl']};
  font-size: 15px;
  background: rgb(var(--app-surface-rgb) / 0.7);
  border: 2px solid rgb(var(--app-violet-rgb) / 0.5);
  color: ${colors.foreground};
  transition: all 0.2s;
  box-shadow: 0 0 20px rgb(var(--app-violet-rgb) / 0.12);
  outline: none;

  &::placeholder {
    color: rgb(var(--app-muted-fg-rgb) / 0.5);
  }

  &:focus {
    ring: 2px solid rgb(var(--app-violet-rgb) / 0.25);
    border-color: rgb(var(--app-violet-rgb) / 0.5);
    box-shadow: 0 0 0 2px rgb(var(--app-violet-rgb) / 0.25), 0 0 20px rgb(var(--app-violet-rgb) / 0.12);
  }
`;

const SendButton = styled.button<{ $active: boolean }>`
  position: absolute;
  right: ${Theme.usage.space.small};
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  border-radius: ${radius.xl};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  border: none;
  cursor: ${({ $active }) => ($active ? 'pointer' : 'default')};
  background: ${({ $active }) => ($active ? colors.violet600 : 'transparent')};
  color: ${({ $active }) => ($active ? colors.white : 'rgb(var(--app-muted-fg-rgb) / 0.3)')};
  box-shadow: ${({ $active }) => ($active ? `0 4px 6px -1px rgb(var(--app-violet-rgb) / 0.25)` : 'none')};

  &:hover {
    background: ${({ $active }) => ($active ? colors.violet700 : 'transparent')};
  }
`;

const ControlsRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${Theme.usage.space.small};
`;

const ModeToggleGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xxxSmall};
  background: rgb(var(--app-muted-rgb) / 0.6);
  padding: ${Theme.usage.space.xxxSmall};
  border-radius: ${radius.lg};
`;

const ModeButton = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xxSmall};
  padding: ${Theme.usage.space.xxSmall} ${Theme.usage.space.small};
  border-radius: ${radius.md};
  font-size: ${Theme.usage.fontSize.xxSmall};
  font-weight: 500;
  transition: all 0.2s;
  border: none;
  cursor: pointer;
  background: ${({ $active }) => ($active ? colors.background : 'transparent')};
  color: ${({ $active }) => ($active ? colors.foreground : colors.mutedForeground)};
  box-shadow: ${({ $active }) => ($active ? shadows.sm : 'none')};

  &:hover {
    color: ${colors.foreground};
  }
`;

const PurposeGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xxSmall};
`;

const PurposeButton = styled.button<{ $active: boolean; $disabled: boolean }>`
  padding: ${Theme.usage.space.xxSmall} ${Theme.usage.space.small};
  border-radius: ${Theme.usage.borderRadius.full};
  font-size: ${Theme.usage.fontSize.xxSmall};
  font-weight: 500;
  transition: all 0.2s;
  text-transform: capitalize;
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ $disabled }) => ($disabled ? 0.4 : 1)};
  background: ${({ $active }) => ($active ? colors.foreground : colors.background)};
  color: ${({ $active }) => ($active ? colors.background : colors.foreground)};
  border: 1px solid ${({ $active }) => ($active ? colors.foreground : colors.border)};

  &:hover {
    background: ${({ $active, $disabled }) =>
      $disabled ? undefined : $active ? colors.foreground : 'rgb(var(--app-accent-rgb) / 0.4)'};
  }
`;

const PromptsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${Theme.usage.space.xxSmall};
`;

const PromptChip = styled(motion.button)`
  padding: ${Theme.usage.space.xxSmall} ${Theme.usage.space.small};
  border-radius: ${radius.md};
  font-size: ${Theme.usage.fontSize.xxSmall};
  background: rgb(var(--app-muted-rgb) / 0.6);
  border: 1px solid rgb(var(--app-overlay-rgb) / 0.04);
  color: rgb(var(--app-fg-rgb) / 0.8);
  transition: all 0.2s;
  cursor: pointer;

  &:hover {
    color: ${colors.foreground};
    background: rgb(var(--app-accent-rgb) / 0.6);
    border-color: rgb(var(--app-overlay-rgb) / 0.06);
    box-shadow: ${shadows.sm};
  }
`;

export function HeroPanel({
  userName,
  greeting = 'Good morning',
  prompts,
  searchTerm,
  onSearchTermChange,
  onSubmit,
  onPromptClick,
  agentMode,
  onAgentModeChange,
  agentPurpose,
  onAgentPurposeChange,
}: HeroPanelProps) {
  return (
    <PanelWrapper
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <HeaderRow>
        <IconBox>
          <Sparkles style={{ width: 20, height: 20, color: colors.white }} />
        </IconBox>
        <div style={{ flex: 1 }}>
          <Greeting>
            {greeting}, {userName}
          </Greeting>
          <SubText>What would you like to explore today?</SubText>
        </div>
      </HeaderRow>

      <InputWrapper>
        <SearchInput
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchTermChange(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); onSubmit(); } }}
          placeholder="Ask anything about your data..."
        />
        <SendButton
          onClick={onSubmit}
          $active={!!searchTerm.trim()}
          disabled={!searchTerm.trim()}
        >
          <Send style={{ width: 16, height: 16 }} />
        </SendButton>
      </InputWrapper>

      <ControlsRow>
        <ModeToggleGroup>
          {(['chat', 'hybrid'] as const).map((mode) => (
            <ModeButton
              key={mode}
              onClick={() => onAgentModeChange(mode)}
              $active={agentMode === mode}
            >
              {mode === 'chat' && <MessageSquare style={{ width: 14, height: 14 }} />}
              {mode === 'hybrid' && <Layers style={{ width: 14, height: 14 }} />}
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </ModeButton>
          ))}
        </ModeToggleGroup>

        <PurposeGroup>
          {(['analysis', 'exploration', 'reporting'] as const).map((purpose) => {
            const isComingSoon = purpose === 'exploration' || purpose === 'reporting';
            return (
              <PurposeButton
                key={purpose}
                onClick={() => !isComingSoon && onAgentPurposeChange(purpose)}
                disabled={isComingSoon}
                title={isComingSoon ? 'Coming soon' : undefined}
                $active={agentPurpose === purpose}
                $disabled={isComingSoon}
              >
                {purpose}
              </PurposeButton>
            );
          })}
        </PurposeGroup>
      </ControlsRow>

      <PromptsRow>
        {prompts.map((prompt, index) => (
          <PromptChip
            key={index}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onPromptClick?.(prompt)}
          >
            {prompt}
          </PromptChip>
        ))}
      </PromptsRow>
    </PanelWrapper>
  );
}
