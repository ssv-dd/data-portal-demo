import { Theme } from '@doordash/prism-react'
import styled from 'styled-components'

export const MonacoWrap = styled.div<{ $hasError: boolean }>`
  border: 1px solid
    ${({ $hasError }) => ($hasError ? Theme.usage.color.negative.default : Theme.usage.color.border.default)};
  border-radius: ${Theme.usage.borderRadius.medium};
  overflow: hidden;
`
