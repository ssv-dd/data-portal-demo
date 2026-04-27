import { Tooltip as PrismTooltip, TooltipPosition } from '@doordash/prism-react'
import type { ReactNode } from 'react'

export { TooltipPosition }

type TooltipProps = {
  readonly children: ReactNode
  readonly content?: ReactNode
}

export function Tooltip({ children, content }: TooltipProps) {
  if (!content) return <>{children}</>

  return (
    <PrismTooltip content={content} position={TooltipPosition.topCenter}>
      {({ describedBy }) => (
        <span aria-describedby={describedBy} style={{ display: 'inline-flex' }}>
          {children}
        </span>
      )}
    </PrismTooltip>
  )
}
