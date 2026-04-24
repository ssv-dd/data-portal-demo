import { AllCommunityModule, ModuleRegistry, themeQuartz } from 'ag-grid-community'
import type { ColDef } from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'
import type { AgGridReactProps } from 'ag-grid-react'
import * as React from 'react'

import { useAppContext } from '../../app/AppContext'

import * as S from './DPAgGrid.styles'

ModuleRegistry.registerModules([AllCommunityModule])

export type DPAgGridProps<TData> = Omit<AgGridReactProps<TData>, 'theme'> & {
  /**
   * Pixel height, CSS length, or `'auto'`. Use `'auto'` with AG Grid `domLayout="autoHeight"` so the shell
   * grows with row count (avoids a tall empty viewport above pinned rows).
   */
  height?: number | string
  /**
   * Light/dark chrome for AG Grid. When omitted, follows Data Portal shell theme
   * (`AppContext.themeMode`). Requires `AppContextProvider` unless you pass this explicitly.
   */
  colorScheme?: 'light' | 'dark'
  /** Optional AG Grid theme object; defaults to Quartz + `data-ag-theme-mode` from `colorScheme`. */
  theme?: AgGridReactProps<TData>['theme']
  className?: string
}

/**
 * Opinionated AG Grid wrapper for Data Portal: registers Community modules via `ModuleRegistry`,
 * applies Quartz theming
 * that tracks shell light/dark mode, and renders inside a bordered, elevated shell.
 *
 * Pass standard `AgGridReact` props (`rowData`, `columnDefs`, `defaultColDef`, `onGridReady`, …).
 * Wrap tall grids in layout as needed; this component only sizes the grid viewport via `height`.
 */
export function DPAgGrid<TData = unknown>({
  height = 420,
  colorScheme: colorSchemeProp,
  theme: themeOverride,
  className,
  defaultColDef,
  animateRows = true,
  suppressCellFocus = true,
  ...gridProps
}: DPAgGridProps<TData>) {
  const app = useAppContext()
  const resolvedScheme = colorSchemeProp ?? (app.themeMode === 'dark' ? 'dark' : 'light')
  const agThemeMode = resolvedScheme === 'dark' ? 'dark' : 'light'
  const resolvedTheme = themeOverride ?? themeQuartz

  const mergedDefaultColDef = React.useMemo((): ColDef<TData> => {
    return {
      sortable: true,
      filter: true,
      resizable: true,
      ...defaultColDef,
    }
  }, [defaultColDef])

  return (
    <S.GridShell className={className} $height={height} data-ag-theme-mode={agThemeMode} data-dp-ag-grid>
      <AgGridReact<TData>
        {...gridProps}
        animateRows={animateRows}
        suppressCellFocus={suppressCellFocus}
        defaultColDef={mergedDefaultColDef}
        theme={resolvedTheme}
      />
    </S.GridShell>
  )
}
