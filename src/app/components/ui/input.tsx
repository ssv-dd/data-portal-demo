import React from 'react';
import styled from 'styled-components';
import { colors, radius } from '@/styles/theme';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'size'> {
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

const StyledInput = styled.input`
  width: 100%;
  padding: 10px 12px;
  font-size: 14px;
  font-family: inherit;
  color: ${colors.foreground};
  background: ${colors.background};
  border: 1px solid ${colors.border};
  border-radius: ${radius.md};
  outline: none;
  transition: border-color 150ms;

  &::placeholder {
    color: ${colors.mutedForeground};
  }

  &:focus {
    border-color: ${colors.violet500};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ value, onChange, placeholder, disabled, id, className, style, type, readOnly, onKeyDown, autoFocus, ...rest }, ref) => {
    return (
      <StyledInput
        ref={ref}
        type={type || 'text'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        id={id}
        className={className}
        style={style}
        onKeyDown={onKeyDown}
        autoFocus={autoFocus}
        {...rest}
      />
    );
  }
);

Input.displayName = 'Input';
