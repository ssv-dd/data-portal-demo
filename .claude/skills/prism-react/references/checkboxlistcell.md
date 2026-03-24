## Import
```tsx
import {
    CheckboxListCell,
    CheckboxList
} from '@doordash/prism-react'
```
## Basic Usage

When using `CheckboxListCell`, **it is strongly encouraged to use `CheckboxList`**. `CheckboxList` implements accessibility considerations, keyboard controls and state management assistance. `CheckboxList` can be used as either a controlled or uncontrolled component. **Each `CheckboxListCell` requires a unique `value` prop when used in `CheckboxList`.**
```tsx
import { CheckboxList, ListCellIconType } from '@doordash/prism-react'

const MyList = () => {
  const [selected, setSelected] = React.useState<boolean>(false)
  return (
    <CheckboxList
      value={selected}
      onChange={setSelected}
      label={'This is a list label'}
      hint={'This is a hint that describes the list'}
      cells={[
        {
          label: 'This is a label',
          description: 'This is a description',
          leadingArtwork: ListCellIconType.SmileyNeutralLine,
          value: 'value-1'
        },
        {
          label: 'This is also a label',
          description: 'This is also description',
          leadingArtwork: ListCellIconType.SmileyNeutralLine,
          value: 'value-2'
        }
      ]}
    />
  )
}
```
### Indeterminate Checkboxes

`CheckboxList` allows indeterminate checkboxes. Below is an example of how to implement a checkbox that will select or deselect all checkboxes. The checkbox will also show an indeterminate state when not all checkboxes are selected or deselected. Note that in this use case, the toggling checkbox does _not_ get a `value` prop, as it is not actually part of data set that is being collected. This also simplifies the code. If the toggling checkbox had a `value`, that adds extra filtering/processing of the `selected` state.
```tsx
import { CheckboxList, ListCellIconType } from '@doordash/prism-react'

const MyList = () => {
  const [selected, setSelected] = React.useState<string[]>([])
  return (
    <CheckboxList
      value={selected}
      onChange={setSelected}
      label={'This is a list label'}
      hint={'This is a hint that describes the list'}
      cells={[
        {
          // We omit `value` here since its not actually part of the data set (It also greatly simplifies the required code).
          label: 'Select all',
          // set `isDeterminate` to true if some but not all are selected
          isIndeterminate: selected.length > 0 && selected.length < 3,
          // this will force the select all checkbox state to be on or off
          isSelected: selected.length === 3,
          onChange: () => {
            // if all are selected then uncheck everything, otherwise select all checkboxes
            selected.length === 3
              ? setSelected([])
              : setSelected(['value-1', 'value-2'])
          },
        },
        {
          label: 'This is a label',
          description: 'This is a description',
          leadingArtwork: ListCellIconType.SmileyNeutralLine,
          value: 'value-1'
        },
        {
          label: 'This is also a label',
          description: 'This is also description',
          leadingArtwork: ListCellIconType.SmileyNeutralLine,
          value: 'value-2'
        }
      ]}
    />
  )
}
```
### Individual Checkboxes
While it is recommended to use `CheckboxList` to render `CheckboxListCells`, there may be scenarios where only a single checkbox is required. Simply import `CheckboxListCell` and pass the props needed for your requirements.
```tsx
import { CheckboxListCell, ListCellIconType } from '@doordash/prism-react'

const MyListCell = () => {
  const [ selected, setSelected ] = React.useState<boolean>(false)
  return (
    <CheckboxListCell
      isSelected={selected}
      onChange={setSelected}
      label={'This is a label'}
      description={'This is a description'}
      leadingArtwork={ListCellIconType.SmileyNeutralLine}
    />
  )
}
```
## Additional Capabilities
Both `CheckboxListCell` and `CheckboxList` support:

* `forwardRef`
* `styled-components`

## `CheckboxList` API

**The `CheckboxList` also [accepts all props in `List`](https://prism.doordash.com/latest/web/components/list-cell/list-cell.html#list-api) except `cellRole` and `renderCells`**

### `value`
| | |
|-----------|------------|
| Type | `string[]` |
| Default | `undefined` |
| Description | An array of values representing the checked checkboxes when used in controlled mode |

### `defaultValue`
| | |
|-----------|------------|
| Type | `string[]` |
| Default | `undefined` |
| Description | The checkboxes to show as checked on initial render when used in uncontrolled mode |

### `onChange`
| | |
|-----------|------------|
| Type | `(value: string[], data: { event: ChangeEvent; selectedCellValue: string }) => void` |
| Default | `undefined` |
| Description | Callback to invoke on change event |

### `cells`
| | |
|-----------|------------|
| Type | `Array<CheckboxListCellProps>` |
| Default | `undefined` |
| Description | An array of CheckboxListCellProps used to render the checkboxes in the list |

## `CheckboxListCell` API

**The `CheckboxListCell` also accepts [all shared props in `ListCell`](https://prism.doordash.com/latest/web/components/list-cell/list-cell.html#shared-props)**

### `value`
| | |
|-----------|------------|
| Type | `string` |
| Default | `undefined` |
| Description | Used to determine selected state when used in `CheckboxList` |

### `isSelected`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `undefined` |
| Description | Sets the checkbox selection state |

### `onChange`
| | |
|-----------|------------|
| Type | `((isSelected: boolean, event: React.ChangeEvent) => void) \| undefined` |
| Default | `undefined` |
| Description | Callback to invoke on change event |

### `isIndeterminate`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `undefined` |
| Description | Sets the checkbox to indeterminate. If both `isSelected` and `isIndeterminate` are true, the checkbox will remain in an `indeterminate` state. |

### `error`
| | |
|-----------|------------|
| Type | `string` |
| Default | `undefined` |
| Description | Sets the checkbox in an error state |

### `normalizeOnClick`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `true` |
| Description | The `CheckboxListCell` wraps an `input` in a `label`. Clicks on a `label` element will trigger two `onClick` events, one for the `label` and one for the `input`. When `normalizeOnClick` is `true`, `CheckboxListCell` will fire just one `onClick` for the `label`. Set this prop to `false` if you require the default DOM behavior. |