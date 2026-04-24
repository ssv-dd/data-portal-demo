import { TextStyle, Theme } from '@doordash/prism-react'
import styled from 'styled-components'

export const Form = styled.form`
  width: 100%;
`

/** Single row: textarea + send (no skills). Must be flex so the send control stays right-aligned and never wraps under the placeholder. */
export const Row = styled.div`
  display: flex;
  flex-direction: row;

  gap: ${Theme.usage.space.small};
  min-width: 0;
  padding: ${Theme.usage.space.small};
  border-radius: var(--usage-border-radius-x-large);
  background-color: rgb(var(--app-surface-rgb) / 0.5);
  border: 1px solid rgb(var(--app-violet-deep-rgb) / 0.08);
  transition: all 200ms;

  &:focus-within {
    border-color: rgb(var(--app-violet-deep-rgb) / 0.2);
    box-shadow: 0 0 0 3px rgb(var(--app-violet-deep-rgb) / 0.06);
  }
`

/** Column: textarea on top, toolbar row below (with skills). */
export const Shell = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${Theme.usage.space.xSmall};
  padding: ${Theme.usage.space.small};
  border-radius: ${Theme.usage.borderRadius.large};
  background-color: rgb(var(--app-surface-rgb) / 0.5);
  border: 1px solid rgb(var(--app-violet-deep-rgb) / 0.08);
  transition: all 200ms;

  &:focus-within {
    border-color: rgb(var(--app-violet-deep-rgb) / 0.2);
    box-shadow: 0 0 0 3px rgb(var(--app-violet-deep-rgb) / 0.06);
  }
`

export const TextArea = styled.textarea`
  flex: 1;
  min-width: 0;
  min-height: 40px;
  max-height: 120px;
  padding: 0;
  border: none;
  outline: none;
  resize: none;
  font-family: inherit;
  font-size: ${TextStyle.label.xSmall.default.size};
  font-weight: 400;
  line-height: 1.45;
  color: ${Theme.usage.color.text.default};
  background: transparent;

  &::placeholder {
    color: ${Theme.usage.color.text.subdued.hovered};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`

export const Toolbar = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  gap: ${Theme.usage.space.small};
  min-height: 36px;
`

export const AddButtonWrap = styled.div`
  position: relative;
  flex-shrink: 0;
`

export const AddButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border-radius: var(--usage-border-radius-large);
  border: none;
  background: none;
  color: rgb(var(--app-muted-fg-rgb) / 0.5);
  cursor: pointer;
  transition: all 200ms;

  &:hover:not(:disabled) {
    background-color: rgb(var(--app-violet-deep-rgb) / 0.06);
    color: var(--app-muted-fg);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

export const Popover = styled.div`
  position: absolute;
  /* Sit above the + button; parent is narrow — avoid left+right or fixed bottom or width collapses */
  bottom: calc(100% + ${Theme.usage.space.xSmall});
  left: 0;
  z-index: 50;
  width: min(320px, calc(100vw - 32px));
  max-height: min(360px, 50vh);
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: rgb(var(--app-surface-rgb) / 0.95);
  backdrop-filter: blur(24px);
  border-radius: var(--usage-border-radius-x-large);
  box-shadow:
    0 8px 40px rgb(var(--app-overlay-rgb) / 0.12),
    0 0 1px rgb(var(--app-overlay-rgb) / 0.08);
`

export const PopoverHeader = styled.div`
  flex-shrink: 0;
  padding: ${Theme.usage.space.small} ${Theme.usage.space.medium};
`

export const PopoverList = styled.div`
  flex: 1 1 auto;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: ${Theme.usage.space.xxSmall};
  overflow-x: hidden;
  overflow-y: auto;
  padding: 0 ${Theme.usage.space.small} ${Theme.usage.space.small};
  -webkit-overflow-scrolling: touch;
`

export const PopoverEmpty = styled.p`
  margin: 0;
  padding: ${Theme.usage.space.small};
  font-size: ${Theme.usage.fontSize.xxSmall};
  line-height: 1.35;
  color: ${Theme.usage.color.text.subdued.default};
`

export const PopoverOption = styled.button`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: ${Theme.usage.space.small};
  width: 100%;
  padding: ${Theme.usage.space.small};
  border: none;
  border-radius: ${Theme.usage.borderRadius.medium};
  text-align: left;
  cursor: pointer;
  background: transparent;
  color: inherit;
  font: inherit;
  transition: background-color 120ms ease;

  &:hover:not(:disabled) {
    background-color: rgb(var(--app-fg-rgb) / 0.04);
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`

export const PopoverOptionIcon = styled.span`
  flex-shrink: 0;
  display: inline-flex;
  margin-top: 2px;
  color: rgb(var(--app-muted-fg-rgb) / 0.5);
`

export const PopoverOptionText = styled.div`
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  border-width: 0;
  border-style: solid;
  border-color: var(--app-border);
`

export const PopoverOptionTitle = styled.div`
  font-size: var(--usage-font-size-xx-small);
  font-weight: 500;
  color: var(--app-fg);
`

export const PopoverOptionDesc = styled.div`
  font-size: 11px;
  color: rgb(var(--app-muted-fg-rgb) / 0.6);
  margin-top: var(--usage-space-xxx-small);
`

export const PillsRow = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  gap: ${Theme.usage.space.xSmall};
  flex: 1;
  min-width: 0;
`

export const SkillPill = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${Theme.usage.space.xSmall};
  padding: ${Theme.usage.space.xxSmall} ${Theme.usage.space.small};
  border-radius: ${Theme.usage.borderRadius.large};
  background-color: rgb(var(--app-violet-deep-rgb) / 0.07);
  font-size: ${Theme.usage.fontSize.xxSmall};
  color: var(--app-fg);
`

export const SkillPillIcon = styled.span`
  width: 12px;
  height: 12px;
  color: rgb(var(--app-muted-fg-rgb) / 0.6);
  align-items: center;
  display: flex;
  align-items: center;
`

export const SkillPillLabel = styled.span`
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  border-width: 0;
  border-style: solid;
  border-color: var(--app-border);
`

export const SkillPillRemove = styled.button`
  color: rgb(var(--app-muted-fg-rgb) / 0.4);
  background: none;
  border: none;
  cursor: pointer;
  margin-left: var(--usage-space-xxx-small);
  padding: 0;
  transition: color 200ms;

  &:hover {
    color: var(--app-muted-fg);
  }
`

export const ToolbarSpacer = styled.div`
  flex: 1;
  min-width: ${Theme.usage.space.small};
`

export const SendButton = styled.button<{
  $isActive: boolean
}>`
  flex-shrink: 0;
  padding: var(--usage-space-x-small);
  border-radius: var(--usage-border-radius-large);
  border: none;
  transition: all 200ms;

  ${({ $isActive }) =>
    $isActive
      ? `
    background-color: var(--app-violet-button);
    color: var(--app-white);
    box-shadow: 0 2px 8px rgb(var(--app-violet-deep-rgb) / 0.2);

    &:hover {
      background-color: var(--app-violet-button-hover);
    }

    
  `
      : `
    background-color: rgb(var(--app-violet-deep-rgb) / 0.06);
    color: rgb(var(--app-muted-fg-rgb) / 0.3);
    border-color: none;
    cursor: not-allowed;
    opacity: 0.85;
  `}

  &:disabled {
    cursor: not-allowed;
  }
`

export const DisabledOverlay = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${Theme.usage.space.xSmall};
  width: 100%;
  padding: ${Theme.usage.space.small} ${Theme.usage.space.medium};
  border-radius: var(--usage-border-radius-x-large);
  background-color: ${Theme.usage.color.background.elevated.default};
  border: 1px solid ${Theme.usage.color.border.default};
  color: ${Theme.usage.color.text.subdued.default};
  font-size: ${Theme.usage.fontSize.xxSmall};
  font-weight: 500;
  user-select: none;
`
