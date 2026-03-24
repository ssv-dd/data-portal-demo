import styled from 'styled-components';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { colors, radius, shadows, Theme } from '@/styles/theme';

interface FeatureBadgeProps {
  visible: boolean;
  onDismiss: () => void;
}

const Wrapper = styled(motion.div)`
  position: fixed;
  top: 80px;
  right: ${Theme.usage.space.xLarge};
  z-index: 50;
  max-width: 384px;
`;

const StyledCard = styled(Card)`
  padding: ${Theme.usage.space.medium};
  background-color: ${colors.purple600};
  color: ${colors.white};
  box-shadow: ${shadows['2xl']};
  border: 2px solid ${colors.purple400};
`;

const ContentRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${Theme.usage.space.small};
`;

const IconWrapper = styled.div`
  flex-shrink: 0;
`;

const TextContent = styled.div`
  flex: 1;
`;

const Title = styled.h4`
  font-weight: 600;
  font-size: ${Theme.usage.fontSize.xSmall};
  margin-bottom: ${Theme.usage.space.xxSmall};
`;

const Description = styled.p`
  font-size: ${Theme.usage.fontSize.xxSmall};
  color: ${colors.purple100};
  margin-bottom: ${Theme.usage.space.xSmall};
`;

const BadgeRow = styled.div`
  display: flex;
  gap: ${Theme.usage.space.xSmall};
`;

const StyledBadge = styled(Badge)`
  background-color: ${colors.purple500};
  color: ${colors.white};
  border-color: ${colors.purple400};
  font-size: ${Theme.usage.fontSize.xxSmall};
`;

const DismissButton = styled.button`
  flex-shrink: 0;
  height: 20px;
  width: 20px;
  background-color: ${colors.purple700};
  border-radius: ${radius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${Theme.usage.fontSize.xSmall};
  transition: background-color 150ms;
  color: ${colors.white};
  border: none;
  cursor: pointer;

  &:hover {
    background-color: ${colors.purple800};
  }
`;

export function FeatureBadge({ visible, onDismiss }: FeatureBadgeProps) {
  return (
    <AnimatePresence>
      {visible && (
        <Wrapper
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <StyledCard>
            <ContentRow>
              <IconWrapper>
                <Sparkles style={{ height: '20px', width: '20px' }} />
              </IconWrapper>
              <TextContent>
                <Title>✨ New Feature: Smart Highlighting</Title>
                <Description>
                  Highlight any text, number, or metric to ask AI questions or collaborate with teammates
                </Description>
                <BadgeRow>
                  <StyledBadge>
                    Try it now!
                  </StyledBadge>
                </BadgeRow>
              </TextContent>
              <DismissButton onClick={onDismiss}>
                ×
              </DismissButton>
            </ContentRow>
          </StyledCard>
        </Wrapper>
      )}
    </AnimatePresence>
  );
}
