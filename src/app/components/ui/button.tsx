import React from 'react';
import styled, { css } from 'styled-components';
import { colors } from '@/styles/theme';

export type ButtonVariant = 'default' | 'secondary' | 'outline' | 'ghost' | 'link' | 'destructive';
export type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';

export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const sizeStyles = {
  sm: css`
    padding: 6px 14px;
    font-size: 13px;
    min-height: 32px;
  `,
  default: css`
    padding: 8px 16px;
    font-size: 14px;
    min-height: 36px;
  `,
  lg: css`
    padding: 10px 20px;
    font-size: 15px;
    min-height: 40px;
  `,
  icon: css`
    padding: 8px;
    width: 36px;
    height: 36px;
    min-height: 36px;
  `,
} as const;

const variantStyles = {
  default: css`
    background: ${colors.violet600};
    color: #fff;
    border: none;

    &:hover:not(:disabled) {
      opacity: 0.9;
    }
  `,
  secondary: css`
    background: ${colors.muted};
    color: ${colors.foreground};
    border: 1px solid ${colors.border};

    &:hover:not(:disabled) {
      background: rgb(var(--app-muted-rgb) / 0.8);
    }
  `,
  outline: css`
    background: transparent;
    color: var(--app-fg);
    border: 1px solid var(--app-outline-pill-border, ${colors.border});

    &:hover:not(:disabled) {
      border-color: var(--app-outline-pill-border-hover, ${colors.borderStrong});
      background: var(--app-outline-pill-hover-fill, rgb(var(--app-muted-rgb) / 0.4));
    }
  `,
  ghost: css`
    background: transparent;
    color: ${colors.mutedForeground};
    border: none;

    &:hover:not(:disabled) {
      color: ${colors.foreground};
      background: rgb(var(--app-overlay-rgb) / 0.06);
    }
  `,
  link: css`
    background: transparent;
    color: ${colors.violet600};
    border: none;
    padding: 0;
    min-height: unset;
    text-decoration: underline;
    text-underline-offset: 2px;

    &:hover:not(:disabled) {
      opacity: 0.8;
    }
  `,
  destructive: css`
    background: #ef4444;
    color: #fff;
    border: none;

    &:hover:not(:disabled) {
      background: #dc2626;
    }
  `,
} as const;

const StyledButton = styled.button<{ $variant: ButtonVariant; $size: ButtonSize }>`
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin: 0;
  font-family: inherit;
  font-weight: 500;
  line-height: 1.25;
  white-space: nowrap;
  border-radius: 9999px;
  cursor: pointer;
  transition: background 150ms, border-color 150ms, color 150ms, opacity 150ms;

  &:focus-visible {
    outline: 2px solid var(--app-dd-primary, ${colors.violet600});
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }

  ${({ $size }) => sizeStyles[$size]}
  ${({ $variant }) => variantStyles[$variant]}
`;

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'default', size = 'default', children, ...rest }, ref) => {
    return (
      <StyledButton
        ref={ref}
        type="button"
        $variant={variant}
        $size={size}
        {...rest}
      >
        {children}
      </StyledButton>
    );
  },
);

Button.displayName = 'Button';
