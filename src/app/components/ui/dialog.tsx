import React, { useEffect, useCallback } from 'react';
import { ModalSize } from '@doordash/prism-react';
import styled from 'styled-components';
import { colors, radius } from '@/styles/theme';

export { ModalSize };

interface DialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
  title?: string;
  description?: string;
  size?: typeof ModalSize[keyof typeof ModalSize];
  maxWidth?: string;
}

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(2px);
`;

const ModalPanel = styled.div<{ $size?: string }>`
  background: ${colors.white};
  border-radius: ${radius.xl};
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
  width: ${({ $size }) => $size === 'large' ? '640px' : $size === 'small' ? '360px' : '500px'};
  max-width: 90vw;
  max-height: 85vh;
  overflow-y: auto;
  padding: 24px;
`;

const ModalTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: ${colors.foreground};
  margin: 0 0 16px 0;
`;

export function Dialog({ open, onOpenChange, children, title = '', size }: DialogProps) {
  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onOpenChange?.(false);
    }
  }, [onOpenChange]);

  useEffect(() => {
    if (!open) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onOpenChange?.(false);
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <Backdrop onClick={handleBackdropClick}>
      <ModalPanel $size={size}>
        {title && <ModalTitle>{title}</ModalTitle>}
        {children}
      </ModalPanel>
    </Backdrop>
  );
}

// Legacy compound components - now pass-through
export function DialogContent({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <div style={style}>{children}</div>;
}

export function DialogHeader({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function DialogTitle({ children }: { children: React.ReactNode }) {
  void children;
  return null; // Title is now handled by the Modal's title prop
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
