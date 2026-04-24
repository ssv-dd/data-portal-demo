import { Lock } from 'lucide-react'
import * as React from 'react'

import * as S from './ComingSoonInputBlock.styles'

const ICON_DEFAULT = 14
const ICON_COMPACT = 12

export type ComingSoonInputBlockProps = {
  /** Defaults to "Coming soon" (matches AI assistant chat disabled state). */
  readonly message?: string
  readonly 'aria-label'?: string
  /** Smaller padding and type for dense surfaces (e.g. template cards). */
  readonly compact?: boolean
}

export const ComingSoonInputBlock: React.FC<ComingSoonInputBlockProps> = ({
  message = 'Coming soon',
  'aria-label': ariaLabel,
  compact = false,
}) => {
  const iconSize = compact ? ICON_COMPACT : ICON_DEFAULT
  return (
    <S.ComingSoonBlock $compact={compact} aria-label={ariaLabel ?? message}>
      <Lock size={iconSize} strokeWidth={2} aria-hidden />
      {message}
    </S.ComingSoonBlock>
  )
}
