import { Theme } from '@doordash/prism-react'
import styled from 'styled-components'

export const ActionButton = styled.button<{ $isActive?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${Theme.usage.space.xLarge};
  height: ${Theme.usage.space.xLarge};
  padding: 0;
  background-color: ${({ $isActive }) =>
    $isActive ? Theme.usage.color.highlight.subdued.default : 'transparent'};
  border: none;
  border-radius: ${Theme.usage.borderRadius.small};
  color: ${({ $isActive }) =>
    $isActive ? Theme.usage.color.highlight.strong.default : Theme.usage.color.text.subdued.default};
  cursor: pointer;
  transition:
    background-color 150ms ease,
    color 150ms ease;

  &:hover {
    background-color: ${Theme.usage.color.background.hovered};
    color: ${Theme.usage.color.text.default};
  }
`

export const IconWrapper = styled.span`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
`

export const CopyIcon = styled.span<{ $visible: boolean }>`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transform: ${({ $visible }) => ($visible ? 'scale(1)' : 'scale(0.9)')};
  filter: ${({ $visible }) => ($visible ? 'blur(0)' : 'blur(2px)')};
  transition:
    opacity 100ms ease-out,
    transform 100ms ease-out,
    filter 100ms ease-out;
`

export const CheckIcon = styled.span<{ $visible: boolean }>`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${Theme.usage.color.positive.default};
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transform: ${({ $visible }) => ($visible ? 'scale(1)' : 'scale(0.9)')};
  filter: ${({ $visible }) => ($visible ? 'blur(0)' : 'blur(2px)')};
  transition:
    opacity 100ms ease-out,
    transform 100ms ease-out,
    filter 100ms ease-out;
`
