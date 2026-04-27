import { Theme } from '@doordash/prism-react'
import styled, { css } from 'styled-components'

export const FormikDateFieldMain = styled.div<{ isError?: boolean }>`
  ${({ isError }) => css`
    ${isError &&
    css`
      button {
        border: 2px solid ${Theme.usage.color.negative.default};
        box-shadow: none;
        background-color: ${Theme.usage.color.negative.subdued.default};
      }
    `}

    svg {
      width: ${Theme.usage.space.xLarge};
      height: ${Theme.usage.space.xLarge};
    }
  `}
`
