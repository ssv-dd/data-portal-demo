import { Button as PrismButton, ButtonType, ButtonSize as PrismButtonSize } from '@doordash/prism-react'
import React from 'react'

import * as S from './ButtonWrapper.styles'

export type ButtonVariant = 'default' | 'primary' | 'secondary' | 'outline' | 'ghost' | 'link' | 'destructive'
export type ButtonSize = 'default' | 'sm' | 'lg' | 'icon'

export type ButtonProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'> & {
  readonly variant?: ButtonVariant
  readonly size?: ButtonSize
}

const VARIANT_MAP: Record<Exclude<ButtonVariant, 'outline' | 'primary' | 'destructive'>, ButtonType> = {
  default: ButtonType.primary,
  secondary: ButtonType.secondary,
  ghost: ButtonType.flatSecondary,
  link: ButtonType.flatPrimary,
}

const SIZE_MAP: Record<ButtonSize, (typeof PrismButtonSize)[keyof typeof PrismButtonSize]> = {
  default: PrismButtonSize.medium,
  sm: PrismButtonSize.small,
  lg: PrismButtonSize.large,
  icon: PrismButtonSize.small,
}

function hasMultipleChildren(children: React.ReactNode): boolean {
  return React.Children.count(children) > 1
}

export const ButtonWrapper = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { variant = 'default', size = 'default', disabled, children, onClick, className, id, style, ...rest },
    ref
  ) => {
    const wrappedChildren = hasMultipleChildren(children) ? (
      <S.ButtonChildrenWrapper>{children}</S.ButtonChildrenWrapper>
    ) : (
      children
    )

    if (variant === 'outline') {
      return (
        <S.OutlineButton
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
        </S.OutlineButton>
      )
    }

    if (variant === 'primary') {
      return (
        <S.PrimaryPillButton
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
        </S.PrimaryPillButton>
      )
    }

    if (variant === 'destructive') {
      return (
        <S.DestructiveButton
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
        </S.DestructiveButton>
      )
    }

    const tagProps: React.ButtonHTMLAttributes<HTMLButtonElement> = { ...rest }
    if (style) {
      tagProps.style = style
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
    )
  }
)

ButtonWrapper.displayName = 'ButtonWrapper'
