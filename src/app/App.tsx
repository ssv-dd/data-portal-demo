import { RouterProvider } from 'react-router'
import { router } from './routes'
import { GlobalStyles } from '@/styles/global-styles'
import {
  ColorMode,
  InternalToolsConfiguration,
  InternalToolsThemeCollection,
  LayerManager,
  PrismConfig,
  PrismWebGlobalStyles,
  Theming,
  ToastPosition,
  ToastProvider,
} from '@doordash/prism-react'
import styled, { createGlobalStyle } from 'styled-components'

const PrismGlobalOverrides = createGlobalStyle`
  .prism-theme {
    height: 100%;
    overflow-y: hidden;
  }
`

const LayerManagerWrapper = styled.div`
  height: 100%;
  overflow-y: hidden;

  > div:first-child {
    height: 100%;
    overflow-y: hidden;
  }
`

export function App() {
  return (
    <>
      <GlobalStyles />
      <PrismGlobalOverrides />
      <PrismWebGlobalStyles />
      <PrismConfig configuration={InternalToolsConfiguration} colorMode={ColorMode.light}>
        <Theming theme={InternalToolsThemeCollection}>
          <LayerManagerWrapper>
            <LayerManager>
              <ToastProvider position={ToastPosition.topEnd}>
                <RouterProvider router={router} />
              </ToastProvider>
            </LayerManager>
          </LayerManagerWrapper>
        </Theming>
      </PrismConfig>
    </>
  )
}
