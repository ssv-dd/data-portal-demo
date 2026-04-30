import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { colors, radius } from '@/styles/theme';

export const TooltipPosition = {
  topCenter: 'topCenter',
  bottomCenter: 'bottomCenter',
  topLeft: 'topLeft',
  topRight: 'topRight',
} as const;

export function TooltipProvider({ children }: { children: React.ReactNode; delayDuration?: number }) {
  return <>{children}</>;
}

interface TooltipProps {
  children: React.ReactNode;
  content?: React.ReactNode;
}

export function Tooltip({ children, content }: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout>>();

  if (!content) return <>{children}</>;

  const show = () => {
    timeout.current = setTimeout(() => setVisible(true), 300);
  };
  const hide = () => {
    clearTimeout(timeout.current);
    setVisible(false);
  };

  return (
    <TooltipWrap onMouseEnter={show} onMouseLeave={hide} onFocus={show} onBlur={hide}>
      {children}
      {visible && <TooltipBubble>{content}</TooltipBubble>}
    </TooltipWrap>
  );
}

const TooltipWrap = styled.span`
  position: relative;
  display: inline-flex;
`;

const TooltipBubble = styled.div`
  position: absolute;
  bottom: calc(100% + 6px);
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  padding: 6px 10px;
  font-size: 12px;
  font-weight: 500;
  color: #fff;
  background: ${colors.foreground};
  border-radius: ${radius.md};
  white-space: nowrap;
  pointer-events: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
`;

export function TooltipTrigger({ children, asChild, ...props }: {
  children: React.ReactNode;
  asChild?: boolean;
} & React.HTMLAttributes<HTMLDivElement>) {
  void asChild;
  return <div {...props}>{children}</div>;
}

export function TooltipContent({ children }: { children: React.ReactNode; side?: string; sideOffset?: number }) {
  void children;
  return null;
}
