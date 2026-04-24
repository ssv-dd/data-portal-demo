import { Text, Theme } from '@doordash/prism-react'
import styled from 'styled-components'

/** Inline helper text — not a second “field”; no border or filled panel. */
export const Root = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${Theme.usage.space.xxSmall};
  box-sizing: border-box;
  width: 100%;
  max-width: 100%;
  padding: 0;
  margin: 0;
  color: ${Theme.usage.color.negative.strong.default};
`

export const IconWrap = styled.span`
  display: flex;
  flex-shrink: 0;
  margin-top: 2px;
  color: ${Theme.usage.color.negative.default};

  svg {
    display: block;
  }
`

export const WrappingText = styled(Text)`
  flex: 1;
  min-width: 0;
  word-break: break-word;
  overflow-wrap: break-word;
  white-space: normal;
  line-height: 1.45;
`
