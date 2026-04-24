import { Theme } from '@doordash/prism-react'
import styled, { css } from 'styled-components'

import type { ButtonSize } from './ButtonWrapper'

export const pillSizeStyles = {
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
} as const

const pillBase = css`
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
  transition:
    border-color 0.15s ease,
    background-color 0.15s ease,
    color 0.15s ease,
    filter 0.15s ease;

  &:focus-visible {
    outline: 2px solid var(--app-dd-primary);
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`

export const OutlineButton = styled.button<{ $size: ButtonSize }>`
  ${pillBase}
  border: 1px solid var(--app-outline-pill-border);
  background: transparent;
  color: var(--app-fg);

  &:hover:not(:disabled) {
    border-color: var(--app-outline-pill-border-hover);
    background: var(--app-outline-pill-hover-fill);
  }

  ${({ $size }) => pillSizeStyles[$size]}
`

export const PrimaryPillButton = styled.button<{ $size: ButtonSize }>`
  ${pillBase}
  border: none;
  background-color: ${Theme.usage.color.brand.primary};
  color: ${Theme.usage.color.text.inverse.default};

  &:hover:not(:disabled) {
    filter: brightness(0.85);
  }

  ${({ $size }) => pillSizeStyles[$size]}
`

export const DestructiveButton = styled.button<{ $size: ButtonSize }>`
  ${pillBase}
  border: none;
  background-color: var(--app-destructive);
  color: ${Theme.usage.color.text.inverse.default};

  &:hover:not(:disabled) {
    filter: brightness(0.9);
  }

  &:active:not(:disabled) {
    filter: brightness(0.8);
  }

  ${({ $size }) => pillSizeStyles[$size]}
`

export const ButtonChildrenWrapper = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
`
