import React from 'react';
import { Modal, ModalSize } from '@doordash/prism-react';

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

export function Dialog({ open, onOpenChange, children, title = '', size, ...rest }: DialogProps) {
  void rest;
  return (
    <Modal
      isOpen={open ?? false}
      onOpenChange={(visible) => {
        if (!visible) onOpenChange?.(false);
      }}
      title={title}
      size={size}
    >
      {children}
    </Modal>
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
