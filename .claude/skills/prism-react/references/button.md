# `Button`

Interactive element with a fill.

## Exported Constants
* ButtonPadding
* ButtonSize
* ButtonState
* ButtonType

## API

### `onClick`
| | |
|-----------|------------|
| Type | `MouseEventHandler<HTMLButtonElement>` |
| Default | `undefined` |
| Description | Function to call when clicked. |

### `size`
| | |
|-----------|------------|
| Type | `**ButtonSize**` |
| Default | `Medium` |
| Description | Size of the button. |

### `state`
| | |
|-----------|------------|
| Type | `**ButtonState**` |
| Default | `Default` |
| Description | State of the button, used for animation. |

### `type`
| | |
|-----------|------------|
| Type | `**ButtonType**` |
| Default | `Primary` |
| Description | Type of the button, which sets its style. |

### `padding`
| | |
|-----------|------------|
| Type | `**ButtonPadding**` |
| Default | `Default` |
| Description | Allows for no padding, default padding, or extra padding to the size of the button. No padding can only be used with Plain, FlatPrimary, or FlatSecondary buttons. |

### `isDepressed`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `false` |
| Description | Makes button look like it's being pressed. Used for dropdowns. |

### `isDisabled`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `false` |
| Description | Makes button disabled, prevent interaction. |

### `isInRadioGroup`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `undefined` |
| Description | Should be used in combination with `isToggleable`. Toggleable buttons have an accessibility property `aria-pressed` for indicating toggled status, but when a toggleable `Button` component is used within a radio group (such as [the Prism Web `SingleSelectGroup` component](https://github.com/doordash/design-language-system/tree/master/packages/component-select-group#singleselectgroup)), `aria-pressed` is an invalid property. See MDN guidance on [aria-pressed](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-pressed) and [aria-checked](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-checked) for additional information. |

### `isToggleable`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `false` |
| Description | Makes button toggleable; necessary for `isToggled` to work. This is primarily meant to be used with `ButtonType.tertiary`, but is available for all types except `flatPrimary` and `flatSecondary`. |

### `isToggled`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `false` |
| Description | If `isToggleable={true}`, this governs whether this component is in it's toggled state or not. `isToggleable={false}` or `undefined`, then this does nothing. |

### `isInline`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `false` |
| Description | Makes the button inline-flex and auto width. Use alongside flex container to make buttons side by side |

### `isRaised`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `false` |
| Description | Makes button appear raised, with a box-shadow, meant to be used on imagery like pictures or maps. |

### `onAnimationEnd`
| | |
|-----------|------------|
| Type | `(loadingStateKey?: ButtonLoadingStateKey) => void` |
| Default | `null` |
| Description | Called when the Loading success/error animation completes. |

### `id`
| | |
|-----------|------------|
| Type | `string` |
| Default | `undefined` |
| Description | The DOM id to provide to the root element of the Button. |

### `tag`
| | |
|-----------|------------|
| Type | `keyof HTMLElementTagNameMap \| ((props: ButtonProps) => React.ReactNode)` |
| Default | `null` |
| Description | Swap out the root component implementation with either a different HTML tag (e.g. `a`) or a React component. When providing a react component, you will need to type the props parameter (i.e. `(props: ButtonProps) => <Component />`). |

### `tagProps`
| | |
|-----------|------------|
| Type | `object (omits certain properties)` |
| Default | `undefined` |
| Description | An object that will be passed to the root element passed to the `tag` prop. Will accept any `<button>` props but default |

### `href`
| | |
|-----------|------------|
| Type | `string` |
| Default | `null` |
| Description | Passed along to root component; use with `tag` to create navigational buttons. |

### `target`
| | |
|-----------|------------|
| Type | `string` |
| Default | `null` |
| Description | Passed along to root component; use with `tag` to create navigational buttons. |

### `accessibilityLabel`
| | |
|-----------|------------|
| Type | `string` |
| Default | `null` |
| Description | Set an `aria-label` on your button for screen reader accessibility. |

### `accessibilityRole`
| | |
|-----------|------------|
| Type | `string` |
| Default | `null` |
| Description | Set an `aria-role` on your button for screen reader accessibility. |

### `accessibilityDescribedBy`
| | |
|-----------|------------|
| Type | `string` |
| Default | `undefined` |
| Description | A DOM ID that references an element (like a tooltip) that describes this button. |

### `children`
| | |
|-----------|------------|
| Type | `ReactNode` |
| Default | `null` |
| Description | Content of the button. |

### `leadingIcon`
| | |
|-----------|------------|
| Type | `**ButtonIconType**` |
| Default | `undefined` |
| Description | Type of icon to render before children. |

### `trailingIcon`
| | |
|-----------|------------|
| Type | `**ButtonIconType**` |
| Default | `undefined` |
| Description | Type of icon to render after children. |

### `leadingText`
| | |
|-----------|------------|
| Type | `string` |
| Default | `undefined` |
| Description | Text to render before the children. |

### `trailingText`
| | |
|-----------|------------|
| Type | `string` |
| Default | `undefined` |
| Description | Text to render after the children. |

### `contentHugging`
| | |
|-----------|------------|
| Type | `**ButtonContentHugging**` |
| Default | `ButtonContentHugging.expanded` |
| Description | Controls the spacing between leading/trailing content and button text. When `expanded`, the leading and trailing content will be pushed to the edges of the button. When `compressed`, the spacing between the leading/trailing content and button text will be removed, and the leadnig/trailing content will be right next to the button text. |

### `isVisualTapStateEnabled`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `false` |
| Description | Enables a press down transition when a button is clicked. |

## Usage

### Button - default state
```typescript
import { Button } from '@doordash/prism-react'
<Button>Click me!</Button>
```
### Button - make it a secondary button
```typescript
import { Button, ButtonType } from '@doordash/prism-react'
<Button type={ButtonType.secondary}>Click me!</Button>
```
### Button - make it a button that looks like a link and has padding
```typescript
import { Button, ButtonType } from '@doordash/prism-react'
<Button type={ButtonType.flatPrimary}>Click me!</Button>
```
### Button - show loading state
```typescript
import { Button, ButtonState } from '@doordash/prism-react'
<Button state={ButtonState.loading}>Click me!</Button>
```
### Button - disable the button
```typescript
import { Button } from '@doordash/prism-react'
<Button isDisabled>Click me!</Button>
```
### Button - create a toggleable button
```typescript
import { Button, ButtonSize, ButtonType } from '@doordash/prism-react'
…
<Button
  isToggleable
  isToggled={this.state.isButtonToggled}
  size={ButtonSize.small}
  type={ButtonType.secondaryPill}
>
  {this.state.isButtonToggled ? 'Add' : 'Added'}
</Button>
```
### Button - how to use with React Router Links
```typescript
import { Button } from '@doordash/prism-react'
// This is a shim meant to mock a react router link
const Link = props => (
  <a {...props} onClick={() => alert(`im navigating to ${props.to}`)} />
)
const WrappedLink = props => <Link {...props} to={props.href} />
const NavButton = props => <Button {...props} tag={WrappedLink} />
return (
  <NavButton isInline href="google.com">
    Navigate
  </NavButton>
)
```
### Usage tips

- If you need to make an action inline with text, use a Link component.
- Try to have one primary-style button visible at any one time.
- Buttons should be clearly and accurately labeled.
- Use colors appropriately; lean on secondary and flat buttons more than primary.
- Make sure they're used in consistent locations in the interface.
- If you have custom `Text` and `Icon` nodes from `@doordash/design-language` as children, setting their `color` props to `${Text/Icon}.Colors.CurrentColor` will ensure expected application of hover and pressed colors from the theme.

## Accessibility Guidelines
- **Label** - The label of the button is derived from the text inside the button. In case of buttons represented by **icons** or to give additional information to the screen reader user, the label can be provided from the **aria-label** or **aria-labelledby** attributes.

- **State** - The state of the button can be `Default`, `Hover`, `Focussed`, `Disabled` and `Selected`

- **Role** - In Prism Semantic `<button>` element is used, thus no need to add additional role

Use **aria-haspopup="true|false|dialog|menu"** if button activation triggers a menu or other content for user to interact. This will allow screen reader users to anticipate on what action to expect.

## Keyboard Guidelines
**Space** and **Enter** key should activate the button. These interactions are already supported in the ```button``` component.

## `IconButton`

Interactive element that only houses an icon and provides you with correct icon sizing and padding.

## Exported Constants
* IconButtonPadding
* IconButtonSize
* IconButtonState
* IconButtonType

### API

### `onClick`
| | |
|-----------|------------|
| Type | `React.MouseEventHandler<HTMLButtonElement>` |
| Default | `null` |
| Description | Function to call when clicked. |

### `size`
| | |
|-----------|------------|
| Type | `IconButtonSize` |
| Default | `Medium` |
| Description | Size of the button. |

### `state`
| | |
|-----------|------------|
| Type | `IconButtonState` |
| Default | `Default` |
| Description | State of the button, used for animation. |

### `type`
| | |
|-----------|------------|
| Type | `IconButtonType` |
| Default | `Plain` |
| Description | Type of the button, which sets its style. |

### `iconType`
| | |
|-----------|------------|
| Type | `IconButtonIconType` |
| Default | `undefined` |
| Description | Type of the button, which sets its style. |

### `isDepressed`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `false` |
| Description | Makes button look like it's being pressed. Used for dropdowns. |

### `isDisabled`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `false` |
| Description | Makes button disabled, prevent interaction. |

### `isToggleable`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `false` |
| Description | Makes button toggleable; necessary for `isToggled` to work. This property is available for all `IconButton` types except `FlatPrimary` and `FlatSecondary`. |

### `isToggled`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `false` |
| Description | If `isToggleable={true}`, this governs whether this component is in it's toggled state or not. `isToggleable={false}` or `undefined`, then this does nothing. |

### `isRaised`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `false` |
| Description | Makes button appear raised, with a box-shadow, meant to be used on imagery like pictures or maps. |

### `onAnimationEnd`
| | |
|-----------|------------|
| Type | `(loadingStateKey?: IconButtonLoadingStateKey) => void` |
| Default | `null` |
| Description | Called when the Loading success/error animation completes. |

### `id`
| | |
|-----------|------------|
| Type | `string` |
| Default | `undefined` |
| Description | The DOM id to provide to the root element of the Button. |

### `tag`
| | |
|-----------|------------|
| Type | `keyof HTMLElementTagNameMap \| ((props: IconButtonProps) => React.ReactNode)` |
| Default | `null` |
| Description | Swap out the root component implementation with either a different HTML tag (e.g. `a`) or a React component. When providing a react component, you will need to type the props parameter (i.e. `(props: IconButtonProps) => <Component />`). |

### `tagProps`
| | |
|-----------|------------|
| Type | `Omit<React.ComponentProps<E>, keyof ButtonProps>` |
| Default | `undefined` |
| Description | An object that will be passed to the root element passed to the `tag` prop. Will accept any `<button>` props but default |

### `href`
| | |
|-----------|------------|
| Type | `string` |
| Default | `null` |
| Description | Passed along to root component; use with `tag` to create navigational buttons. |

### `target`
| | |
|-----------|------------|
| Type | `string` |
| Default | `null` |
| Description | Passed along to root component; use with `tag` to create navigational buttons. |

### `accessibilityLabel` `required`
| | |
|-----------|------------|
| Type | `string` |
| Default | `undefined` |
| Description | Set an `aria-label` on your button for screen reader accessibility. As an icon-only button, this is _required_, otherwise your button will not render. |

### `accessibilityRole`
| | |
|-----------|------------|
| Type | `string` |
| Default | `null` |
| Description | Set an `aria-role` on your button for screen reader accessibility. |

### `accessibilityDescribedBy`
| | |
|-----------|------------|
| Type | `string` |
| Default | `undefined` |
| Description | A DOM ID that references an element (like a tooltip) that describes this button. |

### `children`
| | |
|-----------|------------|
| Type | `React.ReactNode` |
| Default | `null` |
| Description | Content of the button. |

### `isVisualTapStateEnabled`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `false` |
| Description | Enables a press down transition when a button is clicked. |

### Usage

#### IconButton - default state
```typescript
import { IconButton, IconButtonType } from '@doordash/prism-react'
<IconButton
  accessibilityLabel="Next Page"
  iconType={IconButtonType.ArrowRight}
  onClick={() => goToNextPage()}
/>
```
#### IconButton - make it a tertiary style button
```typescript
import { IconButton, IconButtonIconType, IconButtonType } from '@doordash/prism-react'
<IconButton
  accessibilityLabel="Search Menu"
  iconType={IconButtonIconType.Search}
  type={IconButtonType.tertiary}
  onClick={() => openSearch()}
/>
```
#### IconButton - make it a button used on top of imagery, like a map
```typescript
import { IconButton, IconButtonIconType } from '@doordash/prism-react'
<IconButton
  accessibilityLabel="Search Menu"
  iconType={IconButtonIconType.Search}
  onClick={() => openSearch()}
  isRaised
/>
```