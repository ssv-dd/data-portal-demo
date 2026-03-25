import React from 'react';
import {
  Tooltip as PrismTooltip,
  TooltipPosition,
} from '@doordash/prism-react';

export { TooltipPosition };

export function TooltipProvider({ children }: { children: React.ReactNode; delayDuration?: number }) {
  return <>{children}</>;
}

interface TooltipProps {
  children: React.ReactNode;
  content?: React.ReactNode;
}

export function Tooltip({ children, content }: TooltipProps) {
  if (!content) return <>{children}</>;

  return (
    <PrismTooltip
      content={content}
      position={TooltipPosition.topCenter}
    >
      {({ describedBy }) => (
        <span aria-describedby={describedBy} style={{ display: 'inline-flex' }}>
          {children}
        </span>
      )}
    </PrismTooltip>
  );
}

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
