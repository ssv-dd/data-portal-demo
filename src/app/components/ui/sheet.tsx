import React, { useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { Theme } from '@doordash/prism-react';
import { colors, radius, shadows } from '@/styles/theme';
import { X } from 'lucide-react';

type SheetSide = 'top' | 'right' | 'bottom' | 'left';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideFromRight = keyframes`
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
`;

const slideFromLeft = keyframes`
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
`;

const slideFromTop = keyframes`
  from { transform: translateY(-100%); }
  to { transform: translateY(0); }
`;

const slideFromBottom = keyframes`
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
`;

const slideAnimations: Record<SheetSide, ReturnType<typeof keyframes>> = {
  right: slideFromRight,
  left: slideFromLeft,
  top: slideFromTop,
  bottom: slideFromBottom,
};

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 50;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(2px);
  animation: ${fadeIn} 200ms ease;
`;

const SheetContentStyled = styled.div<{ $side: SheetSide }>`
  position: fixed;
  z-index: 50;
  gap: ${Theme.usage.space.medium};
  background: ${colors.background};
  padding: ${Theme.usage.space.large};
  box-shadow: ${shadows.popover};
  animation: ${({ $side }) => slideAnimations[$side]} 200ms ease;

  ${({ $side }) => {
    switch ($side) {
      case 'right':
        return css`
          inset: 0 0 0 auto;
          width: 100%;
          max-width: 384px;
          border-radius: ${radius['2xl']} 0 0 ${radius['2xl']};
        `;
      case 'left':
        return css`
          inset: 0 auto 0 0;
          width: 100%;
          max-width: 384px;
          border-radius: 0 ${radius['2xl']} ${radius['2xl']} 0;
        `;
      case 'top':
        return css`inset: 0 0 auto 0;`;
      case 'bottom':
        return css`inset: auto 0 0 0;`;
    }
  }}
`;

const CloseButton = styled.button`
  position: absolute;
  right: ${Theme.usage.space.medium};
  top: ${Theme.usage.space.medium};
  border-radius: ${radius.sm};
  opacity: 0.7;
  transition: opacity 150ms;
  svg { width: 16px; height: 16px; }
  &:hover { opacity: 1; }
`;

const SheetContext = React.createContext<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
}>({ open: false, onOpenChange: () => {} });

export function Sheet({ open = false, onOpenChange, children }: {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <SheetContext.Provider value={{ open, onOpenChange: onOpenChange || (() => {}) }}>
      {children}
    </SheetContext.Provider>
  );
}

export function SheetTrigger({ children, ...props }: React.HTMLAttributes<HTMLButtonElement>) {
  const { onOpenChange } = React.useContext(SheetContext);
  return <button onClick={() => onOpenChange(true)} {...props}>{children}</button>;
}

export function SheetClose({ children, ...props }: React.HTMLAttributes<HTMLButtonElement>) {
  const { onOpenChange } = React.useContext(SheetContext);
  return <button onClick={() => onOpenChange(false)} {...props}>{children || <X />}</button>;
}

export function SheetContent({ side = 'right', children, ...props }: React.HTMLAttributes<HTMLDivElement> & { side?: SheetSide }) {
  const { open, onOpenChange } = React.useContext(SheetContext);

  useEffect(() => {
    if (open) {
      const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onOpenChange(false); };
      document.addEventListener('keydown', handler);
      document.body.style.overflow = 'hidden';
      return () => { document.removeEventListener('keydown', handler); document.body.style.overflow = ''; };
    }
  }, [open, onOpenChange]);

  if (!open) return null;
  return (
    <>
      <Overlay onClick={() => onOpenChange(false)} />
      <SheetContentStyled $side={side} {...props}>
        <CloseButton onClick={() => onOpenChange(false)} aria-label="Close"><X /></CloseButton>
        {children}
      </SheetContentStyled>
    </>
  );
}

export const SheetHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${Theme.usage.space.xSmall};
  text-align: left;
`;

export const SheetFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${Theme.usage.space.xSmall};
`;

export const SheetTitle = styled.h3`
  font-size: ${Theme.usage.fontSize.medium};
  font-weight: 600;
`;

export const SheetDescription = styled.p`
  font-size: ${Theme.usage.fontSize.xSmall};
  color: ${colors.mutedForeground};
`;
