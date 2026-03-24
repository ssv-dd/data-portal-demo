import React from 'react';
import {
  Button as PrismButton,
  ButtonType,
  ButtonSize as PrismButtonSize,
} from '@doordash/prism-react';
import styled from 'styled-components';

export type ButtonVariant = 'default' | 'secondary' | 'outline' | 'ghost' | 'link' | 'destructive';
export type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';

export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const VARIANT_MAP: Record<ButtonVariant, ButtonType> = {
  default: ButtonType.primary,
  secondary: ButtonType.secondary,
  outline: ButtonType.secondary,
  ghost: ButtonType.flatSecondary,
  link: ButtonType.flatPrimary,
  destructive: ButtonType.primary,
};

const SIZE_MAP: Record<ButtonSize, typeof PrismButtonSize[keyof typeof PrismButtonSize]> = {
  default: PrismButtonSize.medium,
  sm: PrismButtonSize.small,
  lg: PrismButtonSize.large,
  icon: PrismButtonSize.small,
};

const ButtonChildrenWrapper = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
`;

function hasMultipleChildren(children: React.ReactNode): boolean {
  return React.Children.count(children) > 1;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'default', size = 'default', disabled, children, onClick, className, id, style, ...rest }, _ref) => {
    void rest;
    const wrappedChildren = hasMultipleChildren(children) ? (
      <ButtonChildrenWrapper>{children}</ButtonChildrenWrapper>
    ) : (
      children
    );

    const button = (
      <PrismButton
        type={VARIANT_MAP[variant]}
        size={SIZE_MAP[size]}
        isDisabled={disabled}
        onClick={onClick}
        className={className}
        id={id}
        isInline={size === 'icon'}
      >
        {wrappedChildren}
      </PrismButton>
    );

    if (style) {
      return <span style={style}>{button}</span>;
    }
    return button;
  }
);

Button.displayName = 'Button';
