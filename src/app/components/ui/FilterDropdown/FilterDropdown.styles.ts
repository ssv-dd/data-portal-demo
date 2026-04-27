import { TextStyle, Theme } from '@doordash/prism-react'
import styled from 'styled-components'

export const Container = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`

export const TriggerButton = styled.button<{ $isOpen: boolean }>`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xSmall};
  padding: ${Theme.usage.space.xSmall} ${Theme.usage.space.medium};
  border-radius: ${Theme.usage.borderRadius.full};
  border: 1px solid ${Theme.usage.color.brand.primary};
  background-color: ${Theme.usage.color.brand.primary};
  color: ${Theme.usage.color.text.inverse.default};
  font-size: ${TextStyle.label.small.default.size};
  font-weight: ${TextStyle.label.small.strong.fontWeight};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    filter: brightness(0.85);
  }

  svg {
    flex-shrink: 0;
  }
`

export const ChevronIcon = styled.span<{ $isOpen: boolean }>`
  display: inline-flex;
  transition: transform 200ms;
  ${({ $isOpen }) => $isOpen && 'transform: rotate(180deg);'}
`

export const Dropdown = styled.div<{ $minWidth?: string; $maxHeight?: string }>`
  position: absolute;
  top: calc(100% + ${Theme.usage.space.xSmall});
  left: 0;
  min-width: ${({ $minWidth }) => $minWidth ?? '180px'};
  max-height: ${({ $maxHeight }) => $maxHeight ?? '360px'};
  overflow-y: auto;
  background-color: ${Theme.usage.color.background.default};
  border: 1px solid ${Theme.usage.color.border.default};
  border-radius: ${Theme.usage.borderRadius.medium};
  box-shadow: ${Theme.usage.elevation[2]};
  z-index: 100;
  transform-origin: top left;
`

export const DropdownOption = styled.button<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.small};
  width: 100%;
  padding: ${Theme.usage.space.small} ${Theme.usage.space.medium};
  background-color: ${({ $isActive }) =>
    $isActive ? Theme.usage.color.highlight.subdued.default : 'transparent'};
  border: none;
  cursor: pointer;
  text-align: left;
  font-size: ${TextStyle.label.small.default.size};
  font-weight: ${({ $isActive }) =>
    $isActive ? TextStyle.label.small.strong.fontWeight : TextStyle.label.small.default.fontWeight};
  color: ${({ $isActive }) => ($isActive ? Theme.usage.color.brand.primary : Theme.usage.color.text.default)};
  transition: background-color 150ms ease;

  &:not(:last-child) {
    border-bottom: 1px solid ${Theme.usage.color.border.default};
  }

  &:hover {
    background-color: ${({ $isActive }) =>
      $isActive ? Theme.usage.color.highlight.subdued.default : Theme.usage.color.background.hovered};
  }

  svg {
    flex-shrink: 0;
    color: ${({ $isActive }) =>
      $isActive ? Theme.usage.color.brand.primary : Theme.usage.color.text.subdued.default};
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`
