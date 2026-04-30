import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { colors, radius } from '@/styles/theme';

const DropdownContext = createContext<{
  open: boolean;
  setOpen: (v: boolean) => void;
  triggerRef: React.RefObject<HTMLDivElement | null>;
}>({ open: false, setOpen: () => {}, triggerRef: { current: null } });

export function DropdownMenu({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement | null>(null);
  return (
    <DropdownContext.Provider value={{ open, setOpen, triggerRef }}>
      <DropdownWrapper>{children}</DropdownWrapper>
    </DropdownContext.Provider>
  );
}

const DropdownWrapper = styled.div`
  position: relative;
  display: inline-flex;
`;

export function DropdownMenuTrigger({ children, asChild }: { children: React.ReactNode; asChild?: boolean }) {
  void asChild;
  const { open, setOpen, triggerRef } = useContext(DropdownContext);
  return (
    <TriggerWrap ref={triggerRef} onClick={() => setOpen(!open)}>
      {children}
    </TriggerWrap>
  );
}

const TriggerWrap = styled.div`
  cursor: pointer;
  display: inline-flex;
  align-items: center;
`;

export function DropdownMenuContent({ children, align }: { children: React.ReactNode; align?: string }) {
  const { open, setOpen } = useContext(DropdownContext);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (contentRef.current && !contentRef.current.contains(e.target as Node)) {
      setOpen(false);
    }
  }, [setOpen]);

  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => document.addEventListener('mousedown', handleClickOutside), 0);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open, handleClickOutside]);

  if (!open) return null;

  return (
    <ContentPanel ref={contentRef} $align={align}>
      {children}
    </ContentPanel>
  );
}

const ContentPanel = styled.div<{ $align?: string }>`
  position: absolute;
  top: calc(100% + 4px);
  ${({ $align }) => $align === 'end' ? 'right: 0;' : 'left: 0;'}
  z-index: 9990;
  min-width: 180px;
  background: ${colors.white};
  border: 1px solid ${colors.border};
  border-radius: ${radius.lg};
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  padding: 4px;
  display: flex;
  flex-direction: column;
`;

export function DropdownMenuGroup({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function DropdownMenuItem({ children, onClick, style }: { children: React.ReactNode; onClick?: () => void; style?: React.CSSProperties }) {
  const { setOpen } = useContext(DropdownContext);
  return (
    <MenuItem
      style={style}
      onClick={() => {
        onClick?.();
        setOpen(false);
      }}
    >
      {children}
    </MenuItem>
  );
}

const MenuItem = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 8px 12px;
  font-size: 13px;
  font-family: inherit;
  color: ${colors.foreground};
  background: transparent;
  border: none;
  border-radius: ${radius.md};
  cursor: pointer;
  text-align: left;
  transition: background 100ms;

  &:hover {
    background: rgb(var(--app-muted-rgb) / 0.5);
  }
`;

export function DropdownMenuSeparator() {
  return <Separator />;
}

const Separator = styled.div`
  height: 1px;
  background: ${colors.border};
  margin: 4px 0;
`;
