import { Theme } from '@doordash/prism-react'
import styled, { css } from 'styled-components'

import { colors, radius } from '../../../styles/dataPortalAppTheme'

export type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline'

const variantStyles: Record<BadgeVariant, ReturnType<typeof css>> = {
  default: css`
    border-color: transparent;
    background-color: ${colors.primary};
    color: ${colors.primaryForeground};
  `,
  secondary: css`
    border-color: transparent;
    background-color: ${colors.secondary};
    color: ${colors.secondaryForeground};
  `,
  destructive: css`
    border-color: transparent;
    background-color: ${colors.destructive};
    color: ${colors.white};
  `,
  outline: css`
    color: ${colors.foreground};
    border-color: ${colors.border};
  `,
}

export const StyledBadge = styled.span<{ $variant: BadgeVariant }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: ${radius.lg};
  border: 1px solid;
  padding: ${Theme.usage.space.xxxSmall} ${Theme.usage.space.small};
  font-size: ${Theme.usage.fontSize.xxSmall};
  font-weight: 500;
  width: fit-content;
  white-space: nowrap;
  flex-shrink: 0;
  gap: ${Theme.usage.space.xxSmall};
  overflow: hidden;
  transition:
    color 150ms,
    box-shadow 150ms;

  svg {
    width: 12px;
    height: 12px;
    pointer-events: none;
  }

  ${({ $variant }) => variantStyles[$variant]}
`
