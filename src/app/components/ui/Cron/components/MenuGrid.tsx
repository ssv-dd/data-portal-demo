import React from 'react'

import { GridContainer, GridContent, GridItem } from './MenuGrid.styles'

export type MenuGridProps = {
  columnCount: number
  items: React.ReactNode[]
}

export const MenuGrid: React.FC<MenuGridProps> = (props) => {
  const grid: Array<Array<React.ReactNode>> = React.useMemo(() => {
    const temp: Array<React.ReactNode[]> = []
    for (let i = 0; i < props.columnCount; i += 1) {
      temp.push([])
    }
    let curr = 0

    for (let i = 0; i < props.items.length; i += 1) {
      if (temp?.[curr]) {
        temp[curr].push(props.items[i])
      }
      curr = curr >= props.columnCount - 1 ? 0 : curr + 1
    }
    return temp
  }, [props.items, props.columnCount])

  return (
    <GridContainer>
      {grid.map((gridContent, i: number) => (
        <GridContent key={`content:${props.columnCount}:${i}`}>
          {gridContent.map((item: React.ReactNode, j: number) => (
            <GridItem key={`item:${props.columnCount}:${i}:${j}`}>{item}</GridItem>
          ))}
        </GridContent>
      ))}
    </GridContainer>
  )
}
