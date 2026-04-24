import { Theme } from '@doordash/prism-react'
import styled from 'styled-components'

export const Rail = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${Theme.usage.space.small} 0;
  gap: ${Theme.usage.space.xSmall};
  height: 100%;
  min-height: 0;
  width: 64px;
  background: ${Theme.usage.color.background.default};
  border-radius: ${Theme.usage.borderRadius.large};
  border: 0.5px solid ${Theme.usage.color.border.default};
`

export const ExpandButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  padding: 0;
  border-radius: 50%;
  background: transparent;
  border: none;

  color: ${Theme.usage.color.text.default};
  cursor: pointer;

  &:hover {
    background-color: ${Theme.usage.color.background.subdued.hovered};
  }

  &:focus-visible {
    outline: 2px solid ${Theme.usage.color.highlight.strong.default};
    outline-offset: 2px;
  }
`
