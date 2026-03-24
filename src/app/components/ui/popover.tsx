import React, { useState, useRef, useEffect, createContext, useContext } from 'react';
import styled, { keyframes } from 'styled-components';
import { Theme } from '@doordash/prism-react';
import { colors, radius, shadows } from '@/styles/theme';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: translateY(0); }
`;

const PopoverContentStyled = styled.div<{ $align?: 'start' | 'center' | 'end' }>`
  position: absolute;
  z-index: 50;
  width: 288px;
  border-radius: ${radius.xl};
  border: 1px solid rgba(0, 0, 0, 0.06);
  background: ${colors.background};
  padding: ${Theme.usage.space.medium};
  box-shadow: ${shadows.popover};
  animation: ${fadeIn} 150ms ease;
  top: calc(100% + ${Theme.usage.space.xxSmall});

  ${({ $align }) => {
    if ($align === 'end') return 'right: 0;';
    if ($align === 'center') return 'left: 50%; transform: translateX(-50%);';
    return 'left: 0;';
  }}
`;

const PopoverWrapper = styled.div`
  position: relative;
  display: inline-block;
`;

interface PopoverContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const PopoverContext = createContext<PopoverContextType>({ open: false, setOpen: () => {} });

export function Popover({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <PopoverContext.Provider value={{ open, setOpen }}>
      <PopoverWrapper>{children}</PopoverWrapper>
    </PopoverContext.Provider>
  );
}

export function PopoverTrigger({ children, asChild, ...props }: React.HTMLAttributes<HTMLElement> & { asChild?: boolean }) {
  const { open, setOpen } = useContext(PopoverContext);
  const handleClick = () => setOpen(!open);

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, { onClick: handleClick });
  }

  return <button onClick={handleClick} {...props}>{children}</button>;
}

export function PopoverContent({ align = 'center', children, ...props }: React.HTMLAttributes<HTMLDivElement> & { align?: 'start' | 'center' | 'end'; sideOffset?: number }) {
  const { open, setOpen } = useContext(PopoverContext);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.parentElement?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open, setOpen]);

  if (!open) return null;
  return <PopoverContentStyled ref={ref} $align={align} {...props}>{children}</PopoverContentStyled>;
}

export function PopoverAnchor({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div {...props}>{children}</div>;
}
