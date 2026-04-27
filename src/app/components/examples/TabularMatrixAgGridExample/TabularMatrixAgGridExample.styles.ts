import styled from 'styled-components'

import { Theme } from '../../../styles/dataPortalAppTheme'

export const ExampleRoot = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${Theme.usage.space.small};
`

export const TitleRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${Theme.usage.space.xxSmall};
`

export const Title = styled.h3`
  margin: 0;
  font-size: ${Theme.usage.fontSize.large};
  font-weight: 600;
  color: ${Theme.usage.color.text.default};
`

export const Breadcrumb = styled.div`
  font-size: ${Theme.usage.fontSize.small};
  color: ${Theme.usage.color.text.subdued.default};
`

export const BreadcrumbSep = styled.span`
  color: ${Theme.usage.color.text.subdued.default};
  padding: 0 ${Theme.usage.space.xxSmall};
`

/** Scope AG Grid header chrome to Prism tokens (Quartz defaults are generic). */
export const MatrixGridScope = styled.div`
  & [data-dp-ag-grid] .ag-header-cell-text,
  & [data-dp-ag-grid] .ag-header-group-cell-label {
    color: ${Theme.usage.color.text.subdued.default};
    font-size: ${Theme.usage.fontSize.small};
    font-weight: 500;
  }

  & [data-dp-ag-grid] .ag-header-cell,
  & [data-dp-ag-grid] .ag-header-group-cell {
    border-color: ${Theme.usage.color.border.default};
  }

  & [data-dp-ag-grid] .ag-row {
    border-color: ${Theme.usage.color.border.default};
  }

  /* Quartz pinned rows use --ag-pinned-row-text-color (often light); keep totals readable on our surface. */
  & [data-dp-ag-grid] .ag-row.ag-row-pinned .ag-cell,
  & [data-dp-ag-grid] .ag-row.ag-row-pinned .ag-cell-value {
    color: ${Theme.usage.color.text.default} !important;
  }
`
