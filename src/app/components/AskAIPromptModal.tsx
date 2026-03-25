import { useState } from 'react';
import styled from 'styled-components';
import { Dialog, DialogContent, DialogDescription } from './ui/dialog';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Theme } from '@doordash/prism-react';
import { colors, radius } from '@/styles/theme';

interface AskAIPromptModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedText: string;
  contextType: 'highlight' | 'concern';
  onSelectPrompt: (prompt: string, selectedText: string) => void;
}

const PreviewBox = styled.div`
  padding: ${Theme.usage.space.small};
  background-color: ${colors.purple50};
  border: 1px solid ${colors.purple200};
  border-radius: ${radius.xl};
`;

const PreviewLabel = styled.p`
  font-size: ${Theme.usage.fontSize.xSmall};
  color: ${colors.mutedForeground};
  margin-bottom: ${Theme.usage.space.xxSmall};
`;

const PreviewText = styled.p`
  font-size: ${Theme.usage.fontSize.xSmall};
  font-weight: 500;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const PromptsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${Theme.usage.space.xSmall};
`;

const PromptsLabel = styled.p`
  font-size: ${Theme.usage.fontSize.xSmall};
  font-weight: 500;
  color: ${colors.mutedForeground};
`;

const PromptButton = styled(motion.button)`
  width: 100%;
  text-align: left;
  padding: ${Theme.usage.space.medium};
  border-radius: ${radius.xl};
  border: 2px solid;
  transition: all 200ms;
  background: transparent;
  cursor: pointer;

  &:hover {
    border-color: ${colors.purple400};
    background-color: ${colors.purple50};
  }
`;

const PromptInner = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${Theme.usage.space.small};
`;

const PromptEmoji = styled.span`
  font-size: ${Theme.usage.fontSize.xxLarge};
`;

const PromptContent = styled.div`
  flex: 1;
`;

const PromptHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${Theme.usage.space.xxSmall};
`;

const PromptText = styled.span`
  font-weight: 500;
  font-size: ${Theme.usage.fontSize.xSmall};
`;

const StyledArrowRight = styled(ArrowRight)<{ $hovered: boolean }>`
  height: 16px;
  width: 16px;
  transition: transform 200ms;
  transform: ${({ $hovered }) => ($hovered ? 'translateX(4px)' : 'none')};
`;

const PromptDescription = styled.p`
  font-size: ${Theme.usage.fontSize.xxSmall};
  color: ${colors.mutedForeground};
`;

const FooterDivider = styled.div`
  padding-top: ${Theme.usage.space.xSmall};
  border-top: 1px solid ${colors.border};
`;

const FooterHint = styled.p`
  font-size: ${Theme.usage.fontSize.xxSmall};
  text-align: center;
  color: ${colors.mutedForeground};
`;

export function AskAIPromptModal({
  open,
  onOpenChange,
  selectedText,
  contextType,
  onSelectPrompt
}: AskAIPromptModalProps) {
  const [hoveredPrompt, setHoveredPrompt] = useState<number | null>(null);

  const isNumeric = /^\d+\.?\d*%?|[\$\€\£]\d+/.test(selectedText.trim());

  const getSmartPrompts = () => {
    if (isNumeric) {
      return [
        {
          text: 'Why did this metric change?',
          icon: '📊',
          description: 'Understand the drivers behind this number'
        },
        {
          text: 'Show me the trend over time',
          icon: '📈',
          description: 'View historical context and patterns'
        },
        {
          text: 'What should we do about this?',
          icon: '🎯',
          description: 'Get actionable recommendations'
        }
      ];
    } else if (contextType === 'concern') {
      return [
        {
          text: 'What caused this issue?',
          icon: '🔍',
          description: 'Dive into the root causes and contributing factors'
        },
        {
          text: 'What is the recovery plan?',
          icon: '🔄',
          description: 'Understand the steps to resolve and timeline'
        },
        {
          text: 'What are the risks if unaddressed?',
          icon: '⚠️',
          description: 'Assess potential downstream impacts and urgency'
        }
      ];
    } else {
      return [
        {
          text: 'Explain this in more detail',
          icon: '💡',
          description: 'Get deeper context and background'
        },
        {
          text: 'What are the next steps?',
          icon: '📋',
          description: 'Understand the action plan and timeline'
        },
        {
          text: 'Show related metrics',
          icon: '🔗',
          description: 'See connected data and dependencies'
        }
      ];
    }
  };

  const prompts = getSmartPrompts();

  const handlePromptClick = (promptText: string) => {
    onSelectPrompt(promptText, selectedText);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange} title="Ask AI About This">
      <DialogContent style={{ maxWidth: '512px' }}>
          <DialogDescription>
            Choose a question to explore this insight with Data Debby
          </DialogDescription>

        <PreviewBox>
          <PreviewLabel>Selected text:</PreviewLabel>
          <PreviewText>"{selectedText}"</PreviewText>
        </PreviewBox>

        <PromptsContainer>
          <PromptsLabel>Suggested questions:</PromptsLabel>
          {prompts.map((prompt, idx) => (
            <PromptButton
              key={idx}
              style={{
                borderColor: hoveredPrompt === idx ? '#a855f7' : '#e5e7eb'
              }}
              onMouseEnter={() => setHoveredPrompt(idx)}
              onMouseLeave={() => setHoveredPrompt(null)}
              onClick={() => handlePromptClick(prompt.text)}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <PromptInner>
                <PromptEmoji>{prompt.icon}</PromptEmoji>
                <PromptContent>
                  <PromptHeader>
                    <PromptText>{prompt.text}</PromptText>
                    <StyledArrowRight $hovered={hoveredPrompt === idx} />
                  </PromptHeader>
                  <PromptDescription>{prompt.description}</PromptDescription>
                </PromptContent>
              </PromptInner>
            </PromptButton>
          ))}
        </PromptsContainer>

        <FooterDivider>
          <FooterHint>
            Or ask your own question in the chat panel
          </FooterHint>
        </FooterDivider>
      </DialogContent>
    </Dialog>
  );
}
