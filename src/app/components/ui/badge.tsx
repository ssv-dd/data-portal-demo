import React from 'react';
import styled, { css } from 'styled-components';
import { Theme } from '@doordash/prism-react';
import { colors, radius } from '@/styles/theme';

type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

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
};

const StyledBadge = styled.span<{ $variant: BadgeVariant }>`
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
  transition: color 150ms, box-shadow 150ms;

  svg {
    width: 12px;
    height: 12px;
    pointer-events: none;
  }

  ${({ $variant }) => variantStyles[$variant]}
`;

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = 'default', className, style, ...props }, ref) => {
    return (
      <StyledBadge ref={ref} $variant={variant} className={className} style={style} {...props} />
    );
  }
);

Badge.displayName = 'Badge';
