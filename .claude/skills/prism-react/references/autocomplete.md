# `Autocomplete`
A combination field and list component that displays a list of results based on user search

## Exported Constants
* `AutocompleteSize`
* `AutocompleteIconType`

## API

### `fieldValue` `required`
| | |
|-----------|------------|
| Type | `string` |
| Default | `undefined` |
| Description | Value rendered in the `Autocomplete` field input. |

### `fieldAccessibilityLabel` `required`
| | |
|-----------|------------|
| Type | `string` |
| Default | `undefined` |
| Description | Visually hidden label for the `Autocomplete`'s field input. Required for screen reader accessibility. |

### `results`
| | |
|-----------|------------|
| Type | `string \| AutocompleteResultProps \| AutocompleteCategoryProps` |
| Default | `[]` |
| Description | Results to display below the `Autocomplete` field when active. For simplified use, users can pass in an array of strings that will be used for the result rows. For more complex results, leverage `AutocompleteResultProps` (or `AutocompleteCategoryProps` for categorized results). |

### `selectedResult`
| | |
|-----------|------------|
| Type | `AutocompleteResultProps \| string` |
| Default | `undefined` |
| Description | The "value" of the component rendered in the text input (using the result `label` or `labelAsString`) and the result menu. Required to use component as a controlled form control. |

### `showResultsOnFocus`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `true` |
| Description | Determines if the results will show when a user moves focus into the text input via keyboard controls. |

### `selectResultsOnResultFocus`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `false` |
| Description | Determines if a result is also selected when focus moves to it via keyboard control. [Additional context on when to enable can be found here](https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/#x6-4-deciding-when-to-make-selection-automatically-follow-focus). |

### `closeOnSelection`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `true` |
| Description | Determines if the results menu will close/hide when a result selection is made. |

### `fieldIconType`
| | |
|-----------|------------|
| Type | `**AutocompleteIconType**` |
| Default | `undefined` |
| Description | Set if you would like to render an Icon inside of the leading edge of the `Autocomplete` field element, such as a search icon or a location pin icon. |

### `isFieldInset`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `false` |
| Description | When true, the results will be rendered in the document flow. When false, the results will be rendered within an `AnchorLayer`. Recommended use: when rendering the `Autocomplete` inside of a contained context (Examples: inside of a popover Menu element, or inside of a fullscreen Modal on mobile devices). |

### `size`
| | |
|-----------|------------|
| Type | `**AutocompleteSize**` |
| Default | `AutocompleteSize.medium` |
| Description | Determines the size and spacing of the component. |

### `onFieldValueChange`
| | |
|-----------|------------|
| Type | `(value: string, event?: ChangeEvent<HTMLInputElement>) => void` |
| Default | `undefined` |
| Description | Callback when input value changes. Passed through to the underlying `TextField` as `onChange`. |

### `onFieldClearClick`
| | |
|-----------|------------|
| Type | `function (no parameters)` |
| Default | `undefined` |
| Description | Callback when the input field's "x" control is clicked to clear the field value. |

### `onResultSelect`
| | |
|-----------|------------|
| Type | `(event: AutocompleteResultSelectEvent) => void` |
| Default | `undefined` |
| Description | Optional top-level callback that will be called for any result row click (or, when navigating via keyboard, when the result is focused and the `Enter` key is pressed). Can also define individual `onSelect` callback for result (see [AutocompleteResultProps](#AutocompleteResultProps)). |

### `onResultFocus`
| | |
|-----------|------------|
| Type | `(result: AutocompleteResultProps) => void` |
| Default | `undefined` |
| Description | Optional top-level callback that will be called for any result row focus. Can also define individual `onFocus` callback for result (see [AutocompleteResultProps](#AutocompleteResultProps)). |

### `fieldProps`
| | |
|-----------|------------|
| Type | `AutocompleteFieldProps` |
| Default | `undefined` |
| Description | Props to pass through to underlying `TextField` component. |

### `containerStyles`
| | |
|-----------|------------|
| Type | `{ [key: string]: any }` |
| Default | `undefined` |
| Description | Shape of CSS key/value pairs. Styles to apply to input & results container - can be leveraged for setting a maximum height or scrolling behavior on the results (similar to same API in `Menu` component). |

### `shouldAutomaticallyFlip`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `false` |
| Description | Allows the result container to move above the input if the container would be our of the viewport. Note, when using this prop you must also set a height in the `containerStyles` prop. |

### `isPortaled`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `true` |
| Description | Whether or not to render the Autocomplete dropdown in a portal or adjacent to the trigger. |

### `anchoredLayerProps`
| | |
|-----------|------------|
| Type | `AnchoredLayerSettingsProps` |
| Default | `{}` |
| Description | Allows you to pass any override settings to the AnchoredLayer contained in Autocomplete. |

### `AutocompleteResultSelectEvent`

#### `selected`
| | |
|-----------|------------|
| Type | `AutocompleteResultProps` |
| Default | `undefined` |
| Description | The selected result. |

#### `action`
| | |
|-----------|------------|
| Type | `**AutocompleteResultSelectEventAction**` |
| Default | `undefined` |
| Description | Object contained event data for the user interaction that triggered the selection. |

### `AutocompleteResultSelectEventAction`

#### `type`
| | |
|-----------|------------|
| Type | `'click' \| 'keyboard' \| 'blur' \| 'resultFocus'` |
| Default | `undefined` |
| Description | Denotes what kind of user action triggered the selection. |

#### `event`
| | |
|-----------|------------|
| Type | `React.MouseEvent \| React.KeyboardEvent \| null` |
| Default | `undefined` |
| Description | The event object from the user interaction (if applicable). |

### `AutocompleteResultProps`

#### `label` `required`
| | |
|-----------|------------|
| Type | `string \| React.ReactElement` |
| Default | `undefined` |
| Description | Main label/content for result. |

#### `labelAsString`
| | |
|-----------|------------|
| Type | `string` |
| Default | `undefined` |
| Description | Required if `label` is a React element. Used to populate TextField on selection. |

#### `id`
| | |
|-----------|------------|
| Type | `string` |
| Default | `undefined` |
| Description | A custom id added to the associated DOM element. The Autocomplete will autogenerate a unique ID using the `label` or `labelAsString` if not provided. |

#### `body`
| | |
|-----------|------------|
| Type | `string \| React.ReactElement` |
| Default | `undefined` |
| Description | |

#### `meta`
| | |
|-----------|------------|
| Type | `string \| React.ReactElement` |
| Default | `undefined` |
| Description | |

#### `isMetaAbove`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `undefined` |
| Description | Set to `true` if `meta` content should be displayed above `label`. |

#### `href`
| | |
|-----------|------------|
| Type | `string` |
| Default | `undefined` |
| Description | |

#### `onSelect`
| | |
|-----------|------------|
| Type | `(result: AutocompleteResultProps) => void` |
| Default | `undefined` |
| Description | Callback when result row is clicked or, when navigating via keyboard, when the result is focused and the `Enter` key is pressed. Will receive `AutocompleteResultProps` content as callback param. |

#### `onFocus`
| | |
|-----------|------------|
| Type | `(result: AutocompleteResultProps) => void` |
| Default | `undefined` |
| Description | Callback when result row is focused (e.g. when user cycles through results using arrow keys). Will receive `AutocompleteResultProps` content as callback param. |

#### `hasSeparator`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `undefined` |
| Description | If `true`, row will render with a bottom separator. |

#### `leadingIconType`
| | |
|-----------|------------|
| Type | `**AutocompleteIconType**` |
| Default | `undefined` |
| Description | |

#### `leadingIconProps`
| | |
|-----------|------------|
| Type | `AutocompleteIconProps` |
| Default | `undefined` |
| Description | Additional props to pass through to rendered `Icon`. |

#### `trailingIconType`
| | |
|-----------|------------|
| Type | `**AutocompleteIconType**` |
| Default | `undefined` |
| Description | |

#### `trailingIconProps`
| | |
|-----------|------------|
| Type | `AutocompleteIconProps` |
| Default | `undefined` |
| Description | Additional props to pass through to rendered `Icon`. |

#### `renderContentBefore`
| | |
|-----------|------------|
| Type | `function (returns value)` |
| Default | `undefined` |
| Description | Content to render on the leading edge of the main row content block. Can be used for rendering an image like a store logo. |

#### `renderContentAfter`
| | |
|-----------|------------|
| Type | `function (returns value)` |
| Default | `undefined` |
| Description | Content to render on the trailing edge of the main row content block. Can be used for rendering an image like a store logo. |

### `AutocompleteCategoryProps`

#### `category` `required`
| | |
|-----------|------------|
| Type | `string` |
| Default | `undefined` |
| Description | Category name that will be displayed above the categorized results. |

#### `id`
| | |
|-----------|------------|
| Type | `string` |
| Default | `undefined` |
| Description | A custom id added to the associated DOM element. The Autocomplete will autogenerate a unique ID using the `category` if not provided. |

#### `categoryTextProps`
| | |
|-----------|------------|
| Type | `AutocompleteTextProps` |
| Default | `undefined` |
| Description | Additional props that will be passed through to the underlying `Text` node. Can be used for customizing label attributes like `color`. |

#### `hasSeparator`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `undefined` |
| Description | If true, will render with a divider line below the `category` `Text`. |

#### `results`
| | |
|-----------|------------|
| Type | `Array<string \| AutocompleteResultProps>` |
| Default | `undefined` |
| Description | Results to display within Category. |

## Usage

### Autocomplete - basic usage
```typescript
import { Autocomplete } from '@doordash/prism-react'
...
const [searchValue, setSearchValue] = React.useState('')
const [selected, setSelected] = React.useState<AutocompleteResultProps>(null) // required when used as a controlled component
...
<Autocomplete
  fieldAccessibilityLabel="Address search"
  fieldValue={searchValue}
  onFieldValueChange={value => {
    fetchNewAddresses(value)
    setSearchValue(value)
  }}
  selectedResult={selected}
  onResultSelect={event => setSelected(event.selected)} // required when used as a controlled component
  results={[
    '123 Main St',
    '500 Main Ave',
    'Main Plaza, Central City',
  ]}
/>
```
#### Example - Autocomplete - categorized results
```typescript
import { Autocomplete } from '@doordash/prism-react'
...
const [searchValue, setSearchValue] = React.useState('')
...
<Autocomplete
  fieldAccessibilityLabel="Store & Business Search"
  fieldValue={searchValue}
  onFieldValueChange={value => {
    fetchNewResults(value)
    setSearchValue(value)
  }}
  results={[
    {
      category: 'Businesses',
      results: [
        {
          label: 'Red Robin',
          body: '570 stores',
          meta: 'Contains store Red Robin (590)',
          renderBeforeContent: () => <img src="logos/red-robin-logo.png" />
        },
        {
          label: "Chicken Sammy's",
          body: '26 stores',
          meta: "Contains store Chicken Sammy's Brentwood",
          renderBeforeContent: () => <img src="logos/chicken-sammys-logo.png" />
        },
      ]
    },
    {
      category: 'Stores',
      results: [
        {
          label: 'Red Robin (590)',
          body: '2385 Sand Creek Rd, Brentwood, CA 94513, USA',
          renderBeforeContent: () => <img src="logos/red-robin-logo.png" />
        },
        {
          label: "Chicken Sammy's Brentwood",
          body: '2385 Sand Creek Rd, Brentwood, CA 94513, USA',
          renderBeforeContent: () => <img src="logos/chicken-sammys-logo.png" />
        },
      ]
    }
  ]}
/>
```
#### Example - Autocomplete & Address Searching
```typescript
import { Autocomplete } from '@doordash/prism-react'
...
const [searchValue, setSearchValue] = React.useState('')
...
<Autocomplete
  fieldAccessibilityLabel="Address search"
  fieldValue={searchValue}
  onFieldValueChange={value => {
    fetchNewAddresses(value)
    setSearchValue(value)
  }}
  onResultFocus={result => {
    setSearchValue(value)
  }}
  results={[
    '123 Main St',
    '500 Main Ave',
    'Main Plaza, Central City',
  ]}
/>
```