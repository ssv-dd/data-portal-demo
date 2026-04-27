import { Theme } from '@doordash/prism-react'
import styled from 'styled-components'

import { shadows } from '../../../styles/dataPortalAppTheme'

/**
 * Shrink-wrap the trigger so `right: 0` on the menu aligns to the button, not the grid column.
 * `align-self: flex-start` avoids stretching when the parent is a column flex (e.g. form rows).
 * `align-items: flex-start` keeps the trigger content-sized (not stretched by a wide open menu).
 */
export const Wrapper = styled.div`
  position: relative;
  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;
  align-self: flex-start;
  width: max-content;
  max-width: 100%;
`

export const Trigger = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  align-self: flex-start;
  gap: ${Theme.usage.space.xSmall};
  min-height: 36px;
  padding: 8px 20px;
  width: max-content;
  max-width: 100%;
  background: ${Theme.usage.color.background.default};
  color: ${Theme.usage.color.text.default};
  border: 1px solid ${Theme.usage.color.border.default};
  border-radius: ${Theme.usage.borderRadius.full};
  font-size: ${Theme.usage.fontSize.small};
  font-weight: 500;
  cursor: pointer;
  transition: all 200ms;
  white-space: nowrap;

  &:hover {
    box-shadow: ${shadows.card};
    border-color: var(--app-border-strong);
  }

  &:active {
    transform: scale(0.97);
  }
`

export const Menu = styled.div`
  position: absolute;
  top: calc(100% + ${Theme.usage.space.xSmall});
  right: 0;
  min-width: 240px;
  background: ${Theme.usage.color.background.elevated.default};
  border: 1px solid ${Theme.usage.color.border.default};
  border-radius: ${Theme.usage.borderRadius.large};
  box-shadow: ${shadows.popover};
  z-index: 20;
  overflow: hidden;
`

export const MenuItem = styled.button<{ $disabled?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.small};
  width: 100%;
  padding: ${Theme.usage.space.small} ${Theme.usage.space.medium};
  background: none;
  border: none;
  color: ${({ $disabled }) =>
    $disabled ? Theme.usage.color.text.subdued.default : Theme.usage.color.text.default};
  font-size: ${Theme.usage.fontSize.small};
  font-weight: 400;
  text-align: left;
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ $disabled }) => ($disabled ? 0.5 : 1)};
  transition: background 150ms;

  &:hover {
    background: ${({ $disabled }) => ($disabled ? 'none' : 'rgb(var(--app-surface-rgb) / 0.5)')};
  }

  &:not(:last-child) {
    border-bottom: 1px solid ${Theme.usage.color.border.default};
  }
`
