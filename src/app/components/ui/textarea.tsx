import React from 'react';
import styled from 'styled-components';
import { colors, radius } from '@/styles/theme';

interface TextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
}

const StyledTextarea = styled.textarea`
  width: 100%;
  padding: 10px 12px;
  font-size: 14px;
  font-family: inherit;
  color: ${colors.foreground};
  background: ${colors.background};
  border: 1px solid ${colors.border};
  border-radius: ${radius.md};
  outline: none;
  resize: vertical;
  min-height: 80px;
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

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ value, onChange, placeholder, disabled, id, className, style, rows, ...rest }, ref) => {
    return (
      <StyledTextarea
        ref={ref}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        id={id}
        className={className}
        style={style}
        rows={rows}
        {...rest}
      />
    );
  }
);

Textarea.displayName = 'Textarea';
