# QuantityStepper

Quantity steppers provide an input for incremental quantity selection via buttons for incrementing and decrementing the value, as well as an optional field for the value.

## Exported Constants
* `QuantityNumberType`
* `QuantityStepperState`

## `<QuantityStepperPage />`

### `accessibilityCurrentQuantityLabel` `required`
| | |
|-----------|------------|
| Type | `(labelArgs: { quantity: number; metadata?: string }) => string` |
| Default | |
| Description | Accessibility label for the current quantity. Within a live-region that is read out to the user on change. |

### `className`
| | |
|-----------|------------|
| Type | `string` |
| Default | |
| Description | CSS class name, applied to the root element of the stepper. |

### `decrementAccessibilityLabel` `required`
| | |
|-----------|------------|
| Type | `(stepSize: number) => string` |
| Default | |
| Description | Accessibility label for decrement button. |

### `fieldAccessibilityLabel`
| | |
|-----------|------------|
| Type | `(quantity: number) => string` |
| Default | |
| Description | Accessibility label for number field. Required, if `isReadOnlyField` is `false`. |

### `incrementAccessibilityLabel` `required`
| | |
|-----------|------------|
| Type | `(stepSize: number) => string` |
| Default | |
| Description | Accessibility label for increment button. |

### `initialQuantity`
| | |
|-----------|------------|
| Type | `number` |
| Default | |
| Description | The initial quantity, when  using as an uncontrolled component. |

### `isReadOnlyField`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `true` |
| Description | Determins if a field should be rendered or just a number to indicate the quantity. |

### `maxValue`
| | |
|-----------|------------|
| Type | `number` |
| Default | |
| Description | Maximum value that can be selected. |

### `metadata`
| | |
|-----------|------------|
| Type | `string` |
| Default | |
| Description | Metadata, a string displayed next to the quantity. |

### `minValue`
| | |
|-----------|------------|
| Type | `number` |
| Default | `1` |
| Description | Minimum value that can be selected. |

### `onChange`
| | |
|-----------|------------|
| Type | `({ value: number, direction: ChangeDirection }) => void` |
| Default | |
| Description | Callback when value changes. |

### `onDelete`
| | |
|-----------|------------|
| Type | `() => void` |
| Default | |
| Description | Callback when the delete button is clicked. |

### `quantity`
| | |
|-----------|------------|
| Type | `number` |
| Default | |
| Description | The value displayed, for use when controlled. |

### `quantityNumberType`
| | |
|-----------|------------|
| Type | `QuantityNumberType` |
| Default | `QuantityNumberType.integer` |
| Description | Type of quantity number, integer or float. |

### `state`
| | |
|-----------|------------|
| Type | `QuantityStepperState` |
| Default | `QuantityStepperState.default` |
| Description | State of the quantity stepper, loading or default. |

### `stepSize`
| | |
|-----------|------------|
| Type | `number` |
| Default | `1` |
| Description | Step size for incrementing and decrementing. |

## `<QuantityStepperField />`

### `accessibilityCurrentQuantityLabel` `required`
| | |
|-----------|------------|
| Type | `(labelArgs: { quantity: number; metadata?: string }) => string` |
| Default | |
| Description | Accessibility label for the current quantity. Within a live-region that is read out to the user on change. |

### `className`
| | |
|-----------|------------|
| Type | `string` |
| Default | |
| Description | CSS class name, applied to the root element of the stepper. |

### `decrementAccessibilityLabel` `required`
| | |
|-----------|------------|
| Type | `(stepSize: number) => string` |
| Default | |
| Description | Accessibility label for decrement button. |

### `deleteAccessibilityLabel`
| | |
|-----------|------------|
| Type | `(quantity: number) => string` |
| Default | |
| Description | Accessibility label for delete button. Required, if `hasDelete` is `true`. |

### `fieldAccessibilityLabel`
| | |
|-----------|------------|
| Type | `(quantity: number) => string` |
| Default | |
| Description | Accessibility label for number field. Required, if `isReadOnlyField` is `false`. |

### `hasDelete`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `true` |
| Description | Whether the component has a delete button, once the `minValue` is reached. |

### `incrementAccessibilityLabel` `required`
| | |
|-----------|------------|
| Type | `(stepSize: number) => string` |
| Default | |
| Description | Accessibility label for increment button. |

### `initialQuantity`
| | |
|-----------|------------|
| Type | `number` |
| Default | |
| Description | The initial quantity, when  using as an uncontrolled component. |

### `isExpandable`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `true` |
| Description | Whether the component is expandable. |

### `isReadOnlyField`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `true` |
| Description | Determins if a field should be rendered or just a number to indicate the quantity. |

### `maxValue`
| | |
|-----------|------------|
| Type | `number` |
| Default | |
| Description | Maximum value that can be selected. |

### `metadata`
| | |
|-----------|------------|
| Type | `string` |
| Default | |
| Description | Metadata, a string displayed next to the quantity. |

### `minValue`
| | |
|-----------|------------|
| Type | `number` |
| Default | `1` |
| Description | Minimum value that can be selected. |

### `onChange`
| | |
|-----------|------------|
| Type | `({ value: number, direction: ChangeDirection }) => void` |
| Default | |
| Description | Callback when value changes. |

### `onCollapse`
| | |
|-----------|------------|
| Type | `() => void` |
| Default | |
| Description | Callback when the component collapses. |

### `onDelete`
| | |
|-----------|------------|
| Type | `() => void` |
| Default | |
| Description | Callback when the delete button is clicked. |

### `onExpand`
| | |
|-----------|------------|
| Type | `() => void` |
| Default | |
| Description | Callback when the component expands. |

### `quantity`
| | |
|-----------|------------|
| Type | `number` |
| Default | |
| Description | The value displayed, for use when controlled. |

### `quantityNumberType`
| | |
|-----------|------------|
| Type | `QuantityNumberType` |
| Default | `QuantityNumberType.integer` |
| Description | Type of quantity number, integer or float. |

### `state`
| | |
|-----------|------------|
| Type | `QuantityStepperState` |
| Default | `QuantityStepperState.default` |
| Description | State of the quantity stepper, loading or default. |

### `stepSize`
| | |
|-----------|------------|
| Type | `number` |
| Default | `1` |
| Description | Step size for incrementing and decrementing. |

## `<QuantityStepperFloating />`

### `accessibilityCurrentQuantityLabel` `required`
| | |
|-----------|------------|
| Type | `(labelArgs: { quantity: number; metadata?: string }) => string` |
| Default | |
| Description | Accessibility label for the current quantity. Within a live-region that is read out to the user on change. |

### `className`
| | |
|-----------|------------|
| Type | `string` |
| Default | |
| Description | CSS class name, applied to the root element of the stepper. |

### `decrementAccessibilityLabel` `required`
| | |
|-----------|------------|
| Type | `(stepSize: number) => string` |
| Default | |
| Description | Accessibility label for decrement button. |

### `deleteAccessibilityLabel`
| | |
|-----------|------------|
| Type | `(quantity: number) => string` |
| Default | |
| Description | Accessibility label for delete button. Required, if `hasDelete` is `true`. |

### `hasDelete`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `true` |
| Description | Whether the component has a delete button, once the `minValue` is reached. |

### `incrementAccessibilityLabel` `required`
| | |
|-----------|------------|
| Type | `(stepSize: number) => string` |
| Default | |
| Description | Accessibility label for increment button. |

### `initialQuantity`
| | |
|-----------|------------|
| Type | `number` |
| Default | |
| Description | The initial quantity, when  using as an uncontrolled component. |

### `isExpandable`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `true` |
| Description | Whether the component is expandable. |

### `maxValue`
| | |
|-----------|------------|
| Type | `number` |
| Default | |
| Description | Maximum value that can be selected. |

### `metadata`
| | |
|-----------|------------|
| Type | `string` |
| Default | |
| Description | Metadata, a string displayed next to the quantity. |

### `minimizeTimeout`
| | |
|-----------|------------|
| Type | `number` |
| Default | `2000` |
| Description | Timeout before the component minimizes. |

### `minValue`
| | |
|-----------|------------|
| Type | `number` |
| Default | `1` |
| Description | Minimum value that can be selected. |

### `onChange`
| | |
|-----------|------------|
| Type | `({ value: number, direction: ChangeDirection }) => void` |
| Default | |
| Description | Callback when value changes. |

### `onCollapse`
| | |
|-----------|------------|
| Type | `() => void` |
| Default | |
| Description | Callback when the component collapses. |

### `onDelete`
| | |
|-----------|------------|
| Type | `() => void` |
| Default | |
| Description | Callback when the delete button is clicked. |

### `onExpand`
| | |
|-----------|------------|
| Type | `() => void` |
| Default | |
| Description | Callback when the component expands. |

### `onMinimize`
| | |
|-----------|------------|
| Type | `() => void` |
| Default | |
| Description | Callback when the component minimizes. |

### `quantity`
| | |
|-----------|------------|
| Type | `number` |
| Default | |
| Description | The value displayed, for use when controlled. |

### `quantityNumberType`
| | |
|-----------|------------|
| Type | `QuantityNumberType` |
| Default | `QuantityNumberType.integer` |
| Description | Type of quantity number, integer or float. |

### `state`
| | |
|-----------|------------|
| Type | `QuantityStepperState` |
| Default | `QuantityStepperState.default` |
| Description | State of the quantity stepper, loading or default. |

### `stepSize`
| | |
|-----------|------------|
| Type | `number` |
| Default | `1` |
| Description | Step size for incrementing and decrementing. |

### `willMinimize`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `true` |
| Description | Whether the component will minimize, after interaction. |

## Usage

### Basic
```
import { QuantityStepperPage } from '@doordash/prism-react'

...

<QuantityStepperPage
    accessibilityCurrentQuantityLabel={({quantity, metadata}) => `Current Quantity: ${quantity} ${metadata}`}
    decrementAccessibilityLabel={(stepSize) => `Remove ${stepSize} from your quantity.`}
    incrementAccessibilityLabel={(stepSize) => `Add ${stepSize} to your quantity.`}
/>
```
### Controlled
```
import { QuantityStepperPage } from '@doordash/prism-react'

...
const [quantity, setQuantity] = React.useState(0)

const handleQuantityChange = ({value, direction}) => {
    if (quantity !== value) {
        setQuantity(value)
    }
}
...
<QuantityStepperPage
    quantity={quantity}
    onChange={handleQuantityChange}
    accessibilityCurrentQuantityLabel={({quantity, metadata}) => `Current Quantity: ${quantity} ${metadata}`}
    decrementAccessibilityLabel={(stepSize) => `Remove ${stepSize} from your quantity.`}
    incrementAccessibilityLabel={(stepSize) => `Add ${stepSize} to your quantity.`}
/>
```