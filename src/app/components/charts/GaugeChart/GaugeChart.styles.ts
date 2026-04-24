import styled from 'styled-components'

import { Theme } from '../../../styles/dataPortalAppTheme'

export const CenterStack = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  gap: ${Theme.usage.space.xSmall};
  padding-top: 18%;
`

export const ValueText = styled.span`
  font-size: ${Theme.usage.fontSize.large};
  font-weight: 600;
  color: ${Theme.usage.color.text.default};
  line-height: 1.1;
  font-variant-numeric: tabular-nums;
`

export const LabelText = styled.span`
  font-size: ${Theme.usage.fontSize.small};
  color: ${Theme.usage.color.text.subdued.default};
  text-align: center;
  max-width: 80%;
`
