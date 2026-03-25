import { useMemo } from 'react'
import { RouterProvider } from 'react-router'
import { router } from './routes'
import { createDataPortalPrismThemingOverrides } from '@/styles/prism-theming-overrides'
import { GlobalStyles } from '@/styles/global-styles'
import {
  ColorMode,
  DefaultThemeCollection,
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
import { ThemeProvider, useTheme } from '@/app/context/theme-context'

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

function AppInner() {
  const { theme, useStockPrismDark } = useTheme();
  const colorMode = theme === 'dark' ? ColorMode.dark : ColorMode.light;
  /** Internal Tools dark is blue-tinted; Prism's neutral/black dark is `DefaultThemeCollection`. */
  const useNeutralPrismDark = theme === 'dark' && useStockPrismDark;
  const prismThemeCollection = useMemo(
    () =>
      useNeutralPrismDark ? DefaultThemeCollection : InternalToolsThemeCollection,
    [useNeutralPrismDark],
  );
  const prismOverrides = useMemo(
    () => createDataPortalPrismThemingOverrides(useStockPrismDark),
    [useStockPrismDark],
  );

  return (
    <>
      <GlobalStyles />
      <PrismGlobalOverrides />
      <PrismWebGlobalStyles />
      <PrismConfig configuration={InternalToolsConfiguration} colorMode={colorMode}>
        <Theming theme={prismThemeCollection} overrides={prismOverrides}>
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
  );
}

export function App() {
  return (
    <ThemeProvider>
      <AppInner />
    </ThemeProvider>
  )
}
