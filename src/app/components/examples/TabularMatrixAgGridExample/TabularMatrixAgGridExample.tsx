import type { ColDef, ColGroupDef, ValueFormatterParams } from 'ag-grid-community'
import * as React from 'react'

import { DPAgGrid } from '../../AgGrid'

import * as S from './TabularMatrixAgGridExample.styles'
import {
  createMatrixHeatmapCellStyle,
  getTabularMatrixRowStyle,
  matrixCellPadding,
  matrixCellFontSize,
  matrixPinnedDimensionCellStyle,
} from './tabularMatrixAgGridTheme'
import { TABULAR_MATRIX_GRAND_TOTAL_ROW, TABULAR_MATRIX_ROW_DATA } from './tabularMatrixMockData'
import type { TabularMatrixRow } from './tabularMatrixTypes'

const intFmt = new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 })

const formatCost = (p: ValueFormatterParams<TabularMatrixRow, number | null>) => {
  if (p.value === null || p.value === undefined) return ''
  return intFmt.format(p.value)
}

function y2026Parts(d: TabularMatrixRow): number[] {
  return [
    d.y2026_snowflake,
    d.y2026_dbrOnly,
    d.y2026_dbrAws,
    d.y2026_s3,
    d.y2026_trino,
    d.y2026_emr,
    d.y2026_aws,
  ].filter((x): x is number => typeof x === 'number')
}

function y2026RowTotal(d: TabularMatrixRow): number | null {
  const parts = y2026Parts(d)
  if (parts.length === 0) return null
  return parts.reduce((a, b) => a + b, 0)
}

const HEATMAP_FIELDS: ReadonlySet<string> = new Set([
  'y2023_total',
  'y2024_total',
  'y2025_total',
  'y2026_snowflake',
  'y2026_dbrOnly',
  'y2026_dbrAws',
  'y2026_s3',
  'y2026_trino',
  'y2026_emr',
  'y2026_aws',
  'y2026_total',
])

function cellNumericValue(row: TabularMatrixRow, field: string): number | null {
  if (field === 'y2026_total') return y2026RowTotal(row)
  const v = row[field as keyof TabularMatrixRow]
  return typeof v === 'number' ? v : null
}

function computeHeatmapRanges(rows: TabularMatrixRow[]) {
  const mins: Record<string, number> = {}
  const maxs: Record<string, number> = {}
  for (const field of HEATMAP_FIELDS) {
    const vals = rows.map((r) => cellNumericValue(r, field)).filter((v): v is number => typeof v === 'number')
    if (vals.length === 0) continue
    mins[field] = Math.min(...vals)
    maxs[field] = Math.max(...vals)
  }
  return { mins, maxs }
}

function buildColumnDefs(
  mins: Record<string, number>,
  maxs: Record<string, number>
): (ColDef<TabularMatrixRow> | ColGroupDef<TabularMatrixRow>)[] {
  const heatmapStyle = (field: string) =>
    createMatrixHeatmapCellStyle<TabularMatrixRow>(field, HEATMAP_FIELDS, mins, maxs)

  const costLeaf = (
    field: keyof TabularMatrixRow,
    headerName: string,
    opts?: { minWidth?: number; flex?: number; heatmap?: boolean }
  ): ColDef<TabularMatrixRow> => ({
    field,
    headerName,
    type: 'numericColumn',
    minWidth: opts?.minWidth ?? 96,
    flex: opts?.flex,
    valueFormatter: formatCost,
    cellStyle: opts?.heatmap ? heatmapStyle(field as string) : undefined,
  })

  const y2026Platforms: ColDef<TabularMatrixRow>[] = [
    costLeaf('y2026_snowflake', 'Snowflake', { minWidth: 104, heatmap: true }),
    costLeaf('y2026_dbrOnly', 'DBR only', { heatmap: true }),
    costLeaf('y2026_dbrAws', 'DBR-AWS', { heatmap: true }),
    costLeaf('y2026_s3', 'S3 Datalake', { minWidth: 112, heatmap: true }),
    costLeaf('y2026_trino', 'Trino', { heatmap: true }),
    costLeaf('y2026_emr', 'EMR', { heatmap: true }),
    costLeaf('y2026_aws', 'AWS', { heatmap: true }),
    {
      colId: 'y2026_total',
      headerName: '2026 total',
      type: 'numericColumn',
      minWidth: 108,
      valueGetter: (p) => {
        const d = p.data
        if (!d) return null
        return y2026RowTotal(d)
      },
      valueFormatter: formatCost,
      cellStyle: heatmapStyle('y2026_total'),
    },
  ]

  return [
    {
      field: 'portfolioCategory',
      headerName: 'Portfolio Category',
      pinned: 'left',
      width: 132,
      spanRows: true,
      cellStyle: matrixPinnedDimensionCellStyle<TabularMatrixRow>,
    },
    {
      field: 'portfolioSubcategory',
      headerName: 'Portfolio Subcategory',
      pinned: 'left',
      width: 200,
      cellStyle: matrixPinnedDimensionCellStyle<TabularMatrixRow>,
    },
    {
      headerName: '2023',
      marryChildren: true,
      children: [costLeaf('y2023_total', 'Total Cost', { heatmap: true })],
    },
    {
      headerName: '2024',
      marryChildren: true,
      children: [costLeaf('y2024_total', 'Total Cost', { heatmap: true })],
    },
    {
      headerName: '2025',
      marryChildren: true,
      children: [costLeaf('y2025_total', 'Total Cost', { heatmap: true })],
    },
    {
      headerName: '2026',
      marryChildren: true,
      openByDefault: true,
      children: y2026Platforms,
    },
  ]
}

/**
 * Matrix-style cost table (mock rows): nested year → platform headers, merged category cells, per-column heatmap
 * (Prism highlight tokens), zebra rows, pinned grand total. Community-only (pre-aggregated layout).
 */
export function TabularMatrixAgGridExample() {
  const { mins, maxs } = React.useMemo(() => computeHeatmapRanges(TABULAR_MATRIX_ROW_DATA), [])
  const columnDefs = React.useMemo(() => buildColumnDefs(mins, maxs), [mins, maxs])

  return (
    <S.ExampleRoot>
      <S.TitleRow>
        <S.Title>Tabular Overview</S.Title>
        <S.Breadcrumb aria-label="Column hierarchy">
          Yearly Cost Date
          <S.BreadcrumbSep aria-hidden>/</S.BreadcrumbSep>
          Platform Name
          <S.BreadcrumbSep aria-hidden>/</S.BreadcrumbSep>
          Values
        </S.Breadcrumb>
      </S.TitleRow>
      <S.MatrixGridScope>
        <DPAgGrid<TabularMatrixRow>
          height="auto"
          domLayout="autoHeight"
          alwaysShowHorizontalScroll
          rowData={TABULAR_MATRIX_ROW_DATA}
          pinnedBottomRowData={[TABULAR_MATRIX_GRAND_TOTAL_ROW]}
          columnDefs={columnDefs}
          enableCellSpan
          suppressRowVirtualisation
          rowHeight={28}
          headerHeight={32}
          defaultColDef={{
            sortable: true,
            filter: false,
            resizable: true,
            suppressMovable: false,
            cellStyle: { fontSize: matrixCellFontSize, ...matrixCellPadding },
          }}
          getRowStyle={getTabularMatrixRowStyle}
          getRowId={(p) =>
            p.data.portfolioCategory === 'Grand Total'
              ? '__grand_total__'
              : `${p.data.portfolioCategory}::${p.data.portfolioSubcategory}`
          }
        />
      </S.MatrixGridScope>
    </S.ExampleRoot>
  )
}

export type { TabularMatrixRow } from './tabularMatrixTypes'
