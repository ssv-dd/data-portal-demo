import { Spacing } from '@doordash/prism-react'
import styled from 'styled-components'

export const Main = styled.div`
  display: flex;
`

export const MenuContent = styled.div`
  max-height: 400px;
  overflow-y: auto;
  padding: ${Spacing.small}px;
`
