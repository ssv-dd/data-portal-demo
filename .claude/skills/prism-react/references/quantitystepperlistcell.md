## Import
```tsx
import {
    QuantityStepperListCell
} from '@doordash/prism-react'
```
## Basic Usage
```tsx
import { useState } from 'react'
import { QuantityStepperListCell, ListCellIconType } from '@doordash/prism-react'

const MyListCell = () => {
  const [quantity, setQuantity] = useState(0)

  return (
    <QuantityStepperListCell
      label={'This is a label'}
      description={'This is a description'}
      leadingArtwork={ListCellIconType.SmileyNeutralLine}
      quantity={quantity}
      onChange={({ value }) => setQuantity(value)}
      incrementAccessibilityLabel={stepSize => `Add ${stepSize} more Mocha to your cart.`}
      decrementAccessibilityLabel={stepSize => `Remove ${stepSize} Mocha from your cart.`}
      accessibilityCurrentQuantityLabel={({ quantity }) =>
        `You have ${quantity} mocha${quantity > 1 || quantity === 0 ? 's' : ''} in your cart`
      }
    />
  )
}
```
## Additional Capabilities
`QuantityStepperListCell` supports:

* `forwardRef`
* `styled-components`

## `QuantityStepperListCell` API

**The `QuantityStepperListCell` accepts**
* [All shared `ListCellProps`](https://prism.doordash.com/latest/web/components/list-cell/list-cell.html#shared-props)
* [All `QuantityStepperField` props](https://prism.doordash.com/latest/web/components/quantity-stepper.html#quantitystepperfield-).