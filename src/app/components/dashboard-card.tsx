import { Share2, MoreVertical } from 'lucide-react';
import { VerifiedBadge } from './verified-badge';
import { Button } from './ui/button';
import type { Artifact } from '../data/mock-data';
import styled from 'styled-components';
import { Theme } from '@doordash/prism-react';
import { colors, radius, shadows } from '@/styles/theme';

const CardContainer = styled.div`
  border: 1px solid ${colors.border};
  border-radius: ${radius.xl};
  background-color: ${colors.white};
  overflow: hidden;
  transition: box-shadow 200ms;

  &:hover {
    box-shadow: ${shadows.cardHover};
  }
`;

const Thumbnail = styled.div`
  height: 128px;
  background: linear-gradient(to bottom right, ${colors.muted}, ${colors.muted});
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ThumbnailEmoji = styled.span`
  font-size: 40px;
  opacity: 0.2;
`;

const Content = styled.div`
  padding: ${Theme.usage.space.medium};
`;

const TitleRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${Theme.usage.space.xSmall};
  margin-bottom: ${Theme.usage.space.xSmall};
`;

const Title = styled.h4`
  font-size: ${Theme.usage.fontSize.small};
  color: ${colors.foreground};
`;

const Description = styled.p`
  font-size: ${Theme.usage.fontSize.xSmall};
  color: ${colors.mutedForeground};
  margin-bottom: ${Theme.usage.space.small};
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const MetaInfo = styled.div`
  font-size: ${Theme.usage.fontSize.xxSmall};
  color: ${colors.mutedForeground};
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xSmall};
`;

interface DashboardCardProps {
  artifact: Artifact;
}

export function DashboardCard({ artifact }: DashboardCardProps) {
  return (
    <CardContainer>
      <Thumbnail>
        <ThumbnailEmoji>
          {artifact.type === 'sql' ? '📊' : artifact.type === 'notebook' ? '📓' : '📈'}
        </ThumbnailEmoji>
      </Thumbnail>

      <Content>
        <TitleRow>
          <Title>{artifact.title}</Title>
          <Button variant="ghost" size="sm" style={{ height: 24, width: 24, padding: 0 }}>
            <MoreVertical style={{ width: 16, height: 16 }} />
          </Button>
        </TitleRow>

        <Description>{artifact.description}</Description>

        <Footer>
          <MetaInfo>
            <div>{artifact.owner}</div>
            <div>Updated {artifact.created}</div>
          </MetaInfo>

          <Actions>
            <VerifiedBadge
              verified={artifact.verified}
              verifiedBy={artifact.verifiedBy}
              verifiedDate={artifact.verifiedDate}
            />
            <Button variant="ghost" size="sm" style={{ height: 32, padding: '0 8px' }}>
              <Share2 style={{ width: 16, height: 16 }} />
            </Button>
          </Actions>
        </Footer>
      </Content>
    </CardContainer>
  );
}
