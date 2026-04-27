import { Spacing } from '@doordash/prism-react'
import styled from 'styled-components'

export const GridContainer = styled.div`
  overflow: hidden;
  display: flex;
  padding-top: ${Spacing.xxSmall}px;
  padding-bottom: ${Spacing.xxSmall}px;
  padding-right: ${Spacing.small}px;
`

export const GridContent = styled.div`
  display: flex;
  flex-direction: column;
  padding-left: ${Spacing.small}px;

  [class^='GridItem']:last-child {
    padding-bottom: 0;
  }
`

export const GridItem = styled.div`
  padding-bottom: ${Spacing.small}px;
`
