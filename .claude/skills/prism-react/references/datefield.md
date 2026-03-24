# `DateField`

Take in date values, renders them in the input with formatting. Currently supports `MM/DD/YYYY` and any similar format.

This is intended to be used for dates in the past, where a date picker is less useful.

This component will do no validation by default.

## Exported Constants
* `DateFieldSize`

## API

### `value` `required`
| | |
|-----------|------------|
| Type | `string \| Date` |
| Default | `null` |
| Description | The value of the component, rendered in the input. |

### `label` `required`
| | |
|-----------|------------|
| Type | `string` |
| Default | `null` |
| Description | The name of the field; required for accessibility reasons. |

### `onChange` `required`
| | |
|-----------|------------|
| Type | `(formattedValue: V, value: string, e: React.ChangeEvent<T>, date?: Date) => void`<br>*`V` = `string`, `T` = `HTMLInputElement`* |
| Default | `null` |
| Description | Callback for when the component's value is changed.<br>For versions **<5.13.0**, this callback will receive three values - a string of the valid input value, a string of the raw event value, and the event object.<br>For versions **>=5.13.0**, this callback will receive four values - a string of the valid input value, a string of the raw event value, the event object, and the Date object equivalent of the valid input value. (if the field is not a Date parse-able string, this property will be `undefined`) |

### `dateFormat`
| | |
|-----------|------------|
| Type | `**DateFieldDateFormat**` |
| Default | `DateFieldDateFormat.en_US` |
| Description | Format the date will be rendered in. Can be leveraged for countries who display dates in a different format than the US standard 'MM/DD/YYYY'. |

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
| Type | `**DateFieldSize**` |
| Default | `DateFieldSize.Medium` |
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
| Description | When `value` has length, a "click to clear input" button will be displayed. |

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

### DateField - default use
```typescript
import { DateField } from '@doordash/prism-react'

<DateField
  value={this.state.dob}
  onChange={value => this.setState({ dob: value })}
  label="Date of Birth"
/>
```
### DateField - with custom format and validation
```typescript
import { DateField, DateFieldDateFormat } from '@doordash/prism-react'

<DateField
  value={dateValue}
  onChange={(formattedValue, rawValue, event, dateObject) => {
    setDateValue(formattedValue)
    if (dateObject && dateObject > new Date()) {
      setError('Date cannot be in the future')
    }
  }}
  label="Event Date"
  dateFormat={DateFieldDateFormat.en_AU}
  placeholder="DD/MM/YYYY"
  error={error}
  isRequired
  isClearable
  description="Enter date in Australian format"
/>
```
## Usage tips

-   You can get the updated value with invalid characters removed in the first parameter of `onChange`. The raw value will be passed in the second parameter, and the event will be passed in the third.
-   The value given to the field can be either formatted or unformatted.
-   If your change handler relies on the value being a `Date` type, you will need to upgrade your Prism packages to `>=5.13.0`. The **fourth** value returned in `onChange` will be the Date equivalent of the input's value. If unable to update, you will need to parse the Date equivalent from the string value that's returned in the first value. (The second and third values, in all cases, are the raw event value and the `event` object that triggered the `onChange` event.)