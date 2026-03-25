# `ButtonGroup`

Button Group is a component to help simplify the common layout patterns related to button groupings.

## Exported Constants
* `ButtonGroupAlignment`
* `ButtonGroupLayout`
* `ButtonGroupSlotType`
* `ButtonGroupSpacing`
* `ButtonGroupButtonType`

## API
Prop | PropType | Default | Notes
---- | -------- | ------- | -----
`primaryAction` | `ButtonGroupSlotInput` | `undefined` | Used to render content in the primary location.
`secondaryAction` | `ButtonGroupSlotInput` | `undefined` | Used to render content in the secondary location.
`tertiaryAction` | `ButtonGroupSlotInput` | `undefined` | Used to render content in the tertiary location.
`layout` | `ButtonGroupLayout` | `ButtonGroupLayout.Split` | The type of button layout you want to use (Split, Fill, Stack).
`insetSize` | `ButtonGroupSpacing` | `ButtonGroupSpacing.Small` | The amount of padding around the buttons.
`insetHorizontalSize` | `ButtonGroupSpacing` | `undefined` | The amount of horizontal padding around the buttons.
`insetVerticalSize` | `ButtonGroupSpacing` | `undefined` | The amount of vertical padding around the buttons.
`insetProps` | `ButtonGroupInsetProps` | `{}` | Props passed to the `<Inset />` wrapper. This allows for overwriting the default props of the Action.
`itemGap` | `ButtonGroupSpacing` | `ButtonGroupSpacing.XxSmall` | The amount of space between the buttons.
`itemAlignment` | `ButtonGroupAlignment` | `ButtonGroupAlignment.Center` | The vertical alignment of the items.

### Action type

Attribute | Type | Required | Notes
--------- | ---- | -------- | -----
`content` | `string OR React.ReactNode` | Yes | The content rendered within the `<Button />`
`onClick` | `() => void` | No | The method attached to the `onClick` of the `<Button />`
`buttonProps` | `ButtonGroupButtonProps` | No | Props passed to the `<Button />`. This allows for overwritting the default props of the Action.

## Usage

### ButtonGroup - Using Default Actions
```typescript
import { ButtonGroup } from '@doordash/prism-react'

const onClick = () => console.log('action clicked')

<ButtonGroup
    primaryAction={{ content: 'Primary Button', onClick }}
    secondaryAction={{ content: 'Secondary Button', onClick }}
    tertiaryAction={{ content: 'Tertiary Button', onClick }}
/>
```
### ButtonGroup - Using Custom Content
```typescript
import { ButtonGroup } from '@doordash/prism-react'

<ButtonGroup
    primaryAction={() => <div>Slot content</div>}
    secondaryAction={() => <div>Slot content</div>}
    tertiaryAction={() => <div>Slot content</div>}
/>
```