import { Link } from 'react-router'
import styled from 'styled-components'

import { colors } from '../../../styles/dataPortalAppTheme'

export const NavContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
  justify-content: flex-end;
`

export const TabsContainer = styled.nav`
  display: flex;
  align-items: center;
  gap: 4px;
`

export const TabLink = styled(Link)<{ $active: boolean }>`
  padding: 6px 14px;
  border-radius: 12px;
  transition: all 200ms;
  font-size: 13px;
  font-weight: 600;
  line-height: 1.4;
  text-decoration: none;
  white-space: nowrap;

  ${({ $active }) =>
    $active
      ? `
    background: var(--app-fg);
    color: var(--app-bg);
  `
      : `
    color: var(--app-muted-fg);

    &:hover {
      color: var(--app-fg);
      background: rgb(var(--app-muted-fg-rgb) / 0.08);
    }
  `}
`

export const Spacer = styled.div`
  flex: 1;
`

export const PersonaContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  line-height: 1;
  white-space: nowrap;
`

export const PersonaLabel = styled.span`
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.2px;
  color: ${colors.navLabel};
`

export const PersonaTag = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  border-radius: 8px;
  border: 1px solid ${colors.personaBorder};
  background-color: ${colors.personaBg};
  color: ${colors.personaText};
  font-size: 12px;
  font-weight: 600;
  line-height: 1.2;
  white-space: nowrap;
`
