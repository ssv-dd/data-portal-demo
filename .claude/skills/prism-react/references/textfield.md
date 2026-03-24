# `TextField`

Type plain text into a box.

## Exported Constants
* `TextFieldSize`

## API

### `autoFocus`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `false` |
| Description | Should this component be immediately focused on when rendered? |

### `isDisabled`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `false` |
| Description | Should this component allow editing? |

### `onFocus`
| | |
|-----------|------------|
| Type | `FocusEventHandler` |
| Default | `null` |
| Description | Callback for when the component is focused on. |

### `onBlur`
| | |
|-----------|------------|
| Type | `FocusEventHandler` |
| Default | `null` |
| Description | Callback for when the component is blurred out of. |

### `onChange` `required`
| | |
|-----------|------------|
| Type | `(value: V, e: React.ChangeEvent<T>) => void`<br>*`V` = `string`, `T` = `HTMLInputElement`* |
| Default | `null` |
| Description | Callback for when the component's value is changed. |

### `onKeyUp`
| | |
|-----------|------------|
| Type | `KeyboardEventHandler` |
| Default | `null` |
| Description | Callback for when the component keys up, even if a value has not changed. |

### `onKeyDown`
| | |
|-----------|------------|
| Type | `KeyboardEventHandler` |
| Default | `null` |
| Description | Callback for when the component keys down, even if a value has not changed. |

### `onClick`
| | |
|-----------|------------|
| Type | `MouseEventHandler` |
| Default | `null` |
| Description | Callback for when the component is clicked. |

### `value` `required`
| | |
|-----------|------------|
| Type | `string` |
| Default | `null` |
| Description | The value of the component, rendered in the input. |

### `label` `required`
| | |
|-----------|------------|
| Type | `string` |
| Default | `null` |
| Description | The name of the field; required for accessibility reasons. |

### `isLabelHidden`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `false` |
| Description | Since label is required, you can hide the label with this. |

### `isRequired`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `false` |
| Description | Passed down to the input to get native required error state. |

### `isResizeable`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `true` |
| Description | By default true, but allows you to prevent resizing if set to false. |

### `isRounded`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `false` |
| Description | By default false, allows you to have a rounded field container. |

### `isMultiline`
| | |
|-----------|------------|
| Type | `boolean \| number` |
| Default | `false` |
| Description | If boolean, turns field into 2 line textarea; number specifies how many minimum lines. |

### `error`
| | |
|-----------|------------|
| Type | `string \| boolean` |
| Default | `null` |
| Description | Error message rendered below the field; if given as a boolean, will cause the field to be highlighted as having an error. |

### `warning`
| | |
|-----------|------------|
| Type | `string` |
| Default | `null` |
| Description | Warning message rendered below the field; if `error` prop is given, warning message will not be presented. |

### `description`
| | |
|-----------|------------|
| Type | `string \| React.ReactNode` |
| Default | `null` |
| Description | Secondary message rendered after the label; describes constraints and additional information. |

### `hint`
| | |
|-----------|------------|
| Type | `string \| React.ReactNode` |
| Default | `null` |
| Description | Tertiary message rendered below the field input; a way to provide additional help for user about what content should be in the input. |

### `accessibilityDescribedBy`
| | |
|-----------|------------|
| Type | `string` |
| Default | `undefined` |
| Description | A DOM ID that references an element (like a tooltip) that describes this field. |

### `placeholder`
| | |
|-----------|------------|
| Type | `string` |
| Default | `null` |
| Description | Message to display within the input before any value is set. |

### `title`
| | |
|-----------|------------|
| Type | `string` |
| Default | `null` |
| Description | Message to display when hovering over the input. |

### `autoComplete`
| | |
|-----------|------------|
| Type | `string` |
| Default | `null` |
| Description | Hint that indicates to browser how to autofill this input <https://developers.google.com/web/updates/2015/06/checkout-faster-with-autofill> |

### `name`
| | |
|-----------|------------|
| Type | `string` |
| Default | `undefined` |
| Description | Provided as the input's [name](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attributes) attribute. |

### `spellCheck`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `undefined` |
| Description | The spellcheck global attribute is an enumerated attribute that defines whether the element may be checked for spelling errors. |

### `readOnly`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `undefined` |
| Description | Should the input have a [readonly](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/readonly) attribute? |

### `id`
| | |
|-----------|------------|
| Type | `string` |
| Default | `undefined` |
| Description | String that will be set as the rendered `input` element's `id` attribute. Field components will automatically generate a unique id if prop is not provided. |

### `renderBeforeContent`
| | |
|-----------|------------|
| Type | `() => JSX.Element \| string` |
| Default | `null` |
| Description | Render function to allow rendering inside input, on the left. |

### `renderAfterContent`
| | |
|-----------|------------|
| Type | `() => JSX.Element \| string` |
| Default | `null` |
| Description | Render function to allow rendering inside input, on the right. |

### `leadingIcon`
| | |
|-----------|------------|
| Type | `**FieldIconType**` |
| Default | `undefined` |
| Description | Icon rendered at the leading (left) edge inside the input; takes precedence over `renderBeforeContent` when both are provided. |
### `trailingIcon`
| | |
|-----------|------------|
| Type | `**FieldIconType**` |
| Default | `undefined` |
| Description | Icon rendered at the trailing (right) edge inside the input; takes precedence over `renderAfterContent` when both are provided. |

### `renderConnectedBefore`
| | |
|-----------|------------|
| Type | `() => JSX.Element \| string` |
| Default | `null` |
| Description | Render function to allow rendering on the left outside of the input. |

### `renderConnectedAfter`
| | |
|-----------|------------|
| Type | `() => JSX.Element \| string` |
| Default | `null` |
| Description | Render function to allow rendering on the right outside of the input. |

### `hasConnectedContentAbove`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `undefined` |
| Description | If true, the field will render with zeroed out border radii on its top edge. |

### `hasConnectedContentBelow`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `undefined` |
| Description | If true, the field will render with zeroed out border radii on its bottom edge. |

### `maxLength`
| | |
|-----------|------------|
| Type | `number` |
| Default | `null` |
| Description | Number of characters to allow in input. |

### `minLength`
| | |
|-----------|------------|
| Type | `number` |
| Default | `null` |
| Description | Minimum number of characters to allow in input. |

### `size`
| | |
|-----------|------------|
| Type | `**TextFieldSize**` |
| Default | `TextFieldSize.medium` |
| Description | Determines the size and font-size of the input. |

### `inputMode`
| | |
|-----------|------------|
| Type | `InputElementType['inputMode']` |
| Default | `undefined` |
| Description | Hints at the type of data that might be entered by the user while editing the element or its contents https://html.spec.whatwg.org/multipage/interaction.html#input-modalities:-the-inputmode-attribute |

### `interfaceRef`
| | |
|-----------|------------|
| Type | `React.RefObject` |
| Default | `null` |
| Description | Provides access to underlying `DOM` methods (i.e. `focus`) via `ref`. |

### `forceOnChange`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `false` |
| Description | In some rare situations, you may find that a browser's autofill feature changes a DOM input, but does not fire React's onChange. Use this prop to try to assist with this issue. |

### `isClearable`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `undefined` |
| Description | Displays a "click to clear input" button in the input if input is present. |

### `onValueClear`
| | |
|-----------|------------|
| Type | `(event: MouseEvent) => void` |
| Default | `undefined` |
| Description | A callback function that is run when the clear input button is activated. |

### `clearButtonAccessibilityLabel`
| | |
|-----------|------------|
| Type | `string` |
| Default | `Clear input value` |
| Description | Accessible text label for the "click to clear" button. Utilized by assistive technologies. |

## Usage

### TextField - default use
```typescript
import { TextField } from '@doordash/prism-react'
…
<TextField
  value={this.state.firstName}
  onChange={value => this.setState({ firstName: value })}
  label="First Name"
/>
…
```
### TextField - bare field without visible label
```typescript
import { TextField } from '@doordash/prism-react'
…
<TextField
  value={this.state.address}
  onChange={value => this.setState({ address: value })}
  label="Your Address"
  isLabelHidden
/>
…
```
### TextField - multiline text field
```typescript
import { TextField } from '@doordash/prism-react'
…
<TextField
  value={this.state.instructions}
  onChange={value => this.setState({ instructions: value })}
  label="Special Instructions"
  isMultiline={4}
  placeholder="The restaurant will try to accommodate your request!"
/>
…
```
### TextField - multiline text field without resizing
```typescript
import { TextField } from '@doordash/prism-react'
…
<TextField
  value={this.state.instructions}
  onChange={value => this.setState({ instructions: value })}
  label="Special Instructions"
  isMultiline={4}
  placeholder="The restaurant will try to accommodate your request!"
  isResizeable={false}
/>
…
```
### TextField - with submit button on the right outside of the input
```typescript
import { TextField, Button, ButtonType } from '@doordash/prism-react'
…
<TextField
  value={this.state.link}
  onChange={value => this.setState({ link: value })}
  label="New Link"
  renderConnectedAfter={() => <Button type={ButtonType.full}>Submit</Button>}
/>
…
```
### TextField - with clear text button on the right
```typescript
import { TextField } from '@doordash/prism-react'
…
<TextField
  value={this.state.text}
  onChange={value => this.setState({ text: value })}
  label="Description"
  renderAfterContent={() => <Text onClick={this.clearText}>Clear</Text>}
/>
…
```
```typescript
import { TextField } from '@doordash/prism-react'
const firstNameRef = React.createRef()

…
<TextField
  interfaceRef={firstNameRef}
  value={this.state.firstName}
  onChange={value => this.setState({ firstName: value })}
  label="First Name"
/>
…
```
## Usage tips

-   Always provide a label. We've ensured that by default the field is accessible, but we need to ensure that the field is named.
-   Use render props (like `renderAfterContent`, `renderConnectedAfter`) to extend fields.