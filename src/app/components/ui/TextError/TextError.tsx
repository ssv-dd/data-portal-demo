import { Theme, TextWeight } from '@doordash/prism-react'
import { CircleAlert } from 'lucide-react'
import * as React from 'react'

import * as S from './TextError.styles'

export interface Props {
  message?: string
}

export const TextError: React.FC<Props> = ({ message }) => (
  <S.Root>
    <S.IconWrap aria-hidden>
      <CircleAlert size={14} strokeWidth={2} color="currentColor" />
    </S.IconWrap>
    <S.WrappingText
      size={Theme.usage.fontSize.small}
      weight={TextWeight.regular}
      color={Theme.usage.color.negative.strong.default}
    >
      {message}
    </S.WrappingText>
  </S.Root>
)

export default TextError
