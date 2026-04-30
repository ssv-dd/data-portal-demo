import React from 'react';
import styled from 'styled-components';
import { colors } from '@/styles/theme';

interface SwitchProps {
  id?: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const Track = styled.button<{ $checked: boolean; disabled?: boolean }>`
  position: relative;
  width: 40px;
  height: 22px;
  border-radius: 11px;
  border: none;
  padding: 0;
  cursor: ${({ disabled }) => disabled ? 'not-allowed' : 'pointer'};
  background: ${({ $checked }) => $checked ? colors.violet600 : colors.muted};
  opacity: ${({ disabled }) => disabled ? 0.5 : 1};
  transition: background 150ms;

  &:focus-visible {
    outline: 2px solid ${colors.violet600};
    outline-offset: 2px;
  }
`;

const Thumb = styled.span<{ $checked: boolean }>`
  position: absolute;
  top: 2px;
  left: ${({ $checked }) => $checked ? '20px' : '2px'};
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  transition: left 150ms;
`;

export const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  ({ checked = false, onCheckedChange, disabled, className, style }, ref) => {
    return (
      <Track
        ref={ref}
        type="button"
        role="switch"
        aria-checked={checked}
        $checked={checked}
        disabled={disabled}
        className={className}
        style={style}
        onClick={() => !disabled && onCheckedChange?.(!checked)}
      >
        <Thumb $checked={checked} />
      </Track>
    );
  }
);

Switch.displayName = 'Switch';
