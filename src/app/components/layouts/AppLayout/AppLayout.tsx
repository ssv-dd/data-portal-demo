import { Outlet, useLocation } from 'react-router'

import { useAppContext } from '../../../app/AppContext'
import { isWorkflowBuilderRoute } from '../../../constants/routes'
import { LayoutAIAssistantProvider } from '../../../contexts/LayoutAIAssistantContext'
import { TrackingProvider } from '../../../contexts/TrackingProvider'
import { useShellVersion } from '../../../hooks/useShellVersion'
import { AmbientBackground } from '../../ui/AmbientBackground'
import { AppSidebar } from '../AppSidebar/AppSidebar'
import { DataPortalNavBar } from '../DataPortalNavBar/DataPortalNavBar'

import * as S from './AppLayout.styles'

export const AppLayout = () => {
  const { themeMode } = useAppContext()
  const { pathname } = useLocation()
  const isLightMode = themeMode !== 'dark'
  const shellVersion = useShellVersion()

  return (
    <S.LayoutContainer $shellVersion={shellVersion}>
      <DataPortalNavBar persona="Business Executive" shellVersion={shellVersion} />
      <TrackingProvider>
        <AppSidebar hidden={isWorkflowBuilderRoute(pathname)} />
        <LayoutAIAssistantProvider>
          <S.WorkspaceRow>
            <S.MainContent $edgeToEdge={isWorkflowBuilderRoute(pathname)}>
              <AmbientBackground isDark={!isLightMode} />
              <Outlet />
            </S.MainContent>
          </S.WorkspaceRow>
        </LayoutAIAssistantProvider>
      </TrackingProvider>
    </S.LayoutContainer>
  )
}
