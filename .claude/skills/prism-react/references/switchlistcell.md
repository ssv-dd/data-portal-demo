## Import
```tsx
import {
    SwitchListCell
} from '@doordash/prism-react'
```
## Basic Usage
```tsx
import { useState } from 'react'
import { SwitchListCell, ListCellIconType } from '@doordash/prism-react'

const MyListCell = () => {
  const [checked, setChecked] = useState(false)

  return (
    <SwitchListCell
      isSelected={checked}
      onChange={setChecked}
      label={'This is a label'}
      description={'This is a description'}
      leadingArtwork={ListCellIconType.SmileyNeutralLine}
    />
  )
}
```
## Additional Capabilities
`SwitchListCell` supports:

* `forwardRef`
* `styled-components`

## `SwitchListCell` API

**The `SwitchListCell` also accepts [all shared props in `ListCell`](https://prism.doordash.com/latest/web/components/list-cell/list-cell.html#shared-props)**

### `onSwitchBlur`
| | |
|-----------|------------|
| Type | `React.FocusEventHandler \| undefined` |
| Default | `undefined` |
| Description | Callback to run when the switch element loses focus (blurred) |

### `onSwitchFocus`
| | |
|-----------|------------|
| Type | `React.FocusEventHandler \| undefined` |
| Default | `undefined` |
| Description | Callback to run when the switch element gains focus |

### `onSwitchClick`
| | |
|-----------|------------|
| Type | `((isSelected: boolean, event: React.MouseEvent) => void) \| undefined` |
| Default | `undefined` |
| Description | Callback to run when the switch element is clicked (NOT the ListCell itself) |