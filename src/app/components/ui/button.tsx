import React from 'react';
import {
  Button as PrismButton,
  ButtonType,
  ButtonSize as PrismButtonSize,
} from '@doordash/prism-react';
import styled, { css } from 'styled-components';

export type ButtonVariant = 'default' | 'secondary' | 'outline' | 'ghost' | 'link' | 'destructive';
export type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';

export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const VARIANT_MAP: Record<Exclude<ButtonVariant, 'outline'>, ButtonType> = {
  default: ButtonType.primary,
  secondary: ButtonType.secondary,
  ghost: ButtonType.flatSecondary,
  link: ButtonType.flatPrimary,
  destructive: ButtonType.primary,
};

const SIZE_MAP: Record<ButtonSize, (typeof PrismButtonSize)[keyof typeof PrismButtonSize]> = {
  default: PrismButtonSize.medium,
  sm: PrismButtonSize.small,
  lg: PrismButtonSize.large,
  icon: PrismButtonSize.small,
};

const outlineSizeStyles = {
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

/**
 * Pill outline buttons: transparent fill, high-contrast label, subtle border.
 * Implemented natively so selected/hover styles apply to the rounded button, not a wrapper span.
 */
const OutlineButton = styled.button<{ $size: ButtonSize }>`
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
  border: 1px solid var(--app-outline-pill-border);
  background: transparent;
  color: var(--app-fg);
  cursor: pointer;
  transition:
    border-color 0.15s ease,
    background-color 0.15s ease,
    color 0.15s ease;

  &:hover:not(:disabled) {
    border-color: var(--app-outline-pill-border-hover);
    background: var(--app-outline-pill-hover-fill);
  }

  &:focus-visible {
    outline: 2px solid var(--app-dd-primary);
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }

  ${({ $size }) => outlineSizeStyles[$size]}
`;

const ButtonChildrenWrapper = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
`;

function hasMultipleChildren(children: React.ReactNode): boolean {
  return React.Children.count(children) > 1;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'default',
      size = 'default',
      disabled,
      children,
      onClick,
      className,
      id,
      style,
      ...rest
    },
    ref,
  ) => {
    const wrappedChildren = hasMultipleChildren(children) ? (
      <ButtonChildrenWrapper>{children}</ButtonChildrenWrapper>
    ) : (
      children
    );

    if (variant === 'outline') {
      return (
        <OutlineButton
          ref={ref}
          type="button"
          $size={size}
          className={className}
          id={id}
          style={style}
          disabled={disabled}
          onClick={onClick}
          {...rest}
        >
          {wrappedChildren}
        </OutlineButton>
      );
    }

    const tagProps: React.ButtonHTMLAttributes<HTMLButtonElement> = { ...rest };
    if (style) {
      tagProps.style = style;
    }

    return (
      <PrismButton
        ref={ref}
        type={VARIANT_MAP[variant]}
        size={SIZE_MAP[size]}
        isDisabled={disabled}
        onClick={onClick}
        className={className}
        id={id}
        isInline={size === 'icon'}
        tagProps={Object.keys(tagProps).length > 0 ? tagProps : undefined}
      >
        {wrappedChildren}
      </PrismButton>
    );
  },
);

Button.displayName = 'Button';
