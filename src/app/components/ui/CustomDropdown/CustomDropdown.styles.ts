import { Theme } from '@doordash/prism-react'
import styled from 'styled-components'

export const DropdownWrap = styled.div`
  position: relative;
  width: 100%;
`

export const DropdownTrigger = styled.button<{ $isOpen?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xSmall};
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
  padding: ${Theme.usage.space.xSmall} ${Theme.usage.space.small};
  border: 1px solid ${Theme.usage.color.border.default};
  border-radius: ${Theme.usage.borderRadius.large};
  font-size: 12px;
  background: ${Theme.usage.color.background.default};
  color: ${Theme.usage.color.text.default};
  cursor: pointer;
  outline: none;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    background-color 0.15s ease;

  &:hover {
    background: ${Theme.usage.color.background.hovered};
  }

  &:focus-visible {
    border-color: ${Theme.usage.color.border.focused};
    box-shadow: 0 0 0 2px ${Theme.usage.color.border.focused};
  }

  svg {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
  }

  /** Keeps label + badge adjacent; avoids flex:1 on the label alone (which stretched and separated them). */
  .dropdown-trigger-main {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: ${Theme.usage.space.xSmall};
  }

  .dropdown-trigger-badge {
    flex-shrink: 0;
  }

  .dropdown-trigger-label {
    flex: 0 1 auto;
    min-width: 0;
    text-align: left;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .dropdown-chevron {
    margin-left: auto;
    flex-shrink: 0;
    opacity: 0.7;
    transform: ${({ $isOpen }) => ($isOpen ? 'rotate(180deg)' : 'rotate(0deg)')};
    transition: transform 0.25s ease;
  }
`

export const DropdownList = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  z-index: 10;
  min-width: 100%;
  max-height: min(320px, 45vh);
  overflow-x: hidden;
  overflow-y: auto;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  padding: ${Theme.usage.space.xSmall};
  border-radius: ${Theme.usage.borderRadius.medium};
  border: 1px solid ${Theme.usage.color.border.default};
  background: ${Theme.usage.color.background.default};
  box-shadow: ${Theme.usage.elevation[2]};
  pointer-events: ${({ $isOpen }) => ($isOpen ? 'auto' : 'none')};
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  transform: ${({ $isOpen }) => ($isOpen ? 'translateY(0)' : 'translateY(-8px)')};
  transition:
    opacity 0.2s ease,
    transform 0.2s ease,
    visibility 0.2s ease;
  visibility: ${({ $isOpen }) => ($isOpen ? 'visible' : 'hidden')};
  scrollbar-width: thin;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background: ${Theme.usage.color.border.strong.default};
  }
`

export const DropdownOption = styled.button<{ $isActive?: boolean; $disabled?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xSmall};
  width: 100%;
  padding: ${Theme.usage.space.xSmall} ${Theme.usage.space.small};
  border: none;
  border-radius: ${Theme.usage.borderRadius.small};
  font-size: 12px;
  text-align: left;
  background: ${({ $isActive, $disabled }) =>
    $disabled
      ? Theme.usage.color.background.disabled
      : $isActive
        ? Theme.usage.color.background.subdued.default
        : 'transparent'};
  color: ${({ $disabled }) => ($disabled ? Theme.usage.color.text.disabled : Theme.usage.color.text.default)};
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  transition: background-color 0.15s ease;

  &:hover:not(:disabled) {
    background: ${Theme.usage.color.background.hovered};
  }

  &:focus-visible:not(:disabled) {
    outline: none;
    background: ${Theme.usage.color.background.hovered};
    box-shadow: 0 0 0 2px ${Theme.usage.color.border.focused} inset;
  }

  .dropdown-option-main {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: ${Theme.usage.space.xxSmall};
  }

  .dropdown-option-main > span:first-child {
    flex: 0 1 auto;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .dropdown-option-badge {
    flex-shrink: 0;
  }

  svg {
    flex-shrink: 0;
    width: 16px;
    height: 16px;
  }
`
