import * as React from 'react'

import type { SurfaceCardPadding, SurfaceCardVariant } from '../SurfaceCard/SurfaceCard'

import * as S from './ClickableCard.styles'

export type ClickableCardProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  readonly variant?: SurfaceCardVariant
  readonly padding?: SurfaceCardPadding
}

/**
 * Card-sized control: use for navigational tiles and other card-shaped actions.
 * Renders a native `button` (defaults to `type="button"`).
 */
export const ClickableCard = React.forwardRef<HTMLButtonElement, ClickableCardProps>((props, ref) => {
  const { variant = 'solid', padding = 'md', children, ...rest } = props
  const buttonType = props.type ?? 'button' // eslint-disable-line react/prop-types -- typed via ClickableCardProps
  return (
    <S.Root ref={ref} $variant={variant} $padding={padding} {...rest} type={buttonType}>
      {children}
    </S.Root>
  )
})

ClickableCard.displayName = 'ClickableCard'
