# `PasswordField`

Type in your password; allow for showing and hiding the content of the field.

## Exported Constants
* `PasswordFieldSize`

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

### `isRounded`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `false` |
| Description | By default false, allows you to have a rounded field container. |

### `error`
| | |
|-----------|------------|
| Type | `string \| boolean` |
| Default | `null` |
| Description | Error message rendered below the field. |

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
| Type | `string or node` |
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
| Description | Render function to allow rendering inside input, on the right (note: PasswordField renders its show/hide toggle here by default). |

### `leadingIcon`
| | |
|-----------|------------|
| Type | `**FieldIconType**` |
| Default | `undefined` |
| Description | Icon rendered at the leading (left) edge inside the input; takes precedence over `renderBeforeContent` when both are provided. |

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
| Type | `**PasswordFieldSize**` |
| Default | `PasswordFieldSize.Medium` |
| Description | Determines the size and font-size of the input. |

### `strings`
| | |
|-----------|------------|
| Type | `{ show: string, hide: string }` |
| Default | `{ show: 'Show', hide: 'Hide' }` |
| Description | Allows custom text to be passed for the "Show"/"Hide" toggle button. |

### `defaultShowPassword`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `false` |
| Description | If true password field will by default show the password entered into the field. |

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

### PasswordField - default use
```typescript
import { PasswordField } from '@doordash/prism-react'
…
<PasswordField
  value={this.state.password}
  onChange={value => this.setState({ password: value })}
  label="Password"
/>
…
```
### PasswordField - forgot password link in description
```typescript
import { PasswordField } from '@doordash/prism-react'
…
<PasswordField
  value={this.state.password}
  onChange={value => this.setState({ password: value })}
  label="Password"
  description={<a href="/forgot-password">Forgot your password?</a>}
/>
…
```
## Usage tips

-   _Don't_ have a password confirm field; allowing someone to see/check what they've typed is build into this field, and the second field is less necessary.
-   Any constraints on the password should be called out with `description`.
-   Provide a useful error message for invalid passwords; call out _how_ the value is invalid, not just that it is.