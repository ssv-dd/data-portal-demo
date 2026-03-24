## Import
```tsx
import {
    ListCell,
    ListCellMediaSize,
    ListCellIconSize,
    ListCellIconType,
    ListCellIconColor,
    ListCellTagIconType,
    ListCellTagType,
    ListCellSeparator,
    ListCellAlignment,
    List,
    ListLabel,
    ListError,
    ListHint,
} from '@doordash/prism-react'
```
## Getting Started

In addition to [the base `ListCell` component](#listcell-api), the following components that cover many of the common use cases are also provided:

* [Checkbox](https://prism.doordash.com/latest/web/components/list-cell/checkbox.html)
* [Radio](https://prism.doordash.com/latest/web/components/list-cell/radio-alNSso9z.html)
* [Selection](https://prism.doordash.com/latest/web/components/list-cell/selection-4MZV0O1u.html)
* [IconButton](https://prism.doordash.com/latest/web/components/list-cell/icon-button-yA7RoTen.html)
* [Navigation](https://prism.doordash.com/latest/web/components/list-cell/navigation-smweiY99.html)
* [QuantityStepper](https://prism.doordash.com/latest/web/components/list-cell/quantity-stepper-MU4j3vYB.html)
* [Switch](https://prism.doordash.com/latest/web/components/list-cell/switch-59dMUyBp.html)

Before using `ListCell` or `List`, **make sure your use case is not covered by one of the above components**. The core `ListCell` and `List` components are highly customizable but you will need to implement UX and accessibility considerations that are managed for you in the components above.

### Basic usage
```tsx
import { ListCell, ListCellIconType } from '@doordash/prism-react'

const MyListCell = () => (
  <ListCell
    label={'This is a label'}
    description={'This is a description'}
    leadingArtwork={ListCellIconType.SmileyNeutralLine}
  />
)
```
[A `List` component](#list-api) is also provided to group `ListCell` components together:
```tsx
import { List, ListCellIconType } from '@doordash/prism-react'

const cells = [
  {
    label: 'This is a label',
    description: 'This is a description',
    leadingArtwork: ListCellIconType.SmileyNeutralLine
  },
  {
    label: 'This is also a label',
    description: 'This is also description',
    leadingArtwork: ListCellIconType.SmileyNeutralLine
  }
]
const MyList = () => (
  <List
    label={'This is a list label'}
    hint={'This is a hint that describes the list'}
    renderCells={commonProps =>
      cells.map((cell, index) => (
        <ListCell
          key={cell.label + index}
          {...cell}
          {...commonProps}
        />
      ))
    }
  ></List>
)
```
## Custom Content

### ListCell
The `customContent` prop will render whatever is passed to it under the standard `ListCell` UI and above the bottom separator.
```tsx
import { ListCell, ListCellIconType } from '@doordash/prism-react'

import { SomeCustomComponent } from '../some/path'

const MyListCell = () => (
  <ListCell
    label={'This is a label'}
    description={'This is a description'}
    leadingArtwork={ListCellIconType.SmileyNeutralLine}
    customContent={<SomeCustomComponent />}
  />
)
```
If you need your custom content to be aligned with the existing `ListCell` grid, [a `ListCellFrame` layout component](#listcellframe-api) is provided. The content you pass to the available slots will be placed on the same grid that the `ListCell` content is placed in.
```tsx
import { ListCell, ListCellIconType, ListCellFrame } from '@doordash/prism-react'

import { SomeCustomComponent } from '../some/path'

const MyListCell = () => (
  <ListCell
    label={'This is a label'}
    description={'This is a description'}
    leadingArtwork={ListCellIconType.SmileyNeutralLine}
    // Passing `SomeCustomComponent` to the `content` slot will make sure `SomeCustomComponent`
    // is left-aligned with the `label` and `description`
    customContent={<ListCellFrame content={<SomeCustomComponent />} />}
  />
)
```
### List
If the provided `List` component does not meet your requirements, you can use the exported `ListLabel`, `ListHint` and `ListError` components to compose your own list wrapper that visually aligns with other Prism `List` component in your application.

## Additional Capabilities
Both `ListCell` and `List` support:

* Polymorphic types (props of `as` element will also be permitted)
* `forwardRef`
* `styled-components`

## `ListCell` API

### Shared Props
The following props are also available in all list cell components listed in the [Getting Started](#getting-started) section.

**You must provide either a label or description.**

#### `label`
| | |
|-----------|------------|
| Type | `string` |
| Default | `undefined` |
| Description | Renders a label within the ListCell, above `description` and `detail` |

#### `labelTextProps`
| | |
|-----------|------------|
| Type | `ListCellTextProps` |
| Default | `undefined` |
| Description | Override props passed to the `label` `Text` component |

#### `labelMaxLines`
| | |
|-----------|------------|
| Type | `number` |
| Default | `undefined` |
| Description | The maximum number of lines a `label` can span before being truncated |

#### `description`
| | |
|-----------|------------|
| Type | `string` |
| Default | `undefined` |
| Description | Renders a description string within the ListCell, under the `label` and above `detail` |

#### `descriptionTextProps`
| | |
|-----------|------------|
| Type | `ListCellTextProps` |
| Default | `undefined` |
| Description | Override props passed to the `description` `Text` component |

#### `descriptionMaxLines`
| | |
|-----------|------------|
| Type | `number` |
| Default | `undefined` |
| Description | The maximum number of lines a `description` can span before being truncated |

#### `detail`
| | |
|-----------|------------|
| Type | `string` |
| Default | `undefined` |
| Description | Renders a detail string in the ListCell, under the `label` and `description` |

#### `detailTextProps`
| | |
|-----------|------------|
| Type | `ListCellTextProps` |
| Default | `undefined` |
| Description | Override props passed to the `detail` `Text` component |

#### `trailingDetail`
| | |
|-----------|------------|
| Type | `string` |
| Default | `undefined` |
| Description | Renders text opposite of `label`/`description`/`detail` in the ListCell |

#### `trailingDetailTextProps`
| | |
|-----------|------------|
| Type | `ListCellTextProps` |
| Default | `undefined` |
| Description | Override props passed to the `trailingDetail` `Text` component |

#### `tags`
| | |
|-----------|------------|
| Type | `ListCellTagProps \| ListCellTagArray` |
| Default | `undefined` |
| Description | Renders 1-4 tags in the ListCell, below the `label`, `description` and `detail` |

#### `topTags`
| | |
|-----------|------------|
| Type | `ListCellTagProps \| ListCellTopTagArray` |
| Default | `undefined` |
| Description | Renders 1-2 tags in the ListCell, above the `label`, `description` and `detail` |

#### `customContent`
| | |
|-----------|------------|
| Type | `React.ReactNode \| React.ReactNode[]` |
| Default | `undefined` |
| Description | Custom content to be rendered at the bottom of the ListCell, after all built-in props |

#### `onClick`
| | |
|-----------|------------|
| Type | `MouseEventHandler` |
| Default | `undefined` |
| Description | Handler to run when ListCell is clicked |

#### `leadingArtwork`
| | |
|-----------|------------|
| Type | `ListCellIconTypeValueType \| ListCellIconProps \| ListCellMediaProps` |
| Default | `undefined` |
| Description | Leading artwork to render on leading side of ListCell. Can be an icon or image. |

#### `separator`
| | |
|-----------|------------|
| Type | `**ListCellSeparator**` |
| Default | `ListCellSeparator.inset` |
| Description | Determines style of border/rule along the bottom of the ListCell |

#### `alignment`
| | |
|-----------|------------|
| Type | `**ListCellAlignment**` |
| Default | `ListCellAlignment.center` |
| Description | Vertically align content |

#### `isDisabled`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `false` |
| Description | Disables the ListCell |

### `ListCell` Specific Props

These props are only available in `ListCell`, and **not** in the list cell components listed in [Getting Started](#getting-started)

#### `leadingContent`
| | |
|-----------|------------|
| Type | `ReactNode` |
| Default | `undefined` |
| Description | Generic container to render custom content at beginning of ListCell |

#### `trailingContent`
| | |
|-----------|------------|
| Type | `React.ReactNode \| React.ReactNode[]` |
| Default | `undefined` |
| Description | Generic container to render custom content at end of ListCell. When given an array of nodes, each node will be rendered inline. |

#### `manageNestedInteractiveElements`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `false` |
| Description | Set this to true when providing an `onClick` prop, and `leadingContent`, `trailingContent` or `customContent` contain interactive elements. This will prevent your nested interactions from triggering the `ListCell` `onClick` event and manage required a11y considerations |

## `ListCellFrame` API

### `leading`
| | |
|-----------|------------|
| Type | `ReactNode` |
| Default | `undefined` |
| Description | Content for "leading" slot (first column) |

### `leadingMetadata`
| | |
|-----------|------------|
| Type | `ReactNode` |
| Default | `undefined` |
| Description | Content for "leadingMetadata" slot (second column) |

### `content`
| | |
|-----------|------------|
| Type | `ReactNode` |
| Default | `undefined` |
| Description | Content for "content slot" (third column) |

### `trailingMetadata`
| | |
|-----------|------------|
| Type | `ReactNode` |
| Default | `undefined` |
| Description | Content for "trailingMetadata" slot (fourth column) |

### `trailing`
| | |
|-----------|------------|
| Type | `ReactNode` |
| Default | `undefined` |
| Description | Content for "trailing slot" (fifth column) |

### `collapseColumns`
| | |
|-----------|------------|
| Type | `boolean \| [boolean, boolean, boolean, boolean, boolean]` |
| Default | `undefined` |
| Description | If a slot/column is empty, this prop determines if the column will still take up space within the layout grid. When true, all empty columns will be combined with the closest previous column with content. An array of boolean values can be provided to only collapse certain columns. For example, if you want `leading` content to span both the `leading` and `leadingMetadata` columns, you would provide `[false, true, false, false, false]`, and leave the `leadingMetadata` prop empty/undefined |

### `alignment`
| | |
|-----------|------------|
| Type | `**ListCellAlignment**` |
| Default | `ListCellAlignment.center` |
| Description | Determines the vertical alignment of the content in the frame |

### `padding`
| | |
|-----------|------------|
| Type | `**ListCellFramePadding**` |
| Default | `ListCellFramePaddingValueType.none` |
| Description | Adds vertical padding to the top and bottom of the frame |

## `List` API

**You must provide either a label or labelledBy.**

### `label`
| | |
|-----------|------------|
| Type | `string` |
| Default | `undefined` |
| Description | The label to render at the top of the list. Can be visually hidden with `isLabelHidden` |

### `labelledBy`
| | |
|-----------|------------|
| Type | `string` |
| Default | `undefined` |
| Description | An `id` reference to another element's `id` attribute in the DOM that the list should use as its label for screenreaders |

### `hint`
| | |
|-----------|------------|
| Type | `string` |
| Default | `string` |
| Description | A hint to render below the list's label |

### `listStyle`
| | |
|-----------|------------|
| Type | `**ListCellListStyle**` |
| Default | `ListCellListStyle.floating` |
| Description | Determines the visual UI style of the list. When set to `ListCellListStyle.contained`, the `separator` prop is automatically ignored as contained lists do not use separators in their visual design. |

### `isLabelHidden`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `undefined` |
| Description | Hides the label element visually. A `label` or `labelledby` is still required for accessibility |

### `error`
| | |
|-----------|------------|
| Type | `string` |
| Default | `undefined` |
| Description | Display an error message in place of the hint and adds an error state to all checkboxes |

### `separator`
| | |
|-----------|------------|
| Type | `**ListCellSeparator**` |
| Default | `ListCellSeparator.inset` |
| Description | Determines style of border/rule along the bottom of all the checkboxes in the list |

### `isDisabled`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `false` |
| Description | Disables all checkboxes in the list |

### `alignment`
| | |
|-----------|------------|
| Type | `**ListCellAlignment**` |
| Default | `ListCellAlignment.center` |
| Description | Vertically align content |

### `cellRole`
| | |
|-----------|------------|
| Type | `string` |
| Default | `'listitem'` |
| Description | The HTML role passed to cells in the `renderCells` function. If a `role` is provided to the `List` component, this will default to `undefined` and will need to be explicitly defined. If no `role` is provided to the `List` component, the `List` will be `role=list` and cells will be passed `role=listitem`. |

### `renderCells`
| | |
|-----------|------------|
| Type | `(cellProps: {error?: string; separator?: ListCellSeparator; isDisabled?: boolean; alignment?: ListCellAlignment; role?: string }, listProps: { id?: string; labelId?: string; descriptionId?: string } ) => ReactNode` |
| Default | `undefined` |
| Description | A function to render ListCells with access to shared `List` config props (e.g., separator style, alignment, etc.) |

### `role`
| | |
|-----------|------------|
| Type | `string \| null` |
| Default | `undefined` |
| Description | The HTML role passed to the `List` component. If a `role` is provided to the `List` component, the `cellRole` will default to `undefined` and will need to be explicitly defined. `role=generic` will remove the `role` attribute from the element |