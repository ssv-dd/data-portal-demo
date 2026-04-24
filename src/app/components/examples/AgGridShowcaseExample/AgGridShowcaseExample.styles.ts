import styled from 'styled-components'

import { radius, Theme } from '../../../styles/dataPortalAppTheme'

export const ExampleRoot = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${Theme.usage.space.small};
`

export const FilterField = styled.label`
  display: flex;
  flex-direction: column;
  gap: ${Theme.usage.space.xxSmall};
  font-size: ${Theme.usage.fontSize.small};
  color: ${Theme.usage.color.text.subdued.default};
  max-width: 360px;
`

export const FilterInput = styled.input`
  width: 100%;
  padding: ${Theme.usage.space.small} ${Theme.usage.space.medium};
  border-radius: ${radius.lg};
  border: 1px solid ${Theme.usage.color.border.default};
  background: ${Theme.usage.color.background.default};
  color: ${Theme.usage.color.text.default};
  font-size: ${Theme.usage.fontSize.medium};

  &::placeholder {
    color: ${Theme.usage.color.text.subdued.default};
  }

  &:focus-visible {
    outline: 2px solid ${Theme.usage.color.border.strong.default};
    outline-offset: 1px;
  }
`
