import * as React from 'react'

import * as S from './SurfaceCard.styles'

export type SurfaceCardVariant = 'solid' | 'glass'
export type SurfaceCardPadding = 'none' | 'sm' | 'md' | 'lg'

export type SurfaceCardProps = React.HTMLAttributes<HTMLDivElement> & {
  readonly variant?: SurfaceCardVariant
  readonly padding?: SurfaceCardPadding
}

export const SurfaceCard = React.forwardRef<HTMLDivElement, SurfaceCardProps>(
  ({ variant = 'solid', padding = 'md', children, ...rest }, ref) => {
    return (
      <S.Root ref={ref} $variant={variant} $padding={padding} {...rest}>
        {children}
      </S.Root>
    )
  }
)

SurfaceCard.displayName = 'SurfaceCard'
