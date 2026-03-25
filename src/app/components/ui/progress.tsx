import React from 'react';
import { ProgressBar } from '@doordash/prism-react';

interface ProgressProps {
  value?: number;
  max?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ value = 0, max = 100, className, style }, _ref) => {
    const progress = Math.min(Math.max((value / max) * 100, 0), 100);
    return (
      <div className={className} style={style}>
        <ProgressBar progress={progress} ariaLabel="Progress" />
      </div>
    );
  }
);

Progress.displayName = 'Progress';
