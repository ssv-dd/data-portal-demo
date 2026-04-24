import React from 'react'

import * as S from './Badge.styles'

export type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  readonly variant?: S.BadgeVariant
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = 'default', className, ...props }, ref) => (
    <S.StyledBadge ref={ref} $variant={variant} className={className} {...props} />
  )
)

Badge.displayName = 'Badge'
