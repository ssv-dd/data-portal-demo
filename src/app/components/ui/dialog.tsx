import React, { useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import { colors, radius, shadows } from '@/styles/theme';
import { Theme } from '@doordash/prism-react';

export const ModalSize = { small: 'small', medium: 'medium', large: 'large' } as const;

interface DialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
  title?: string;
  description?: string;
  size?: string;
  maxWidth?: string;
}

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 9998;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Panel = styled.div<{ $maxWidth: string }>`
  position: relative;
  z-index: 9999;
  background: ${colors.background};
  border: 1px solid ${colors.border};
  border-radius: ${radius.xl};
  box-shadow: ${shadows.popover};
  width: 90vw;
  max-width: ${({ $maxWidth }) => $maxWidth};
  max-height: 85vh;
  overflow-y: auto;
  padding: ${Theme.usage.space.large};
`;

const TitleBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${Theme.usage.space.medium};
`;

const Title = styled.h2`
  font-size: ${Theme.usage.fontSize.large};
  font-weight: 600;
  color: ${colors.foreground};
  margin: 0;
`;

const CloseBtn = styled.button`
  width: 28px;
  height: 28px;
  border-radius: ${radius.sm};
  border: none;
  background: none;
  cursor: pointer;
  font-size: 18px;
  color: ${colors.mutedForeground};
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: ${colors.muted};
  }
`;

const SIZE_MAP: Record<string, string> = {
  small: '400px',
  medium: '512px',
  large: '680px',
};

export function Dialog({ open, onOpenChange, children, title = '', size, maxWidth }: DialogProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  const handleClose = useCallback(() => onOpenChange?.(false), [onOpenChange]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, handleClose]);

  if (!open) return null;

  const resolvedMax = maxWidth || SIZE_MAP[size ?? 'medium'] || '512px';

  return createPortal(
    <Backdrop onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}>
      <Panel ref={panelRef} $maxWidth={resolvedMax} role="dialog" aria-modal="true" aria-label={title}>
        {title && (
          <TitleBar>
            <Title>{title}</Title>
            <CloseBtn onClick={handleClose} aria-label="Close">&times;</CloseBtn>
          </TitleBar>
        )}
        {children}
      </Panel>
    </Backdrop>,
    document.body,
  );
}

export function DialogContent({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <div style={style}>{children}</div>;
}

export function DialogHeader({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function DialogTitle({ children }: { children: React.ReactNode }) {
  void children;
  return null;
}

export function DialogDescription({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <p style={{ fontSize: '14px', color: '#71717a', ...style }}>{children}</p>;
}

export function DialogFooter({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px', ...style }}>{children}</div>;
}

export function DialogTrigger({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function DialogPortal({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function DialogClose({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
