## Import
```tsx
import {
    RadioListCell,
    RadioList
} from '@doordash/prism-react'
```
## Basic Usage

When using `RadioListCell`, **it is strongly encouraged to use `RadioList`**. `RadioList` implements accessibility considerations, keyboard controls and state management assistance. `RadioList` can be used as either a controlled or uncontrolled component. **Each `RadioListCell` requires a unique `value` prop when used in `RadioList`.**
```tsx
import { RadioList, ListCellIconType } from '@doordash/prism-react'

const MyList = () => {
  const [selected, setSelected] = React.useState<string | null>(null)
  return (
    <RadioList
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
### Individual Radios
While it is recommended to use `RadioList` to render `RadioListCells`, there may be scenarios where only a single Radio is required. Simply import `RadioListCell` and pass the props needed for your requirements.
```tsx
import { RadioListCell, ListCellIconType } from '@doordash/prism-react'

const MyListCell = () => {
  const [selected, setSelected] = React.useState<boolean>(false)
  return (
    <RadioListCell
      isSelected={selected}
      onChange={setSelected}
      label={'This is a label'}
      description={'This is a description'}
      leadingArtwork={ListCellIconType.SmileyNeutralLine}
    />
  )
}
```
## `RadioList` API

**The `RadioList` also accepts [accepts all props in `List`](https://prism.doordash.com/latest/web/components/list-cell/list-cell.html#list-api) except `cellRole` and `renderCells`**

### `value`
| | |
|-----------|------------|
| Type | `string \| null` |
| Default | `undefined` |
| Description | The value representing the checked radio when used in controlled mode |

### `defaultValue`
| | |
|-----------|------------|
| Type | `string` |
| Default | `undefined` |
| Description | The radios to show as checked on initial render when used in uncontrolled mode |

### `onChange`
| | |
|-----------|------------|
| Type | `(value: string \| null, data: { event: React.ChangeEvent; selectedCellValue: string \| null }) => void` |
| Default | `undefined` |
| Description | Callback to invoke on change event |

### `cells`
| | |
|-----------|------------|
| Type | `Array<RadioListCellProps>` |
| Default | `undefined` |
| Description | An array of RadioListCellProps used to render the radios in the list |

### `name`
| | |
|-----------|------------|
| Type | `string` |
| Default | `undefined` |
| Description | Sets the `name` attribute of all nested radio elements |

## `RadioListCell` API

**The `RadioListCell` also accepts [all shared props in `ListCell`](https://prism.doordash.com/latest/web/components/list-cell/list-cell.html#shared-props)**

### `value`
| | |
|-----------|------------|
| Type | `string` |
| Default | `undefined` |
| Description | Used to determine selected state when used in `RadioList` |

### `isSelected`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `undefined` |
| Description | Sets the radio selection state |

### `onChange`
| | |
|-----------|------------|
| Type | `((isSelected: boolean, event: React.ChangeEvent) => void) \| undefined` |
| Default | `undefined` |
| Description | Callback to invoke on change event |

### `name`
| | |
|-----------|------------|
| Type | `string` |
| Default | `undefined` |
| Description | Sets the `name` attribute of the radio element |

### `error`
| | |
|-----------|------------|
| Type | `string` |
| Default | `undefined` |
| Description | Sets the radio in an error state |

### `normalizeOnClick`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `true` |
| Description | The `RadioListCell` wraps an `input` in a `label`. Clicks on a `label` element will trigger two `onClick` events, one for the `label` and one for the `input`. When `normalizeOnClick` is `true`, `RadioListCell` will fire just one `onClick` for the `label`. Set this prop to `false` if you require the default DOM behavior. |