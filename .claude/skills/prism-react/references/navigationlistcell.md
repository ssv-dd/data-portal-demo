## Import
```tsx
import {
    NavigationListCell
} from '@doordash/prism-react'
```
## Basic Usage
```tsx
import { NavigationListCell, ListCellIconType } from '@doordash/prism-react'

const MyListCell = () => (
  <NavigationListCell
    label={'This is a label'}
    description={'This is a description'}
    leadingArtwork={ListCellIconType.SmileyNeutralLine}
  />
)
```
### With Router
```tsx
import { NavigationListCell, List, ListCellIconType, Text } from '@doordash/prism-react'
import { Link, Route, Routes } from 'react-router-dom'

const routes = ['page-1', 'page-2', 'page-3']

const cells = [
  { label: 'Home' },
  { label: 'Retail' },
  { label: 'Convenience' }
]

const MyNavigation = () => (
   <>
      <List
        label={'Navigation with router'}
        hint={'Choose a cell to change the route'}
        renderCells={commonProps =>
          cells.map((cell, index) => (
            <NavigationListCell
              key={cell.label + index}
              {...cell}
              {...commonProps}
              as={Link}
              to={routes[index]}
            />
          ))
        }
      ></List>

      <Routes>
        <Route path={routes[0]} element={<Text>Home</Text>} />
        <Route path={routes[1]} element={<Text>Retail</Text>} />
        <Route path={routes[2]} element={<Text>Convenience</Text>} />
      </Routes>
    </>
)
```
## Additional Capabilities
`NavigationListCell` supports:

* Polymorphic types (props of `as` element will also be permitted)
* `forwardRef`
* `styled-components`

## NavigationListCell API

**The `NavigationListCell` accepts [all shared props in `ListCell`](https://prism.doordash.com/latest/web/components/list-cell/list-cell.html#shared-props)**