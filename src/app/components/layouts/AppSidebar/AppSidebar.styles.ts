import { Link } from 'react-router'
import styled, { css } from 'styled-components'

import { colors, radius } from '../../../styles/dataPortalAppTheme'

/* ------------------------------------------------------ */
/*                     Shared helpers                     */
/* ------------------------------------------------------ */

const accentBarBase = css`
  content: '';
  position: absolute;
  top: 50%;
  width: 4px;
  background: ${colors.violet600};
  border-radius: 0 4px 4px 0;
  opacity: 0;
  transform: translateY(-50%) scaleX(0) scaleY(0);
  transform-origin: left center;
  transition:
    transform 150ms ease-out,
    opacity 150ms ease;
`

const accentBarVisible = css`
  transform: translateY(-50%) scaleX(1) scaleY(1);
  opacity: 1;
`

const focusVisible = css`
  &:focus-visible {
    outline: 2px solid rgb(var(--app-dd-primary-rgb) / 0.5);
    outline-offset: 2px;
  }
`

const reducedMotionAccent = css`
  @media (prefers-reduced-motion: reduce) {
    &::before {
      transition: none;
    }
    &[aria-current='page']::before {
      ${accentBarVisible}
    }
  }
`

/* ------------------------------------------------------ */
/*                     Layout containers                  */
/* ------------------------------------------------------ */

export const SidebarContainer = styled.aside<{ $width: number }>`
  width: ${({ $width }) => $width}px;
  min-width: ${({ $width }) => $width}px;
  height: 100%;
  background: ${colors.backgroundSecondary};
  box-shadow: inset -1px 0 0 0 ${colors.border};
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  position: relative;
  z-index: 1;
  overflow: hidden;
  transition:
    width 0.2s cubic-bezier(0.23, 1, 0.32, 1),
    min-width 0.2s cubic-bezier(0.23, 1, 0.32, 1);

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`

export const SidebarInner = styled.div<{ $hidden: boolean }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  opacity: ${({ $hidden }) => ($hidden ? 0 : 1)};
  pointer-events: ${({ $hidden }) => ($hidden ? 'none' : 'auto')};
  transition: opacity 0.1s ease-out;

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`

// Icons-text mode: vertical layout (icon above text)
export const NavSectionIconsText = styled.nav`
  flex: 1;
  padding: 8px 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-height: 0;
  overflow-y: auto;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`

// Icons-only mode: flex column with scrolling
export const NavSectionIconsOnly = styled.nav`
  flex: 1;
  padding: 12px 8px;
  display: flex;
  flex-direction: column;
  gap: 1px;
  overflow-y: auto;
  overflow-x: hidden;
  min-height: 0;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`

/* ------------------------------------------------------ */
/*                      Nav item links                    */
/* ------------------------------------------------------ */

// Icons-text: icon above text, vertical layout
export const NavItemLinkIconsText = styled(Link)<{ $disabled?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  padding: 0 8px;
  text-decoration: none;
  position: relative;
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ $disabled }) => ($disabled ? 0.5 : 1)};
  touch-action: manipulation;
  user-select: none;

  &::before {
    ${accentBarBase}
    left: 0;
    height: 40px;
  }

  &[aria-current='page']::before {
    ${accentBarVisible}
  }

  @media (hover: hover) and (pointer: fine) {
    &:hover:not(:disabled):not([aria-current='page'])::before {
      transform: translateY(-50%) scaleX(1) scaleY(0.4);
      opacity: 1;
    }
  }

  ${focusVisible}
  ${reducedMotionAccent}
`

// Icons-only: centered icon, fixed 56px rail
export const NavItemLinkIconsOnly = styled(Link)<{ $disabled?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 40px;
  padding: 8px;
  border-radius: 10px;
  color: ${colors.mutedForeground};
  background: transparent;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.5;
  position: relative;
  transition:
    background-color 150ms ease,
    color 150ms ease;
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ $disabled }) => ($disabled ? 0.5 : 1)};
  touch-action: manipulation;
  user-select: none;

  &[aria-current='page'] {
    color: ${colors.violet600};
    background: rgb(var(--app-violet-rgb) / 0.1);
  }

  &::before {
    ${accentBarBase}
    left: -8px;
    height: 28px;
  }

  &[aria-current='page']::before {
    ${accentBarVisible}
  }

  @media (hover: hover) and (pointer: fine) {
    &:hover:not([aria-disabled='true']):not([aria-current='page']) {
      background: rgb(var(--app-muted-rgb) / 0.6);
      color: ${colors.foreground};
    }

    &[aria-current='page']:hover:not([aria-disabled='true']) {
      background: rgb(var(--app-violet-rgb) / 0.15);
      color: ${colors.violet600};
    }

    &:hover:not([aria-disabled='true']):not([aria-current='page'])::before {
      transform: translateY(-50%) scaleX(1) scaleY(0.571);
      opacity: 1;
    }
  }

  &:active:not([aria-disabled='true']) {
    background: rgb(var(--app-muted-rgb) / 0.8);
  }

  ${focusVisible}

  @media (prefers-reduced-motion: reduce) {
    transition: none;
    ${reducedMotionAccent}
  }
`

/* ------------------------------------------------------ */
/*                      Icon wrappers                     */
/* ------------------------------------------------------ */

export const IconWrapperIconsText = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  border-radius: 8px;
  background: transparent;
  color: ${colors.mutedForeground};
  transition:
    background-color 150ms ease,
    color 150ms ease;

  svg {
    width: 24px;
    height: 24px;
    stroke-width: 2;
  }

  ${NavItemLinkIconsText}[aria-current='page'] & {
    background: rgb(var(--app-violet-rgb) / 0.1);
    color: ${colors.violet600};
  }

  @media (hover: hover) and (pointer: fine) {
    ${NavItemLinkIconsText}:hover:not([aria-current='page']):not([aria-disabled='true']) & {
      background: rgb(var(--app-muted-rgb) / 0.5);
      color: ${colors.foreground};
    }

    ${NavItemLinkIconsText}[aria-current='page']:hover:not([aria-disabled='true']) & {
      background: rgb(var(--app-violet-rgb) / 0.15);
      color: ${colors.violet600};
    }
  }

  ${NavItemLinkIconsText}:active:not([aria-disabled='true']) & {
    transform: scale(0.97);
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`

export const IconWrapperIconsOnly = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  flex-shrink: 0;

  svg {
    width: 18px;
    height: 18px;
    stroke-width: 2;
  }
`

/* ------------------------------------------------------ */
/*                        Labels                          */
/* ------------------------------------------------------ */

export const LabelIconsText = styled.span`
  font-size: 10px;
  font-weight: 500;
  line-height: 1.2;
  text-align: center;
  color: ${colors.mutedForeground};
  white-space: nowrap;
  overflow: hidden;
  transition: color 150ms ease;

  ${NavItemLinkIconsText}[aria-current='page'] & {
    color: ${colors.violet600};
  }

  @media (hover: hover) and (pointer: fine) {
    ${NavItemLinkIconsText}:hover:not([aria-current='page']):not([aria-disabled='true']) & {
      color: ${colors.foreground};
    }

    ${NavItemLinkIconsText}[aria-current='page']:hover:not([aria-disabled='true']) & {
      color: ${colors.violet600};
    }
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`

/* ------------------------------------------------------ */
/*                     Layout helpers                     */
/* ------------------------------------------------------ */

export const Spacer = styled.div`
  flex: 1;
  min-height: 16px;
`

export const FooterSectionIconsText = styled.div`
  padding: 8px 0 12px;
  box-shadow: inset 0 1px 0 0 ${colors.border};
  display: flex;
  flex-direction: column;
  gap: 10px;
`

export const FooterSectionIconsOnly = styled.div`
  padding: 8px 8px 12px;
  box-shadow: inset 0 1px 0 0 ${colors.border};
  display: flex;
  flex-direction: column;
  gap: 1px;
`

/* ------------------------------------------------------ */
/*                    Customize buttons                   */
/* ------------------------------------------------------ */

export const CustomizeButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 8px;
  background: transparent;
  border: none;
  color: var(--app-muted-fg);
  cursor: pointer;
  transition:
    background-color 150ms ease,
    color 150ms ease;
  touch-action: manipulation;
  position: relative;

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      color: var(--app-fg);
    }
  }

  &:active {
    transform: scale(0.97);
  }

  ${focusVisible}

  svg {
    width: 24px;
    height: 24px;
    stroke-width: 2;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`

export const CustomizeButtonIconsOnly = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 40px;
  padding: 8px;
  border-radius: 10px;
  background: transparent;
  border: none;
  color: var(--app-muted-fg);
  cursor: pointer;
  transition:
    background-color 150ms ease,
    color 150ms ease;
  touch-action: manipulation;

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      background: rgb(var(--app-overlay-rgb) / 0.06);
      color: var(--app-fg);
    }
  }

  &:active {
    transform: scale(0.97);
  }

  ${focusVisible}

  svg {
    width: 16px;
    height: 16px;
    stroke-width: 2;
    flex-shrink: 0;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`

/* ------------------------------------------------------ */
/*                    Customize modal                     */
/* ------------------------------------------------------ */

export const ModalDescription = styled.p`
  font-size: 14px;
  color: ${colors.mutedForeground};
  margin: 0 0 20px 0;
  line-height: 1.5;
`

export const RadioGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

export const RadioOption = styled.label<{ $selected: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  border-radius: ${radius.lg};
  border: 2px solid ${({ $selected }) => ($selected ? colors.violet600 : colors.border)};
  background: ${({ $selected }) => ($selected ? 'rgb(var(--app-violet-rgb) / 0.05)' : 'transparent')};
  cursor: pointer;
  transition:
    border-color 150ms ease,
    background-color 150ms ease;

  &:hover {
    border-color: ${({ $selected }) => ($selected ? colors.violet600 : colors.violet400)};
    background: ${({ $selected }) =>
      $selected ? 'rgb(var(--app-violet-rgb) / 0.08)' : 'rgb(var(--app-violet-rgb) / 0.03)'};
  }
`

export const RadioInput = styled.input`
  width: 18px;
  height: 18px;
  margin-top: 2px;
  accent-color: ${colors.violet600};
  cursor: pointer;
  flex-shrink: 0;
`

export const RadioContent = styled.div`
  flex: 1;
`

export const RadioLabel = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: ${colors.foreground};
  margin-bottom: 4px;
`

export const RadioDescription = styled.div`
  font-size: 13px;
  color: ${colors.mutedForeground};
  line-height: 1.5;
`
