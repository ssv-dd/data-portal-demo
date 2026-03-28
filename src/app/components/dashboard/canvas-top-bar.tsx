import { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { Plus, Eye, Share2 } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Theme } from '@doordash/prism-react';
import { colors } from '@/styles/theme';
import { domainColors } from '@/config/app.config';
import type { Canvas } from '@/types';

interface CanvasTopBarProps {
  canvas: Canvas;
  onUpdate: (updates: Partial<Canvas>) => void;
  onAddWidget: () => void;
  onPublish: () => void;
}

const ToolbarContainer = styled.div`
  border-bottom: 1px solid ${colors.border};
  padding: ${Theme.usage.space.medium} ${Theme.usage.space.xLarge};
`;

const ToolbarRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const TitleSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const TitleInput = styled.input`
  font-size: ${Theme.usage.fontSize.xLarge};
  color: ${colors.foreground};
  font-weight: 600;
  background: none;
  border: 1px solid transparent;
  border-radius: 6px;
  padding: 2px 6px;
  margin: -2px -6px;
  outline: none;
  width: 100%;
  max-width: 400px;

  &:hover {
    border-color: ${colors.border};
  }

  &:focus {
    border-color: var(--app-dd-primary);
    background: rgb(var(--app-surface-rgb) / 0.5);
  }
`;

const MetaRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xSmall};
  margin-top: 4px;
`;

const Badge = styled.span<{ $color?: string }>`
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 9999px;
  font-size: ${Theme.usage.fontSize.xxSmall};
  font-weight: 500;
  background: ${({ $color }) => $color ? `${$color}18` : 'rgb(var(--app-overlay-rgb) / 0.06)'};
  color: ${({ $color }) => $color ?? colors.mutedForeground};
`;

const StatusBadge = styled(Badge)<{ $published: boolean }>`
  background: ${({ $published }) => $published ? 'rgb(var(--app-emerald-rgb, 16 185 129) / 0.12)' : 'rgb(var(--app-overlay-rgb) / 0.06)'};
  color: ${({ $published }) => $published ? colors.emerald500 : colors.mutedForeground};
`;

const Separator = styled.span`
  color: rgb(var(--app-muted-fg-rgb) / 0.3);
  font-size: ${Theme.usage.fontSize.xxSmall};
`;

const SubtitleText = styled.span`
  font-size: ${Theme.usage.fontSize.xxSmall};
  color: ${colors.mutedForeground};
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xSmall};
`;

export function CanvasTopBar({ canvas, onUpdate, onAddWidget, onPublish }: CanvasTopBarProps) {
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState(canvas.title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTitleValue(canvas.title);
  }, [canvas.title]);

  useEffect(() => {
    if (editingTitle && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingTitle]);

  const commitTitle = () => {
    setEditingTitle(false);
    const trimmed = titleValue.trim();
    if (trimmed && trimmed !== canvas.title) {
      onUpdate({ title: trimmed });
    } else {
      setTitleValue(canvas.title);
    }
  };

  const domainColor = domainColors[canvas.domain] ?? undefined;
  const widgetCount = canvas.layout.length;

  return (
    <ToolbarContainer>
      <ToolbarRow>
        <TitleSection>
          <TitleInput
            ref={inputRef}
            value={titleValue}
            readOnly={!editingTitle}
            onClick={() => setEditingTitle(true)}
            onChange={(e) => setTitleValue(e.target.value)}
            onBlur={commitTitle}
            onKeyDown={(e) => {
              if (e.key === 'Enter') commitTitle();
              if (e.key === 'Escape') { setTitleValue(canvas.title); setEditingTitle(false); }
            }}
          />
          <MetaRow>
            <Badge $color={domainColor}>{canvas.domain}</Badge>
            <Badge>{canvas.tier}</Badge>
            <StatusBadge $published={canvas.status === 'published'}>
              {canvas.status === 'published' ? 'Published' : 'Draft'}
            </StatusBadge>
            <Separator>·</Separator>
            <SubtitleText>{widgetCount} widget{widgetCount !== 1 ? 's' : ''}</SubtitleText>
          </MetaRow>
        </TitleSection>
        <Actions>
          <Button variant="outline" style={{ gap: '8px', fontSize: '14px' }} onClick={onAddWidget}>
            <Plus style={{ width: 16, height: 16 }} />
            Add Widget
          </Button>
          <Button variant="outline" style={{ gap: '8px', fontSize: '14px' }}>
            <Eye style={{ width: 16, height: 16 }} />
            Preview
          </Button>
          <Button
            style={{ backgroundColor: colors.ddPrimary, color: colors.white, gap: '8px', fontSize: '14px' }}
            onClick={onPublish}
          >
            <Share2 style={{ width: 16, height: 16 }} />
            Publish
          </Button>
        </Actions>
      </ToolbarRow>
    </ToolbarContainer>
  );
}
