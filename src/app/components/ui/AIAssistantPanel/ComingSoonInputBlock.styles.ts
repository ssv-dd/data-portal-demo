import { Theme } from '@doordash/prism-react'
import styled, { css } from 'styled-components'

import { DisabledOverlay } from './AIAssistantChatInput.styles'

export const ComingSoonBlock = styled(DisabledOverlay)<{ $compact?: boolean }>`
  ${({ $compact }) =>
    $compact
      ? css`
          padding: ${Theme.usage.space.xxSmall} ${Theme.usage.space.small};
          font-size: ${Theme.usage.fontSize.xxSmall};
          gap: 6px;
        `
      : ''}

  & > svg {
    flex-shrink: 0;
    color: ${Theme.usage.color.text.subdued.default};
  }
`
