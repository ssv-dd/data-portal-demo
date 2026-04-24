import { TextStyle } from '@doordash/prism-react'
import styled, { css } from 'styled-components'

import { Theme } from '../../../styles/dataPortalAppTheme'

/** Groups separator + panel so the resizable assistant can be wrapped by a themed parent. */
export const LayoutRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: stretch;
  flex-shrink: 0;
  min-height: 0;
`

export const Separator = styled.div`
  flex-shrink: 0;
  width: 1px;
  align-self: stretch;
  touch-action: none;
`

export const Root = styled.aside<{ $resizable: boolean; $widthPx?: number }>`
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
  background: var(--app-glass-chat-bg);
  backdrop-filter: blur(24px);
  border-radius: ${Theme.usage.borderRadius.large};

  /* Fixed width whenever $widthPx is set (resizable drag or non-resizable defaultWidthPx). Otherwise width follows parent flex (intrinsic content can jump between tabs). */
  ${({ $widthPx }) =>
    $widthPx !== undefined
      ? css`
          flex-shrink: 0;
          width: ${$widthPx}px;
          max-width: 100%;
          min-width: 0;
          box-sizing: border-box;
        `
      : css`
          flex: 1;
          min-width: 0;
        `}
`

export const Header = styled.div`
  flex-shrink: 0;
  padding: ${Theme.usage.space.small};
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.small};
  min-width: 0;
`

export const Body = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  overflow: auto;
`

export const AIAssistantTabsContainer = styled.div`
  display: flex;
  gap: 6px;
  padding: 3px;
  background-color: var(--app-segmented-bg);
  border-radius: ${Theme.usage.borderRadius.xLarge};
  border: 1px solid var(--app-segmented-border);
  box-shadow: inset 0 1px 0 rgb(var(--app-surface-rgb) / 0.08);
  flex: 1;
  min-width: 0;
  overflow: hidden;
`

export const AIAssistantTabButton = styled.button<{ $isActive: boolean }>`
  display: inline-flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: ${Theme.usage.space.xSmall};
  border-radius: ${Theme.usage.borderRadius.xLarge};
  font-size: ${TextStyle.label.xSmall.default.size};
  font-weight: ${TextStyle.label.xSmall.default.fontWeight};
  line-height: ${TextStyle.label.xSmall.default.lineHeight};
  cursor: pointer;
  min-width: 0;
  overflow: hidden;
  border: none;
  color: var(--app-segmented-inactive);
  background: transparent;
  transition:
    background 140ms ease,
    border-color 140ms ease,
    box-shadow 140ms ease,
    color 140ms ease;

  ${({ $isActive }) =>
    $isActive
      ? css`
          background: ${Theme.usage.color.background.default};

          font-weight: ${TextStyle.label.xSmall.strong.fontWeight};
          box-shadow: inset 0 1px 0 rgb(var(--app-surface-rgb) / 0.12);
          color: ${Theme.usage.color.text.default};
        `
      : css`
          &:hover {
            background: var(--app-segmented-hover);
            border-color: ${Theme.usage.color.border.strong.default};
            box-shadow: inset 0 1px 0 rgb(var(--app-surface-rgb) / 0.12);
          }
        `}

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }

  svg {
    width: 12px;
    height: 12px;
    flex-shrink: 0;
  }
`

/** Tab label must be a real element so truncation works (raw text nodes ignore flex min-width). */
export const AIAssistantTabLabel = styled.span`
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const HeaderIcon = styled.div`
  flex-shrink: 0;
  gap: ${Theme.usage.space.small};
  color: ${Theme.usage.color.text.default};
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
`

export const ActionButton = styled.button<{ $disabled: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border-radius: ${Theme.usage.borderRadius.small};
  color: ${Theme.usage.color.text.default};
  background: transparent;
  border: none;
  cursor: pointer;

  ${({ $disabled }) =>
    $disabled
      ? css`
          color: ${Theme.usage.color.text.disabled};
          cursor: not-allowed;
        `
      : css`
          &:hover {
            background: ${Theme.usage.color.background.subdued.hovered};
          }
        `}
`
