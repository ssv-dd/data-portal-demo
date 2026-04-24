import type { ColDef, ValueFormatterParams } from 'ag-grid-community'
import * as React from 'react'

import { DPAgGrid } from '../../AgGrid'

import * as S from './AgGridShowcaseExample.styles'

type CatalogRow = {
  dataset: string
  domain: string
  owner: string
  tier: 'gold' | 'silver' | 'bronze'
  freshnessHours: number
  rowCount: number
  piiTagged: boolean
}

const rowData: CatalogRow[] = [
  {
    dataset: 'orders_curated',
    domain: 'Marketplace',
    owner: 'data-eng-marketplace',
    tier: 'gold',
    freshnessHours: 2,
    rowCount: 128_400_000,
    piiTagged: true,
  },
  {
    dataset: 'merchant_dim',
    domain: 'Merchants',
    owner: 'data-eng-merchants',
    tier: 'gold',
    freshnessHours: 6,
    rowCount: 4_200_000,
    piiTagged: true,
  },
  {
    dataset: 'delivery_events',
    domain: 'Logistics',
    owner: 'data-eng-logistics',
    tier: 'silver',
    freshnessHours: 12,
    rowCount: 980_000_000,
    piiTagged: false,
  },
  {
    dataset: 'support_tickets',
    domain: 'Support',
    owner: 'data-eng-support',
    tier: 'silver',
    freshnessHours: 24,
    rowCount: 42_000_000,
    piiTagged: true,
  },
  {
    dataset: 'experiment_assignments',
    domain: 'Growth',
    owner: 'data-eng-growth',
    tier: 'bronze',
    freshnessHours: 48,
    rowCount: 310_000_000,
    piiTagged: false,
  },
  {
    dataset: 'search_query_log',
    domain: 'Search',
    owner: 'data-eng-search',
    tier: 'bronze',
    freshnessHours: 72,
    rowCount: 5_100_000_000,
    piiTagged: false,
  },
]

const formatInt = (value: number) =>
  new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(value)

const columnDefs: ColDef<CatalogRow>[] = [
  { field: 'dataset', headerName: 'Dataset', flex: 1.2, minWidth: 160 },
  { field: 'domain', headerName: 'Domain', flex: 1, minWidth: 120 },
  { field: 'owner', headerName: 'Owner team', flex: 1.2, minWidth: 160 },
  {
    field: 'tier',
    headerName: 'Tier',
    maxWidth: 110,
    valueFormatter: (p: ValueFormatterParams<CatalogRow, CatalogRow['tier']>) =>
      p.value ? p.value.charAt(0).toUpperCase() + p.value.slice(1) : '',
  },
  {
    field: 'freshnessHours',
    headerName: 'Freshness (h)',
    type: 'numericColumn',
    maxWidth: 140,
    valueFormatter: (p) => (typeof p.value === 'number' ? `${p.value}h` : ''),
  },
  {
    field: 'rowCount',
    headerName: 'Rows',
    type: 'numericColumn',
    flex: 1,
    minWidth: 120,
    valueFormatter: (p) => (typeof p.value === 'number' ? formatInt(p.value) : ''),
  },
  {
    field: 'piiTagged',
    headerName: 'PII',
    maxWidth: 90,
    valueFormatter: (p) => (p.value === true ? 'Yes' : 'No'),
  },
]

/**
 * Demo grid for `/charts-demo`: sorting, filtering, resizing, pagination — uses {@link DPAgGrid}.
 */
export function AgGridShowcaseExample() {
  const [quickFilter, setQuickFilter] = React.useState('')

  return (
    <S.ExampleRoot>
      <S.FilterField htmlFor="dp-ag-grid-quick-filter">
        Quick filter
        <S.FilterInput
          id="dp-ag-grid-quick-filter"
          type="search"
          value={quickFilter}
          onChange={(e) => setQuickFilter(e.target.value)}
          placeholder="Filter any column…"
        />
      </S.FilterField>
      <DPAgGrid<CatalogRow>
        height={380}
        rowData={rowData}
        columnDefs={columnDefs}
        pagination
        paginationPageSize={5}
        paginationPageSizeSelector={[5, 10]}
        quickFilterText={quickFilter}
      />
    </S.ExampleRoot>
  )
}
