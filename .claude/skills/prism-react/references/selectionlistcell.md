## Import
```tsx
import {
    SelectionListCell,
    SelectionList
} from '@doordash/prism-react'
```
## Basic Usage

When using `SelectionListCell`, **it is strongly encouraged to use `SelectionList`**. `SelectionList` implements accessibility considerations, keyboard controls and state management assistance. `SelectionList` can be used as either a controlled or uncontrolled component. **Each `SelectionListCell` requires a unique `value` prop when used in `SelectionList`.**
```tsx
import { SelectionList, ListCellIconType } from '@doordash/prism-react'

const MyList = () => {
  const [selected, setSelected] = React.useState<string[]>([])
  return (
    <SelectionList
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
### Accessibility
`SelectionList` uses the `listbox` `role` and implements required accessibility features. [As a composite widget, focus is managed between options using the up and down arrow keys](https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/#kbd_focus_activedescendant). Using the `tab` key will continue focus passed the list cell options and to the interactive element on the page.

### Individual Selections
While it is recommended to use `SelectionList` to render `SelectionListCells`, there may be scenarios where only a single Selection is required. Simply import `SelectionListCell` and pass the props needed for your requirements.
```tsx
import { SelectionListCell, ListCellIconType } from '@doordash/prism-react'

const MyListCell = () => {
  const [ selected, setSelected ] = React.useState<boolean>(false)
  return (
    <SelectionListCell
      isSelected={selected}
      onChange={setSelected}
      label={'This is a label'}
      description={'This is a description'}
      leadingArtwork={ListCellIconType.SmileyNeutralLine}
    />
  )
}
```
## `SelectionList` API

**The `SelectionList` also accepts [accepts all props in `List`](https://prism.doordash.com/latest/web/components/list-cell/list-cell.html#list-api) except `cellRole` and `renderCells`**

### `value`
| | |
|-----------|------------|
| Type | `string[]` |
| Default | `undefined` |
| Description | An array of values representing the checked Selections when used in controlled mode |

### `defaultValue`
| | |
|-----------|------------|
| Type | `string[]` |
| Default | `undefined` |
| Description | The Selections to show as checked on initial render when used in uncontrolled mode |

### `onChange`
| | |
|-----------|------------|
| Type | `(value: string[], data: { event: React.ChangeEvent \| React.KeyboardEvent \| React.MouseEvent, selectedCellValue: string }) => void` |
| Default | `undefined` |
| Description | Callback to invoke on change event |

### `cells`
| | |
|-----------|------------|
| Type | `Array<SelectionListCellPropType>` |
| Default | `undefined` |
| Description | An array of `SelectionListCellProps` used to render the options in the list |

### `allowMultiselect`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `false` |
| Description | When true a user can select multiple list cells |

### `selectItemOnCellFocus`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `false` |
| Description | When true, the selected list cell will change with focus (only works when `allowMultiselect` is false) |

## `SelectionListCell` API

**The `SelectionListCell` also accepts a[ll shared props in `ListCell`](https://prism.doordash.com/latest/web/components/list-cell/list-cell.html#shared-props)**

### `value`
| | |
|-----------|------------|
| Type | `string` |
| Default | `undefined` |
| Description | Used to determine selected state when used in `SelectionList` |

### `isSelected`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `undefined` |
| Description | Sets the Selection selection state |

### `onChange`
| | |
|-----------|------------|
| Type | `(isSelected: boolean, event: any) => void` |
| Default | `undefined` |
| Description | Callback to invoke on change event |

### `error`
| | |
|-----------|------------|
| Type | `string` |
| Default | `undefined` |
| Description | Sets the Selection in an error state |