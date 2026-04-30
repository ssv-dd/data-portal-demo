import React from 'react';
import styled from 'styled-components';
import { Check } from 'lucide-react';
import { colors, radius } from '@/styles/theme';

interface CheckboxProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const Box = styled.button<{ $checked: boolean; disabled?: boolean }>`
  width: 18px;
  height: 18px;
  border-radius: ${radius.sm};
  border: 1.5px solid ${({ $checked }) => $checked ? colors.violet600 : colors.border};
  background: ${({ $checked }) => $checked ? colors.violet600 : 'transparent'};
  color: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  cursor: ${({ disabled }) => disabled ? 'not-allowed' : 'pointer'};
  opacity: ${({ disabled }) => disabled ? 0.5 : 1};
  transition: background 150ms, border-color 150ms;
  flex-shrink: 0;

  &:hover:not(:disabled) {
    border-color: ${colors.violet600};
  }

  &:focus-visible {
    outline: 2px solid ${colors.violet600};
    outline-offset: 2px;
  }
`;

export const Checkbox = React.forwardRef<HTMLButtonElement, CheckboxProps>(
  ({ checked = false, onCheckedChange, disabled, className, style }, ref) => {
    return (
      <Box
        ref={ref}
        type="button"
        role="checkbox"
        aria-checked={checked}
        $checked={checked}
        disabled={disabled}
        className={className}
        style={style}
        onClick={() => !disabled && onCheckedChange?.(!checked)}
      >
        {checked && <Check style={{ width: 12, height: 12 }} />}
      </Box>
    );
  }
);

Checkbox.displayName = 'Checkbox';
