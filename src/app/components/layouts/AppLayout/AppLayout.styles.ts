import { Theme } from '@doordash/prism-react'
import styled from 'styled-components'

/** Uniform inset between the shell app header and all module content (see AppLayout). */
export const APP_MAIN_CONTENT_INSET = Theme.usage.space.small

export const LayoutContainer = styled.div<{ $shellVersion: number }>`
  display: flex;
  height: 100%;
  width: 100%;
  overflow: hidden;
  /* Match page chrome so shell/MFE edges never show as flat black next to the module. */
  background-color: ${Theme.usage.color.background.default};
  ${({ $shellVersion }) =>
    $shellVersion === 1 &&
    `
    padding-top: 58px;
  `}
`

/** Holds primary scrollable content + optional global AI assistant column. */
export const WorkspaceRow = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  min-width: 0;
  min-height: 0;
  align-items: stretch;
  overflow: hidden;
  /* Same surface as {@link MainContent} — avoids a second “black” strip beside the AI panel. */
  background-color: ${Theme.usage.color.background.default};
`

export const MainContent = styled.main<{ $edgeToEdge?: boolean }>`
  position: relative;
  flex: 1;
  min-width: 0;
  min-height: 0;
  overflow-y: ${({ $edgeToEdge }) => ($edgeToEdge ? 'hidden' : 'auto')};
  box-sizing: border-box;
  background-color: ${Theme.usage.color.background.default};
  padding: ${({ $edgeToEdge }) => ($edgeToEdge ? 0 : APP_MAIN_CONTENT_INSET)};
`
